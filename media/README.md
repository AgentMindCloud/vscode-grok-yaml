# Grok YAML — Brand Assets

Assets in this folder are consumed by `package.json` for the VS Code
Marketplace listing and by the extension's README banner.

> **Status (v0.1.0):** the three PNGs are **placeholder** solid-fill images
> generated at release time so `vsce package` succeeds. Replace with the
> final brand artwork produced by Claude Design ("Grok Install Eco System")
> before the first public Marketplace publish.

## Files

| File            | Purpose                    | Size       | Background | Notes                                        |
| --------------- | -------------------------- | ---------- | ---------- | -------------------------------------------- |
| `icon.png`      | Marketplace icon (light)   | 128×128    | transparent | cyan ring placeholder                        |
| `icon-dark.png` | Marketplace icon (dark)    | 128×128    | `#0A0A0A`   | cyan ring placeholder                        |
| `banner.png`    | Marketplace gallery banner | 1376×400   | `#0A0A0A`   | cyan accent stripe on left placeholder       |

## Locked brand hex values

These are the exact brand tokens documented by Claude Design. Do **not**
substitute.

| Token             | Value                            |
| ----------------- | -------------------------------- |
| Background        | `#0A0A0A` (deep space black)     |
| Primary neon      | `#00F0FF` (cyan)                 |
| Success neon      | `#00FF9D` (green)                |
| Text primary      | `#FFFFFF`                        |
| Text secondary    | `#E5E5E5`                        |
| Text tertiary     | `rgba(255, 255, 255, 0.5)`       |
| Surface (glass)   | `rgba(255, 255, 255, 0.04)`      |
| Border subtle     | `rgba(0, 240, 255, 0.15)`        |
| Border focused    | `rgba(0, 240, 255, 0.40)`        |

## Rules

- **No drop shadows.** Neon glow only.
- Maintain exact pixel dimensions. Marketplace rejects off-size artwork.
- Keep `icon.png` legible on a light background and `icon-dark.png`
  legible on `#0A0A0A`.
- The banner's right two-thirds must be clear of mark/text so Marketplace
  can overlay the extension title readably.

## Replacing placeholders

1. Drop the final PNG files into this folder, overwriting the placeholders.
2. Keep the exact filenames — `package.json` and the root `README.md`
   reference them.
3. Run `npx @vscode/vsce package --no-dependencies` locally to verify.
4. Bump `package.json` version and add a CHANGELOG entry describing the
   artwork swap.
