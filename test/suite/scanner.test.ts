import * as assert from 'node:assert';
import * as path from 'node:path';
import * as vscode from 'vscode';

const FIXTURES = path.resolve(__dirname, '..', '..', '..', 'test', 'fixtures');

describe('scanner diagnostics', () => {
  it('exposes the rescan command', async () => {
    const ext = vscode.extensions.getExtension('AgentMindCloud.vscode-grok-yaml');
    await ext?.activate();
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('grokYaml.rescan'), 'rescan command should be registered');
    assert.ok(commands.includes('grokYaml.showOutput'), 'showOutput command should be registered');
    assert.ok(commands.includes('grokYaml.refreshSchemas'), 'refreshSchemas command should be registered');
  });

  it('does not crash when scanning the unsafe fixture (with or without CLI)', async () => {
    const uri = vscode.Uri.file(path.join(FIXTURES, 'grok-install.unsafe.yaml'));
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc);
    await vscode.commands.executeCommand('grokYaml.rescan');
    // Diagnostics may or may not populate depending on whether grok-install is
    // available in the test environment; the important guarantee is that the
    // rescan command runs to completion without throwing.
    assert.ok(true);
  });
});
