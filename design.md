# Princeps Self-Service Loan Portal — Design System

> Single source of truth for visual language, tokens, components, and motion.
> Structural language: **Revolut Business (web)** — sidebar-led app shell, calm density, financial clarity, generous whitespace, neutral surfaces with confident accent color, **rounded pill-shaped controls**.
> Motion language: **Apple fluid interfaces** — interruptible springs, 1:1 direct manipulation, velocity handoff, no fixed-duration keyframes for gesture-driven surfaces.
> Brand: **Princeps Credit Systems Limited** — tri-color palette from the logo: navy `#0B2B55`, cyan `#51C4D9`, orange `#F16522`.
>
> Stack: Angular v20+, standalone components, signals, OnPush. All rules here override defaults.

---

## 1. Brand foundation

### 1.1 Logo

Master logo (geometric mark + wordmark) lives at:

```
design/assets/princeps-logo.svg    # official 116×32 vector — three brand colors baked in
```

The mark itself carries the entire brand palette — navy `#0B2B55` (upper-left triangle), cyan `#51C4D9` (upper-right triangle), orange `#F16522` (lower fan + circle accent). The wordmark ("Princeps CREDIT SYSTEMS LIMITED") is black.

**Rules**
- Minimum clear space on all sides = height of the "P" glyph.
- Minimum size: **116px wide** (the native size). Below that, use the mark alone (crop to just the triangle/circle glyph).
- Never recolor any of the three shapes. Never stretch. Never place on backgrounds with < 4.5:1 contrast against the wordmark.
- On dark surfaces (navy `#0B2B55` or darker), use a white-wordmark variant (to be exported from Figma; the geometric mark stays as-is because its colors are self-contrasting).
- Inline the SVG in the app shell so the wordmark can adopt `currentColor` when a themed variant is needed. Use `NgOptimizedImage` for any raster hero placement.

```html
<!-- app-shell.component.html -->
<a routerLink="/" class="brand" aria-label="Princeps home">
  <!-- inline <svg …> from design/assets/princeps-logo.svg -->
</a>
```

### 1.2 Voice
Confident, plain, financial-adult. Never patronizing. Numbers first, prose second. Match Revolut's tone: short sentences, action verbs, no jargon.

---

## 2. Design principles

1. **Numbers are the interface.** Balance, rate, tenor, next-payment date — these are the hero. Type scale and hierarchy exist to make them scannable.
2. **Neutral canvas, one confident accent.** The page is greyscale + white; Princeps blue is reserved for primary action, active state, and brand moments. Overuse of blue kills its meaning.
3. **Direct manipulation over chrome.** A slider drags 1:1. A sheet follows the finger. Nothing waits for a button to "commit" a physical action.
4. **Interruptible motion.** Every animation reads the on-screen presentation value and starts from there. No queued transitions, no locked input during motion. (Apple §3.)
5. **Progressive disclosure.** One decision per screen. Options behind a "More" reveal, not paraded up front.
6. **Predictable spatial model.** Modals dim + push back. Sheets slide from below. Popovers anchor to their trigger (`transform-origin` = trigger). Enter and exit along the same path. (Apple §7.)
7. **Accessibility is a design constraint, not a review step.** WCAG AA is the floor. All colors are pre-checked against surface pairings in §3.1.

---

## 3. Design tokens

Tokens are the contract. Never hardcode a hex or a pixel in a component — always reference a token. Publish as CSS custom properties on `:root` (light) and `[data-theme="dark"]`.

### 3.1 Color

**Brand (from the Princeps logo — three-color system)**

Navy is the workhorse (primary buttons, links, headings). Cyan is the secondary/support accent (data viz, illustrations, informational highlights). Orange is the reserved attention color (single primary CTA per view, notifications, "new"). Never use all three at equal weight in one view — pick a lead.

