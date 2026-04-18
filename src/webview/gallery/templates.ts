export type TemplateCategory =
  | 'voice-ready'
  | 'multi-agent-swarm'
  | 'beginner'
  | 'trending';

export interface TemplateFile {
  path: string;
  content: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  categories: TemplateCategory[];
  type: 'project' | 'snippet';
  previewUrl?: string;
  files: TemplateFile[];
  snippet?: string;
}

const AGENT_REPLY_BOT = `spec_version: 2.0.0
name: reply-rider
handle: "@replyrider"
description: Warm, concise replies to every mention within 30 seconds.
category: reply-bot
persona:
  voice: "Casual, confident, briefly witty."
  temperament: "Curious and supportive."
  guardrails:
    - "Never reply to accounts with < 10 followers."
    - "Skip DM-bait or crypto-shilling mentions."
capabilities:
  - reply_to_mention
`;

const CAPS_REPLY_BOT = `spec_version: 2.0.0
capabilities:
  reply_to_mention:
    enabled: true
    max_replies_per_hour: 20
    cooldown_seconds: 30
    tone: "warm"
`;

const INSTALL_REPLY_BOT = `spec_version: 2.0.0
agent: ./grok-agent.yaml
runtime:
  platform: x
  model: grok-4-fast
safety:
  profile: standard
  rate_limits:
    posts_per_hour: 0
    replies_per_hour: 20
`;

const AGENT_VOICE = `spec_version: 2.0.0
name: voice-companion
description: Voice-first Grok companion with a warm, deliberate tone.
category: voice-companion
persona:
  voice: "Deliberate, warm, unhurried."
  temperament: "Patient and clarifying."
capabilities:
  - voice_response
`;

const VOICE_SPEC = `spec_version: 2.0.0
voice_profile:
  voice_id: "grok-primary-en"
  tone: warm
  rate: 1.0
  pitch: 0.0
response:
  max_duration_seconds: 30
  wake_phrases:
    - "hey grok"
  fallback_text: "Sorry, I didn't catch that."
`;

const AGENT_TREND = `spec_version: 2.0.0
name: trend-surfer
description: Turns the hottest X trends into insightful 5-post threads.
category: trend-surfer
persona:
  voice: "Analytical with a journalistic lean."
  temperament: "Measured, never sensational."
trend_pipeline:
  source: "x-trending"
  window_minutes: 15
  max_posts_per_hour: 4
thread_posting:
  max_posts: 5
  cadence_seconds: 60
capabilities:
  - trend_to_thread
  - post_thread
`;

const AGENT_THREAD = `spec_version: 2.0.0
name: thread-orchestrator
description: Transforms one-liners into well-structured long-form threads.
category: thread-orchestrator
persona:
  voice: "Editorial, concise, with clear hooks."
  temperament: "Structured and deliberate."
thread_posting:
  max_posts: 8
  cadence_seconds: 45
capabilities:
  - post_thread
`;

const SWARM_SPEC = `spec_version: 2.0.0
orchestrator:
  strategy: router
  max_concurrent: 3
  timeout_seconds: 20
agents:
  - id: lead
    role: primary
    spec: ./agents/lead.yaml
    weight: 0.6
  - id: support
    role: backup
    spec: ./agents/support.yaml
    weight: 0.4
fallback:
  agent_id: lead
  message: "I'll have a teammate pick this up."
`;

const INSTALL_DEFAULT = `spec_version: 2.0.0
agent: ./grok-agent.yaml
runtime:
  platform: x
  model: grok-4-fast
safety:
  profile: standard
`;

export const TEMPLATES: Template[] = [
  {
    id: 'reply-bot',
    name: 'Reply Bot',
    description: 'Warm, rate-limited reply-to-mention agent with a clean capabilities spec.',
    categories: ['beginner', 'trending'],
    type: 'project',
    previewUrl: 'https://grokagents.dev/templates/reply-bot',
    files: [
      { path: 'grok-agent.yaml', content: AGENT_REPLY_BOT },
      { path: 'capabilities.yaml', content: CAPS_REPLY_BOT },
      { path: 'grok-install.yaml', content: INSTALL_REPLY_BOT },
    ],
  },
  {
    id: 'voice-companion',
    name: 'Voice Companion',
    description: 'Voice-first spec with tone, rate, and fallback text ready to go.',
    categories: ['voice-ready'],
    type: 'project',
    previewUrl: 'https://grokagents.dev/templates/voice-companion',
    files: [
      { path: 'grok-agent.yaml', content: AGENT_VOICE },
      { path: 'grok-voice.yaml', content: VOICE_SPEC },
      { path: 'grok-install.yaml', content: INSTALL_DEFAULT },
    ],
  },
  {
    id: 'thread-orchestrator',
    name: 'Thread Orchestrator',
    description: 'Structured long-form thread composer with editorial cadence.',
    categories: ['trending'],
    type: 'project',
    previewUrl: 'https://grokagents.dev/templates/thread-orchestrator',
    files: [
      { path: 'grok-agent.yaml', content: AGENT_THREAD },
      { path: 'grok-install.yaml', content: INSTALL_DEFAULT },
    ],
  },
  {
    id: 'trend-surfer',
    name: 'Trend Surfer',
    description: 'Pulls trending topics on a 15-minute window and spins up 5-post threads.',
    categories: ['trending', 'beginner'],
    type: 'project',
    previewUrl: 'https://grokagents.dev/templates/trend-surfer',
    files: [
      { path: 'grok-agent.yaml', content: AGENT_TREND },
      { path: 'grok-install.yaml', content: INSTALL_DEFAULT },
    ],
  },
  {
    id: 'swarm-coordinator',
    name: 'Swarm Coordinator',
    description: 'Router-strategy swarm orchestrator with lead/support agents and a fallback.',
    categories: ['multi-agent-swarm'],
    type: 'snippet',
    previewUrl: 'https://grokagents.dev/templates/swarm-coordinator',
    files: [{ path: 'grok-swarm.yaml', content: SWARM_SPEC }],
    snippet: SWARM_SPEC,
  },
];

export const FILTERS: { id: 'all' | TemplateCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'voice-ready', label: 'Voice-Ready' },
  { id: 'multi-agent-swarm', label: 'Multi-Agent Swarm' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'trending', label: 'Trending' },
];
