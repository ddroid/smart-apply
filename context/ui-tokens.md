# UI Tokens

Design tokens for JobPilot. All colors, typography, spacing, and component values are extracted from the Catppuccin Latte palette and Google Material Design 3 (M3) specifications. Use these exact values throughout the codebase — never hardcode colors or use raw Tailwind color classes in components.

---

## How to Use

This project uses **Tailwind CSS v4**. All design tokens are defined using the `@theme` directive in `app/globals.css`. No `tailwind.config.ts` is needed for colors or tokens.

Tailwind v4 automatically generates utility classes from `@theme` variables:

- `--color-accent` → `bg-accent`, `text-accent`, `border-accent`
- `--color-surface` → `bg-surface`, `text-surface`, `border-surface`

```tsx
// Correct — uses generated utility classes
className="bg-surface text-text-primary border-border"

// Also correct — references CSS variable directly
style={{ color: 'var(--color-text-primary)' }}

// Never — hardcoded hex values
className="bg-[#eff1f5] text-[#4c4f69]"

// Never — raw Tailwind color classes
className="bg-purple-500 text-gray-600"
```

---

## globals.css — Complete Token Definition

```css
@import "tailwindcss";

@theme {
  /* Font: Montserrat */
  --font-sans: "Montserrat", sans-serif;

  /* Page and surface backgrounds (Catppuccin Latte Base & Surfaces) */
  --color-background: #eff1f5;         /* Catppuccin Latte Base */
  --color-surface: #ffffff;            /* Elevated card containers in Material style */
  --color-surface-secondary: #e6e9ef;  /* Catppuccin Latte Mantle */
  --color-surface-tertiary: #dce0e8;   /* Catppuccin Latte Crust */
  --color-surface-muted: #ccd0da;      /* Catppuccin Latte Surface 0 */

  /* Borders (Catppuccin Latte Surfaces) */
  --color-border: #ccd0da;             /* Catppuccin Latte Surface 0 */
  --color-border-light: #bcc0cc;       /* Catppuccin Latte Surface 1 */
  --color-border-muted: #acb0be;       /* Catppuccin Latte Surface 2 */

  /* Text (Catppuccin Latte Neutrals) */
  --color-text-primary: #4c4f69;       /* Catppuccin Latte Text */
  --color-text-secondary: #5c5f77;     /* Catppuccin Latte Subtext 1 */
  --color-text-muted: #6c6f85;         /* Catppuccin Latte Subtext 0 */
  --color-text-dark: #36394a;          /* Custom darker overlay */
  --color-text-darker: #272835;
  --color-text-darkest: #1e1e2e;
  --color-text-black: #11111b;
  --color-text-slate: #272835;
  --color-text-slate-medium: #666d80;

  /* Primary Accent — Mauve (Catppuccin Latte Mauve) */
  --color-accent: #8839ef;             /* Mauve */
  --color-accent-dark: #722be2;        /* Darker Mauve for hover */
  --color-accent-light: #f4eefc;       /* M3 light container background */
  --color-accent-muted: #faf8ff;       /* Very subtle mauve tint */
  --color-accent-foreground: #ffffff;  /* Contrast text on Mauve */

  /* Success — Green & Teal (Catppuccin Latte) */
  --color-success: #40a02b;            /* Green */
  --color-success-alt: #179299;        /* Teal */
  --color-success-dark: #307820;
  --color-success-darker: #255c18;
  --color-success-light: #e8f5e6;
  --color-success-lightest: #f0fbf0;
  --color-success-foreground: #40a02b;

  /* Info — Blue & Sky (Catppuccin Latte) */
  --color-info: #1e66f5;               /* Blue */
  --color-info-dark: #04a5e5;          /* Sky */
  --color-info-medium: #209fb5;        /* Sapphire */
  --color-info-light: #e8f0fe;
  --color-info-lightest: #f1f6ff;
  --color-info-foreground: #1e66f5;
  --color-info-muted: #8c8fa1;         /* Overlay 1 */

  /* Warning — Peach & Yellow (Catppuccin Latte) */
  --color-warning: #fe641b;            /* Peach */
  --color-warning-foreground: #ffffff;

  /* Error — Red (Catppuccin Latte) */
  --color-error: #d20f39;              /* Red */
  --color-error-foreground: #ffffff;

  /* LinkedIn brand */
  --color-linkedin: #0a66c2;
  --color-linkedin-light: #dce6f1;
  --color-linkedin-foreground: #ffffff;

  /* Dark overlays */
  --color-overlay: #111827;
  --color-overlay-dark: #131316;

  /* Border radius (Google Material Design 3 Spec) */
  --radius-xs: 4px;                    /* Tiny elements, tiny indicators */
  --radius-sm: 8px;                    /* Small shapes, inner layout components */
  --radius-md: 12px;                   /* Text fields, standard inputs, small containers */
  --radius-lg: 16px;                   /* Main Cards (M3 Large container shape) */
  --radius-xl: 24px;                   /* Navigation drawer components, large panels, dialogs */
  --radius-full: 9999px;               /* M3 capsule buttons, active nav indicators, badges */
}
```

