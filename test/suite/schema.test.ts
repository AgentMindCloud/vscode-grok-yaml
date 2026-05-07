import * as assert from 'node:assert';
import * as path from 'node:path';
import * as vscode from 'vscode';

const FIXTURES = path.resolve(__dirname, '..', '..', '..', 'test', 'fixtures');

describe('schema registration', () => {
  it('activates the extension and registers with redhat.vscode-yaml', async () => {
    const ext = vscode.extensions.getExtension('AgentMindCloud.vscode-grok-yaml');
    assert.ok(ext, 'extension should be discoverable by publisher.id');
    await ext!.activate();
    assert.strictEqual(ext!.isActive, true);

    const yaml = vscode.extensions.getExtension('redhat.vscode-yaml');
    assert.ok(yaml, 'redhat.vscode-yaml should be installed as a dependency');
  });

  it('classifies a bundled valid fixture as grok-yaml', async () => {
    const uri = vscode.Uri.file(path.join(FIXTURES, 'grok-agent.valid.yaml'));
    const doc = await vscode.workspace.openTextDocument(uri);
    // grok-*.yaml filename pattern is claimed by the grok-yaml language
    // contribution, so VS Code classifies the fixture accordingly. The
    // schema contributor still binds via URI-based registerContributor,
    // so redhat.vscode-yaml schema validation continues to apply.
    assert.strictEqual(doc.languageId, 'grok-yaml');
  });
});
