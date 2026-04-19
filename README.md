# GrokInstall YAML for VS Code

![GrokInstall extension banner](media/banner.png)

Authoring support for **GrokInstall YAML** specs — the declarative format
for agents, workflows, tools, prompts, models, memory, MCP servers,
tasks, pipelines, policies, datasets, evaluations, environments, and
deployments.

## Features

- **Schema-backed validation** for all 14 GrokInstall spec kinds via the
  official Red Hat YAML language server.
- **IntelliSense**: completions, hovers, and inline diagnostics on any
  `*.grok.yaml` / `*.grok.yml` file or a conventional filename
  (`agent.yaml`, `workflow.yaml`, …).
- **Commands** (in the Command Palette under **Grok YAML**):
  - `Grok YAML: Validate Current File`
  - `Grok YAML: Scan Workspace for Grok Specs`
  - `Grok YAML: Generate New Agent Spec`
- **Language grammar** for `grok-yaml` — YAML plus highlighting of Grok
  top-level keys (`apiVersion`, `kind`, `metadata`, `spec`) and kinds.

## Requirements

This extension depends on
[Red Hat YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml),
which VS Code installs automatically.

## Supported spec kinds

| Kind          | File pattern                           |
|---------------|----------------------------------------|
| Agent         | `*.agent.grok.yaml`, `agent.yaml`      |
| Workflow      | `*.workflow.grok.yaml`                 |
| Tool          | `*.tool.grok.yaml`                     |
| Prompt        | `*.prompt.grok.yaml`                   |
| Model         | `*.model.grok.yaml`                    |
| Memory        | `*.memory.grok.yaml`                   |
| MCPServer     | `*.mcp.grok.yaml`, `mcp-server.yaml`   |
| Task          | `*.task.grok.yaml`                     |
| Pipeline      | `*.pipeline.grok.yaml`                 |
| Policy        | `*.policy.grok.yaml`                   |
| Dataset       | `*.dataset.grok.yaml`                  |
| Evaluation    | `*.eval.grok.yaml`                     |
| Environment   | `*.env.grok.yaml`, `environment.yaml`  |
| Deployment    | `*.deploy.grok.yaml`                   |

## Settings

| Setting                      | Default                          | Description                        |
|------------------------------|----------------------------------|------------------------------------|
| `grokYaml.validation.enabled`| `true`                           | Toggle in-editor validation.       |
| `grokYaml.scan.exclude`      | `["**/node_modules/**", …]`      | Globs excluded from workspace scan.|

## Development

```bash
npm install
npm run compile
npx @vscode/vsce package --no-dependencies
```

Press `F5` in VS Code to launch an Extension Development Host.

## Disclaimer

See [`DISCLAIMER.md`](./DISCLAIMER.md). GrokInstall is an independent
community project — not affiliated with xAI, Grok, or X.

## License

[Apache 2.0](./LICENSE)