Tailwind v4 generates utility classes automatically from every `--color-*` and `--radius-*` token above:

- `bg-accent`, `text-accent`, `border-accent`, `rounded-lg` (maps to `--radius-lg`)
- `bg-surface`, `text-surface-secondary`
- `bg-success-light`, `text-text-muted`
- etc.

---

## Color Usage Guide

### Page Layout

| Element           | Token                  | Latte Value / Description |
| ----------------- | ---------------------- | ------------------------- |
| Page background   | `bg-background`        | `#eff1f5` (Base)          |
| Card / surface    | `bg-surface`           | `#ffffff` (White container) |
| Secondary surface | `bg-surface-secondary` | `#e6e9ef` (Mantle)        |
| Default border    | `border-border`        | `#ccd0da` (Surface 0)     |
| Light border      | `border-border-light`  | `#bcc0cc` (Surface 1)     |

### Typography

| Element                | Token                  | Latte Value |
| ---------------------- | ---------------------- | ----------- |
| Headings, primary text | `text-text-primary`    | `#4c4f69`   |
| Secondary text, labels | `text-text-secondary`  | `#5c5f77`   |
| Placeholder, muted     | `text-text-muted`      | `#6c6f85`   |
| Dark labels            | `text-text-dark`       | `#36394a`   |

### Accent (Primary Mauve)

Used for: primary capsule buttons, active navigation indicators, progress score indicators.

| Element                | Token                    | Latte Value |
| ---------------------- | ------------------------ | ----------- |
| Button background      | `bg-accent`              | `#8839ef`   |
| Button text            | `text-accent-foreground` | `#ffffff`   |
| Light badge background | `bg-accent-light`        | `#f4eefc`   |
| Subtle background      | `bg-accent-muted`        | `#faf8ff`   |

### Match Score Colors

Match score bars and indicators use color mappings based on score range:

| Score Range | Color  | Token                                  |
| ----------- | ------ | -------------------------------------- |
| 80-100%     | Green  | `text-success` / `bg-success-lightest` |
| 60-79%      | Blue   | `text-info` / `bg-info-light`          |
| Below 60%   | Peach  | `text-warning`                         |

### Skills Badges

| Type          | Background            | Text                      |
| ------------- | --------------------- | ------------------------- |
| Matched skill | `bg-success-light`    | `text-success`            |
| Missing skill | `bg-accent-light`     | `text-accent`             |

### Source Badges

| Source   | Background             | Text                  |
| -------- | ---------------------- | --------------------- |
| LinkedIn | `bg-linkedin-light`    | `text-linkedin`       |
| URL      | `bg-surface-secondary` | `text-text-secondary` |

### Status Badges

| Status     | Background             | Text                      |
| ---------- | ---------------------- | ------------------------- |
| Tailored   | `bg-accent-light`      | `text-accent`             |
| High Match | `bg-success-lightest`  | `text-success`            |
| Low Match  | `bg-surface-secondary` | `text-text-secondary`     |

---

## Typography (Montserrat Spec)

| Element              | Size | Weight | Line height | Color token           |
| -------------------- | ---- | ------ | ----------- | --------------------- |
| Logo / Brand text    | 19px | 700    | 28px        | `text-text-primary`   |
| Stat number          | 30px | 700    | 36px        | `text-text-primary`   |
| Section heading      | 16px | 600    | 24px        | `text-text-primary`   |
| Nav item (active)    | 14px | 600    | 20px        | `text-accent`         |
| Nav item (inactive)  | 14px | 500    | 20px        | `text-text-secondary` |
| Card label           | 14px | 500    | 20px        | `text-text-secondary` |
| Body / activity text | 14px | 400    | 20px        | `text-text-primary`   |
| Trend badge text     | 12px | 600    | 16px        | `text-success`        |
| Timestamp / muted    | 12px | 300    | 16px        | `text-text-muted`     |
| Chart axis labels    | 12px | 300    | 15px        | `text-text-muted`     |
| Stat subtitle        | 12px | 300    | 16px        | `text-text-muted`     |

Font family: **Montserrat** — always import via `next/font/google`.

---

## Spacing

Designed strictly around the 8px layout grid:

