export const EXTENSION_ID = 'AgentMindCloud.vscode-grok-yaml';
export const OUTPUT_CHANNEL_NAME = 'GrokInstall';
export const DIAGNOSTIC_SOURCE = 'grokinstall';
export const DIAGNOSTIC_COLLECTION = 'grokinstall';
export const SCHEMA_CONTRIBUTOR_NAMESPACE = 'grokinstall';
export const SCHEMA_CONTRIBUTOR_LABEL = 'GrokInstall YAML';

export const CONFIG_SECTION = 'grokYaml';

export const BRAND = {
  background: '#0A0A0A',
  primaryNeon: '#00F0FF',
  successNeon: '#00FF9D',
  danger: '#FF2D55',
  tagline: 'Built for Grok on X',
  disclaimer:
    'GrokInstall is an independent community project. Not affiliated with xAI, Grok, or X.',
} as const;

export const COMMANDS = {
  showOutput: 'grokYaml.showOutput',
  rescan: 'grokYaml.rescan',
  refreshSchemas: 'grokYaml.refreshSchemas',
} as const;

export const STATUS_BAR_COLORS = {
  clean: 'grokYaml.statusClean',
  scanning: 'grokYaml.statusScanning',
  issues: 'grokYaml.statusIssues',
} as const;

export const GROKINSTALL_API_VERSION_PREFIX = 'grokinstall.dev/';
