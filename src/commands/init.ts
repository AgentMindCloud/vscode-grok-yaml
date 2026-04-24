import * as vscode from 'vscode';
import { runCliInTerminal } from '../cli';

const CATEGORIES: { label: string; value: string; description: string }[] = [
  { label: 'Reply bot', value: 'reply-bot', description: 'Responds to mentions with brand voice' },
  { label: 'Voice companion', value: 'voice-companion', description: 'Voice-first Grok spec' },
  { label: 'Thread orchestrator', value: 'thread-orchestrator', description: 'Long-form thread composer' },
  { label: 'Trend surfer', value: 'trend-surfer', description: 'Turns trending topics into threads' },
  { label: 'Swarm coordinator', value: 'swarm-coordinator', description: 'Multi-agent orchestration' },
];

export async function initAgent(): Promise<void> {
  const name = await vscode.window.showInputBox({
    prompt: 'Agent name',
    placeHolder: 'my-grok-agent',
    validateInput: (v) => (/^[a-z0-9-]{1,64}$/.test(v) ? null : 'Lowercase, digits, and hyphens only (max 64).'),
  });
  if (!name) return;

  const pick = await vscode.window.showQuickPick(
    CATEGORIES.map((c) => ({ label: c.label, description: c.description, value: c.value })),
    { placeHolder: 'Category' },
  );
  if (!pick) return;

  runCliInTerminal(['init', '--name', name, '--category', pick.value]);
  vscode.window.showInformationMessage(
    `Scaffolding "${name}" in a new terminal. When it finishes, open the folder from the CLI hint.`,
  );
}
