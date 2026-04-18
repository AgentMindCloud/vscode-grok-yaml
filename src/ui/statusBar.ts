import * as vscode from 'vscode';
import { COMMANDS, STATUS_BAR_COLORS } from '../constants';

export type StatusBarState =
  | { kind: 'clean' }
  | { kind: 'scanning' }
  | { kind: 'issues'; count: number }
  | { kind: 'error'; message: string };

export interface StatusBar {
  set(state: StatusBarState): void;
  dispose(): void;
}

export function createStatusBar(ctx: vscode.ExtensionContext): StatusBar {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  item.name = 'GrokInstall';
  item.command = COMMANDS.showOutput;
  item.show();
  ctx.subscriptions.push(item);

  const set = (state: StatusBarState): void => {
    switch (state.kind) {
      case 'clean':
        item.text = '$(shield) GrokInstall: clean';
        item.tooltip = 'No issues found. Click to open the GrokInstall output channel.';
        item.color = new vscode.ThemeColor(STATUS_BAR_COLORS.clean);
        item.backgroundColor = undefined;
        return;
      case 'scanning':
        item.text = '$(sync~spin) GrokInstall: scanning';
        item.tooltip = 'Safety scanner is running...';
        item.color = new vscode.ThemeColor(STATUS_BAR_COLORS.scanning);
        item.backgroundColor = undefined;
        return;
      case 'issues':
        item.text = `$(shield) GrokInstall: ${state.count} issue${state.count === 1 ? '' : 's'}`;
        item.tooltip = `${state.count} safety finding${state.count === 1 ? '' : 's'}. Click to view details.`;
        item.color = new vscode.ThemeColor(STATUS_BAR_COLORS.issues);
        item.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        return;
      case 'error':
        item.text = '$(warning) GrokInstall: error';
        item.tooltip = state.message;
        item.color = new vscode.ThemeColor(STATUS_BAR_COLORS.issues);
        item.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        return;
    }
  };

  return {
    set,
    dispose: () => item.dispose(),
  };
}
