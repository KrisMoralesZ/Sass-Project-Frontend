# Design direction — Canopy

Visual system for the multi-tenant workspace frontend. Tokens live in `src/styles/theme.ts`; primitives and shells consume them via styled-components `ThemeProvider`.

## Product feel

**Canopy** is calm, precise, and workspace-first — built for long sessions managing projects, boards, and members. It should read as one intentional product, not a generic dashboard kit or AI-default purple/cream palette.

| Principle | Direction |
| --- | --- |
| Tone | Focused and trustworthy; minimal decoration |
| Color | Forest greens on cool green-grays — clarity over warmth |
| Typography | Source Sans 3 — readable UI sans, not Inter/Roboto defaults |
| Shape | Moderate radii (4–12px); cards feel tactile, not glassy |
| Motion | Short and purposeful (120–180ms); no bounce or parallax |
| Density | Comfortable for forms and data tables; not ultra-compact |

## Palette

| Role | Token | Usage |
| --- | --- | --- |
| Canvas | `colors.background` | App backdrop |
| Surface | `colors.surface` | Panels, inputs, cards |
| Muted surface | `colors.surfaceMuted` | Table stripes, secondary panels |
| Elevated | `colors.surfaceElevated` | Dialogs, dropdowns |
| Primary text | `colors.text` | Headings, body |
| Secondary | `colors.textMuted` | Labels, meta |
| Subtle | `colors.textSubtle` | Placeholders, hints |
| Brand | `colors.brand` | Primary actions, links, active nav |
| Brand muted | `colors.brandMuted` | Selection fills, badges |
| Danger / success / warning / info | semantic tokens | Alerts, toasts, validation |
| Focus | `colors.focus` + `colors.focusRing` | Keyboard focus rings |
| Overlay | `colors.overlay` | Modal/dialog scrim |

## Typography scale

| Token | Size | Typical use |
| --- | --- | --- |
| `font.size.xs` | 12px | Captions, badges |
| `font.size.sm` | 14px | Secondary UI, table cells |
| `font.size.md` | 16px | Body default |
| `font.size.lg` | 18px | Section titles |
| `font.size.xl` | 20px | Page subtitles |
| `font.size.2xl` | 28px | Page titles |

Weights: `regular` (400), `medium` (500), `semibold` (600), `bold` (700).

## Spacing and layout

- Spacing scale: `space.xs` → `space.3xl` (4px base rhythm).
- Auth content width: `layout.contentMaxWidth` (~672px).
- App shell width: `layout.shellMaxWidth` (~1280px).
- Top nav height: `layout.navHeight`.

Breakpoints (`breakpoints.sm`–`xl`) pair with `mediaUp()` / `mediaDown()` in `src/styles/media.ts`.

## What lands later (not 0.2.2)

- UI primitives (Button, Input, Dialog, …) — tasks 0.2.3–0.2.7
- Full layout restyle — tasks 0.2.8–0.2.9
- Domain screens and marketing polish — later phases

Review tokens in Storybook: **Foundation → Visual direction**.
