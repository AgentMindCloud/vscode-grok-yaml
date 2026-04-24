# Publishing Guide — Grok YAML

This document is the canonical release procedure for the **Grok YAML**
VS Code extension. Follow every step; skipping any is how Marketplace
listings get into a broken state.

> **Who this is for:** project maintainers with push access to the
> repository and the Marketplace publisher token.

---

## 0. Prerequisites

- [ ] You are a member of the `agentmindcloud` publisher on the
      [Visual Studio Marketplace management page](https://marketplace.visualstudio.com/manage).
- [ ] You have a **Personal Access Token (PAT)** with the
      `Marketplace → Manage` scope from
      [dev.azure.com](https://dev.azure.com/), stored as the
      `VSCE_PAT` repository secret.
- [ ] Your local machine runs **Node 20 or newer** (`node --version`).
- [ ] Your working tree is clean: `git status` shows nothing pending.
- [ ] You're on the `main` branch and up to date:
      `git fetch origin && git checkout main && git pull --ff-only`.

---

## 1. Decide the version

Semantic Versioning:

- **Patch** (`0.1.0` → `0.1.1`) — docs-only fixes, artwork swaps,
  snippet tweaks, non-breaking mapping corrections.
- **Minor** (`0.1.0` → `0.2.0`) — new snippet catalog, new schema
  kind (moves the "12" count), new file-pattern coverage.
- **Major** (`0.1.0` → `1.0.0`) — drop support for the Red Hat YAML
  extension, drop a previously-supported schema kind, anything that
  could break an existing user's project.

Marketplace does **not** support pre-release versions with the
`-rc.1` suffix on the `agentmindcloud` plan — use a throwaway
publisher or the `--pre-release` flag if you need that.

---

## 2. Bump `package.json`

```bash
# Patch example:
node -e "
  const fs = require('fs');
  const p = require('./package.json');
  const [a,b,c] = p.version.split('.').map(Number);
  p.version = [a, b, c + 1].join('.');
  fs.writeFileSync('./package.json', JSON.stringify(p, null, 2) + '\n');
  console.log('bumped to', p.version);
"
```

Or just hand-edit `version` in `package.json`.

---

## 3. Update `CHANGELOG.md`

- Move everything under `[Unreleased]` into a new section headed with
  the new version and today's date (UTC).
- If there is no `[Unreleased]` section, create the new release section
  from scratch listing the changes since the last tag.
- Add a link reference at the bottom:

  ```md
  [0.1.1]: https://github.com/AgentMindCloud/vscode-grok-yaml/releases/tag/v0.1.1
  ```

- **Count check:** if this release changes the number of schema kinds,
  update every "**12**" reference to the new count. Files to grep:

  ```bash
  git grep -nE '\b12( schemas| document types| kinds)?\b' -- \
    README.md CHANGELOG.md CONTRIBUTING.md docs/publishing.md \
    .github/PULL_REQUEST_TEMPLATE.md .github/workflows/package.yml
  ```

---

## 4. Local package dry run

```bash
npx @vscode/vsce@latest package --no-dependencies
```

- Expected exit code: `0`.
- Expected artefact: `grok-yaml-<new-version>.vsix`.
- Confirm the icon and banner are inside:

  ```bash
  npx @vscode/vsce@latest ls | grep -E 'media/(icon|banner)'
  ```

  Both `media/icon.png` and `media/banner.png` must appear.

- Optional: install the `.vsix` into a clean VS Code window and smoke
  test:

  ```bash
  code --install-extension grok-yaml-<new-version>.vsix
  ```

  Open an `*.install.yaml`, type `grok-install`, <kbd>Tab</kbd>,
  confirm schema validation fires and the `visuals block v2.14`
  snippet is available.

- Delete the `.vsix` before committing — it's `.gitignore`'d anyway.

---

## 5. Commit the bump

One commit, one message, no co-authoring on release commits:

```bash
git add package.json CHANGELOG.md
git commit -m "chore: bump to <new-version>"
```

If the release includes other changes (snippets, docs), those should
already be on `main` — **do not** bundle them with the version-bump
commit. Separate commits make rollbacks surgical.

---

## 6. Tag and push

```bash
git tag -a v<new-version> -m "Release v<new-version>"
git push origin main
git push origin v<new-version>
```

The push of the tag (`v*`) triggers `.github/workflows/publish.yml`.

---

## 7. Watch the publish workflow

1. Open the repo's Actions tab and find the **Publish** run for your tag.
2. The workflow will:
   - Verify tag ↔ `package.json` version match (fails loudly if not).
   - Package the `.vsix`.
   - Publish to the Marketplace using `VSCE_PAT`.
   - Attach the `.vsix` to a GitHub Release.
3. Expected duration: ~1–2 minutes.

If the workflow **fails at the publish step**:

- Check the error. The two common failures are:
  - `401 Unauthorized` → `VSCE_PAT` is expired / scoped wrong.
    Regenerate in Azure DevOps and update the repo secret.
  - `409 Conflict: version already exists` → you bumped to a version
    already in the Marketplace. Bump again and re-tag.
- Re-running the workflow **will not** rebuild the tag; delete the
  tag locally and remotely, bump, re-commit, re-tag, re-push.

---

## 8. Verify on Marketplace

1. Visit
   https://marketplace.visualstudio.com/items?itemName=agentmindcloud.grok-yaml
2. Confirm:
   - The new version number is shown.
   - The banner renders (use an incognito window to bypass cache).
   - The icon renders in the search results on the Marketplace.
   - The **12** schema count in the description is correct.
   - "Dependencies" lists `redhat.vscode-yaml`.
3. Install it into a fresh VS Code window and retest:
   - `code --install-extension agentmindcloud.grok-yaml`
   - Open a `*.install.yaml`, trigger validation + snippets.

---

## 9. Rollback (if a published version is broken)

Marketplace does not allow deleting a published version, only
**unpublishing** it. Steps:

1. Bump the patch version to a fresh number.
2. Revert the offending commits on `main`.
3. Follow steps 2–7 above to publish the fix.
4. If the broken version is dangerous (data loss, security),
   unpublish it from the
   [Marketplace management page](https://marketplace.visualstudio.com/manage)
   → **Options → Unpublish**.
5. Post a brief note in `CHANGELOG.md` under the new version
   explaining what was wrong and what users should do.

---

## Appendix — secrets and who holds them

| Secret     | Where           | Purpose                          | Rotation |
| ---------- | --------------- | -------------------------------- | -------- |
| `VSCE_PAT` | Repo Secrets    | Marketplace publish in CI        | 12 mo    |
| Publisher login | 1Password `agentmindcloud` vault | Manual publish from laptop | on compromise |

Only the release manager touches these. If you need access, ask
in `#grok-install-maintainers`.
