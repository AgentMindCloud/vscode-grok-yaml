import * as vscode from 'vscode';

export async function openMarketplace(): Promise<void> {
  await vscode.env.openExternal(vscode.Uri.parse('https://grokagents.dev'));
}
