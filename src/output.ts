import * as vscode from 'vscode';

let channel: vscode.OutputChannel | undefined;

export function getOutput(): vscode.OutputChannel {
  if (!channel) {
    channel = vscode.window.createOutputChannel('GrokInstall');
  }
  return channel;
}

let diagnostics: vscode.DiagnosticCollection | undefined;

export function getDiagnostics(): vscode.DiagnosticCollection {
  if (!diagnostics) {
    diagnostics = vscode.languages.createDiagnosticCollection('grokinstall');
  }
  return diagnostics;
}
