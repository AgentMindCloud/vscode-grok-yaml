<!--
Thanks for contributing! One change per PR, please. If you're mixing a
snippet change with a schema mapping change with a version bump, split
it into three PRs — it's faster to review and easier to revert if
something goes wrong.
-->

## Summary

<!-- One or two sentences: what does this PR do and why? -->

## Type of change

- [ ] Snippet added / updated
- [ ] Schema mapping added / updated (`contributes.yamlValidation`)
- [ ] README / docs update
- [ ] Community health file (issue / PR templates, SECURITY, FUNDING)
- [ ] CI / release workflow change
- [ ] Version bump / release prep
- [ ] Other (describe):

## Checklist

- [ ] I opened an issue first for anything larger than a typo / single
      snippet, or the change is trivial enough that this PR is self-evidently
      correct.
- [ ] JSON files parse (`jq empty snippets/*.json` and `jq empty package.json`).
- [ ] Snippet bodies end with `$0` and use `${n:...}` tab stops.
- [ ] New/updated schema mappings use specific globs (no bare `**/*.yaml`).
- [ ] Recognised-patterns table in `README.md` matches `package.json`.
- [ ] CHANGELOG.md has an entry under the next unreleased section.
- [ ] The schema count (**12**) is still consistent across README,
      CHANGELOG, `docs/publishing.md`, and this PR. If this change alters
      the count, every reference is updated.
- [ ] `npx @vscode/vsce@latest package --no-dependencies` succeeds locally.
- [ ] No runtime code added (this extension is pure manifest + snippets).

## Verification

<!--
How did you test this? Paste the commands / output you ran locally.
For snippet changes, paste a screenshot of the picker or the produced
YAML after tabbing through.
-->

## Related issues

<!-- Fixes #123 · Relates to #456 -->
