# Changelog

All notable changes to this extension are documented in this file. The
format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.0] — 2026-04-18

### Added
- **Command palette (8 commands):** `New Agent from Template`,
  `Validate Current Spec`, `Validate Entire Project`,
  `Run Safety Scanner`, `Deploy Agent`, `Copy Install Link`,
  `Open grokagents.dev Marketplace`, `Open Template Gallery`.
- **Template gallery webview** (React + esbuild bundle) with
  glassmorphic cards, cyan-accent filter pills
  (`All`, `Voice-Ready`, `Multi-Agent Swarm`, `Beginner`, `Trending`),
  animated SVG circuit backdrop, empty state, and responsive layout
  (1 / 2 / 3 columns at 0 / 640 / 960 px).
- **Five starter templates** — `reply-bot`, `voice-companion`,
  `thread-orchestrator`, `trend-surfer`, `swarm-coordinator`.
- **Five YAML snippets** — `grok:reply`, `grok:thread`, `grok:voice`,
  `grok:trend`, `grok:swarm`.
- **Five JSON schemas** registered via `yamlValidation` for
  `grok-agent.yaml`, `grok-install.yaml`, `grok-voice.yaml`,
  `grok-swarm.yaml`, `capabilities.yaml`.
- **Status bar item** — cyan dot that opens the template gallery.
- **Shared `GrokInstall` output channel** and `grokinstall` diagnostic
  collection backing every CLI integration.
- **Deploy share message** — copies a ready-to-post X message with the
  install link to the clipboard on successful deploy.
- **Manual `workflow_dispatch` GitHub Action** that produces a `.vsix`
  artifact without publishing.
- **Marketplace-facing README**, `PUBLISH.md`, and
  `vsc-extension-quickstart.md`.
- **Brand icon and gallery banner** wired in `package.json`
  (`media/icon.png`, `galleryBanner.color: "#0A0A0A"`). Placeholder PNGs
  ship with this release — real assets from Claude Design drop in before
  publish.

### Changed
- **README** replaced the Session 5 handoff prompt with real
  marketplace copy.

### Known
- Screenshot PNGs in `assets/screenshots/` are `TODO` — to be added by
  Claude Design before marketplace publish.
- `media/icon.png`, `media/icon-dark.png`, `media/banner.png` are
  68-byte transparent placeholders pending real assets from Claude
  Design.
