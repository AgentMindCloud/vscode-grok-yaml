<!-- NEON / CYBERPUNK REPO TEMPLATE · VSCODE-GROK-YAML -->

<p align="center">
  <img
    src="https://capsule-render.vercel.app/api?type=waving&height=230&color=0:00E5FF,50:7C3AED,100:FF4FD8&text=GrokInstall%20YAML&fontSize=50&fontColor=EAF8FF&fontAlign=50&fontAlignY=38&desc=YAML%20Authoring%2C%20Validation%2C%20Safety%20Scans%20%E2%80%94%20Inside%20VS%20Code&descAlignY=62&descSize=17"
    width="100%"
    alt="header"
  />
</p>

<h1 align="center">⚡ GrokInstall YAML for VS Code</h1>

<p align="center">
  <b>Go from empty folder to shipped agent without leaving the editor.</b><br/>
  Schema-aware IntelliSense · inline diagnostics · safety scanning · glassmorphic template gallery.
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=700&size=22&pause=1000&color=00E5FF&center=true&vCenter=true&width=900&lines=5+Grok+Spec+Formats+%C2%B7+Schema-Backed;8+Commands+%C2%B7+5+Context-Aware+Snippets;Inline+Safety+Scanner+%C2%B7+Streaming+Output;Glassmorphic+Template+Gallery" alt="typing" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/VS%20Code%20Extension-00E5FF?style=for-the-badge&logo=visualstudiocode&logoColor=001018&labelColor=0A0D14" />
  <img src="https://img.shields.io/badge/5%20Spec%20Formats-7C3AED?style=for-the-badge&logoColor=FFFFFF&labelColor=0A0D14" />
  <img src="https://img.shields.io/badge/8%20Commands-FF4FD8?style=for-the-badge&logoColor=FFFFFF&labelColor=0A0D14" />
  <img src="https://img.shields.io/badge/Built%20for%20Grok%20on%20X-00D5FF?style=for-the-badge&logo=x&logoColor=001018&labelColor=0A0D14" />
  <img src="https://img.shields.io/badge/Apache%202.0-9D4EDD?style=for-the-badge&logoColor=FFFFFF&labelColor=0A0D14" />
</p>

<p align="center">
  <img src="media/banner.png" alt="GrokInstall extension banner" width="760" />
</p>

---

## ✦ Screenshots

| | |
| --- | --- |
| ![IntelliSense](assets/screenshots/intellisense.png) | ![Hover docs](assets/screenshots/hover.png) |
| ![Safety scanner](assets/screenshots/scanner.png) | ![Gallery](assets/screenshots/gallery.png) |

<details>
<summary><b>Screenshot captions</b></summary>

- **Top-left:** IntelliSense completing a `reply_to_mention` key
- **Top-right:** Hover tooltip on `voice_profile.tone`
- **Bottom-left:** Scanner flagging a rate-limit risk
- **Bottom-right:** Glassmorphic template gallery panel

Assets marked as placeholders are dropped in by Claude Design before publish — see `PUBLISH.md`.

</details>

## ✦ Features

<table>
  <tr>
    <td width="50%">
      <h3>🧠 Schema-Backed IntelliSense</h3>
      <p>Completion, hover docs, and inline diagnostics for all five Grok spec formats — powered by the bundled <code>redhat.vscode-yaml</code> dependency.</p>
    </td>
    <td width="50%">
      <h3>🛡️ Safety Scanner Integration</h3>
      <p>Runs <code>grok-install scan</code> with severity-aware notifications and a streaming output log. Ship safer agents by default.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>⌨️ Command Palette Coverage</h3>
      <p>Eight <code>GrokInstall:</code> commands — init, validate (file + project), scan, deploy, copy install link, share.</p>
    </td>
    <td>
      <h3>📝 Context-Aware Snippets</h3>
      <p>Five prefixes expand into schema-valid defaults with tab stops — reply, thread, voice, trend, swarm.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🎨 Glassmorphic Template Gallery</h3>
      <p>Clone starter projects or drop a snippet into the current file. Dark-premium UI, live-previewable.</p>
    </td>
    <td>
      <h3>🔗 One-Click Share</h3>
      <p>Deploy copies a ready-to-post X message with your install link to the clipboard. Zero friction from ship to share.</p>
    </td>
  </tr>
