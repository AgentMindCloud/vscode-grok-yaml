# Contributing to Grok YAML

Thanks for considering a contribution — this extension stays useful only
as long as its snippets and schema mappings track the spec.

This is a **low-ceremony** project. The extension has no runtime code:
everything that matters lives in `package.json`, `snippets/*.json`, and
the remote schemas referenced by URL. That keeps contributions small and
reviewable.

---

## Ground rules

1. **Open an issue first** for anything larger than a typo or a single
   snippet. Use the right form:
   [Bug](.github/ISSUE_TEMPLATE/bug.yml) ·
   [Feature](.github/ISSUE_TEMPLATE/feature.yml) ·
   [Snippet request](.github/ISSUE_TEMPLATE/snippet-request.yml).
2. **One change per pull request.** Don't mix a snippet addition with a
   schema mapping change with a dependency bump — each gets its own PR.
3. **Keep snippets tab-stopped and realistic.** Placeholders should
   reflect common choices (enum `choice|a,b,c` where possible), not
   empty blanks.
4. **Keep the schema count at 12.** If you propose a 13th kind, you own
   bumping every "12" reference (README, CHANGELOG, PR template,
   `docs/publishing.md`) in the same PR.

---

## Adding a snippet

1. Decide which catalog the snippet belongs in:
   - Install-related → `snippets/grok-install.json`
   - Agent-related → `snippets/grok-agent.json`
   - Config-related → `snippets/grok-config.json`
   - Workflow-related → `snippets/grok-workflow.json`
2. Add a new top-level key. The key is the human-readable name shown in
   the snippet picker. Example:

   ```jsonc
   "Workflow — email notification step": {
     "prefix": ["workflow-email", "email-step"],
     "scope": "yaml",
     "description": "A workflow step that sends an email via the mailer tool.",
     "body": [
       "- id: ${1:notify}",
       "  tool: ./tools/mailer.tool.yaml",
       "  input:",
       "    to: ${2:user@example.com}",
       "    subject: ${3:Pipeline complete}",
       "$0"
     ]
   }
   ```

3. Follow existing conventions:
   - `prefix` is an **array** so users can trigger via several aliases.
   - `scope: "yaml"` always — the snippet only fires in YAML files.
   - End the `body` with `$0` so the cursor lands outside the snippet
     after the final tab stop.
   - Use `${n:default}` for free text, `${n|a,b,c|}` for closed enums.
4. Verify the JSON parses — `jq empty snippets/your-file.json` should
   exit cleanly.
5. Add a one-line entry under `Added` in `CHANGELOG.md` under the next
   unreleased section (create one if absent).

---

## Proposing a new schema mapping

The extension doesn't author schemas — it just tells the YAML service
**where to fetch them** for a given file pattern. To add (or adjust) a
mapping:

1. The schema **must already be published** at
   `https://schemas.grokinstall.dev/v2.14/<kind>.json` (or another
   stable HTTPS URL). If it isn't, open a spec-side issue first — this
   repo is downstream of the spec.
2. Open `package.json`. Add or edit an entry in
   `contributes.yamlValidation`:

   ```jsonc
   {
     "fileMatch": [
       "**/*.newkind.yaml",
       "**/newkinds/*.yaml"
     ],
     "url": "https://schemas.grokinstall.dev/v2.14/newkind.json"
   }
   ```

3. **Be specific with globs.** Avoid `**/*.yaml` — it collides with
   everyone else's YAML.
4. Update the recognised-patterns table in `README.md`.
5. Add a row to `CHANGELOG.md` under the next unreleased section.
6. If this changes the total kind count away from 12, update every
   "12" reference in the repo in the same PR.

---

## Local development

There is no build step. To exercise changes:

```bash
# 1. Package the extension into a .vsix
npx @vscode/vsce@latest package --no-dependencies

# 2. Install it into a clean VS Code window
code --install-extension grok-yaml-0.1.0.vsix

# 3. Open a sample YAML file and confirm
#    - schema validation fires
#    - snippet prefixes autocomplete
#    - the banner shows in the marketplace preview (Extensions: Install
#      from VSIX... then view the extension details pane)
```

---

## Commit messages

Conventional Commits, one line, imperative mood:

```
feat(snippets): add workflow email notification step
fix(schema): correct glob for policy documents
docs(readme): clarify fallback schema URL
chore: bump version to 0.1.1
```

---

## Code of conduct

Be decent. Disagree on ideas, not people. Project maintainers reserve
the right to remove comments and close issues that drift from that.
