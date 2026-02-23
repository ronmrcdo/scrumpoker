# MyScrum Design System

Extracted from codebase — source of truth for UI consistency.

---

## Spacing

**Base unit:** 4px (Tailwind default)

**Scale:**
| Token  | Value | Usage |
|--------|-------|-------|
| `1`    | 4px   | Tight gaps (gap-1) |
| `1.5`  | 6px   | Compact spacing (gap-1.5, py-1.5) |
| `2`    | 8px   | Standard tight (gap-2, p-2, mr-2) |
| `2.5`  | 10px  | Mid spacing (py-2.5) |
| `3`    | 12px  | Primary spacing (gap-3, p-3, px-3) |
| `4`    | 16px  | Standard (p-4, gap-4) |
| `6`    | 24px  | Card padding (p-6) |
| `8`    | 32px  | Section gap (gap-8) |
| `16`   | 64px  | Large section gap |

**Most common:** `gap-3`, `p-3`, `p-4`, `gap-2`

**Responsive pattern:** `p-3 sm:p-4`, `px-3 sm:px-4`, `gap-2 sm:gap-3`

---

## Border Radius

**Tokens (from shared-styles.css):**
| Token       | Value | CSS Variable   |
|-------------|-------|----------------|
| `rounded-sm`  | 6px   | `--radius-sm`  |
| `rounded-md`  | 8px   | `--radius-md`  |
| `rounded-lg`  | 12px  | `--radius-lg`  |

**Usage by frequency:**
- `rounded-lg` — 37x (default for cards, buttons, dialogs, containers)
- `rounded-md` — 16x (inputs, small interactive elements, dropdown items)
- `rounded-full` — 10x (avatars, badges, status dots)
- `rounded-xl` — 8x (large containers, landing page elements)
- `rounded-2xl` — 6x (hero cards, feature cards)

**Rules:**
- Cards, buttons, dialogs → `rounded-lg`
- Inputs, tabs, small controls → `rounded-md`
- Avatars, badges, pills → `rounded-full`
- Large feature/hero containers → `rounded-xl` or `rounded-2xl`

---

## Depth (Hybrid: Soft Shadows + Borders)

### Shadows (custom soft scale)

| Token            | Value                           | Usage |
|------------------|---------------------------------|-------|
| `shadow-soft-sm` | `0 2px 8px rgba(0,0,0,0.04)`   | Buttons, tabs, subtle lift |
| `shadow-soft-md` | `0 4px 16px rgba(0,0,0,0.06)`  | Cards, tooltips, dropdowns |
| `shadow-soft-lg` | `0 8px 24px rgba(0,0,0,0.08)`  | Dialogs, modals, popovers |
| `shadow-soft-xl` | `0 12px 32px rgba(0,0,0,0.1)`  | Hero elements (rare) |

### Borders

| Pattern              | Usage |
|----------------------|-------|
| `border border-border` | Default card/container border (45x) |
| `border-2`           | Interactive emphasis, selected states (19x) |
| `border-b`           | Dividers, header bottoms (11x) |
| `border-l-2`         | Callout/alert left accent (4x) |
| `border-dashed`      | Empty/placeholder states |

**Rules:**
- Every card gets `border border-border` + `shadow-soft-sm`
- Hover elevation: `hover:shadow-soft-md`
- Dialogs get `shadow-soft-lg`
- Selected/active states use `border-2 border-primary-500`

---

## Color Palette

### Brand Colors

**Primary (Indigo):** `#6b7de6`
```
50: #f0f4ff  100: #e0e9ff  200: #c7d7fe  300: #a4bcfd  400: #8b9dfa
500: #6b7de6  600: #5561d3  700: #4449b0  800: #353b8d  900: #2b316a
```

**Accent (Green):** `#22c55e`
```
50: #f0fdf5  100: #dcfce8  200: #bbf7d1  300: #86efac  400: #4ade80
500: #22c55e  600: #16a34a  700: #15803c  800: #166534  900: #14532b
```

