# GrokInstall YAML

![GrokInstall extension banner](media/banner.png)

**YAML authoring, validation, safety scanning, and a template gallery for
GrokInstall specs — right in VS Code. Built for Grok on X.**

Go from empty folder to shipped agent without leaving the editor. Author
`grok-agent.yaml`, `grok-install.yaml`, `grok-voice.yaml`, `grok-swarm.yaml`,
and `capabilities.yaml` with schema-aware IntelliSense, inline
diagnostics, safety scanning, and a glassmorphic template gallery.

---

## Screenshots

| | |
| --- | --- |
| ![IntelliSense](assets/screenshots/intellisense.png)<br />`TODO: IntelliSense completing a reply_to_mention key` | ![Hover docs](assets/screenshots/hover.png)<br />`TODO: Hover tooltip on voice_profile.tone` |
| ![Safety scanner](assets/screenshots/scanner.png)<br />`TODO: Scanner flagging a rate-limit risk` | ![Gallery](assets/screenshots/gallery.png)<br />`TODO: Glassmorphic template gallery panel` |

> Assets marked `TODO` are dropped in by Claude Design before publish
> (see `PUBLISH.md`).

---

## Features

- **Schema-backed IntelliSense and diagnostics** for five Grok spec
  formats, powered by the bundled `redhat.vscode-yaml` dependency.
- **Five context-aware snippets** covering the most-used capabilities.
- **Command palette** — eight commands covering init, validate, scan,
  deploy, and share.
- **Glassmorphic template gallery** — clone starter projects or drop a
  snippet into the current file.
- **Safety scanner integration** — runs `grok-install scan` with
  severity-aware notifications and a streaming output log.
- **One-click share** — deploy copies a ready-to-post X message with
  your install link to the clipboard.

---

## Commands

Every command is prefixed `GrokInstall:` in the palette.

| Command                               | Suggested shortcut | What it does                                                         |
| ------------------------------------- | ------------------ | -------------------------------------------------------------------- |
| `New Agent from Template`             | `Cmd+Alt+N`        | Wizard (name + category) then runs `grok-install init` in a terminal |
| `Validate Current Spec`               | `Cmd+Alt+V`        | Validates the active file, pushes diagnostics into Problems          |
| `Validate Entire Project`             | `Cmd+Alt+Shift+V`  | Scans the full workspace with `grok-install validate --project`      |
| `Run Safety Scanner`                  | `Cmd+Alt+S`        | Runs `grok-install scan` with progress notifications                 |
| `Deploy Agent`                        | `Cmd+Alt+D`        | Deploys, copies a ready-to-post X share message                      |
| `Copy Install Link`                   | `Cmd+Alt+L`        | Generates and copies the install link to clipboard                   |
| `Open grokagents.dev Marketplace`     | —                  | Opens the public marketplace in your browser                         |
| `Open Template Gallery`               | `Cmd+Alt+G`        | Opens the glassmorphic template gallery webview                      |

Assign the shortcuts from `File > Preferences > Keyboard Shortcuts` —
the suggestions above are not pre-bound to avoid stomping your setup.

---

## Snippets

Type any of the prefixes below inside a `.yaml` file. The snippet fills
in schema-valid defaults with tab stops for quick customization.

| Prefix         | Expands into                            | Target file             |
| -------------- | --------------------------------------- | ----------------------- |
| `grok:reply`   | `capabilities.reply_to_mention` block   | `capabilities.yaml`     |
| `grok:thread`  | `thread_posting` + `post_thread`        | `grok-agent.yaml`       |
| `grok:voice`   | Full `voice_profile` + `response` block | `grok-voice.yaml`       |
| `grok:trend`   | `trend_pipeline` + `post_thread` combo  | `grok-agent.yaml`       |
| `grok:swarm`   | `orchestrator` + `agents` + `fallback`  | `grok-swarm.yaml`       |

---

## Why GrokInstall?

GrokInstall turns a YAML spec into a shippable Grok agent on X. The CLI
handles validation, safety scanning, and deployment. This extension
puts that entire loop inside your editor — author with IntelliSense,
catch issues before `deploy`, and share an install link that lets
anyone install your agent with a single click.

The full stack is open and independent: the
[core spec](https://github.com/AgentMindCloud/grok-install), the
[YAML standards](https://github.com/AgentMindCloud/grok-yaml-standards),
the [CLI](https://github.com/AgentMindCloud/grok-install-cli), and the
[marketplace](https://grokagents.dev) all ship under the AgentMindCloud
org. Build an agent once, publish it everywhere.

---

## Install

1. Install this extension from the VS Code Marketplace.
2. Install the CLI: `npm install -g grok-install`.
3. Open the command palette and run **GrokInstall: New Agent from Template**.

---

## Disclaimer

GrokInstall is an independent community project. **Not affiliated with
xAI, Grok, or X.**
