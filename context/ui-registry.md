# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Layout Components

#### Navbar
- **File Path**: [Navbar.tsx](file:///home/ddroid/Projects/job-pilot/components/layout/Navbar.tsx)
- **Primary Classes**: `sticky top-0 z-50 w-full border-b border-border bg-surface px-6 h-16 flex items-center justify-between`
- **Nav Link Classes**: `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-in-out`
- **Active Nav Link**: `bg-accent-light text-accent font-semibold`
- **Inactive Nav Link**: `text-text-secondary hover:text-text-primary hover:bg-surface-secondary`
- **Primary CTA Button**: `px-6 py-2.5 rounded-full text-sm font-medium bg-overlay hover:bg-overlay-dark text-white transition-all duration-200 ease-in-out shadow-sm hover:shadow active:scale-98`

#### Footer
- **File Path**: [Footer.tsx](file:///home/ddroid/Projects/job-pilot/components/layout/Footer.tsx)
- **Primary Classes**: `w-full border-t border-border bg-surface py-8 px-8 mt-auto`
- **Container Classes**: `max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6`

### Homepage Components

#### Hero
- **File Path**: [Hero.tsx](file:///home/ddroid/Projects/job-pilot/components/homepage/Hero.tsx)
- **Section Wrapper**: `relative w-full pt-16 pb-20 px-6 overflow-hidden flex flex-col items-center`
- **Background Glow**: `bg-gradient-to-tr from-accent/10 via-[#7287fd]/15 to-accent-light/35 blur-[100px] rounded-full`
- **Primary CTA Button**: `bg-overlay hover:bg-overlay-dark text-white`
- **Secondary CTA Button**: `border border-border-light hover:bg-accent-light text-accent bg-surface`
- **Browser Mockup**: `w-full max-w-[1000px] rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden`

#### Features
- **File Path**: [Features.tsx](file:///home/ddroid/Projects/job-pilot/components/homepage/Features.tsx)
- **Section 1 (White)**: `w-full py-20 px-6 bg-surface`
- **Section 2 (Latte)**: `w-full py-20 px-6 bg-background relative overflow-hidden`
- **Active Tab Button**: `border-l-4 border-accent bg-background/50 rounded-r-xl`
- **Inactive Tab Button**: `border-l-4 border-transparent hover:bg-background/20 rounded-r-xl`
- **Mockup Card Container**: `relative w-full max-w-[480px] hover:scale-[1.02] transition-all duration-300` (aspect-[2364/1778] for jobs-lists, aspect-[2144/1656] for agnet-log)

#### Testimonial
- **File Path**: [Testimonial.tsx](file:///home/ddroid/Projects/job-pilot/components/homepage/Testimonial.tsx)
- **Section Wrapper**: `w-full py-24 px-6 bg-surface flex flex-col items-center justify-center border-t border-border`
- **Avatar container**: `relative w-12 h-12 rounded-full overflow-hidden border border-border shadow-sm`

#### BottomCTA
- **File Path**: [BottomCTA.tsx](file:///home/ddroid/Projects/job-pilot/components/homepage/BottomCTA.tsx)
- **Section Wrapper**: `relative w-full py-24 px-6 overflow-hidden flex flex-col items-center border-t border-border`
- **Background Glow**: `bg-gradient-to-t from-accent-light/30 via-background/10 to-background`
- **Buttons**: Matches Hero CTA styling.
