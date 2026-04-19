# GrokInstall VS Code Extension — Media Assets

These files back the marketplace listing and in-editor language icon.

## Files

- `icon.png` — 128×128, extension icon (marketplace + in-editor)
- `banner.png` — 1376×400, marketplace gallery banner

## Locked brand tokens (Session 1)

| Token                        | Value                       |
|------------------------------|-----------------------------|
| Background (deep space black)| `#0A0A0A`                   |
| Primary neon (cyan)          | `#00F0FF`                   |
| Success neon (green)         | `#00FF9D`                   |
| Primary text                 | `#FFFFFF`                   |
| Secondary text               | `#E5E5E5`                   |
| Tertiary text                | `rgba(255, 255, 255, 0.5)`  |
| Surface (glass fills)        | `rgba(255, 255, 255, 0.04)` |
| Border subtle                | `rgba(0, 240, 255, 0.15)`   |
| Border focused               | `rgba(0, 240, 255, 0.40)`   |

No other colors. No drop shadows. Neon glow only.

## Status

The PNGs currently committed are brand-compliant solid-color placeholders
sized to spec so packaging (`vsce package`) succeeds. Replace with the final
v1 assets from the "Grok Install Eco System" Claude Design project before
publishing to the Marketplace.

## Legal

GrokInstall is an independent community project. Not affiliated with xAI,
Grok, or X.
