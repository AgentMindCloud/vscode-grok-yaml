import * as vscode from 'vscode';
import * as path from 'path';

const SPEC_GLOBS = [
  '**/*.grok.yaml',
  '**/*.grok.yml',
  '**/agent.yaml',
  '**/workflow.yaml',
  '**/tool.yaml',
  '**/prompt.yaml',
  '**/model.yaml',
  '**/memory.yaml',
  '**/mcp.yaml',
  '**/mcp-server.yaml',
  '**/task.yaml',
  '**/pipeline.yaml',
  '**/policy.yaml',
  '**/dataset.yaml',
  '**/evaluation.yaml',
  '**/environment.yaml',
  '**/deployment.yaml'
];

export function activate(context: vscode.ExtensionContext): void {
  const output = vscode.window.createOutputChannel('Grok YAML');
  context.subscriptions.push(output);

  context.subscriptions.push(
    vscode.commands.registerCommand('grok-yaml.validate', () => validateCurrent(output)),
    vscode.commands.registerCommand('grok-yaml.scan', () => scanWorkspace(output)),
    vscode.commands.registerCommand('grok-yaml.generateAgent', () => generateAgent())
  );

  output.appendLine('Grok YAML extension activated.');
}

export function deactivate(): void {
  // no-op
}

async function validateCurrent(output: vscode.OutputChannel): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('Grok YAML: open a YAML file first.');
    return;
  }

  const doc = editor.document;
  const text = doc.getText();

  if (!text.trim()) {
    vscode.window.showWarningMessage('Grok YAML: file is empty.');
    return;
  }

  const diagnostics = vscode.languages.getDiagnostics(doc.uri);
  const problems = diagnostics.length;

  output.show(true);
  output.appendLine(`Validated ${path.basename(doc.fileName)} — ${problems} problem(s).`);

  if (problems === 0) {
    vscode.window.showInformationMessage('Grok YAML: no problems found.');
  } else {
    vscode.window.showWarningMessage(
      `Grok YAML: ${problems} problem(s). See the Problems panel for details.`
    );
  }
}

async function scanWorkspace(output: vscode.OutputChannel): Promise<void> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showWarningMessage('Grok YAML: open a workspace folder first.');
    return;
  }

  const config = vscode.workspace.getConfiguration('grokYaml');
  const exclude = config.get<string[]>('scan.exclude', []);
  const excludeGlob = exclude.length > 0 ? `{${exclude.join(',')}}` : undefined;

  const include = `{${SPEC_GLOBS.join(',')}}`;
  const found = await vscode.workspace.findFiles(include, excludeGlob);

  output.show(true);
  output.appendLine(`Scan complete — ${found.length} Grok spec file(s) found.`);
  for (const uri of found) {
    output.appendLine(`  ${vscode.workspace.asRelativePath(uri)}`);
  }

  if (found.length === 0) {
    vscode.window.showInformationMessage('Grok YAML: no spec files found in workspace.');
  } else {
    vscode.window.showInformationMessage(`Grok YAML: found ${found.length} spec file(s).`);
  }
}

async function generateAgent(): Promise<void> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showWarningMessage('Grok YAML: open a workspace folder first.');
    return;
  }

  const name = await vscode.window.showInputBox({
    prompt: 'Agent name',
    placeHolder: 'my-agent',
    validateInput: (value) =>
      /^[a-z][a-z0-9-]*$/.test(value) ? null : 'Use lowercase letters, digits, and dashes only.'
  });
  if (!name) {
    return;
  }

  const description = await vscode.window.showInputBox({
    prompt: 'Short description',
    placeHolder: 'What does this agent do?'
  });

  const template = buildAgentTemplate(name, description ?? '');
  const target = vscode.Uri.joinPath(folders[0].uri, `${name}.agent.grok.yaml`);

  const encoder = new TextEncoder();
  await vscode.workspace.fs.writeFile(target, encoder.encode(template));

  const doc = await vscode.workspace.openTextDocument(target);
  await vscode.window.showTextDocument(doc);
  vscode.window.showInformationMessage(`Grok YAML: created ${path.basename(target.fsPath)}.`);
}

function buildAgentTemplate(name: string, description: string): string {
  return `# yaml-language-server: $schema=./schemas/agent.schema.json
apiVersion: grok.install/v1
kind: Agent
metadata:
  name: ${name}
  description: ${JSON.stringify(description)}
spec:
  model: grok-4
  systemPrompt: |
    You are a helpful agent.
  tools: []
  memory:
    kind: short-term
`;
}
