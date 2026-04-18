# GrokInstall Extension — Media Assets

**IMPORTANT: the three PNGs in this directory are 68-byte session
placeholders.** They exist purely so `@vscode/vsce package` produces a
valid `.vsix` during CI sanity checks. They contain no visual content.

## Before publishing to the Marketplace

Drop the real brand-locked PNGs from Claude Design into this directory.
The package manifest already references them correctly, so no code
changes are required.

| File               | Dimensions   | Background           | Purpose                         |
| ------------------ | ------------ | -------------------- | ------------------------------- |
| `icon.png`         | 128 x 128    | Transparent          | Primary extension icon          |
| `icon-dark.png`    | 128 x 128    | `#0A0A0A`            | Dark-theme fallback             |
| `banner.png`       | 1376 x 400   | `#0A0A0A`            | Marketplace gallery banner      |

## Locked brand values

| Token                      | Value                         |
| -------------------------- | ----------------------------- |
| Background (deep space)    | `#0A0A0A`                     |
| Primary neon (cyan)        | `#00F0FF`                     |
| Success neon (green)       | `#00FF9D`                     |
| Primary text               | `#FFFFFF`                     |
| Secondary text             | `#E5E5E5`                     |
| Tertiary text              | `rgba(255, 255, 255, 0.5)`    |
| Surface (glass fill)       | `rgba(255, 255, 255, 0.04)`   |
| Border subtle              | `rgba(0, 240, 255, 0.15)`     |
| Border focused             | `rgba(0, 240, 255, 0.40)`     |

No drop shadows. Neon glow only on hero wordmark. Dark mode only.

## Legal

GrokInstall is an independent community project. Not affiliated with
xAI, Grok, or X.
