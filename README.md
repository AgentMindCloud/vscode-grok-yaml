# Grok YAML

![Grok YAML extension banner](media/banner.png)

> Schema validation, autocomplete, and tab-stopped snippets for the **12
> Grok YAML document types** — `install`, `agent`, `config`, `workflow`,
> `prompt`, `tool`, `policy`, `model`, `dataset`, `eval`, `deployment`,
> plus the pinned `install-v2.14` variant.

Stop copy-pasting YAML from old projects. Type `grok-install` and press
<kbd>Tab</kbd>: a schema-valid document materialises, ready to fill in.
Every field is autocompleted, validated, and documented by the spec —
live, in your editor.

---

## Features

- **Schema validation for 12 document kinds.** Red squiggles the moment
  you mis-spell a key or drop an enum value. Fully spec v2.14 compliant.
- **Rich autocomplete.** Hover any field to see its description from the
  schema. Press <kbd>Ctrl</kbd>+<kbd>Space</kbd> for options on enums.
- **Tab-stopped snippets.** Four snippet catalogs cover the documents
  you write most often:
  - `grok-install` — full install + `visuals` neon-token block
  - `grok-agent` — agent with tools and policies
  - `grok-config` — project config / `.grokrc.yaml`
  - `grok-workflow` — workflow with steps, triggers, retries
- **Zero configuration.** Schemas are discovered by file pattern
  (`*.install.yaml`, `*.agent.yaml`, etc.). Just name your files
  correctly and it works.
- **Delegates to the official YAML service.** All the heavy lifting
  (parsing, diagnostics, hover, autocomplete) is done by
  [Red Hat's YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml).
  We only ship the mappings and snippets.

---

## File patterns recognised

| Kind              | Matches                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `install`         | `*.install.yaml`, `grok-install.yaml`                            |
| `install-v2.14`   | `*.install.v2.14.yaml`                                           |
| `agent`           | `*.agent.yaml`, files under `agents/`                            |
| `config`          | `grok.config.yaml`, `.grokrc.yaml`                               |
| `workflow`        | `*.workflow.yaml`, files under `workflows/`                      |
| `prompt`          | `*.prompt.yaml`, files under `prompts/`                          |
| `tool`            | `*.tool.yaml`, files under `tools/`                              |
| `policy`          | `*.policy.yaml`, files under `policies/`                         |
| `model`           | `*.model.yaml`, files under `models/`                            |
| `dataset`         | `*.dataset.yaml`, files under `datasets/`                        |
| `eval`            | `*.eval.yaml`, files under `evals/`                              |
| `deployment`      | `*.deployment.yaml`, files under `deployments/`                  |

Prefer an explicit inline reference? Drop this as the first line of any
YAML file:

```yaml
# yaml-language-server: $schema=https://schemas.grokinstall.dev/v2.14/<kind>.json
```

---

## Requirements

- **VS Code** 1.85.0 or newer.
- **[Red Hat YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)**
  — listed in `extensionDependencies`, so VS Code installs it for you
  automatically on first activation.

No runtime binaries, no language server of our own, no telemetry.

---

## Quick start

1. Install the extension from the VS Code Marketplace.
2. Create a file called `hello.install.yaml`.
3. Type `grok-install` and press <kbd>Tab</kbd>.
4. Fill in the tab stops with your values.
5. Save. You now have a schema-valid Grok install document.

---

## Extension settings

This extension contributes no custom settings. Validation strictness,
schema download behaviour, and all other knobs live on the
[Red Hat YAML extension](https://github.com/redhat-developer/vscode-yaml#options).

---

## Known limitations

- v0.1.0 ships placeholder brand PNGs in `media/`. Final artwork lands
  in a patch release — see
  [`media/README.md`](media/README.md).
- Schemas are served from `https://schemas.grokinstall.dev/v2.14/`. If
  that host is unreachable (offline dev, locked-down corporate proxy),
  fall back to a local `$schema:` reference or a pinned commit URL.
- No runtime code means no commands, no views, and no tasks contributed
  by this extension — it is a **pure manifest + snippets** extension.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full release history.
The current release is **v0.1.0**.

---

## Contributing

Pull requests are welcome. To add a snippet or propose a new schema,
start with [CONTRIBUTING.md](CONTRIBUTING.md).

For security issues, please read [SECURITY.md](SECURITY.md) — do **not**
open a public issue.

---

## Trademark disclaimer

GrokInstall and Grok YAML are independent community projects.
**Not affiliated with xAI, Grok, or X.** All product names, logos, and
brands are property of their respective owners.

---

## License

Apache License 2.0 — see [LICENSE](LICENSE).