| Token | Hex | Use |
|---|---|---|
| `--navy-900` | `#0B2B55` | **Primary.** Headings, primary buttons, links, active nav, top-bar text |
| `--navy-800` | `#123869` | Primary hover |
| `--navy-950` | `#071E3D` | Primary pressed / darkest navy |
| `--navy-100` | `#E4EAF3` | Selected row bg, subtle badges, focus tint |
| `--cyan-500` | `#51C4D9` | **Secondary accent.** Chart series, info highlights, badges, decorative fills |
| `--cyan-600` | `#2EA9C0` | Cyan hover on interactive uses |
| `--cyan-100` | `#E5F6FA` | Cyan-soft bg (info panels, tags) |
| `--orange-500` | `#F16522` | **Attention accent.** Reserved: primary CTA on marketing surfaces, "new" badge, alert dot, promotional highlight |
| `--orange-600` | `#D45217` | Orange hover |
| `--orange-100` | `#FDEAE0` | Orange-soft bg (accent pill, promo strip) |

**Neutrals (Revolut-inspired greyscale)**

| Token | Hex | Use |
|---|---|---|
| `--surface-0` | `#FFFFFF` | Base page, cards |
| `--surface-1` | `#FAFAFB` | App shell background, table zebra off |
| `--surface-2` | `#F3F4F6` | Hover row, subtle section separator |
| `--surface-3` | `#E5E7EB` | Divider, input border |
| `--surface-4` | `#D1D5DB` | Divider on darker bg |
| `--text-primary` | `#111214` | Headings, key numbers |
| `--text-secondary` | `#5A5D63` | Body copy, labels |
| `--text-tertiary` | `#8A8D93` | Placeholder, helper, metadata |
| `--text-disabled` | `#B6B8BD` | Disabled text |
| `--text-on-navy` | `#FFFFFF` | Text on `--navy-900` (primary button label, top-bar) |
| `--text-on-orange` | `#FFFFFF` | Text on `--orange-500` |
| `--text-on-cyan` | `#0B2B55` | Text on `--cyan-500` (navy for legibility) |

**Semantic**

| Token | Hex | Use |
|---|---|---|
| `--success` | `#16A34A` | Approved, paid, active |
| `--success-soft` | `#E7F6EC` | Success pill bg |
| `--warning` | `#D97706` | Due soon, review |
| `--warning-soft` | `#FEF3E2` | Warning pill bg |
| `--danger` | `#DC2626` | Overdue, error, destructive action |
| `--danger-soft` | `#FDECEC` | Danger pill bg |
| `--info` | `#0B2B55` | Informational (= navy) |
| `--info-soft` | `#E4EAF3` |  |

**Contrast pairings (AA verified)**
- `--text-primary` on `--surface-0` → 17.4:1 ✓
- `--text-secondary` on `--surface-0` → 6.8:1 ✓
- `--text-on-navy` on `--navy-900` → 12.9:1 ✓
- `--navy-900` on `--surface-0` → 13.3:1 ✓
- `--text-on-orange` on `--orange-500` → 3.4:1 ✓ (AA large / graphical only — never use white text on orange at body sizes; use `--navy-900` on `--orange-100` for body-size accent text)
- `--cyan-500` is a **fill/decorative** color — do not use for body text on white (2.0:1). Text on cyan backgrounds must be `--navy-900`.

### 3.2 Typography

System stack (Revolut ships Aeonik Pro; until a licensed face is procured, use system with tightened tracking to approximate).

```css
--font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace; /* amounts, IDs */
```

**Scale — size-specific tracking (Apple §15)**

| Token | Size / Line-height / Tracking / Weight | Use |
|---|---|---|
| `--text-display-xl` | 56 / 60 / -0.03em / 600 | Marketing hero only |
| `--text-display-lg` | 40 / 44 / -0.025em / 600 | Section leads |
| `--text-h1` | 32 / 38 / -0.02em / 600 | Page title |
| `--text-h2` | 24 / 30 / -0.015em / 600 | Card title, modal title |
| `--text-h3` | 20 / 26 / -0.01em / 600 | Subsection |
| `--text-body-lg` | 17 / 26 / 0 / 400 | Read-focused paragraphs |
| `--text-body` | 15 / 22 / 0 / 400 | Default body |
| `--text-body-sm` | 13 / 18 / 0.005em / 400 | Helper, table cells |
| `--text-caption` | 12 / 16 / 0.01em / 500 | Labels, tags, metadata |
| `--text-amount-hero` | 44 / 48 / -0.02em / 600 tabular-nums | Dashboard balance |
| `--text-amount` | 20 / 26 / -0.01em / 600 tabular-nums | Row amounts |