**Warm (Orange):** `#f97316`
```
50: #fff7ed  100: #ffedd5  200: #fed7aa  300: #fdba74  400: #fb923c
500: #f97316  600: #ea580c  700: #c2410c  800: #9a3412  900: #7c2d12
```

### Semantic Tokens

| Token                  | Light        | Dark                      |
|------------------------|-------------|---------------------------|
| `background`           | `#fafafa`   | `#171717`                 |
| `foreground`           | `#404040`   | `#f5f5f5`                 |
| `card`                 | `#ffffff`   | `rgba(38, 38, 38, 0.75)`  |
| `card-foreground`      | `#404040`   | `#f5f5f5`                 |
| `popover`              | `#ffffff`   | `#262626`                 |
| `popover-foreground`   | `#404040`   | `#f5f5f5`                 |
| `secondary`            | `#f5f5f5`   | `#404040`                 |
| `secondary-foreground` | `#404040`   | `#f5f5f5`                 |
| `muted`                | `#f5f5f5`   | `#404040`                 |
| `muted-foreground`     | `#737373`   | `#a3a3a3`                 |
| `destructive`          | `#f87171`   | `#dc2626`                 |
| `destructive-foreground` | `#ffffff` | `#ffffff`                 |
| `border`               | `#e5e5e5`   | `rgba(64, 64, 64, 0.6)`   |
| `input`                | `#e5e5e5`   | `#404040`                 |
| `ring`                 | `#6b7de6`   | `#6b7de6`                 |

**Invariant across modes:** primary, accent, ring

**Rules:**
- Use semantic tokens (`bg-card`, `text-foreground`, `border-border`) — not raw hex values
- Primary scale for brand accents and interactive elements
- Accent (green) for success states and highlights
- Warm (orange) for warnings and callouts
- Destructive (red) for errors and danger actions
- Opacity modifiers for muted variants: `/10`, `/20`, `/30`, `/50`

---

## Typography

### Scale

| Class      | Size  | Frequency | Usage |
|------------|-------|-----------|-------|
| `text-xs`  | 12px  | 44x       | Labels, captions, timestamps |
| `text-sm`  | 14px  | 47x       | Body text, buttons, inputs (default) |
| `text-base`| 16px  | 17x       | Larger body text |
| `text-lg`  | 18px  | 11x       | Card titles, section labels |
| `text-xl`  | 20px  | 6x        | Subheadings |
| `text-2xl` | 24px  | 9x        | Section headings, stats |
| `text-3xl` | 30px  | 3x        | Page titles |
| `text-4xl+`| 36px+ | rare      | Hero headlines only |

### Weights

| Class           | Weight | Frequency | Usage |
|-----------------|--------|-----------|-------|
| (default)       | 400    | —         | Body text |
| `font-medium`   | 500    | 30x       | Labels, secondary emphasis |
| `font-semibold`  | 600    | 37x       | Headings, card titles |
| `font-bold`      | 700    | 37x       | Strong emphasis, stats |

### Responsive Patterns
- `text-xs sm:text-sm` — mobile-compact to desktop-readable
- `text-sm sm:text-base` — body text scaling
- `text-xl sm:text-2xl` — heading scaling

### Rules
- Default body: `text-sm` (14px)
- Card titles: `text-lg font-semibold`
- Section headings: `text-2xl font-bold` or `text-xl font-semibold`
- Muted secondary text: `text-xs text-muted-foreground` or `text-sm text-muted-foreground`

---

## Component Patterns

### Button
```
Base:     rounded-lg, text-sm, font-medium, transition-all
Sizes:    sm=h-9 px-3 text-xs | md=h-10 px-4 | lg=h-12 px-6 text-base | icon=h-10 w-10
Variants: default (primary bg), secondary, outline (border-2), ghost, destructive, link
Focus:    focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
```

