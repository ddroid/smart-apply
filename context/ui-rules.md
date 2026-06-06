# UI Rules (Google Material Design & Catppuccin Latte)

Concise rules for building the JobPilot UI, fully aligned with Google Material Design 3 (M3) principles, styled with the Catppuccin Latte color palette, and set in the Montserrat typeface. These rules maintain consistency across layout, components, and typography.

---

## Font

Always import **Montserrat** via `next/font/google` in the root layout.

```typescript
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});
```

The `--font-sans` variable is declared in `@theme` in `app/globals.css`. Apply the font variable class to the `<html>` tag in the root layout. Never use system fallback fonts as the primary typeface.

---

## Typography Hierarchy

Montserrat is a geometric sans-serif. To maintain visual balance, use the following weight mappings:
- **Bold (700)**: Page titles, logo/brand text, and large stats numbers.
- **SemiBold (600)**: Section headings, card titles, and table headers.
- **Medium (500)**: Active navigation, button labels, input text, and badge text.
- **Regular (400)**: Body copy, job descriptions, and general text.
- **Light (300)**: Secondary metadata, timestamps, captions, and muted descriptions.

### Specific Sizes and Weights:

*   **Stat Numbers (Dashboard)**: `30px` | Weight 700 | Color: `--color-text-primary` (`#4c4f69`) | Line-height: `36px`
*   **Page Titles / Brand**: `20px` | Weight 700 | Color: `--color-text-primary` (`#4c4f69`) | Line-height: `28px`
*   **Section Headings (Card/Page Sections)**: `16px` | Weight 600 | Color: `--color-text-primary` (`#4c4f69`) | Line-height: `24px`
*   **Body / Primary Content**: `14px` | Weight 400 (or 500 for emphasis) | Color: `--color-text-primary` (`#4c4f69`) | Line-height: `20px`
*   **Secondary / Muted labels / Metadata**: `12px` | Weight 300 (or 400) | Color: `--color-text-secondary` (`#5c5f77`) | Line-height: `16px`

---

## Layout

Designed on a strict 8px (8dp) grid:
- **Page Max-Width**: `1440px`, centered.
- **Main Content Padding**: `32px` (p-8) on all sides.
- **Gap between Sections**: `24px` (gap-6) or `32px` (gap-8).
- **Header (Top Navbar)**: Height `64px`, full width, background `--color-surface` (`#ffffff`), border-bottom `1px solid var(--color-border)` (`#ccd0da`), padding `0 24px` (px-6).
- **Navigation Type**: All pages use top navigation only — no sidebars, drawers, or floating actions for primary page routing.

---

## Navbar

Three navigation items: **Dashboard**, **Find Jobs**, and **Profile**.
Aligned with Material Design 3 Navigation Bar aesthetics:
- **Active Navigation Item**:
  - Wrapped in a pill-shaped container: background `--color-accent-light` (`#f4eefc`), `border-radius: 9999px` (rounded-full).
  - Text: color `--color-accent` (`#8839ef`), weight 600 (SemiBold), `14px`.
  - Padding: `6px 16px` (px-4 py-1.5).
- **Inactive Navigation Item**:
  - No background container.
  - Text: color `--color-text-secondary` (`#5c5f77`), weight 500 (Medium), `14px`.
  - Padding: `6px 16px` (px-4 py-1.5).
- **Transition**: Smooth transition for color and background (`transition-all duration-200 ease-in-out`).

---

## Cards (Material 3 Containers)

In accordance with M3, containers represent clear surfaces. We use three distinct Card types:

1.  **Elevated Card** (Primary container for lists/stats):
    ```css
    background: var(--color-surface); /* #ffffff */
    border-radius: 16px;              /* rounded-2xl */
    padding: 24px;                    /* p-6 */
    box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.05), 0px 1px 2px 0px rgba(0, 0, 0, 0.1); /* M3 Elevation 1 */
    ```
2.  **Filled Card** (Secondary surfaces like detail side-panels):
    ```css
    background: var(--color-surface-secondary); /* #e6e9ef */
    border-radius: 16px;
    padding: 24px;
    border: none;
    ```
3.  **Outlined Card** (Subtle grid items or sections):
    ```css
    background: var(--color-surface);
    border: 1px solid var(--color-border); /* #ccd0da */
    border-radius: 16px;
    padding: 24px;
    ```

*Never apply color gradients to card backgrounds. Color belongs inside cards (badges, bars, progress elements) — card surfaces remain neutral.*

---

## Buttons

Material Design 3 buttons are fully rounded capsule shapes (`border-radius: 9999px` / `rounded-full`).

