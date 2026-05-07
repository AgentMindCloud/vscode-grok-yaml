import * as vscode from 'vscode';

interface Template {
  id: string;
  label: string;
  description: string;
  url: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'agent-basic',
    label: 'Basic Agent',
    description: 'Minimal grok-agent.yaml',
    url: 'https://github.com/AgentMindCloud/grok-yaml-standards/tree/main/templates/agent-basic',
  },
  {
    id: 'workflow-pipeline',
    label: 'Workflow Pipeline',
    description: 'Multi-step grok-workflow.yaml',
    url: 'https://github.com/AgentMindCloud/grok-yaml-standards/tree/main/templates/workflow-pipeline',
  },
  {
    id: 'swarm-orchestrator',
    label: 'Swarm Orchestrator',
    description: 'Orchestrator + sub-agents',
    url: 'https://github.com/AgentMindCloud/grok-yaml-standards/tree/main/templates/swarm-orchestrator',
  },
  {
    id: 'voice-response',
    label: 'Voice Response',
    description: 'grok-voice.yaml with voice_response capability',
    url: 'https://github.com/AgentMindCloud/grok-yaml-standards/tree/main/templates/voice-response',
  },
  {
    id: 'trend-to-thread',
    label: 'Trend → Thread',
    description: 'Trend-watching agent that posts threads',
    url: 'https://github.com/AgentMindCloud/grok-yaml-standards/tree/main/templates/trend-to-thread',
  },
];

export async function openTemplateGallery(_ctx: vscode.ExtensionContext): Promise<void> {
  const items = TEMPLATES.map((t) => ({
    label: t.label,
    description: t.description,
    detail: t.url,
    template: t,
  }));
  const picked = await vscode.window.showQuickPick(items, {
    title: 'Grok Agent Templates',
    placeHolder: 'Select a template to open in your browser',
    matchOnDescription: true,
  });
  if (!picked) return;
  await vscode.env.openExternal(vscode.Uri.parse(picked.template.url));
}