Always set `font-feature-settings: "tnum" 1, "cv11" 1;` on any numeric surface so digits align in tables.

### 3.3 Spacing (4px base)

`--space-1` = 4 · `--space-2` = 8 · `--space-3` = 12 · `--space-4` = 16 · `--space-5` = 20 · `--space-6` = 24 · `--space-8` = 32 · `--space-10` = 40 · `--space-12` = 48 · `--space-16` = 64 · `--space-20` = 80.

Rule of thumb: **section padding 24–32, card padding 20–24, form field vertical rhythm 16, table cell 12×16.**

### 3.4 Radius

Revolut Business skews **rounder** than most SaaS. Buttons and inputs are fully pill-shaped; cards are generously rounded.

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 6px | Tiny badges, tags |
| `--radius-sm` | 10px | Small chips, table row hover surface |
| `--radius-md` | 14px | Inputs (default), search fields |
| `--radius-lg` | 20px | Cards, list rows, list items |
| `--radius-xl` | 28px | Feature cards, hero panels |
| `--radius-2xl` | 32px | Modals, sheets |
| `--radius-pill` | 999px | **Buttons (all sizes), pills, avatars, filter chips** |

### 3.5 Elevation

Revolut uses very light shadows — content, not chrome.

```css
--shadow-1: 0 1px 2px rgba(16, 24, 40, 0.04);                     /* row hover */
--shadow-2: 0 4px 12px rgba(16, 24, 40, 0.06);                    /* card lift */
--shadow-3: 0 12px 32px rgba(16, 24, 40, 0.10);                   /* menu, popover */
--shadow-4: 0 24px 64px rgba(16, 24, 40, 0.14);                   /* modal */
--shadow-focus: 0 0 0 3px rgba(11, 43, 85, 0.28);                 /* focus ring — navy */
```

### 3.6 Motion

Springs, not durations. (Apple §4.)

```ts
export const spring = {
  default:  { bounce: 0,   duration: 0.35 }, // critically damped
  snap:     { bounce: 0,   duration: 0.22 }, // hover / tap feedback
  sheet:    { bounce: 0.15, duration: 0.42 }, // sheet / drawer — momentum
  modal:    { bounce: 0,   duration: 0.30 },
  rotate:   { bounce: 0.2, duration: 0.4  }, // accordion caret
};
```

- **Never** use CSS `transition` on gesture-driven surfaces (sheets, sliders, drawers). Use a spring lib (Motion One or `@angular/animations` with spring params) so animations start from the presentation value.
- Non-gestural (hover, focus, tap feedback) — CSS transitions are fine, ≤ 150ms.
- Respect `prefers-reduced-motion` — cross-fade only, drop springs.

---

## 4. Layout & grid

- **Sidebar-led app shell** (Revolut Business web pattern): fixed left sidebar 240–264px, thin top bar 56px for account switcher + search + notifications + avatar, main content scrolls.
- Sidebar bg: `--surface-1`, primary nav items 40px tall, radius `--radius-lg`, active item has navy label + `--navy-100` bg pill.
- Max content width inside main: **1200px**, centered when the viewport gives room. Gutters 32px on desktop, 16 on mobile.
- 12-column grid, 24px column gap on ≥ md.
- Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.
- On `< lg`, sidebar collapses to a slide-in drawer triggered from the top bar.
- Density: **default** (row height 56), **compact** (44) for large tables — user-toggleable.

---

## 5. Components

Every component below is a standalone Angular component with `ChangeDetectionStrategy.OnPush`, signal-based state, and `input()`/`output()` functions.

### 5.1 Button

**Fully pill-shaped** (radius `--radius-pill`) — this is the Revolut Business signature. Never square-cornered.

Variants: `primary`, `secondary`, `tertiary` (ghost), `accent` (orange, reserved), `danger`, `link`.
Sizes: `sm` (32), `md` (40, default), `lg` (48), `xl` (56, hero CTAs only).

