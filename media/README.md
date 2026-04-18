# Extension media

The marketplace icon and banner are generated from the brand kit in
[`grok-install-brand`](https://github.com/AgentMindCloud/grok-install-brand) and
dropped in here before release:

- `icon.png` — 128×128 marketplace icon. Brand palette: `#0A0A0A` background, `#00F0FF` glyph.
- `banner.png` — 1200×630 marketplace hero.

Once the binary assets are added, restore the `"icon": "media/icon.png"` field in
`package.json`. They are intentionally absent from the `0.1.0` scaffold so `vsce
package` works in CI without requiring binary brand assets to be committed.
