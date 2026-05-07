# Changelog

All notable changes to the `vscode-grok-yaml` extension are documented here.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - Wire commands, snippets, grammar; ship to marketplaces

### Added
- 8 new commands wired through to the Command Palette: `Init Grok Agent`,
  `Validate Current Document`, `Validate Project`, `Scan Safety`,
  `Deploy Agent`, `Generate Install Link`, `Open Grok Marketplace`,
  `Open Template Gallery`. Total of 11 commands now exposed.
- Full `grok-yaml` language registration: 9 snippet files
  (`grok-agent`, `grok-config`, `grok-install`, `grok-workflow`,
  `post_thread`, `reply_to_mention`, `swarm_orchestrator`,
  `trend_to_thread`, `voice_response`), TextMate grammar
  (`source.yaml.grok`), and the existing `language-configuration.json`
  are all wired in `package.json contributes`.
- Activation events for every command and `onLanguage:grok-yaml`.
- Branded marketplace icon and banner using the Spectral palette
  (Plasma `#FF1E70`, Aurora `#00E0D5`).
- `package.json` now declares the `icon` field for marketplace listing.

### Changed
- `Open Template Gallery` was rewritten to use a `QuickPick` so the
  command runs without needing a webview build. The orphan
  `src/webview/gallery` and `esbuild.mjs` files were removed.

### Fixed
- `package.yml` workflow no longer asserts `contributes.yamlValidation.length`
  (the field never existed). It now verifies `commands.length >= 11`
  and runs `npm ci` + `npm run build` before packaging.
- `publish.yml` workflow calls `npm run build` instead of the
  non-existent `npm run compile`.

## [0.1.0] - Initial scaffold

### Added
- Extension scaffold (TypeScript strict, esbuild bundle, vsce packaging).
- Dynamic schema registration with `redhat.vscode-yaml` for every spec declared in
  `schemas/index.json` — matches whatever the `grok-yaml-standards` repository publishes.
- Optional runtime schema refresh from `raw.githubusercontent.com/AgentMindCloud/grok-yaml-standards`.
- Safety-scanner diagnostics sourced from the `grok-install` CLI subprocess,
  with Code Actions for any fixes the CLI suggests.
- Branded status bar indicator using the locked palette (`#00FF9D`, `#00F0FF`, `#FF2D55`).
- Commands: `Show Scanner Output`, `Rescan Workspace`, `Refresh Schemas from Remote`.
