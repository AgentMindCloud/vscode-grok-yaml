# Security Policy

## Supported versions

Only the **latest minor** is supported for security fixes. Older
versions are end-of-life the moment a newer minor ships.

| Version  | Supported |
| -------- | --------- |
| 0.1.x    | yes       |
| < 0.1.0  | no        |

## Reporting a vulnerability

**Do not open a public GitHub issue** for a security report. Public
disclosure before a fix is ready puts every user at risk.

Instead, email **security@agentmind.cloud** with:

1. A clear description of the issue and its security impact.
2. Steps to reproduce. A proof-of-concept repo or gist is ideal.
3. The affected extension version (see `package.json` → `version`).
4. Your name / handle for credit in the release notes, or a note if
   you prefer to stay anonymous.

We will:

- Acknowledge receipt within **3 business days**.
- Triage and confirm impact within **7 business days**.
- Ship a fix, or publish a mitigation plan with a timeline, within
  **90 days** of the initial report — the standard embargo window.
- Credit you in the CHANGELOG and release notes once the fix is
  public (unless you've asked us not to).

## Scope

In scope:

- The shipped `.vsix` package (`package.json`, `snippets/**`, `media/**`).
- The remote schema URLs referenced by `contributes.yamlValidation`
  (if they redirect to attacker-controlled content, that's in scope).
- The CI workflows in `.github/workflows/` (if a malicious PR could
  publish arbitrary content to the Marketplace, that's critical).

Out of scope:

- The upstream `redhat.vscode-yaml` extension — report those to the
  Red Hat project directly.
- VS Code itself.
- Third-party schemas referenced by user workspaces via
  `# yaml-language-server:` comments.

## No bug bounty

We don't run a paid bounty program. Serious contributions are
acknowledged in release notes and, where you'd like it, the repo's
credits list.
