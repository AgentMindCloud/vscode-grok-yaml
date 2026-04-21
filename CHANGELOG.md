# Changelog

All notable changes to the **Grok YAML** extension are documented in this
file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-04-21

Initial public release. Ships schema validation and snippets for the **12
Grok YAML document types** (spec v2.14), piggybacking on
[`redhat.vscode-yaml`](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml).

### Added
- `contributes.yamlValidation` entries for all **12** schemas:
  `install`, `install-v2.14`, `agent`, `config`, `workflow`, `prompt`,
  `tool`, `policy`, `model`, `dataset`, `eval`, `deployment` — each
  resolving to `https://schemas.grokinstall.dev/v2.14/<name>.json`.
- Four snippet catalogs (tab-stopped):
  - `grok-install.json` — full document + `visuals block v2.14` neon-token
    snippet.
  - `grok-agent.json`, `grok-config.json`, `grok-workflow.json`.
- `extensionDependencies: ["redhat.vscode-yaml"]` — the dependency is
  auto-installed on first activation.
- Marketplace branding: `icon`, `galleryBanner` (dark `#0A0A0A`),
  hero banner in README.
- Community health: `CONTRIBUTING.md`, `SECURITY.md`, bug / feature /
  snippet-request issue forms, PR template, FUNDING.yml.
- CI: `package.yml` (build `.vsix` on every push), `publish.yml`
  (Marketplace publish on `v*` tags).
- `docs/publishing.md` — step-by-step release procedure.

### Notes
- v0.1.0 ships **placeholder** brand PNGs in `media/`. Final artwork
  lands in a follow-up patch release. See `media/README.md`.
- No runtime code — the extension is pure manifest + snippets.
- `package-lock.json` is a placeholder; there are no npm dependencies
  to pin in v0.1.0.

[0.1.0]: https://github.com/AgentMindCloud/vscode-grok-yaml/releases/tag/v0.1.0
