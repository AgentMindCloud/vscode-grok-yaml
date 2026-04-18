# Changelog

All notable changes to the `vscode-grok-yaml` extension are documented here.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - Initial scaffold

### Added
- Extension scaffold (TypeScript strict, esbuild bundle, vsce packaging).
- Dynamic schema registration with `redhat.vscode-yaml` for every spec declared in
  `schemas/index.json` — matches whatever the `grok-yaml-standards` repository publishes.
- Optional runtime schema refresh from `raw.githubusercontent.com/AgentMindCloud/grok-yaml-standards`.
- Safety-scanner diagnostics sourced from `grok-install-cli` — CLI subprocess first,
  Node library fallback, with Code Actions for any shipped fixes.
- Branded status bar indicator using the locked palette (`#00FF9D`, `#00F0FF`, `#FF2D55`).
- Commands: `Show Scanner Output`, `Rescan Workspace`, `Refresh Schemas from Remote`.