</table>

## ✦ Supported Spec Files

<p align="center">
  <img src="https://img.shields.io/badge/grok--agent.yaml-00E5FF?style=for-the-badge&logoColor=001018&labelColor=0A0D14" />
  <img src="https://img.shields.io/badge/grok--install.yaml-7C3AED?style=for-the-badge&logoColor=FFFFFF&labelColor=0A0D14" />
  <img src="https://img.shields.io/badge/grok--voice.yaml-FF4FD8?style=for-the-badge&logoColor=FFFFFF&labelColor=0A0D14" />
  <img src="https://img.shields.io/badge/grok--swarm.yaml-00D5FF?style=for-the-badge&logoColor=001018&labelColor=0A0D14" />
  <img src="https://img.shields.io/badge/capabilities.yaml-9D4EDD?style=for-the-badge&logoColor=FFFFFF&labelColor=0A0D14" />
</p>

## ✦ How It Works

```mermaid
flowchart LR
  OPEN["Open .yaml in VS Code"] --> DETECT["File glob match"]
  DETECT --> SCHEMA["Bundled JSON Schema"]
  SCHEMA --> YAMLEXT["redhat.vscode-yaml"]
  YAMLEXT --> INTEL["IntelliSense + hover"]
  YAMLEXT --> DIAG["Problems panel"]
  PALETTE["GrokInstall palette"] --> INIT["init"]
  PALETTE --> VAL["validate"]
  PALETTE --> SCAN["scan"]
  PALETTE --> DEPLOY["deploy"]
  INIT --> CLI["grok-install CLI"]
  VAL --> CLI
  SCAN --> CLI
  DEPLOY --> CLI
  DEPLOY --> SHARE["clipboard · X share message"]
  GALLERY["Template Gallery webview"] --> CLONE["clone starter"]
  GALLERY --> INSERT["insert snippet"]
```

## ✦ Commands

Every command is prefixed `GrokInstall:` in the palette.

| Command | Suggested shortcut | What it does |
|---|---|---|
| `New Agent from Template` | `Cmd+Alt+N` | Wizard (name + category) then runs `grok-install init` in a terminal |
| `Validate Current Spec` | `Cmd+Alt+V` | Validates the active file, pushes diagnostics into Problems |
| `Validate Entire Project` | `Cmd+Alt+Shift+V` | Scans the full workspace with `grok-install validate --project` |
| `Run Safety Scanner` | `Cmd+Alt+S` | Runs `grok-install scan` with progress notifications |
| `Deploy Agent` | `Cmd+Alt+D` | Deploys, copies a ready-to-post X share message |
| `Copy Install Link` | `Cmd+Alt+L` | Generates and copies the install link to clipboard |
| `Open grokagents.dev Marketplace` | — | Opens the public marketplace in your browser |
| `Open Template Gallery` | `Cmd+Alt+G` | Opens the glassmorphic template gallery webview |

> Assign the shortcuts from `File > Preferences > Keyboard Shortcuts` — the suggestions above are not pre-bound to avoid stomping your setup.

## ✦ Snippets

Type any of the prefixes below inside a `.yaml` file. The snippet fills in schema-valid defaults with tab stops for quick customization.

| Prefix | Expands into | Target file |
|---|---|---|
| `grok:reply` | `capabilities.reply_to_mention` block | `capabilities.yaml` |
| `grok:thread` | `thread_posting` + `post_thread` | `grok-agent.yaml` |
| `grok:voice` | Full `voice_profile` + `response` block | `grok-voice.yaml` |
| `grok:trend` | `trend_pipeline` + `post_thread` combo | `grok-agent.yaml` |
| `grok:swarm` | `orchestrator` + `agents` + `fallback` | `grok-swarm.yaml` |

## ✦ Install

