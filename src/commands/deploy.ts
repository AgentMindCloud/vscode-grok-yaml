import * as vscode from 'vscode';
import { runCli } from '../cli';
import { getOutput } from '../output';

interface DeployResult {
  install_link?: string;
  install_url?: string;
}

function extractLink(stdout: string): string | undefined {
  const trimmed = stdout.trim();
  try {
    const parsed = JSON.parse(trimmed) as DeployResult;
    return parsed.install_link ?? parsed.install_url;
  } catch {
    // Fallback: find the first https URL in stdout
    const match = trimmed.match(/https:\/\/[^\s"']+/);
    return match?.[0];
  }
}

function buildShareMessage(link: string): string {
  return [
    `Just shipped my Grok agent on X — ${link}`,
    '',
    `Built with @GrokInstall. Try it: ${link}`,
  ].join('\n');
}

export async function deploy(): Promise<void> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    vscode.window.showWarningMessage('Open a workspace folder to deploy.');
    return;
  }
  const output = getOutput();
  output.show(true);

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Deploying Grok agent...',
      cancellable: false,
    },
    async () => {
      try {
        const res = await runCli(['deploy', '--json'], { cwd: folder.uri.fsPath, output });
        if (res.code !== 0) {
          vscode.window.showErrorMessage('GrokInstall: deploy failed. See output.');
          return;
        }
        const link = extractLink(res.stdout);
        if (!link) {
          vscode.window.showWarningMessage('GrokInstall: deploy succeeded but no install link was returned.');
          return;
        }
        await vscode.env.clipboard.writeText(buildShareMessage(link));
        vscode.window.showInformationMessage('Copied! Paste on X to share.');
      } catch (err) {
        vscode.window.showErrorMessage(`GrokInstall: ${(err as Error).message}`);
      }
    },
  );
}
