import * as vscode from 'vscode';
import { CONFIG_SECTION, GROKINSTALL_API_VERSION_PREFIX } from './constants';
import type { SchemaDescriptor } from './schema/types';

export interface ResolvedKind {
  descriptor: SchemaDescriptor;
  reason: 'glob' | 'content-sniff';
}

export function getFileMatchGlobs(): string[] {
  const cfg = vscode.workspace.getConfiguration(CONFIG_SECTION);
  const fromCfg = cfg.get<string[]>('fileMatch.globs');
  return Array.isArray(fromCfg) ? fromCfg : [];
}

export function contentSniffEnabled(): boolean {
  return vscode.workspace
    .getConfiguration(CONFIG_SECTION)
    .get<boolean>('fileMatch.contentSniff', true);
}

export function matchesAnyGlob(resource: vscode.Uri, patterns: string[]): boolean {
  for (const pattern of patterns) {
    if (vscode.languages.match({ language: 'yaml', pattern }, asTextDocStub(resource)) > 0) {
      return true;
    }
  }
  return false;
}

function asTextDocStub(uri: vscode.Uri): vscode.TextDocument {
  return {
    uri,
    fileName: uri.fsPath,
    languageId: 'yaml',
    isUntitled: false,
    isDirty: false,
    isClosed: false,
    version: 0,
    eol: 1,
    lineCount: 0,
    encoding: 'utf8',
    getText: () => '',
    getWordRangeAtPosition: () => undefined,
    lineAt: () => ({ range: new vscode.Range(0, 0, 0, 0) }) as vscode.TextLine,
    offsetAt: () => 0,
    positionAt: () => new vscode.Position(0, 0),
    save: async () => true,
    validatePosition: (p: vscode.Position) => p,
    validateRange: (r: vscode.Range) => r,
  } as unknown as vscode.TextDocument;
}

export function resolveByGlob(
  resource: vscode.Uri,
  descriptors: SchemaDescriptor[],
): SchemaDescriptor | undefined {
  for (const d of descriptors) {
    for (const pattern of d.fileMatch) {
      if (vscode.languages.match({ language: 'yaml', pattern }, asTextDocStub(resource)) > 0) {
        return d;
      }
    }
  }
  return undefined;
}

const KIND_RE = /^\s*kind\s*:\s*["']?([A-Za-z][A-Za-z0-9-]*)["']?\s*$/m;
const API_RE = /^\s*apiVersion\s*:\s*["']?(grokinstall\.dev\/[A-Za-z0-9-]+)["']?\s*$/m;

export function sniffKind(text: string): { apiVersion: string; kind: string } | undefined {
  const head = text.slice(0, 2048);
  const apiMatch = API_RE.exec(head);
  const kindMatch = KIND_RE.exec(head);
  if (!apiMatch || !kindMatch) return undefined;
  if (!apiMatch[1].startsWith(GROKINSTALL_API_VERSION_PREFIX)) return undefined;
  return { apiVersion: apiMatch[1], kind: kindMatch[1] };
}

export function resolveByContent(
  text: string,
  descriptors: SchemaDescriptor[],
): SchemaDescriptor | undefined {
  const sniffed = sniffKind(text);
  if (!sniffed) return undefined;
  return descriptors.find(
    (d) => d.kind === sniffed.kind && d.apiVersion === sniffed.apiVersion,
  );
}

export function resolveDescriptor(
  resource: vscode.Uri,
  text: string | undefined,
  descriptors: SchemaDescriptor[],
): ResolvedKind | undefined {
  const byGlob = resolveByGlob(resource, descriptors);
  if (byGlob) return { descriptor: byGlob, reason: 'glob' };
  if (contentSniffEnabled() && text) {
    const byContent = resolveByContent(text, descriptors);
    if (byContent) return { descriptor: byContent, reason: 'content-sniff' };
  }
  return undefined;
}

export function isGrokYamlDocument(doc: vscode.TextDocument, descriptors: SchemaDescriptor[]): boolean {
  if (doc.languageId !== 'yaml' && doc.languageId !== 'grok-yaml') return false;
  return resolveDescriptor(doc.uri, doc.getText(), descriptors) !== undefined;
}
