import * as vscode from 'vscode';
import { runCli } from '../cli';
import { getOutput } from '../output';

export async function generateInstallLink(): Promise<void> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    vscode.window.showWarningMessage('Open a workspace folder first.');
    return;
  }
  const output = getOutput();
  try {
    const res = await runCli(['link', '--json'], { cwd: folder.uri.fsPath, output });
    const link = extractLink(res.stdout);
    if (!link) {
      vscode.window.showWarningMessage('GrokInstall: no install link generated.');
      return;
    }
    await vscode.env.clipboard.writeText(link);
    vscode.window.showInformationMessage(`Install link copied: ${link}`);
  } catch (err) {
    vscode.window.showErrorMessage(`GrokInstall: ${(err as Error).message}`);
  }
}

function extractLink(stdout: string): string | undefined {
  const trimmed = stdout.trim();
  try {
    const parsed = JSON.parse(trimmed);
    return parsed?.install_link ?? parsed?.install_url;
  } catch {
    const match = trimmed.match(/https:\/\/[^\s"']+/);
    return match?.[0];
  }
}
