# GrokInstall YAML

**IntelliSense, live schema validation, and safety-scanner diagnostics for the GrokInstall ecosystem.**

> Built for Grok on X.

## Install

From the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=AgentMindCloud.vscode-grok-yaml), or from the command line:

```
code --install-extension AgentMindCloud.vscode-grok-yaml
```

## Features

- **Full IntelliSense** for every YAML spec published in [`grok-yaml-standards`](https://github.com/AgentMindCloud/grok-yaml-standards) — hover docs, autocomplete, and inline validation.
- **Live safety-scanner diagnostics** surfaced directly in the Problems panel, sourced from [`grok-install-cli`](https://github.com/AgentMindCloud/grok-install-cli).
- **Branded status bar indicator** — shows `clean`, `scanning`, `N issue(s)`, or `error` at a glance.
- **Offline-first** — schemas ship inside the VSIX, with an optional command to refresh them from the latest `grok-yaml-standards` release.
- **Quick fixes** — if the scanner ships a suggested fix, it becomes a one-click Code Action.

## How it works

The extension registers a schema contributor with [`redhat.vscode-yaml`](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml), so full YAML language-server features apply to every GrokInstall document. File classification combines a fast glob pass (`**/grok-*.yaml`, `**/.grok/**/*.yaml`) with an optional content sniff that reads `apiVersion: grokinstall.dev/v1` and the `kind:` field so renamed files still validate.

For safety findings, the extension runs the `grok-install` CLI with `--json` output on every change (debounced 400 ms by default) and maps each finding to a `vscode.Diagnostic`. If the CLI is not on PATH, the status bar shows `error` and diagnostics stay empty until the CLI is installed.

## Bundled schemas

All twelve `grok-yaml-standards` specs ship inside the VSIX: `Agent`, `Workflow`, `Tool`, `Prompt`, `Model`, `Dataset`, `Eval`, `Deploy`, `Secret`, `Policy`, `Telemetry`, `Install`. File patterns and the full registry manifest live in [`schemas/index.json`](./schemas/index.json).

## Commands

| Command | Description |
|---|---|
| `GrokInstall: Show Scanner Output` | Open the `GrokInstall` output channel. |
| `GrokInstall: Rescan Workspace` | Re-run the scanner across every matching file. |
| `GrokInstall: Refresh Schemas from Remote` | Pull the latest schemas from `grok-yaml-standards` main. |

## Settings

See `grokYaml.*` in the Settings UI. Highlights:

- `grokYaml.schemas.source` — `bundled` | `remote` | `auto` (default).
- `grokYaml.schemas.remoteBaseUrl` — override the `grok-yaml-standards` base URL used by `auto` / `remote`.
- `grokYaml.scanner.mode` — `cli` | `auto` (default).
- `grokYaml.scanner.cliPath` — path or command for the `grok-install` CLI (default `grok-install`).
- `grokYaml.scanner.runOn` — `change` (default) | `save`.
- `grokYaml.scanner.debounceMs` — debounce for change-driven scans in ms (default `400`).
- `grokYaml.fileMatch.globs` — customise which files are treated as GrokInstall YAML.
- `grokYaml.fileMatch.contentSniff` — also classify by `apiVersion: grokinstall.dev/...` + `kind:` (default `true`).

Status-bar colors are contributed as `grokYaml.statusClean`, `grokYaml.statusScanning`, and `grokYaml.statusIssues` — override them in `workbench.colorCustomizations` to rebrand the indicator.

## Requirements

- VS Code 1.90 or later
- Node.js 20 or later (for building from source)
- `redhat.vscode-yaml` (installed automatically as an extension dependency)
- Optionally, `grok-install` on PATH for the sharpest scanner results

## Development

```
npm install
npm run build      # esbuild → dist/extension.js
npm run watch      # rebuild on change
npm run typecheck  # tsc --noEmit
npm run lint       # eslint src
npm test           # compile + @vscode/test-electron
npm run package    # vsce package → .vsix
```

CI runs `typecheck`, `lint`, and `test` on every push via [`.github/workflows/ci.yml`](./.github/workflows/ci.yml); tagged releases publish via [`.github/workflows/release.yml`](./.github/workflows/release.yml).

## Disclaimer

GrokInstall is an independent community project. Not affiliated with xAI, Grok, or X.

## License

Apache-2.0. See [LICENSE](./LICENSE).
