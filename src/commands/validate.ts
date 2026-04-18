import * as vscode from 'vscode';
import { runCli } from '../cli';
import { getDiagnostics, getOutput } from '../output';

interface CliDiagnostic {
  file: string;
  line: number;
  column?: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  code?: string;
}

function parseDiagnostics(stdout: string): CliDiagnostic[] {
  const trimmed = stdout.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed?.diagnostics) ? parsed.diagnostics : [];
  } catch {
    return [];
  }
}

function toSeverity(s: CliDiagnostic['severity']): vscode.DiagnosticSeverity {
  switch (s) {
    case 'error':
      return vscode.DiagnosticSeverity.Error;
    case 'warning':
      return vscode.DiagnosticSeverity.Warning;
    default:
      return vscode.DiagnosticSeverity.Information;
  }
}

async function pushDiagnostics(entries: CliDiagnostic[], rootFallback?: vscode.Uri): Promise<number> {
  const bucket = new Map<string, vscode.Diagnostic[]>();
  for (const d of entries) {
    const line = Math.max(0, (d.line ?? 1) - 1);
    const col = Math.max(0, (d.column ?? 1) - 1);
    const range = new vscode.Range(line, col, line, col + 1);
    const diag = new vscode.Diagnostic(range, d.message, toSeverity(d.severity));
    diag.source = 'grokinstall';
    if (d.code) diag.code = d.code;
    const key = d.file || rootFallback?.fsPath || '';
    if (!bucket.has(key)) bucket.set(key, []);
    bucket.get(key)!.push(diag);
  }
  const collection = getDiagnostics();
  collection.clear();
  for (const [file, diags] of bucket.entries()) {
    if (!file) continue;
    collection.set(vscode.Uri.file(file), diags);
  }
  return entries.length;
}

export async function validateCurrent(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('Open a Grok YAML file to validate.');
    return;
  }
  const output = getOutput();
  output.appendLine(`[validate] ${editor.document.uri.fsPath}`);
  try {
    const res = await runCli(['validate', editor.document.uri.fsPath, '--json'], { output });
    const diags = parseDiagnostics(res.stdout);
    const count = await pushDiagnostics(diags, editor.document.uri);
    if (res.code === 0 && count === 0) {
      vscode.window.showInformationMessage('GrokInstall: spec is valid.');
    } else {
      vscode.window.showWarningMessage(`GrokInstall: ${count} issue${count === 1 ? '' : 's'} found. See Problems.`);
    }
  } catch (err) {
    vscode.window.showErrorMessage(`GrokInstall: ${(err as Error).message}`);
  }
}

export async function validateProject(): Promise<void> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    vscode.window.showWarningMessage('Open a workspace folder to run a project validation.');
    return;
  }
  const output = getOutput();
  output.appendLine(`[validate:project] ${folder.uri.fsPath}`);
  try {
    const res = await runCli(['validate', '--project', '--json'], { cwd: folder.uri.fsPath, output });
    const diags = parseDiagnostics(res.stdout);
    const count = await pushDiagnostics(diags, folder.uri);
    if (res.code === 0 && count === 0) {
      vscode.window.showInformationMessage('GrokInstall: project is valid.');
    } else {
      vscode.window.showWarningMessage(`GrokInstall: ${count} project issue${count === 1 ? '' : 's'}. See Problems.`);
    }
  } catch (err) {
    vscode.window.showErrorMessage(`GrokInstall: ${(err as Error).message}`);
  }
}