| Token       | Value      | Usage                              |
| ----------- | ---------- | ---------------------------------- |
| `gap-1`     | 4px        | Tight inline gaps                  |
| `gap-2`     | 8px        | Badge and small tag gaps           |
| `gap-3`     | 12px       | Form field gaps                    |
| `gap-4`     | 16px       | Section internal gaps              |
| `gap-6`     | 24px       | Between cards / page columns       |
| `gap-8`     | 32px       | Main page section margins          |
| `p-4`       | 16px       | Inner component/card padding       |
| `p-6`       | 24px       | Standard M3 Card container padding |
| `px-6 py-2.5`| 24px / 10px| Button horizontal/vertical padding |
| `px-3 py-1` | 12px / 4px | Capsule Badge padding              |

---

## Component Tokens

### Cards

```
Elevated Card:
- background: bg-surface (#ffffff)
- border-radius: rounded-2xl (16px) or rounded-3xl (24px)
- padding: p-6 (24px)
- box-shadow: 0px 1px 3px 1px rgba(0,0,0,0.05), 0px 1px 2px 0px rgba(0,0,0,0.1) (M3 Elevation 1)

Filled Card:
- background: bg-surface-secondary (#e6e9ef)
- border-radius: rounded-2xl (16px)
- padding: p-6 (24px)
```

### Buttons (Material 3 Spec)

**Primary:**
```
background: bg-accent (#8839ef)
text: text-accent-foreground (#ffffff)
border-radius: rounded-full (capsule)
padding: px-6 py-2.5
font-weight: font-medium (500)
```

**Secondary:**
```
background: transparent
border: border border-border-light (#bcc0cc)
text: text-accent (#8839ef)
border-radius: rounded-full (capsule)
padding: px-6 py-2.5
```

**Ghost:**
```
background: transparent
text: text-text-secondary (#5c5f77)
hover: hover:bg-surface-secondary (#e6e9ef)
border-radius: rounded-full
```

### Input Fields

```
background: bg-surface (#ffffff)
border: border border-border (#ccd0da)
border-radius: rounded-xl (12px)
padding: px-3.5 py-2.5
text: text-text-primary (#4c4f69)
placeholder: text-text-muted (#6c6f85)
focus: ring-2 ring-accent (2px border outline on focus)
```

### Badges

```
border-radius: rounded-full (pill)
padding: px-3 py-1
font-size: text-xs (12px)
font-weight: font-medium (500)
```

### Match Score Bar (Linear Progress Indicator)

```
background track: bg-surface-muted (#ccd0da)
fill: varies by score range (see Match Score Colors above)
height: 6px
border-radius: rounded-full
```

### Trend Badges (stat cards)

```
background: bg-success-light (#e8f5e6)
text color: text-success (#40a02b)
border-radius: rounded-full (pill)
padding: px-3 py-0.5
font-size: 12px;
font-weight: 600;
```

### Activity Dots

Each activity type has a specific dot color:
| Activity Type | Outer ring | Inner dot |
|---|---|---|
| Resume tailored | `bg-accent-light` (#f4eefc) | `bg-accent` (#8839ef) |
| Cover letter | `bg-info-light` (#e8f0fe) | `bg-info` (#1e66f5) |
| Job found | `bg-success-light` (#e8f5e6) | `bg-success-alt` (#179299) |
Dot size: 8px inner, 16px outer with white border

### Dashboard Chart Colors

| Chart                            | Color                                                           |
| -------------------------------- | --------------------------------------------------------------- |
| Jobs Found Over Time (line)      | `#8839ef` (Mauve) stroke, 3px width, gradient fill rgba(136,57,239,0.1) |
| Resume Tailoring Activity (bars) | `#1e66f5` (Blue) or `#7287fd` (Lavender)                        |
| Match Score Distribution (bars)  | `#40a02b` (Green)                                               |
| Chart grid lines                 | `1px dashed var(--color-border)` (#ccd0da)                      |
| Chart axis labels                | `var(--color-text-muted)` (#6c6f85), 12px                       |

### Logo

```
background: linear-gradient(135deg, #8839ef 0%, #7287fd 100%) (Mauve to Lavender)
border-radius: 12px (rounded-xl)
size: 36x36px
```

---

## Invariants

- **Never** use hex values directly in component styling — always use CSS variables via Tailwind utility tokens.
- **Font is Montserrat** — always import via `next/font/google` and set Montserrat as `--font-sans`. Never use fallback system fonts.
- **Never** use raw Tailwind color classes like `bg-purple-500` or `text-gray-600` — use only project theme tokens.
- **Accent is Mauve** (`#8839ef`) — never use Tailwind's built-in purple/indigo scale.
- **Match score bars** always use Catppuccin Latte success (`#40a02b`), info (`#1e66f5`), and warning (`#fe641b`) tokens — never hardcoded colors.
- **LinkedIn badge** always uses `--color-linkedin` (`#0a66c2`) with Latte/Material styling guidelines.
- **All borders** default to `--color-border` (`#ccd0da`) or `--color-border-light` (`#bcc0cc`).
