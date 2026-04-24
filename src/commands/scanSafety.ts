import * as vscode from 'vscode';
import { runCli } from '../cli';
import { getOutput } from '../output';

interface ScanSummary {
  danger?: number;
  warning?: number;
  info?: number;
}

function parseSummary(stdout: string): ScanSummary {
  const trimmed = stdout.trim();
  if (!trimmed) return {};
  try {
    const parsed = JSON.parse(trimmed);
    return parsed?.summary ?? {};
  } catch {
    return {};
  }
}

export async function scanSafety(): Promise<void> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    vscode.window.showWarningMessage('Open a workspace folder to run the safety scanner.');
    return;
  }
  const output = getOutput();
  output.show(true);

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'GrokInstall safety scan',
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: 'Running grok-install scan...' });
      try {
        const res = await runCli(['scan', '--json'], { cwd: folder.uri.fsPath, output });
        const summary = parseSummary(res.stdout);
        const danger = summary.danger ?? 0;
        const warning = summary.warning ?? 0;
        const info = summary.info ?? 0;

        if (danger > 0) {
          vscode.window.showErrorMessage(
            `Safety scan: ${danger} danger, ${warning} warning, ${info} info. See GrokInstall output.`,
          );
        } else if (warning > 0) {
          vscode.window.showWarningMessage(
            `Safety scan: ${warning} warning, ${info} info. See GrokInstall output.`,
          );
        } else {
          vscode.window.showInformationMessage('Safety scan clean.');
        }
      } catch (err) {
        vscode.window.showErrorMessage(`GrokInstall: ${(err as Error).message}`);
      }
    },
  );
}