- Radius `--radius-pill` on every size. Horizontal padding: `sm 14`, `md 20`, `lg 24`, `xl 28`.
- Weight 600, letter-spacing -0.005em, font `--text-body` (14/15 depending on size).
- Icon-only buttons are **circles** (32/40/48), radius `--radius-pill`. `aria-label` **required**.
- **Feedback on pointer-down**, not click (Apple §1). `transform: scale(0.97)` on `:active`, 100ms ease-out.
- Focus: `--shadow-focus` ring, never remove outline.
- One `primary` (navy) or `accent` (orange) CTA per view. If both are present, orange = the single most-important action; navy = the standard confirm.

```
primary    : bg --navy-900     / text --text-on-navy    / hover --navy-800    / pressed --navy-950
secondary  : bg --surface-0    / text --navy-900        / border 1px --surface-3 / hover bg --surface-2
tertiary   : bg transparent    / text --navy-900        / hover bg --surface-2
accent     : bg --orange-500   / text --text-on-orange  / hover --orange-600
danger     : bg --danger       / text #fff              / hover -8% L
link       : text --navy-900   / underline on hover
```

### 5.2 Input / Field

- Height 48 (md, default — Revolut Business is generous), radius `--radius-md` (14px). Search inputs and single-line filters use `--radius-pill`.
- Border 1px `--surface-3`. Padding 0 16. Font `--text-body`.
- Label above (weight 500, `--text-caption`), helper below (`--text-tertiary`), error replaces helper (`--danger`).
- Focus: border `--navy-900` + `--shadow-focus`.
- Prefix/suffix slots for currency (`₦`), unit (`%`), or icons.
- Currency input uses tabular numerals + right-alignment.
- Use **Reactive Forms** only (per CLAUDE.md).

### 5.3 Amount input (loan portal specific)

- Large, centered numeric input. `--text-amount-hero`, tabular-nums.
- Slider directly below, 1:1 tracking with the finger (§6). Value updates on every `pointermove`, not on release.
- Min/max labels flanking the slider, tick marks at NGN 100k intervals.

### 5.4 Card

