import * as vscode from 'vscode';
import {
  initAgent,
  validateCurrent,
  validateProject,
  scanSafety,
  deploy,
  generateInstallLink,
  openMarketplace,
  openTemplateGallery,
} from './commands';
import { getDiagnostics, getOutput } from './output';

export function activate(context: vscode.ExtensionContext): void {
  const output = getOutput();
  output.appendLine('GrokInstall extension activated.');

  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBar.text = '$(circle-filled) GrokInstall';
  statusBar.tooltip = 'Open Grok Agent Gallery';
  statusBar.color = new vscode.ThemeColor('terminal.ansiCyan');
  statusBar.command = 'grokinstall.openTemplateGallery';
  statusBar.show();

  context.subscriptions.push(
    output,
    statusBar,
    getDiagnostics(),
    vscode.commands.registerCommand('grokinstall.init', initAgent),
    vscode.commands.registerCommand('grokinstall.validate', validateCurrent),
    vscode.commands.registerCommand('grokinstall.validateProject', validateProject),
    vscode.commands.registerCommand('grokinstall.scanSafety', scanSafety),
    vscode.commands.registerCommand('grokinstall.deploy', deploy),
    vscode.commands.registerCommand('grokinstall.generateInstallLink', generateInstallLink),
    vscode.commands.registerCommand('grokinstall.openMarketplace', openMarketplace),
    vscode.commands.registerCommand('grokinstall.openTemplateGallery', () => openTemplateGallery(context)),
  );
}

export function deactivate(): void {
  // subscriptions handle disposal
}
