# Publishing Checklist

Manual release checklist for the GrokInstall VS Code extension. **Every step
runs locally on Jani's machine.** No step is automated — the GitHub workflow
only produces a `.vsix` artifact.

## Pre-flight

- [ ] Real brand PNGs from Claude Design are dropped into `media/`:
      `icon.png` (128×128), `icon-dark.png` (128×128), `banner.png` (1376×400)
- [ ] Real product screenshots dropped into `assets/screenshots/`
      (referenced in the marketplace `README.md` as `TODO` markers)
- [ ] `CHANGELOG.md` entry for the new version exists and is accurate

## Build and verify

- [ ] Bump version in `package.json`
- [ ] `npm run compile` exits 0
- [ ] `npx @vscode/vsce package --no-dependencies` exits 0
- [ ] `.vsix` size < 5 MB
- [ ] `npx @vscode/vsce ls` output includes `media/icon.png`,
      `media/banner.png`, `dist/extension.js`, `dist/webview/gallery.js`,
      all five `snippets/*.code-snippets`, all five
      `schemas/*.schema.json`, `README.md`, `CHANGELOG.md`, `LICENSE`
- [ ] Install the local `.vsix` with `code --install-extension <path>` and
      smoke test each of the eight commands

## Publish

- [ ] `npx @vscode/vsce publish --no-dependencies` (requires PAT)
- [ ] `npx ovsx publish --no-dependencies` (requires Open VSX token)
- [ ] Tag the release: `git tag v0.2.0 && git push origin v0.2.0`
- [ ] Trigger the GitHub Action `publish.yml` via `workflow_dispatch` to
      produce the `.vsix` artifact for the GitHub release
- [ ] Attach the `.vsix` artifact to the GitHub release

## Announce

- [ ] Launch thread on X (see Session 6 marketing pack for copy)
- [ ] Update `grokagents.dev` landing with the "Install from Marketplace"
      badge

> GrokInstall is an independent community project. Not affiliated with
> xAI, Grok, or X.
