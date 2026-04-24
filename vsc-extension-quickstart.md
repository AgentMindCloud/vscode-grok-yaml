# Extension Dev Quickstart

Internal developer notes for the GrokInstall VS Code extension.

## Setup

```bash
npm install
npm run compile          # one-shot bundle
npm run watch            # rebuild on save
```

## Run the extension host

1. Open this folder in VS Code.
2. Press `F5` to launch the Extension Development Host.
3. In the host window, open the Command Palette (`Cmd/Ctrl+Shift+P`) and
   type `GrokInstall:` to see all eight commands.

## Logs

- `View > Output > GrokInstall` — extension-side logs (validation,
  safety scans, gallery file writes).
- `View > Output > YAML` — IntelliSense and schema diagnostics from the
  bundled `redhat.vscode-yaml` dependency.

## Testing without the CLI installed

`grok-install` CLI isn't required to exercise most of the UX:

- `GrokInstall: Open Template Gallery` — works standalone.
- `GrokInstall: Open grokagents.dev Marketplace` — works standalone.
- `GrokInstall: New Agent from Template` — input box + quick-pick works;
  the terminal spawn will error if the CLI isn't installed (friendly
  hint).
- `GrokInstall: Validate / Deploy / Scan / Copy Install Link` — surface
  `grok-install CLI not found` if the CLI is missing.

To smoke-test CLI paths, stub `grok-install` by dropping a shell script
on `$PATH` that echoes sample JSON output.

## Webview HMR

The webview doesn't hot-reload — after editing anything in
`src/webview/gallery/`, close the gallery panel and reopen it so the
fresh bundle loads.

## Packaging

```bash
npm run package          # produces grokinstall-yaml-<version>.vsix
```

Never commit the `.vsix`.
