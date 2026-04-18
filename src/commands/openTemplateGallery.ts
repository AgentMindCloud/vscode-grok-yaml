import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import * as vscode from 'vscode';
import { getOutput } from '../output';

let currentPanel: vscode.WebviewPanel | undefined;

interface CloneMessage {
  type: 'clone';
  templateId: string;
  files: { path: string; content: string }[];
}

interface InsertMessage {
  type: 'insert';
  snippet: string;
}

interface OpenExternalMessage {
  type: 'openExternal';
  url: string;
}

type WebviewMessage = CloneMessage | InsertMessage | OpenExternalMessage;

export function openTemplateGallery(context: vscode.ExtensionContext): void {
  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.Active);
    return;
  }

  const panel = vscode.window.createWebviewPanel(
    'grokinstallGallery',
    'Grok Agent Gallery',
    vscode.ViewColumn.Active,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist')],
    },
  );

  currentPanel = panel;
  panel.iconPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'icon.png');
  panel.webview.html = getHtml(panel.webview, context.extensionUri);

  panel.webview.onDidReceiveMessage(async (msg: WebviewMessage) => {
    switch (msg.type) {
      case 'clone':
        await cloneTemplate(msg);
        break;
      case 'insert':
        await insertSnippet(msg);
        break;
      case 'openExternal':
        await vscode.env.openExternal(vscode.Uri.parse(msg.url));
        break;
    }
  });

  panel.onDidDispose(() => {
    currentPanel = undefined;
  });
}

async function cloneTemplate(msg: CloneMessage): Promise<void> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    vscode.window.showWarningMessage('Open a workspace folder to clone templates into.');
    return;
  }
  const output = getOutput();
  const targetDir = path.join(folder.uri.fsPath, msg.templateId);
  try {
    await fs.mkdir(targetDir, { recursive: true });
    for (const file of msg.files) {
      const dest = path.join(targetDir, file.path);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, file.content, 'utf8');
      output.appendLine(`[gallery] wrote ${dest}`);
    }
    const openUri = vscode.Uri.file(path.join(targetDir, msg.files[0]?.path ?? ''));
    await vscode.window.showTextDocument(openUri, { preview: false });
    vscode.window.showInformationMessage(`Cloned ${msg.templateId} into workspace.`);
  } catch (err) {
    vscode.window.showErrorMessage(`Clone failed: ${(err as Error).message}`);
  }
}

async function insertSnippet(msg: InsertMessage): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('Open a YAML file first to insert a snippet.');
    return;
  }
  await editor.insertSnippet(new vscode.SnippetString(msg.snippet));
}

function getHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'gallery.js'));
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'gallery.css'));
  const nonce = makeNonce();
  const csp = [
    `default-src 'none'`,
    `img-src ${webview.cspSource} https: data:`,
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    `font-src ${webview.cspSource} https:`,
    `script-src 'nonce-${nonce}'`,
    `connect-src https:`,
  ].join('; ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="${styleUri}" />
  <title>Grok Agent Gallery</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

function makeNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < 32; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
