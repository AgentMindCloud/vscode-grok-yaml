import * as vscode from 'vscode';
import { DIAGNOSTIC_COLLECTION, DIAGNOSTIC_SOURCE } from '../constants';
import type { ScanFinding, ScanFindingLocation, ScanResult } from './types';

export function createDiagnosticCollection(): vscode.DiagnosticCollection {
  return vscode.languages.createDiagnosticCollection(DIAGNOSTIC_COLLECTION);
}

export function applyScanResult(
  collection: vscode.DiagnosticCollection,
  result: ScanResult,
  scopedFiles?: string[],
): void {
  const byFile = new Map<string, vscode.Diagnostic[]>();

  for (const finding of result.findings) {
    const diag = toDiagnostic(finding);
    const list = byFile.get(finding.location.file) ?? [];
    list.push(diag);
    byFile.set(finding.location.file, list);
  }

  if (scopedFiles && scopedFiles.length > 0) {
    for (const file of scopedFiles) {
      collection.set(vscode.Uri.file(file), byFile.get(file) ?? []);
    }
    for (const [file, diags] of byFile) {
      if (!scopedFiles.includes(file)) {
        collection.set(vscode.Uri.file(file), diags);
      }
    }
    return;
  }

  collection.clear();
  for (const [file, diags] of byFile) {
    collection.set(vscode.Uri.file(file), diags);
  }
}

export function countIssues(collection: vscode.DiagnosticCollection): number {
  let total = 0;
  collection.forEach((_uri, diags) => {
    total += diags.length;
  });
  return total;
}

function toDiagnostic(finding: ScanFinding): vscode.Diagnostic {
  const range = toRange(finding.location);
  const diag = new vscode.Diagnostic(range, finding.message, toSeverity(finding.severity));
  diag.source = DIAGNOSTIC_SOURCE;
  diag.code = finding.docsUrl
    ? { value: finding.ruleId, target: vscode.Uri.parse(finding.docsUrl) }
    : finding.ruleId;
  (diag as vscode.Diagnostic & { __finding?: ScanFinding }).__finding = finding;
  return diag;
}

function toRange(loc: ScanFindingLocation): vscode.Range {
  const startLine = Math.max(0, loc.startLine - 1);
  const startCol = Math.max(0, loc.startColumn - 1);
  const endLine = Math.max(startLine, loc.endLine - 1);
  const endCol = Math.max(0, loc.endColumn - 1);
  return new vscode.Range(startLine, startCol, endLine, endCol);
}

function toSeverity(sev: ScanFinding['severity']): vscode.DiagnosticSeverity {
  switch (sev) {
    case 'error':
      return vscode.DiagnosticSeverity.Error;
    case 'warning':
      return vscode.DiagnosticSeverity.Warning;
    case 'info':
      return vscode.DiagnosticSeverity.Information;
    case 'hint':
      return vscode.DiagnosticSeverity.Hint;
    default:
      return vscode.DiagnosticSeverity.Warning;
  }
}

export class ScannerCodeActionProvider implements vscode.CodeActionProvider {
  static readonly providedKinds = [vscode.CodeActionKind.QuickFix];

  provideCodeActions(
    _doc: vscode.TextDocument,
    _range: vscode.Range,
    context: vscode.CodeActionContext,
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];
    for (const diag of context.diagnostics) {
      if (diag.source !== DIAGNOSTIC_SOURCE) continue;
      const finding = (diag as vscode.Diagnostic & { __finding?: ScanFinding }).__finding;
      if (!finding?.fix) continue;
      const action = new vscode.CodeAction(finding.fix.title, vscode.CodeActionKind.QuickFix);
      action.diagnostics = [diag];
      action.edit = new vscode.WorkspaceEdit();
      for (const edit of finding.fix.edits) {
        action.edit.replace(
          vscode.Uri.file(edit.range.file),
          toRange(edit.range),
          edit.newText,
        );
      }
      action.isPreferred = true;
      actions.push(action);
    }
    return actions;
  }
}