### Card
```
Base:     rounded-lg, border border-border, bg-card, shadow-soft-sm
Header:   p-6, flex flex-col, space-y-1.5
Content:  p-6 pt-0
Footer:   p-6 pt-0, flex items-center
Title:    text-lg font-semibold leading-none tracking-tight
Desc:     text-sm text-muted-foreground
```

### Input / Textarea
```
Height:   h-10 (Input), min-h-[80px] (Textarea)
Style:    rounded-md, border border-input, bg-card, px-3 py-2, text-sm
Focus:    focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
```

### Badge
```
Shape:    rounded-full, px-2.5 py-0.5, text-xs, font-semibold
Variants: default (primary-100/700), secondary, success (accent), warning (yellow), destructive (red), outline
```

### Avatar
```
Size:     h-10 w-10 (default), rounded-full
Fallback: bg-muted, text-muted-foreground, text-sm font-medium
```

### Dialog
```
Width:    w-[calc(100%-2rem)] max-w-lg
Style:    rounded-lg, border border-border, bg-card, p-6, shadow-soft-lg
Overlay:  bg-black/30, backdrop-blur-sm
```

### Icon Sizes
```
Primary:   h-4 w-4 (size-4) — 22x
Secondary: h-3.5 w-3.5 (size-3.5) — 6x
Large:     h-5 w-5, h-6 w-6 — layout/feature icons
```

---

## Interactive States

### Hover
- Cards/buttons: `hover:shadow-soft-md`, `hover:scale-105`, `hover:-translate-y-1`
- Text links: `hover:text-foreground`, `hover:underline`
- Backgrounds: `hover:bg-muted`

### Active
- `active:scale-95`, `active:duration-75`, `active:shadow-soft-sm`

### Focus
- Universal: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2`

### Disabled
- `disabled:pointer-events-none disabled:opacity-50`

### Selected
- `border-2 border-primary-500`, `bg-primary-50`, `shadow-soft-md`

---

## Animations

### Entry Animations
| Class                    | Effect | Duration |
|--------------------------|--------|----------|
| `animate-fade-in`        | Opacity 0→1 | 0.4s |
| `animate-scale-in`       | Scale 0.8→1 + fade | 0.3s |
| `animate-fade-up`        | TranslateY 30px→0 + fade | 0.6s |
| `animate-slide-in-left`  | TranslateX -100%→0 + fade | 0.3s |
| `animate-slide-in-right` | TranslateX 100%→0 + fade | 0.3s |
| `animate-bounce-once`    | Single bounce + scale | 0.4s |
| `animate-stagger-fade-in`| TranslateY 20px→0 + fade | 0.5s |

### Continuous Animations
| Class                    | Effect | Duration |
|--------------------------|--------|----------|
| `animate-pulse-soft`     | Opacity + scale pulse | 2s infinite |
| `animate-float`          | TranslateY 0→-8px→0 | 3s infinite |
| `animate-countdown-pulse`| Opacity + scale for timer | 1s |

### Staggering Pattern
```tsx
style={{ animationDelay: `${index * 50}ms` }}
```

### Reduced Motion
All animations respect `prefers-reduced-motion: reduce` — set to `animation: none !important`.

---

## Responsive Breakpoints

| Breakpoint | Width  | Primary Usage |
|------------|--------|---------------|
| `sm:`      | 640px  | Typography, padding scale-up |
| `md:`      | 768px  | Sidebar visibility, layout shifts |
| `lg:`      | 1024px | Section spacing, hero sizing |
| `xl:`      | 1280px | Hero headlines (rare) |

**Mobile-first approach.** Base styles target mobile, breakpoints enhance.

---

## Viewport & Mobile Rules

- **Maximum scale and user scalable are intentionally restricted** in the viewport meta tag to prevent unwanted zoom on mobile inputs — do NOT remove `maximumScale` or `userScalable` settings
- iOS safe area padding: `pb-safe`, `pb-safe-fallback`
- Overscroll prevention: `overscroll-behavior: none` on html/body
- Input zoom prevention: inputs forced to `font-size: 16px` on mobile Safari
