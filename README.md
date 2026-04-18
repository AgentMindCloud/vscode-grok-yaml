# GrokInstall YAML

**IntelliSense, live schema validation, and safety-scanner diagnostics for the GrokInstall ecosystem.**

> Built for Grok on X.

## Features

- **Full IntelliSense** for every YAML spec published in [`grok-yaml-standards`](https://github.com/AgentMindCloud/grok-yaml-standards) — hover docs, autocomplete, and inline validation.
- **Live safety-scanner diagnostics** surfaced directly in the Problems panel, sourced from [`grok-install-cli`](https://github.com/AgentMindCloud/grok-install-cli).
- **Branded status bar indicator** — shows `clean`, `scanning`, or `N issue(s)` at a glance.
- **Offline-first** — schemas ship inside the VSIX, with an optional command to refresh them from the latest `grok-yaml-standards` release.
- **Quick fixes** — if the scanner ships a suggested fix, it becomes a one-click Code Action.

## How it works

The extension registers a schema contributor with [`redhat.vscode-yaml`](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml), so full YAML language-server features apply to every GrokInstall document. File classification combines a fast glob pass (`**/grok-*.yaml`, `**/.grok/**/*.yaml`) with an optional content sniff that reads `apiVersion: grokinstall.dev/v1` and the `kind:` field so renamed files still validate.

For safety findings, the extension runs the `grok-install` CLI with `--json` output on every change (debounced 400 ms by default) and maps each finding to a `vscode.Diagnostic`. If the CLI is not on PATH, the extension falls back to the bundled scanner library from `grok-install-cli`.

## Commands

| Command | Description |
|---|---|
| `GrokInstall: Show Scanner Output` | Open the `GrokInstall` output channel. |
| `GrokInstall: Rescan Workspace` | Re-run the scanner across every matching file. |
| `GrokInstall: Refresh Schemas from Remote` | Pull the latest schemas from `grok-yaml-standards` main. |

## Settings

See `grokYaml.*` in the Settings UI. Highlights:

- `grokYaml.schemas.source` — `bundled` | `remote` | `auto` (default).
- `grokYaml.scanner.mode` — `cli` | `library` | `auto` (default).
- `grokYaml.scanner.runOn` — `change` (default) | `save`.
- `grokYaml.fileMatch.globs` — customise which files are treated as GrokInstall YAML.

## Requirements

- VS Code 1.90 or later
- `redhat.vscode-yaml` (installed automatically as an extension dependency)
- Optionally, `grok-install` on PATH for the sharpest scanner results

## Disclaimer

GrokInstall is an independent community project. Not affiliated with xAI, Grok, or X.

## License

Apache-2.0. See [LICENSE](./LICENSE).