**Primary Filled Button** (Main actions):
```css
background: var(--color-accent); /* Mauve #8839ef */
color: var(--color-accent-foreground); /* #ffffff */
border-radius: 9999px;           /* rounded-full */
padding: 10px 24px;              /* px-6 py-2.5 */
font-size: 14px;
font-weight: 500;                /* Montserrat Medium */
transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
```
*Hover state: Subtle scale or darken (`hover:bg-[#722be2]`).*

**Secondary Outlined Button** (Alternative actions):
```css
background: transparent;
border: 1px solid var(--color-border-light); /* #bcc0cc */
color: var(--color-accent);      /* #8839ef */
border-radius: 9999px;
padding: 10px 24px;
font-size: 14px;
font-weight: 500;
```
*Hover state: Background changes to `--color-accent-light` (`#f4eefc`).*

**Text / Ghost Button** (Subtle actions / icons):
```css
background: transparent;
color: var(--color-text-secondary); /* #5c5f77 */
border-radius: 9999px;
padding: 8px 16px;
```
*Hover state: Background changes to `--color-surface-secondary` (`#e6e9ef`), text color becomes `--color-text-primary` (`#4c4f69`).*

---

## Form Inputs

Designed as Material Outlined Text Fields:
```css
background: var(--color-surface);
border: 1px solid var(--color-border); /* #ccd0da */
border-radius: 12px;                  /* rounded-xl */
padding: 10px 14px;                   /* px-3.5 py-2.5 */
font-size: 14px;
color: var(--color-text-primary);     /* #4c4f69 */
placeholder-color: var(--color-text-muted); /* #6c6f85 */
transition: border-color 0.2s ease, box-shadow 0.2s ease;
```
*Focus state: `border-color: var(--color-accent); box-shadow: 0 0 0 2px var(--color-accent-light);` (2px focus ring).*

---

## Badges

All badges use a pill shape (`border-radius: 9999px`) and follow M3 color-pairing recommendations (light background container + dark text):

```css
padding: 4px 12px;                    /* px-3 py-1 */
font-size: 12px;
font-weight: 500;                     /* Montserrat Medium */
```

- **Trend Badges (Stat Cards)**: Background `--color-success-light` (`#e8f5e6`), text `--color-success` (`#40a02b`), Montserrat Bold (700) or SemiBold (600) for trend values.
- **Match Badges**: Background `--color-accent-light` (`#f4eefc`), text `--color-accent` (`#8839ef`).

---

## Table (Jobs List)

- **Layout**: Simple, card-wrapped table.
- **Rows**: No alternating background colors. Always white or container surface, separated by borders.
- **Borders**: `1px solid var(--color-border)` (`#ccd0da`) between rows.
- **Column Headers**: Montserrat SemiBold (600), uppercase, `12px`, color `--color-text-secondary` (`#5c5f77`), padding `12px 16px`.
- **Row Text**: Montserrat Regular (400), `14px`, color `--color-text-primary` (`#4c4f69`), padding `16px`.
- **Hover State**: Row background changes to `--color-surface-secondary` (`#e6e9ef`) with transition.

---

## Match Score Bar

An M3 Linear Progress Indicator:
```css
height: 6px;
border-radius: 9999px;
background: var(--color-surface-muted); /* Track color #ccd0da */
```

**Fill Color by Score (Catppuccin Latte Colors)**:
- **80-100% (High Match)**: `--color-success` (`#40a02b`) (Green)
- **60-79% (Medium Match)**: `--color-info` (`#1e66f5`) (Blue)
- **Below 60% (Low Match)**: `--color-warning` (`#fe641b`) (Peach)

---

## Empty States

Clean, centered layout inside elevated containers:
- **Icon**: Outlined icon with color `--color-text-muted` (`#6c6f85`).
- **Text**: Description in `--color-text-secondary` (`#5c5f77`), Montserrat Regular (400), `14px`.
- **Action**: Capsule-shaped Primary Button if a resolution action is available.

---

## Tailwind v4 Note

This project uses Tailwind v4. Theme tokens are defined under `@theme` in `app/globals.css`. Never use standard Tailwind arbitrary colors (like `bg-purple-500` or `text-gray-600`); always map to theme tokens (`bg-accent`, `text-text-primary`).

---

## Do Nots

- **Never** use hardcoded hex values in component files — always use Tailwind utility tokens.
- **Never** use standard Tailwind built-in colors — use only the Catppuccin Latte palette defined in `@theme`.
- **Never** use sharp or blocky buttons (like `rounded-md` or `rounded-sm`) — keep buttons pill-shaped (`rounded-full`) to match Material Design 3.
- **Never** use more than one font weight variation in a single inline element.
- **Never** apply background gradients to cards or main page containers.
- **Never** show raw error codes or stack traces to users — translate them into readable sentences.
