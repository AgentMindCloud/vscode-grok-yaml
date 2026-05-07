# Audit Report: vscode-grok-yaml

**Date:** 2026-05-07
**Auditor:** Claude Code
**Org:** AgentMindCloud
**Ecosystem Role:** VSCode extension that turns the GrokInstall YAML spec family into in-editor schema validation, snippets, and `grok-install` CLI safety-scan diagnostics — the IDE-tier authoring surface for Grok-native dev workflows.

---

## 1. Snapshot

- **Stars / forks / open issues:** unknown / unknown / 0 open issues, 1 stale open PR (#1, opened 2026-04-21, references obsolete `v2.14` schemas)
- **Last commit:** `bce84da` "Merge branch 'claude/audit-update-readme-m0jmH'" (16 commits total)
- **Primary language(s):** TypeScript (extension host + scanner + schema registry); TSX/CSS (orphan webview); JSON Schema (specs); JSON (snippets); YAML (workflows + fixtures)
- **Total LOC:** ~2,215 in code (`.ts/.tsx/.css`); ≈3,200 including schemas
- **Dependencies health:** 1 runtime dep (`yaml@2.8.3`, one patch behind `2.8.4`); 12 devDeps with **3 transitive vulns** via `mocha` toolchain — `serialize-javascript` high-severity RCE (GHSA-5c6j-r48x-rmvq) + DoS (GHSA-qj8w-gfj5-8c6v), `diff` low-severity DoS (GHSA-73rr-hh4g-fpgx); dev-only blast radius
- **CI status:** 4 workflows. `ci.yml` ✓ functional. `package.yml` ✗ broken — asserts `contributes.yamlValidation.length === 12` but field doesn't exist (TypeError on every run). `publish.yml` ✗ broken — invokes `npm run compile` which is undefined. `release.yml` ✓ functional but no version-tag-vs-`package.json` guard, no test gate, doesn't attach VSIX to GitHub Release
- **License:** Apache-2.0, present at `LICENSE` (placeholder filled per audit-trail commit `dfea670`)
- **Required files present:** README ✓, LICENSE ✓, CHANGELOG ✓, CONTRIBUTING ✓, .gitignore ✓ — plus SECURITY, DISCLAIMER, PUBLISH, vsc-extension-quickstart

---

## 2. File-by-File Findings

### Critical

- `package.json:50-174` — `contributes` declares only `commands`, `colors`, `configuration`. **No `yamlValidation`, `snippets`, `languages`, or `grammars` blocks** — the entire aspirational surface (snippets, grammar, language-config) is unregistered. — **Severity:** Critical
- `.github/workflows/package.yml:39-43` — `node -e "console.log(require('./package.json').contributes.yamlValidation.length)"` evaluates `undefined.length` → TypeError → workflow red on every push since it was added. — **Severity:** Critical
- `.github/workflows/publish.yml:32` — runs `npm run compile`, but `package.json:176-186` defines `compile-tests`, `build`, `package` — no `compile`. Workflow fails immediately on every manual dispatch. — **Severity:** Critical
- `src/webview/gallery/main.tsx:1`, `Gallery.tsx:1`, `TemplateCard.tsx:1` — import `react`/`react-dom`/`react-dom/client`, but `package.json:187-203` lists neither dependency nor `@types/react`; `tsconfig.json` has no `"jsx"` option; `esbuild.config.mjs:7` has only `src/extension.ts` as entry. Webview cannot compile, cannot bundle, cannot resolve — triple-broken. — **Severity:** Critical
- `src/commands/openTemplateGallery.ts:100-101` — webview loads `dist/webview/gallery.js` and `gallery.css`. Nothing in the build pipeline produces these artifacts. If activated, the panel 404s. — **Severity:** Critical
- `media/icon.png`, `media/icon-dark.png`, `media/banner.png` — all are 1×1 placeholder PNGs. `PUBLISH.md:10-12` and `media/README.md:10-13` flag these as release blockers; Marketplace listing would be visually broken if published with current assets. — **Severity:** Critical

### High

- `src/commands/{init,validate,scanSafety,deploy,generateInstallLink,openMarketplace,openTemplateGallery}.ts` (+ `index.ts`) — none registered in `package.json contributes.commands` (lines 51-67) or wired in `src/extension.ts:9-15` / `src/ui/commands.ts:1-36`. ~430 LOC of pure dead code, plus transitively orphans `src/cli.ts` and `src/output.ts`. — **Severity:** High
- `vsc-extension-quickstart.md:18` and `PUBLISH.md:25-26` — claim **"all eight commands"** ship; only 3 exist in the manifest. Misleading both contributors and reviewers. — **Severity:** High
- `snippets/grok-install.json:8,64`, `grok-agent.json:8`, `grok-config.json:8`, `grok-workflow.json:8` — emit `apiVersion: grokinstall.dev/v2.14`. `schemas/grok-install.schema.json:10` (and 11 sibling `grok-*.schema.json`) declare `const "grokinstall.dev/v1"`. **Snippets do not validate against the bundled schemas** — every user-triggered snippet immediately produces a schema diagnostic. (Also see Section 3 schema drift.) — **Severity:** High
- `snippets/grok-config.json:12` — declares `kind: Config`. No `Config` kind exists in `schemas/index.json:4-89` (the 12 are Agent/Workflow/Tool/Prompt/Model/Dataset/Eval/Deploy/Secret/Policy/Telemetry/Install). Snippet output cannot validate under any registered schema. — **Severity:** High
- `schemas/_common.schema.json:9` — `enum: ["grok.install/v1", "grok.install/v1alpha1", "grok.install/v1beta1"]` (note dot: `grok.install`). All live schemas use `grokinstall.dev/v1` (no dot). Different domain — incompatible regimes coexisting in the same VSIX. — **Severity:** High
- `schemas/agent.schema.json:14` vs `schemas/grok-agent.schema.json:15` — orphan duplicate `agent.schema.json` requires `["model", "systemPrompt"]`; live `grok-agent.schema.json` requires `["model"]` only. Two divergent Agent schemas in one VSIX. — **Severity:** High
- `src/scanner/resolver.ts:46` + `src/extension.ts:80-104` — when CLI is missing, `NoopScannerAdapter` returns empty findings → status bar shows `clean`. `README.md:31` claims it shows `error`. **README is wrong; users get a silent "all clear" while the scanner is dead.** — **Severity:** High
- `src/commands/openTemplateGallery.ts:82` — `path.join(targetDir, msg.files[0]?.path ?? '')` — accepts arbitrary `files[].path` from webview message; `..`-traversal allows writing outside `targetDir`. No allowlist or `path.relative` guard. — **Severity:** High
- `README.md:35`, `CONTRIBUTING.md:25-27`, `.github/PULL_REQUEST_TEMPLATE.md:30` — claim "twelve specs ship inside the VSIX". `schemas/` actually contains **30** schema files; 18 are orphans (`agent`, `tool`, `model`, `pipeline`, `task`, `memory`, `mcp-server`, `policy`, `prompt`, `dataset`, `evaluation`, `environment`, `deployment`, `workflow`, `capabilities`, `grok-swarm`, `grok-voice`, `_common`). `.vscodeignore` does not exclude `schemas/` → all 30 ship as VSIX bytes. — **Severity:** High
- `CONTRIBUTING.md:79` — instructs publishing schemas at `https://schemas.grokinstall.dev/v2.14/<kind>.json`; `schemas/index.json:3` says canonical source is `github.com/AgentMindCloud/grok-yaml-standards`; `package.json:116` `remoteBaseUrl` points at `raw.githubusercontent.com/.../grok-yaml-standards/main`. **Three different "canonical" schema homes.** — **Severity:** High
- `schemas/grok-swarm.schema.json:3`, `grok-voice.schema.json:3`, `capabilities.schema.json:3` — use `https://grokagents.dev/schemas/...` `$id` while 26 other schemas use `https://grokinstall.dev/schemas/...`. Two domains in one repo. (`src/commands/openMarketplace.ts:4` also opens `https://grokagents.dev`.) — **Severity:** High
- `schemas/grok-swarm.schema.json:10-13`, `grok-voice.schema.json:10-13`, `capabilities.schema.json:10-13` — use `spec_version` keyword (regex `^2\.0\.\d+$`) and `draft/2020-12` dialect. All other schemas use `apiVersion` const + `draft-07`. Three incompatible regimes across the schema set. — **Severity:** High
- `schemas/index.json:2-89` — manifest version `0.1.0`, only enumerates 12 schemas. The other 18 schema files in `schemas/` are unreferenced from the manifest yet ship in the VSIX. — **Severity:** High
- `docs/publishing.md:140` — says tag push triggers `publish.yml`. The on-tag workflow is `release.yml` (`.github/workflows/release.yml:1-3`); `publish.yml` is `workflow_dispatch`-only. — **Severity:** High
- `docs/publishing.md:204` — leaks internal references: "1Password agentmindcloud vault", `#grok-install-maintainers` Slack. Public docs. — **Severity:** High
- `PUBLISH.md:6` — references "Jani's machine" — personal name in public docs. — **Severity:** High
- `PUBLISH.md:21-25` — VSIX manual checklist instructs verifying `dist/webview/gallery.js`, `dist/webview/gallery.css`, `media/icon.png` are present. None of those are produced by `npm run build`; icons are placeholders. Checklist will fail every release. — **Severity:** High
- `vsc-extension-quickstart.md:50-52` — claims `npm run package` yields `grokinstall-yaml-<version>.vsix`; real artifact is `vscode-grok-yaml-0.1.0.vsix` (per `package.json:2`). `CONTRIBUTING.md:111` similarly says `grok-yaml-0.1.0.vsix`. — **Severity:** High

### Medium

- `src/output.ts:8-19` — defines a second output channel (`'GrokInstall'`) and second diagnostic collection (`'grokinstall'`) that exactly duplicate `src/logger.ts:7` and `src/scanner/diagnostics.ts:6`. Imported only by orphan `src/commands/*` — if those activate, channels double up. — **Severity:** Medium
- `src/extension.ts:55-64` + `src/scanner/diagnostics.ts:23-33` — `applyScanResult` re-applies *all* findings to all files even when `scopedFiles` is supplied; a save-triggered single-file scan that returns project-wide findings can silently overwrite untouched files' diagnostics. — **Severity:** Medium
- `src/scanner/cliAdapter.ts:32-37` — `scan` always uses workspace folder as `cwd` and passes raw `files` paths; relative paths from a different cwd will misresolve under the CLI. — **Severity:** Medium
- `src/fileMatching.ts:31-52` — `asTextDocStub` casts to `vscode.TextDocument` to feed `vscode.languages.match` for glob evaluation. Brittle private-API contract; public glob helpers (`vscode.workspace.asRelativePath` + minimatch) would be safer. — **Severity:** Medium
- `src/schema/refresh.ts:39-43` — `fetch` against `remoteBaseUrl` has no timeout; slow GitHub Raw response can hang the `Refresh Schemas` command indefinitely. — **Severity:** Medium
- `package.json:3` ("GrokInstall YAML") vs `README.md:1` ("GrokInstall YAML") vs `CONTRIBUTING.md:1` ("Grok YAML") vs `vsc-extension-quickstart.md:1` ("GrokInstall VS Code extension") vs `package.json:2` ("vscode-grok-yaml") — **four+ product names** in the same repo. — **Severity:** Medium
- `CHANGELOG.md:6` — `## [0.1.0] - Initial scaffold` (no date) — breaks Keep-a-Changelog convention referenced by `docs/publishing.md:65`. No `[Unreleased]` section despite `CONTRIBUTING.md:67` requiring one. — **Severity:** Medium
- `SECURITY.md:18` — emails `security@agentmind.cloud`; `package.json:8-9` and `DISCLAIMER.md:35` use `agentmindcloud.*` style. Domain inconsistent — emails will likely bounce. — **Severity:** Medium
- `src/commands/init.ts:16` — agent name regex `^[a-z0-9-]{1,64}$` permits a single hyphen (`-`). Should require leading char. — **Severity:** Medium
- `test/suite/scanner.test.ts:25` — `assert.ok(true)` always passes regardless of behavior; one of only 4 `it(...)` cases in the entire suite. — **Severity:** Medium
- `syntaxes/grok-yaml.tmLanguage.json:18` — supports kinds `Memory|MCPServer|Task|Pipeline|Environment|Deployment|Evaluation` — none in `schemas/index.json:4-89`. Diverges from "12 specs" claim and is unregistered anyway. — **Severity:** Medium
- `src/commands/openTemplateGallery.ts:131` — `Math.random()` for webview nonce; should be `crypto.randomBytes(16).toString('base64')`. Low real-world risk for a closed webview, but not best practice and trivial to fix. — **Severity:** Medium
- 7 stale remote `claude/*` branches still on `origin` (`audit-update-readme-m0jmH`, `bootstrap-grokinstall-eOmXo`, `build-grok-yaml-extension-Hzsv3`, `build-vscode-yaml-extension-KpE52`, `grokinstall-ecosystem-setup-kTk4z`, `pre-release-audit-qDZsW`, `audit-agentmindcloud-repo-RgkLl`). Salvage commits (`19add72`, `2980b91`, `d743af5`) suggest cleanup-in-progress but unfinished. — **Severity:** Medium
- PR #1 stale since 2026-04-21, references obsolete `v2.14` schemas at `schemas.grokinstall.dev` — main has shifted to bundled `schemas/`. Should be closed or rebased. — **Severity:** Medium
- `package.json:188` `yaml@2.8.3` — `2.8.4` available (one patch). Audit-trail commit `3ddee4e` previously bumped to 2.8.3 for GHSA-48c2-rrv3-qjmp; staying current is cheap. — **Severity:** Medium
- `package.json:196-200` — transitive dev-only vulns via `mocha`: `serialize-javascript` ≤7.0.4 high-RCE (GHSA-5c6j-r48x-rmvq) + DoS (GHSA-qj8w-gfj5-8c6v); `diff` 6.0.0–8.0.2 low-DoS (GHSA-73rr-hh4g-fpgx). `npm audit fix --force` would downgrade mocha to 11.3.0 (current 11.7.5 may already include fix; verify with installed `node_modules`). — **Severity:** Medium
- `.github/workflows/release.yml` — no version-tag-vs-`package.json` guard (despite `docs/publishing.md:147` promising one); no test gate before publish; doesn't attach `.vsix` to GitHub Release (despite `PUBLISH.md:35`). — **Severity:** Medium
- `PUBLISH.md:32-34` — wants both `vsce publish` locally on step 30 AND triggering `publish.yml` via dispatch — duplicate publishing pathway, easy to double-publish. — **Severity:** Medium

### Low

- `src/cli.ts:18` — hard-codes binary name `grok-install`, ignores the `grokYaml.scanner.cliPath` setting that `cliAdapter.ts:32` honors. Two CLI invocation paths drift apart. — **Severity:** Low
- `src/cli.ts:20` — `shell: process.platform === 'win32'` plus `\\''` quoting won't work in `cmd.exe`. Untested on Windows. — **Severity:** Low
- `src/webview/gallery/Gallery.tsx:67-95` — inline SVG with hard-coded `#00F0FF`; brand tokens already exist in CSS (`styles.css:1-16`) and `src/constants.ts:11-14`. Duplicate brand value. — **Severity:** Low
- `language-configuration.json:21-23` — `decreaseIndentPattern: "^\\s+$"` matches every blank-with-spaces line — likely incorrect; `redhat.vscode-yaml` owns this anyway, file is unregistered. — **Severity:** Low
- `snippets/grok-install.json:14,21,23` — duplicate `${6:primary}` / `${7:main}` placeholders create linked-edit mirrors. Likely unintended. — **Severity:** Low
- `.github/workflows/ci.yml:25` — runs `npm run package` but doesn't run the `yamlValidation length` check from `package.yml:39-43` (which would fail anyway). Two CI workflows that overlap on `push: main`. — **Severity:** Low
- `src/extension.ts:148` — redundant TS type `ReturnType<typeof debounce<[string]>>`. — **Severity:** Low
- `src/webview/gallery/main.tsx:5-7` — silently no-ops if `#root` is missing instead of error-logging. — **Severity:** Low
- `snippets/grok-install.json:25-29` lists `background, primary, success`; `:42-49` lists `textPrimary, textSecondary, surface, borderSubtle, ...`. Two different "brand" subsets in one snippet. — **Severity:** Low
- `test/fixtures/grok-agent.invalid.yaml:6` — comment says "model integer triggers a schema diagnostic"; schema requires `string`, fixture is correct, but comment is misleadingly worded. — **Severity:** Low

### Nit

- `package.json:30-38` — keyword `xai` lowercase vs `xAI` casing in `DISCLAIMER.md:8` and tagline. — **Severity:** Nit
- `media/README.md:7` says banner is 1200×630; `PUBLISH.md:10` says 1376×400. One must be wrong. — **Severity:** Nit
- `README.md:79` — workflow name "release.yml"; `docs/publishing.md:140` says "publish.yml". README is right, docs/publishing.md is wrong. — **Severity:** Nit
- `vsc-extension-quickstart.md:39` — loose wording ("friendly hint"). — **Severity:** Nit
- `src/extension.ts:1-16` — import order mixes vscode/local/scanner inconsistently. — **Severity:** Nit

(55 bullets shown. Long-tail not surfaced: ~20 additional micro-issues across snippet placeholder ergonomics, `.vscodeignore` redundant patterns, esbuild output-dir conventions, output-channel naming variance, and `.eslintrc.cjs` not configured for `.tsx`.)

---

## 3. Cross-Cutting Issues

- **Unescaped `@grok` mentions:** **0 found.** `grep -rn "@grok"` across `.md/.html/.yaml/.yml/.txt` returned zero matches. This repo is clean on the org-wide @grok auto-link issue.

- **Schema/version drift:** **Three incompatible regimes coexist:** (1) 12 `grok-*.schema.json` files declare `apiVersion: const "grokinstall.dev/v1"` (`grok-install.schema.json:10` + 11 siblings); (2) 14 schemas via `_common.schema.json:7-9` accept `apiVersion: enum ["grok.install/v1", "grok.install/v1alpha1", "grok.install/v1beta1"]` (note dotted `grok.install` — different domain); (3) 3 schemas (`grok-swarm`, `grok-voice`, `capabilities`) use `spec_version: ^2\.0\.\d+$` keyword + `draft/2020-12` dialect. Two `$id` domains: `grokinstall.dev` (26) vs `grokagents.dev` (3). Snippets emit `grokinstall.dev/v2.14` — **no schema validates this**. `schemas/index.json` enumerates 12 of 30 schema files; the other 18 ship as orphan bytes in the VSIX.

- **Documentation freshness:** README is mostly truthful about the 3 actually-shipped commands (`README.md:37-44` matches `package.json:51-67`) but oversells: claim of "12 specs" is true for the manifest but ignores 18 extra schemas; status bar `error`-state claim (`README.md:31`) contradicts code (`src/scanner/resolver.ts:46` returns Noop → `clean`). `vsc-extension-quickstart.md:18` and `PUBLISH.md:25-26` claim "8 commands" — only 3 exist. `docs/publishing.md:140` names wrong workflow. Four product names across the repo (`vscode-grok-yaml` / `GrokInstall YAML` / `Grok YAML` / `GrokInstall`). Three "canonical" schema homes (`schemas.grokinstall.dev/v2.14` in CONTRIBUTING vs `github.com/.../grok-yaml-standards` in `schemas/index.json` vs `raw.githubusercontent.com/...` in `package.json`). VSIX filename wrong in two places.

- **Brand/visual consistency:** No "Residual Frequencies" string anywhere. Internal palette IS consistent: `src/webview/gallery/styles.css:1-16` (`--bg #0A0A0A`, `--neon-cyan #00F0FF`, `--neon-green #00FF9D`) matches `src/constants.ts:11-14` and `package.json:69-95` color contributions. Two minor drifts: (a) `Gallery.tsx:67-95` inlines `#00F0FF` instead of referencing the CSS var; (b) `snippets/grok-install.json:25-29` and `:42-49` enumerate two different "brand" subsets. Icons are 1×1 placeholders — visual identity is undelivered for the marketplace listing.

- **Dead code / orphan files:** **~50% of `src/` is dead.** `src/commands/{init,validate,scanSafety,deploy,generateInstallLink,openMarketplace,openTemplateGallery,index}.ts` (~430 LOC) plus transitive `src/cli.ts`, `src/output.ts`. Entire `src/webview/gallery/` (6 files including unbuildable `.tsx` against missing React deps). `syntaxes/grok-yaml.tmLanguage.json` unregistered. `language-configuration.json` unregistered. 9 snippet files unregistered. 18 of 30 schemas unreferenced. 1 duplicate workflow (`publish.yml` ≈ `release.yml`, broken). 3 placeholder media files. The repo is a Frankenstein of (a) a working *minimal* schema-registration + scanner-shell extension, and (b) an aspirational "GrokInstall ecosystem" never wired into `package.json`.

- **Test coverage:** Smoke-only. `@vscode/test-electron` 2.4.1 + `mocha` 11.7.5 configured (`test/runTest.ts`). 2 test files (`schema.test.ts`, `scanner.test.ts`), **4 total `it(...)` cases**, one of which is `assert.ok(true)`. 3 fixtures (`grok-agent.{valid,invalid}.yaml`, `grok-install.unsafe.yaml`); only `grok-agent.valid.yaml` is asserted on. Untested: schema refresh (`src/schema/refresh.ts`), scanner CLI parsing/timeout/cancellation (`src/scanner/cliAdapter.ts`), content-sniff matcher (`src/fileMatching.ts`), debounce, code-action provider, all of `src/commands/*` (orphan anyway), all of `src/webview/*`. Estimated 5-10% meaningful coverage.

- **Security posture:** Generally OK with two small concerns. No hardcoded secrets, no `@grok` mentions, no `eval`. `child_process.spawn` used safely in `src/scanner/cliAdapter.ts:74` (`shell: false`). `.gitignore:9-11` excludes `.env*`; no `.env.example` (could be added). `release.yml:14-15` properly gates on secret presence. **Concerns:** (1) `src/commands/openTemplateGallery.ts:82` accepts `..`-traversal in webview-supplied file paths — though the file is orphan and never wired; (2) `src/commands/openTemplateGallery.ts:131` uses `Math.random()` for webview nonce (should be `crypto.randomBytes`); (3) `src/cli.ts:20` uses platform-conditional `shell: true` on Windows with hand-rolled escaping that won't survive `cmd.exe`; (4) 3 transitive dev-only CVEs in `mocha` (high RCE in `serialize-javascript`, low DoS in `diff`). All `child_process` invocations use `shell: false` in the *active* code path; the orphan code is what carries the risk.

---

## 4. What's Working Well

- **`src/scanner/cliAdapter.ts`** is genuinely well-built: correct timeout enforcement (`scanner.timeoutMs`), proper cancellation token wiring, `SIGTERM`-then-implicit-close signal escalation, exit-code 0/1 treated as findings-vs-clean, `shell: false` invocation. This is the backbone of the extension and it's solid.
- **`src/schema/registry.ts:84-118`** auto/bundled/remote source resolution with content-hash cache invalidation (`grokinstall-schema://<id>/<file>#v=<hash>` URI scheme) is a thoughtful design that avoids stale schema caching across upgrades.
- **`src/debounce.ts`** is a small, clean, fully-typed primitive with `flush` and `cancel` semantics — the kind of utility that's usually copy-pasted badly; here it's right.
- **Audit-trail commit history** (commits `dfea670`, `aea5e76`, `6a6e111`, `e805845`, `3ddee4e`, `60dd67f`, `f96ba19`) shows real prior remediation: license placeholder filled, `yaml` CVE bumped, dev-dep CVEs bumped, marketplace homepage corrected, `package-lock.json` excluded from VSIX. Someone has been iterating responsibly even if the macro-architecture is still half-done.
- **Issue templates** (`.github/ISSUE_TEMPLATE/{bug,feature,snippet-request}.yml`) are well-written, opinionated forms with required fields and security cross-links — better than typical scaffolds.

---

## 5. Top 5 Improvements (Ranked by Impact ÷ Effort)

| # | Improvement | Impact (1-10) | Effort (hours) | Why it matters |
|---|---|---|---|---|
| 1 | **Wire OR delete the orphan layer.** Either add `contributes.{snippets,grammars,languages,yamlValidation}` blocks to `package.json` and register the 8 already-coded commands in `src/extension.ts`, OR delete `src/commands/*`, `src/webview/`, `syntaxes/`, `language-configuration.json`, the 9 snippet files, and the 18 orphan schemas. | 10 | 6-10 (wire) / 1 (delete) | Resolves the central "extension does ~30% of what every doc claims" lie. Wiring is mostly already coded. Without this, every other improvement is rearranging deck chairs. |
| 2 | **Unfuck CI.** Remove or rewrite `.github/workflows/package.yml:39-43` (currently `undefined.length` TypeError); fix `publish.yml:32` (`npm run compile` → `npm run build`) or delete the duplicate workflow entirely. | 9 | 0.25 | Both `package.yml` and `publish.yml` are red on every invocation today. Until fixed, no CI signal is trustworthy and PRs can't be greenlit. |
| 3 | **Pick ONE schema regime.** Choose between `grokinstall.dev/v1` const, `grok.install/v*` enum, or `spec_version: 2.0.x`. Rewrite all 30 schemas to match, update all snippets to match (currently emit `v2.14` which no schema accepts), update `schemas/index.json` to enumerate the full set, consolidate `$id` domain to one. | 9 | 3-4 | The single biggest user-visible bug: every snippet a user inserts immediately produces a schema error. Spec inconsistency also pollutes the entire downstream `grok-yaml-standards` consumer set. |
| 4 | **Ship real marketplace assets.** Replace 1×1 placeholder `media/icon.png|icon-dark.png|banner.png`. Add `"icon": "media/icon.png"` to `package.json`. Add `"galleryBanner.image"` if Marketplace supports it. | 7 | 1-2 | Without these, the listing literally cannot launch. Cheap to fix once a designer ships PNGs. |
| 5 | **Reconcile docs to code.** Pick one product name. Delete two of the three publish guides (likely keep `docs/publishing.md`, drop `PUBLISH.md` + `vsc-extension-quickstart.md` or fold them in). Remove `Jani's machine` / `1Password agentmindcloud vault` / Slack channel from public docs. Fix the "8 commands" claim. Fix the "shows error when CLI missing" claim in `README.md:31`. | 6 | 2 | Trust-builder for early adopters and external contributors. Currently the docs are the worst part of the repo. |

---

## 6. Quick Wins (≤30 min each)

- **Delete `.github/workflows/publish.yml`** — broken duplicate of `release.yml`; nothing references it except `PUBLISH.md:32-34` which itself should be reworked. `git rm .github/workflows/publish.yml`.
- **Bump `yaml` to 2.8.4.** Edit `package.json:188`: `"yaml": "^2.8.4"`. Run `npm install`.
- **Remove the broken assertion in `package.yml:39-43`.** Either delete the step or replace with a check on `schemas/index.json` count: `node -e "if (require('./schemas/index.json').schemas.length !== 12) process.exit(1)"`.
- **Fix the status-bar lie.** In `src/scanner/resolver.ts:46`, return a sentinel that `src/extension.ts:80-104` interprets as `error` instead of an empty-finding `Noop`. ~10 lines.
- **Strip personal/internal references.** `PUBLISH.md:6` ("Jani's machine" → "your local machine"); `docs/publishing.md:204` (drop `1Password agentmindcloud vault` + Slack channel — replace with neutral "credential store" wording).
- **Date the changelog entry.** `CHANGELOG.md:6`: `## [0.1.0] - 2026-05-07` and add an `## [Unreleased]` section above it.
- **Pick one product name** and `sed`-replace across `README.md`, `CONTRIBUTING.md`, `vsc-extension-quickstart.md`, `docs/publishing.md`, `PUBLISH.md`. Recommended: "GrokInstall YAML" (matches `package.json:3 displayName`).
- **Fix VSIX filename references.** `vsc-extension-quickstart.md:50-52` and `CONTRIBUTING.md:111`: change to `vscode-grok-yaml-0.1.0.vsix`.
- **Add `.env.example`** at repo root with placeholder for any future env vars (currently none used at runtime, but signals security hygiene).
- **Close stale PR #1** or rebase it; it references an obsolete schema version regime.
- **Delete 6 stale `claude/*` remote branches** post-salvage. Verify salvage commits are intact, then `git push origin --delete claude/<each>`.
- **Tighten `init.ts:16` regex** to require leading alphanumeric: `^[a-z0-9][a-z0-9-]{0,63}$`.
- **Replace `Math.random()` nonce** at `src/commands/openTemplateGallery.ts:131` with `crypto.randomBytes(16).toString('base64')` (note: file is currently orphan; do this if you wire the command, otherwise delete the file).
- **Fix the `decreaseIndentPattern`** in `language-configuration.json:21-23` to something like `^\\s*\\}$` or remove the file (currently orphan anyway).
- **Add `schemas/`-aware `.vscodeignore` rule** to exclude the 18 orphan schemas if they're not going to be wired: `schemas/_common.schema.json`, `schemas/agent.schema.json`, etc. — saves VSIX bytes.
- **Update `SECURITY.md:18`** email to match the consistent domain (`agentmindcloud.com` if that's the real one, vs `agentmind.cloud`).

---

## 7. Ecosystem Potential Statement

This repo is the IDE-tier authoring surface for the entire GrokInstall YAML spec family — converting the `grok-yaml-standards` schema set into in-editor IntelliSense, snippets, and live `grok-install` CLI safety diagnostics. It sits at the developer-experience apex of AgentMindCloud's xAI-tooling stack: spec authors edit YAML here, schemas come from `grok-yaml-standards`, and the `grok-install` CLI provides runtime safety telemetry — making this the canonical "first 5 minutes" surface for anyone adopting Grok-native specs, and the artifact most likely to be screenshotted in launch posts. **Maturity: alpha-prototype** — `package.json:5` is `0.1.0`, two of four CI workflows fail on every invocation (`package.yml` `undefined.length` TypeError, `publish.yml` missing `npm run compile` script), ~50% of `src/` is unwired orphan code, marketplace icons are 1×1 placeholders, and no Marketplace listing exists yet (`README.md:9` flags as "coming soon"). Six-month potential if invested: realistic 200-800 Marketplace installs (Grok-native specs are nascent), 50-200 GitHub stars, possible 10-25 DAU among early spec authors; strategic value to AgentMindCloud is **outsized** because every other repo in the org's xAI ecosystem (CLI, registry, schema-standards, deploy bridges) depends on developers having a working authoring surface — without this, downstream adoption stalls; for the @JanSol0s X profile, this is the most demoable shipping artifact in the portfolio. **Single biggest unlock:** in one focused 8-hour session, wire the 8 already-coded commands + 9 snippet files + grammar + language config into `package.json contributes.*`, ship a real icon, fix CI, and publish to Marketplace + Open VSX — converting the extension from "broken alpha doing 30% of what docs claim" into "shippable beta delivering the full Grok-native authoring suite using code that's already written, just unwired." **Verdict on resource allocation:** worth the investment — the bones are unusually good (clean scanner adapter, content-hash schema cache, real fixture tests, sensible activation events), the aspirational layer is mostly already coded, and this is the highest-leverage single repo in the entire xAI-developer-stack portfolio for converting spec design into adoption.

`POTENTIAL_TAG: DOUBLE_DOWN — flagship dev-experience surface; orphan features mostly already coded; one focused session ships beta.`
