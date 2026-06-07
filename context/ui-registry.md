# UI Pattern Registry

This registry tracks the structural and visual patterns extracted from components. Use these exact configurations when building similar elements to ensure consistency across the application.

### Elevated Card Panel
File: `components/profile/ProfileInformationForm.tsx`, `components/profile/ResumeSection.tsx`, `components/profile/ProfileAlert.tsx`
Last updated: 2026-06-07

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-surface`    |
| Border           | `border border-border` (Alert uses `border-error/20` when representing an alert, others don't have explicit border if shadow is present) |
| Border radius    | `rounded-2xl`   |
| Spacing          | `p-6`           |
| Shadow           | `shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)]` |

**Pattern notes:**
This is the primary M3 elevated container style. All major content blocks on a page should sit inside this exact configuration.

### Section Heading
File: `components/profile/ResumeSection.tsx`
Last updated: 2026-06-07

| Property         | Class           |
| ---------------- | --------------- |
| Text size/weight | `text-base font-bold` |
| Text color       | `text-text-primary` |

### Form Labels
File: `components/profile/ProfileInformationForm.tsx`
Last updated: 2026-06-07

| Property         | Class           |
| ---------------- | --------------- |
| Text size/weight | `text-xs font-bold` |
| Text color       | `text-text-secondary` |
| Case & Tracking  | `uppercase tracking-wider` |

### Standard Input / Select / Textarea
File: `components/profile/ProfileInformationForm.tsx`
Last updated: 2026-06-07

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-surface` (or `bg-surface-secondary` if disabled) |
| Border           | `border border-border` |
| Border radius    | `rounded-xl`    |
| Spacing          | `px-3.5 py-2.5` |
| Text color       | `text-sm text-text-primary` |
| Placeholder      | `placeholder:text-text-muted` |
| Focus state      | `focus:outline-none focus:ring-2 focus:ring-accent/50` |

### Removable Badge / Tag (e.g. Skills)
File: `components/profile/ProfileInformationForm.tsx`
Last updated: 2026-06-07

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-surface-secondary` |
| Border           | `border border-border-light` |
| Border radius    | `rounded-full`  |
| Spacing          | `px-3 py-1 gap-1` |
| Text size/weight | `text-xs font-medium` |
| Text color       | `text-text-primary` |
| Icon color       | `text-text-muted` (Hover: `hover:text-error`) |

### Primary Capsule Button (Alternative sizes)
File: `components/profile/ProfileInformationForm.tsx` (Save Profile Button)
Last updated: 2026-06-07

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-accent`     |
| Text color       | `text-accent-foreground` |
| Border radius    | `rounded-xl` (Note: Full width actions can use `rounded-xl` over `rounded-full` to align with input styling) |
| Spacing          | `px-6 py-3.5 w-full` |
| Text size/weight | `text-base font-bold` |
| Hover state      | `hover:bg-accent-dark` |

### Icon-Only Action Button (Alternative)
File: `components/profile/ResumeSection.tsx`
Last updated: 2026-06-07

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-black`      |
| Text color       | `text-white`    |
| Border radius    | `rounded-full`  |
| Spacing          | `w-10 h-10 flex items-center justify-center` |
| Hover state      | `hover:bg-gray-800 transition-colors` |

**Pattern notes:**
Used for quick utility actions next to primary or secondary buttons, providing high contrast without competing with standard form buttons.

### Dotted / Dashed Upload Area
File: `components/profile/ResumeSection.tsx`
Last updated: 2026-06-07

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-surface-secondary/30` |
| Border           | `border-2 border-dashed border-border-light` |
| Border radius    | `rounded-xl`    |
| Spacing          | `p-8 flex flex-col items-center justify-center` |
| Hover state      | `hover:bg-surface-secondary/50 cursor-pointer` |
| Drag active state| `border-accent bg-accent/5` |
| Disabled state   | `border-accent/50 opacity-70 bg-surface-secondary/30` |