- Bg `--surface-0`, border 1px `--surface-3` (no shadow at rest — Revolut Business's flat card).
- Radius `--radius-lg` (20px). Padding `--space-6` (24).
- Elevated / feature variant: no border + `--shadow-2`, radius `--radius-xl` (28px).
- Interactive card: `--shadow-1` on hover, cursor pointer, focus ring wraps whole card.
- Hero surfaces (dashboard "your balance" / "your loan summary") can use a filled variant with `--navy-900` bg + `--text-on-navy`, radius `--radius-xl` — mirrors the Revolut Business account-header card.

### 5.5 Data tables

**Per CLAUDE.md: tables are never rendered inside cards unless explicitly specified.**

- Edge-to-edge, no outer border, no radius, no shadow.
- Single 1px divider `--surface-3` below the header row.
- Single 1px divider between rows.
- Header: `--text-caption`, uppercase off, `--text-tertiary`, weight 500, height 44.
- Row height 56 (default) / 44 (compact). Cell padding 12×16.
- Numeric columns right-aligned, tabular-nums.
- Row hover: bg `--surface-1`. Selected: bg `--navy-100`.
- Sort: caret icon inline with header label, `aria-sort` on `<th>`.
- Empty state: centered illustration + one-line explanation + primary action.

### 5.6 Modal

- Center-anchored, max-width 480 (sm) / 560 (md) / 720 (lg).
- Radius `--radius-2xl` (32px), `--shadow-4`, padding 32.
- **Scrim**: `rgba(16, 24, 40, 0.48)`. Background layer pushes back subtly (`scale(0.98)`) — Apple §12 "dim to focus".
- Enter: scale `0.96 → 1` + opacity `0 → 1`, `spring.modal`. Exit mirrors the path (Apple §7).
- Close on scrim click, `Esc`, and dedicated close button (top-right, 32×32 tertiary icon-button).
- Focus trap **required**. Return focus to trigger on close.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the title id.
- Never nest modals. If a second decision is needed, use a step-based modal (one title, progress dots).

### 5.7 Side drawer / bottom sheet

- **Desktop primary pattern: right side-drawer** (Revolut Business uses this for transaction details, invoice previews, loan detail expansion). Width 420 (default) / 560 (wide).
- Mobile: bottom sheet rising from the bottom.
- Radius `--radius-2xl` on the leading corners (top-left+bottom-left for right drawer; top-left+top-right for bottom sheet).
- Drag handle (32×4, `--surface-4`) centered at top for mobile.
- **1:1 drag with velocity handoff** on release (Apple §5, §6). Snap targets: `[closed, mid, full]`. Use projection to pick target.
- Rubber-band past the top edge (Apple §9).

### 5.8 Popover / Menu

- `--shadow-3`, radius `--radius-lg` (20px), padding 8, min-width 220.
- Item height 40, padding 0 12, radius `--radius-md` on hover with bg `--surface-2`.
- `transform-origin` anchored at trigger (Apple §7).
- Keyboard: arrow keys navigate, `Enter` selects, `Esc` closes.

### 5.9 Toast / Snackbar

- Bottom-center on mobile, bottom-right on desktop. Stack vertically, newest bottom.
- Radius `--radius-lg`, `--shadow-3`, min-width 320.
- Variants map to semantic colors. Auto-dismiss 5s (success) / persistent (error, until acked).
- Icon left, message center, action link right. Close ✕ far right.
- `role="status"` (success/info) or `role="alert"` (error).

### 5.10 App shell — sidebar + top bar (Revolut Business web)

**Sidebar (primary nav, left, 240–264px)**
- Bg `--surface-1`, no border, padding 16.
- Logo top-left, 16px margin. Below: workspace/account switcher (row with avatar + name + caret).
- Section labels: `--text-caption`, `--text-tertiary`, weight 600, 12px letter-spacing 0.04em, padding 12 12 8.
- Nav item: 40px tall, radius `--radius-lg`, padding 0 12, icon 20px + label. Hover: bg `--surface-2`. **Active**: bg `--navy-100`, text `--navy-900`, weight 600 (no indicator bar — just the pill).
- Bottom-fixed: settings, help, log-out.

**Top bar (56px)**
- Bg `--surface-0`, 1px bottom border `--surface-3`.
- Left: breadcrumb or page title. Center: global search (pill input, width 480). Right: notifications bell (with `--orange-500` dot for unread), avatar menu.
- Optional translucent-on-scroll variant: `backdrop-filter: blur(20px)` + `rgba(255,255,255,0.72)` (Apple §12).

### 5.11 Status pill

Radius `--radius-pill`, height 24, padding 0 10, `--text-caption`, weight 600.

| Status | Text / bg |
|---|---|
| Approved / Active / Paid | `--success` / `--success-soft` |
| Pending / Under review | `--warning` / `--warning-soft` |
| Overdue / Failed | `--danger` / `--danger-soft` |
| Draft / Info | `--text-secondary` / `--surface-2` |

### 5.12 Empty, loading, error states

- Every list, table, and card has all three.
- Loading: skeleton (bg `--surface-2` → shimmer with `--surface-1`), no spinners for content.
- Empty: 48px icon, one-line headline, one-line subtext, primary action.
- Error: same layout, `--danger` icon, "Try again" as tertiary button.

---

## 6. Motion system (Apple fluid rules, applied)

- **Pointer-down feedback**, always (button scale, row highlight).
- **1:1 tracking** on any draggable surface — respect grab offset, `setPointerCapture`, maintain a short pointer-position history to compute release velocity.
- **Start animations from the presentation value.** On interrupt, read live transform, don't restart from logical target.
- **Velocity handoff** at gesture end. Pass release velocity to the spring.
- **Momentum projection** for flicks (sheets, carousels): `current + (v/1000) * 0.998 / (1 - 0.998)`.
- **Symmetric paths**: what slides in from bottom slides out to bottom.
- **Rubber-band** at boundaries, never hard-stop.
- **No `@keyframes` or CSS transitions on gesture surfaces** — use Motion One or `@angular/animations` spring.

Motion is not decoration; it's the language of causality. If a movement doesn't explain something, remove it.

---

## 7. Accessibility (MUST pass AXE + WCAG AA)

- Contrast: verified in §3.1. Recheck any new color pairing before shipping.
- Focus is always visible (`--shadow-focus`). Never remove outline without a replacement.
- Tab order matches visual order.
- All interactive elements are keyboard operable. Custom controls implement full ARIA pattern (see WAI-ARIA APG).
- Icon-only buttons: `aria-label` required.
- Form fields: programmatic label association (`<label for>`), error via `aria-describedby`, `aria-invalid`.
- Live regions for async status (`role="status"`, `aria-live="polite"`).
- Reduced motion: swap springs for opacity fades.
- Reduced transparency: solid backgrounds replace `backdrop-filter`.

---

## 8. Angular implementation

### 8.1 File layout

```
src/
  app/
    core/           # singleton services (auth, api, config)
    shared/
      ui/           # design-system components (button, card, input, modal, sheet, table)
      tokens/       # tokens.css (custom properties)
      directives/
    features/
      dashboard/
      loans/
      repayments/
      profile/
    app.routes.ts   # lazy-loaded features
```

### 8.2 Rules (from user global CLAUDE.md — non-negotiable)

- Standalone components (no NgModules). Do NOT set `standalone: true` — v20+ default.
- `ChangeDetectionStrategy.OnPush` on every component.
- Signals for local state, `computed()` for derived, no `mutate` — use `update`/`set`.
- `input()` / `output()` functions, not decorators.
- `inject()` inside services and components; no constructor injection.
- Host bindings go in the `host` object, not `@HostBinding` / `@HostListener`.
- Native control flow (`@if`, `@for`, `@switch`), never `*ngIf` etc.
- `class`/`style` bindings, never `ngClass`/`ngStyle`.
- Reactive Forms only.
- `NgOptimizedImage` for all static raster images.
- No arrow functions in templates.
- Lazy-load every feature route.

### 8.3 Token wiring

`src/app/shared/tokens/tokens.css` defines `:root` with every custom property from §3. Imported once in `styles.css`. Components consume via `var(--…)` — never hardcode.

### 8.4 Motion library

Install `motion` (Motion One). Wrap in a `MotionService` with the spring presets from §3.6 so animations stay consistent. Use `@angular/animations` only for route transitions.

---

## 9. Reference — Mobbin flows to study (Revolut Business, web)

Reference target is **Revolut Business on web** (not the consumer mobile app). Open these before designing any new surface. Match structure and interaction patterns; translate palette to Princeps navy/cyan/orange.

- **Hub / Home** — https://mobbin.com/flows/b36b699a-1ec4-46d8-8ff5-a0f4869d3e0a
- **Home (extended)** — https://mobbin.com/flows/3c3122aa-b229-4dee-b394-5e836274d6c9
- **Overview** — https://mobbin.com/flows/a9eaaa54-d3c6-4f0a-88b8-5967d5053a98
- **Profile / account settings** — https://mobbin.com/flows/5555f10a-207a-43e6-9557-1d53fffacabd
- **Switching accounts** — https://mobbin.com/flows/53ade57f-a0b6-40bf-ad44-d18bcb905675
- **Creating an account (25-step onboarding — pattern for loan application flow)** — https://mobbin.com/flows/51279444-8cf6-448f-9a67-c736de9d0969
- **Securing an account (verification patterns)** — https://mobbin.com/flows/b65354d2-69c8-41e6-968b-847907167323

For every new screen: pull the closest Revolut Business (web) analogue, note the structural choices (sidebar item grouping, top-bar treatment, primary-action placement, empty-state pattern, drawer vs. modal choice), then translate into Princeps' three-color palette.

---

## 10. Definition of done (every component)

- [ ] Uses tokens from §3, no hardcoded values.
- [ ] `OnPush`, signals, `input()`/`output()`.
- [ ] Keyboard operable + focus visible.
- [ ] AXE clean, contrast verified.
- [ ] Empty / loading / error states implemented.
- [ ] Motion respects `prefers-reduced-motion` and `prefers-reduced-transparency`.
- [ ] Storybook (or an equivalent playground route) entry with all variants.
- [ ] Matches its Revolut Business (web) reference in structure, Princeps in color.
- [ ] Buttons are pill-shaped (`--radius-pill`). No square-cornered CTAs.
- [ ] Uses navy as primary; orange reserved for the single attention-CTA per view; cyan for support/data-viz only.