<table>
  <tr>
    <td width="33%">
      <h3>1️⃣ Extension</h3>
      <p>Install <b>GrokInstall YAML</b> from the VS Code Marketplace.</p>
    </td>
    <td width="33%">
      <h3>2️⃣ CLI</h3>
      <p><code>npm install -g grok-install</code></p>
    </td>
    <td width="33%">
      <h3>3️⃣ First Agent</h3>
      <p>Command palette → <b>GrokInstall: New Agent from Template</b>.</p>
    </td>
  </tr>
</table>

## ✦ Why GrokInstall?

GrokInstall turns a YAML spec into a shippable Grok agent on X. The CLI handles validation, safety scanning, and deployment. **This extension puts that entire loop inside your editor** — author with IntelliSense, catch issues before `deploy`, and share an install link that lets anyone install your agent with a single click.

The full stack is open and independent:

<table>
  <tr>
    <td width="25%">
      <h3>📦 Core Spec</h3>
      <a href="https://github.com/AgentMindCloud/grok-install">grok-install →</a>
    </td>
    <td width="25%">
      <h3>📐 Standards</h3>
      <a href="https://github.com/AgentMindCloud/grok-yaml-standards">grok-yaml-standards →</a>
    </td>
    <td width="25%">
      <h3>⚙️ CLI</h3>
      <a href="https://github.com/AgentMindCloud/grok-install-cli">grok-install-cli →</a>
    </td>
    <td width="25%">
      <h3>🛒 Marketplace</h3>
      <a href="https://grokagents.dev">grokagents.dev →</a>
    </td>
  </tr>
</table>

**Build an agent once, publish it everywhere.**

## ✦ Sibling Repos

<table>
  <tr>
    <td width="33%">
      <h3>📦 grok-install</h3>
      <p>The universal YAML spec this extension validates.</p>
      <a href="https://github.com/agentmindcloud/grok-install">Repository →</a>
    </td>
    <td width="33%">
      <h3>⚙️ grok-install-cli</h3>
      <p>The CLI this extension orchestrates on your behalf.</p>
      <a href="https://github.com/agentmindcloud/grok-install-cli">Repository →</a>
    </td>
    <td width="33%">
      <h3>📐 grok-yaml-standards</h3>
      <p>The schema registry powering IntelliSense.</p>
      <a href="https://github.com/agentmindcloud/grok-yaml-standards">Repository →</a>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🌟 awesome-grok-agents</h3>
      <p>10 certified templates browsable from the gallery.</p>
      <a href="https://github.com/agentmindcloud/awesome-grok-agents">Repository →</a>
    </td>
    <td>
      <h3>📚 grok-docs</h3>
      <p>Full docs — spec reference, CLI reference, guides.</p>
      <a href="https://github.com/agentmindcloud/grok-docs">Repository →</a>
    </td>
    <td>
      <h3>🤖 grok-install-action</h3>
      <p>GitHub Action that validates every PR with the same scanner.</p>
      <a href="https://github.com/agentmindcloud/grok-install-action">Repository →</a>
    </td>
  </tr>
</table>

## ✦ Connect

<p align="center">
  <a href="https://grokagents.dev"><img src="https://img.shields.io/badge/grokagents.dev-00E5FF?style=for-the-badge&logoColor=001018&labelColor=0A0D14" /></a>
  <a href="https://github.com/agentmindcloud"><img src="https://img.shields.io/badge/GitHub-7C3AED?style=for-the-badge&logo=github&logoColor=FFFFFF&labelColor=0A0D14" /></a>
  <a href="https://x.com/JanSol0s"><img src="https://img.shields.io/badge/X-FF4FD8?style=for-the-badge&logo=x&logoColor=FFFFFF&labelColor=0A0D14" /></a>
</p>

## ✦ Disclaimer

GrokInstall is an independent community project. **Not affiliated with xAI, Grok, or X.**

## ✦ License

Apache 2.0.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=120&section=footer&color=0:00E5FF,50:7C3AED,100:FF4FD8" width="100%" />
</p>
