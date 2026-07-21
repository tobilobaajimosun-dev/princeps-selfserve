# Princeps Self-Service Portal — Design System

> The working design system for `princeps-selfserve`. Governs every screen and component built in this repo.
>
> **Reads on top of:** [`design.md`](./design.md) — the brand foundation (logo, tri-color palette, initial token set, base component sketches). This document supersedes it wherever they conflict; anything not covered here defers to `design.md`.
>
> **References:**
> 1. `design.md` — brand identity (source of truth for colors, logo, base tokens).
> 2. **Apple HIG** (via the `apple-design` skill) — interaction and layout philosophy: clarity, deference, depth. Restraint over decoration. Content-first hierarchy. Interruptible, physics-based motion. **We borrow the discipline, not the visual skin.**
> 3. **Revolut Business** (via Mobbin) — visual tone: confident, high-contrast, bold display type, minimal chrome, card-based data. Serious fintech credibility.

---

## 1. Design principles

We are optimizing for **clarity under stress** — a customer applying for a loan on a mid-tier Android phone with a bad connection needs to know exactly what they've agreed to, how much they'll pay, and what step they're on, without ever having to re-read anything.

We reject: decorative motion, illustrations that dilute financial information, dense forms, gradient chrome, ambiguity in verification states, and any design that only works in English on a 390pt viewport.

Three rules that decide close calls:
1. **Numbers are the interface.** The single largest, most confident thing on any screen showing money is the money.
2. **One decision per screen.** Wizard steps ask for one thing. Complex choices are broken up, not compressed.
3. **State is loud, never quiet.** OTP sent, BVN verified, upload failed — the user should know without having to look for the answer.

---

## 2. Product constraints (design for these, not around them)

- **Mobile-first, PWA.** Design at **360×740** first (a Tecno/Infinix baseline for Nigeria), scale up. Desktop is a secondary target.
- **Mid/low-tier Android.** Avoid GPU-hostile effects (heavy `backdrop-filter`, large box-shadows on scrolling surfaces, complex CSS filters). Ship SVG icons under 4 KB; no per-icon PNG sprites. Bundle-size and paint-cost are design constraints.
- **Patchy connectivity.** Every network-touching state has a distinct **idle → loading → success/failure** presentation. Long-running requests (BVN check, offer computation) always show progress with an explicit message, never a bare spinner.
- **Wide literacy and age range.** Prefer plain language, short sentences, and iconography that supports (never replaces) text. Assume the user has not seen a "stepper" or "chip filter" before — components must be self-evident.
- **Four languages: English, Yoruba, Igbo, Hausa.** All UI text is translated. See §5 for typographic rules that keep the layout intact across languages.
- **Wizard-shaped product.** Employment type → salary channel → eligibility result → product selection → full terms → BVN → documents. Every screen is a step. See §10.1 for the stepper.
- **Money is the recurring hero.** Amounts, interest rates, tenors, repayment schedules appear on nearly every screen. See §9 for the canonical money-display pattern — this is the single most reused primitive.
- **Trust is fragile.** Verification states around money and identity (OTP, BVN, uploads) are the most common abandon points. See §10.6 for the verification badge, §10.7 for upload status.

---

## 3. Foundations — tokens

All tokens live in `src/styles/tokens.css` (already scaffolded). Never hardcode a hex or a pixel in a component. Base brand tokens (navy / cyan / orange, neutrals, spacing, radius) are in `design.md §3` and are already in `tokens.css` — this section adds product-specific tokens and overrides.

### 3.1 Color — semantic layer (WCAG AA verified)

Brand tokens are in `tokens.css`. The semantic layer below is what components consume — never reach for a brand token directly in a feature component.

| Semantic token | Value | Verified pairing | Use |
|---|---|---|---|
| `--action-primary` | `var(--navy-900)` #0B2B55 | text `--text-on-navy` → 12.9:1 | Primary CTA background |
| `--action-primary-hover` | `var(--navy-800)` #123869 | 11.0:1 | Primary CTA hover |
| `--action-primary-pressed` | `var(--navy-950)` #071E3D | 14.9:1 | Primary CTA pressed |
| `--action-accent` | `var(--orange-500)` #F16522 | text on it → **use `--navy-900` at body sizes**, white only at ≥ 18pt / 14pt bold | Reserved attention CTA (one per view max) |
| `--focus-ring` | rgba(11,43,85,0.32) | — | Focus outline (2 → 3px) |
| `--status-verified` | `var(--success)` #16A34A | on `--success-soft` → 4.7:1 | Verified, approved, paid |
| `--status-verified-soft` | `var(--success-soft)` #E7F6EC | — | Verified pill background |
| `--status-pending` | #B45309 (darkened warning for AA) | on `--warning-soft` → 5.2:1 | Pending, in-review, waiting on OTP |
| `--status-pending-soft` | `var(--warning-soft)` #FEF3E2 | — | Pending pill background |
| `--status-failed` | `var(--danger)` #DC2626 | on `--danger-soft` → 5.9:1 | Failed OTP, rejected doc, error |
| `--status-failed-soft` | `var(--danger-soft)` #FDECEC | — | Failed pill background |
| `--status-info` | `var(--navy-900)` | on `--navy-100` → 12.4:1 | Neutral status ("Uploaded", "Processing") |
| `--money-primary` | `var(--navy-900)` | on white → 13.3:1 | Amounts, rates, tenors |
| `--money-muted` | `var(--text-secondary)` #5A5D63 | on white → 6.8:1 | Struck-through, "was" amounts |

**Rules**
- No color-only signalling. Every status color is paired with an icon and a word.
- The **orange accent** is scarce. In a wizard step, use navy for the primary CTA. Orange is reserved for the *final* commit action ("Accept & Continue") on the terms/offer screens, or for a "New offer" strip — never for the "Next" button on step 2 of 8.
- Cyan is decorative (illustrations, empty-state accents, progress-fill background). Cyan is **not** a text or button color.

### 3.2 Type — scale that survives four languages

Font stack (already loaded in `index.html`):
```
--font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
```

Inter covers Latin Extended (all diacritics required by Yorùbá `ẹ ọ ị ụ ń`, Igbo `ị ọ ụ ṅ`, Hausa `ɓ ɗ ƙ 'y`). If Inter fails to load on a slow connection, the system fallback keeps the layout intact.

**Scale** (mobile-first; sizes scale up on ≥ 768):

| Token | Mobile / Desktop | LH | Tracking | Weight | Use |
|---|---|---|---|---|---|
| `--text-display` | 32 / 40 | 1.15 | -0.02em | 700 | One-per-screen headline (offer amount, "You're eligible for") |
| `--text-h1` | 24 / 28 | 1.2 | -0.015em | 700 | Step title ("Employment details") |
| `--text-h2` | 20 / 22 | 1.25 | -0.01em | 600 | Card title, modal title |
| `--text-h3` | 18 / 18 | 1.3 | -0.005em | 600 | Sub-section |
| `--text-body-lg` | 17 / 17 | 1.5 | 0 | 400 | Read-focused paragraphs, terms |
| `--text-body` | 15 / 15 | 1.5 | 0 | 400 | Default body, form fields |
| `--text-body-sm` | 13 / 13 | 1.45 | 0.005em | 400 | Helpers, metadata |
| `--text-label` | 13 / 13 | 1.3 | 0.02em | 600 | Field labels (small-caps effect via tracking) |
| `--text-caption` | 12 / 12 | 1.4 | 0.01em | 500 | Legal, disclaimers, timestamps |
| `--text-amount-hero` | 40 / 56 | 1.05 | -0.025em | 700 tnum | Offer/loan amount hero |
| `--text-amount-lg` | 24 / 28 | 1.2 | -0.015em | 600 tnum | Card-level amounts (monthly repayment) |
| `--text-amount` | 17 / 17 | 1.3 | -0.005em | 600 tnum | Inline amounts (schedule rows, tables) |
| `--text-otp` | 28 / 32 | 1 | 0.05em | 600 tnum | Single OTP digit |

All numeric text sets `font-feature-settings: 'tnum' 1;` so digits align.

**Multi-language rules — non-negotiable**
- **Never fix container width to a translated string.** Buttons, chips, and tabs must size to their content and wrap if forced. `min-width` only, never `width`.
- **Line-height ≥ 1.5 on body-size text**, ≥ 1.3 on headings. Yoruba diacritics need vertical room; tightening below this clips them on many Android renderers.
- **Assume ~30% text expansion** vs. English. If a card looks tight at English length, translate it to Yoruba mentally — if it wraps to 3 lines it will break the layout.
- **Numbers are Arabic in all four languages** — do not localize digits.
- **Currency symbol `₦` is always inline with the amount**, never a separate absolutely-positioned element (breaks with RTL/expansion).
- **`overflow-wrap: anywhere` on any user-supplied string** (names, employer names). BVNs and account numbers use `word-break: normal` so they don't split mid-digit.
- Test every screen with the **longest of the four translations** as the layout baseline. See §12 for a suggested `pseudo-loc.ts` helper.

### 3.3 Spacing — 4px base

`--space-1..20` already in `tokens.css`. Component-level rules:

- **Section padding on mobile is 20**, not 24 — screens are 360-wide baseline; 24 gutters feel airless with `body 15/22`.
- **Section padding on ≥ md** is 32.
- **Vertical rhythm between form fields: 16** (label→input) + **20** (field→field). Wider spacing on mobile than desktop.
- **Sticky bottom action bar** on mobile always adds `padding-bottom: env(safe-area-inset-bottom)`.

### 3.4 Radius

Overrides `design.md §3.4` for two components:

- **Cards on mobile**: `--radius-lg` (20) is right. Do not go higher — 28+ eats corner content on 360-wide screens.
- **Bottom sheets**: 20px top-left + top-right only, not `--radius-2xl`.

### 3.5 Elevation

Mobile-cost-conscious:

- No shadow on cards at rest. Border 1px `--surface-3` instead.
- `--shadow-3` on floating menus / bottom-sheet handle bar only.
- **Never animate `box-shadow`** on mobile scroll — animate opacity of a positioned pseudo-element instead.

---

## 4. Motion — Apple-fluid, applied to a wizard

Motion here is the language of causality between wizard steps. It answers *"what just happened?"* — never *"look at this."*

### 4.1 Step-to-step transitions

| Direction | Motion |
|---|---|
| **Forward** (Next) | Outgoing step slides left `translateX(0 → -8%)` + fades to 0; incoming slides in from `translateX(8% → 0)` + fades to 1. **Spring**: bounce 0, duration 0.28s. Never durations > 350ms — the wizard is 8+ steps. |
| **Backward** (Back) | Mirror: outgoing slides right, incoming slides in from left. Same spring. |
| **Verified / success moment** | Amount card scales `0.98 → 1.0` on mount + status badge fades in 100ms after. No confetti. |
| **Error state** | 3px horizontal shake (once, 180ms) + haptic on iOS PWA if permitted. Never loop. |

### 4.2 Rules

- **Springs, not fixed durations**, for anything the user can interrupt (bottom sheet, drawer, slider). Use `@angular/animations` with spring params or a small utility over the Web Animations API.
- **Progress bar animates 1:1 with step advance** — no lag, no bounce.
- **Never lock the UI during a transition.** Back button must be tappable mid-slide.
- **Reduced motion** replaces every slide with a 120ms opacity cross-fade. Progress bar snaps rather than animates.
- **On mid-tier Android, do not stack blur + transform + opacity** on the same layer during a transition — animate transform + opacity only.

---

## 5. Mobile-first responsive rules

Design at **360px** first, then **≥ 768** as a widened variant, then **≥ 1024** as a genuine desktop layout with the sidebar shell from `design.md §5.10`.

- **Touch targets: 48×48 minimum** (Material's floor; Apple's 44pt is too small for the tap accuracy we see on shared/older phones). Icon-only buttons are 44×44 *visually* but wrapped in a 48×48 hit area via padding.
- **Primary action anchored to bottom of viewport** on every wizard step. Full-width, sticky, `padding-bottom: env(safe-area-inset-bottom) + 12px`. Above it, a 12px `linear-gradient` fade from `--surface-0` alpha 0 → 1 so content doesn't collide.
- **Never show more than one primary action** per screen. Secondary actions are text buttons above or beside the primary; tertiary go in an overflow menu.
- **Bottom sheets over modals on mobile.** Modals reserved for confirmations / destructive intent.
- **Sticky headers are 56 tall**, contain: back arrow (44×44 hit), step title (truncate with ellipsis, one line), and either the progress dot count or a language toggle. No search on wizard pages.
- **Form fields are 48 tall on mobile**, `--radius-md`, 16 horizontal padding. Match the button height.
- **Font size 15/22 minimum on body** on mobile. Never 13/14 body — legibility floor for the target audience.
- **Do not use hover states as the only affordance.** A hover-reveal is invisible on touch. Everything must be visible in a resting state.
- **Skeletons on mobile** are single-color (`--surface-2`) with a slow `opacity: 0.6 ↔ 1` pulse (2s). No shimmer sweep — too GPU-costly.
- **Images and illustrations** are ≤ 40 KB, always with an intrinsic aspect ratio via `width`/`height` attrs to prevent layout shift.

---

## 6. Accessibility baseline

Must-pass, every component:

- **Contrast**: text ≥ 4.5:1, large text (≥ 18pt / 14pt bold) ≥ 3:1, non-text UI (borders, icons that convey meaning) ≥ 3:1. Verified pairings in §3.1.
- **Focus**: 3px `--focus-ring` outline, offset 2px. Never `outline: none` without a replacement. Focus follows a logical top-to-bottom order in every wizard step.
- **Touch target**: 48×48 (see §5).
- **Labels**: every form field has a programmatically associated `<label>`. Placeholder is *never* the only label.
- **Errors**: `aria-invalid="true"` + `aria-describedby` pointing at the message. Error text starts with what's wrong (`"BVN must be 11 digits"`), not `"Error:"`.
- **Live regions**: `role="status"` for OTP-sent / verifying banners, `role="alert"` for validation failures on submit.
- **Screen-reader money**: amounts render both a visual `₦100,000` and an SR-only expansion (`aria-label="One hundred thousand naira"` computed at runtime by an i18n number helper). Never let a screen reader say "N one zero zero comma zero zero zero".
- **Semantics**: wizard stepper uses `<ol>` + `aria-current="step"` on the active item.
- **Motion**: `prefers-reduced-motion` respected everywhere per §4.
- **Language**: `<html lang>` updates when the user switches; every wizard route sets it via the language service.

---

## 7. Trust primitives

Trust is the outcome of §3–6 applied consistently. Concrete rules that make it feel authoritative:

- **Amounts are never grey.** `--money-primary` on white, weight 600/700. A greyed amount reads as unavailable — reserve `--money-muted` strictly for struck-through / historic values.
- **Amounts don't animate on load** other than a subtle fade-in from opacity 0. No count-up animations — they read as marketing, not banking.
- **Verification success is explicit** (icon + word + colored pill) and shown next to the value it confirms, not in a toast that disappears.
- **Failure is actionable.** Every error state names one concrete next action ("Resend code", "Try a different document") within the same screen. Never a bare "Something went wrong."
- **Legal/binding actions confirm the amount inline in the button label** where feasible: "Accept ₦250,000 offer" beats "Continue".
- **Timestamps are relative for events ≤ 24h** ("2 min ago") and absolute after that (`21 Jul, 2:34pm`). Never mix.

---

## 8. The money-display pattern (most-reused primitive)

Every screen showing money uses one of three sizes of the same primitive. Live at `shared/ui/money/`.

**Anatomy**
```
[currency prefix] [integer]  .[fraction]    [tenor unit]
     ₦             250,000     .00           / month
   navy-800     money-primary  text-tertiary  text-secondary
   1em          hero size      0.5em          0.4em
```

**Three sizes**

| Variant | Class | Font | Use |
|---|---|---|---|
| `money-hero` | `.money.money--hero` | `--text-amount-hero`, weight 700 | Eligibility result, offer accept screen, single per screen |
| `money-lg` | `.money.money--lg` | `--text-amount-lg`, weight 600 | Card row (monthly repayment on offer card) |
| `money` | `.money` | `--text-amount`, weight 600 | Inline, repayment schedule rows, tables |

**Rules**
- Always `font-variant-numeric: tabular-nums;` so digits align across rows.
- Currency symbol is inline, always. Never absolutely positioned.
- Fraction is dimmed (`--text-tertiary`) and 0.5–0.7× the integer size. Never bold.
- If the fraction is `.00`, hide it entirely by default; show it only when at least one row on the screen has non-zero cents.
- Tenor/unit ("/ month", "% p.a.") is `--text-secondary`, 0.4× hero size, weight 500. Leading space is a non-breaking space.
- Announce the full amount to screen readers via `aria-label`, computed with `Intl.NumberFormat(locale, { style: 'currency', currency: 'NGN' })` piped through a localized-words helper for the four languages.

Interest rate and tenor use the same primitive:
- Rate: `24%` styled as money-lg, with `p.a.` in the unit slot.
- Tenor: `12 months` styled as money-lg, `months` in the unit slot.

The **offer card triplet** (amount + rate + tenor + monthly) is a fixed grid in that order — the ordering is itself part of the pattern, don't reshuffle per surface.

---

## 9. Component inventory (product-specific)

Each is a standalone Angular component under `shared/ui/`, `OnPush`, signals, `input()` / `output()`. Base primitives (button, input, card, modal) already sketched in `design.md §5`; this section is only the loan-specific set.

### 9.1 Stepper / progress

**Anatomy**: horizontal bar 4px tall + numeric label ("Step 3 of 8") + optional step title.

- Bar: track `--surface-2`, fill `--action-primary`, radius pill.
- Fill animates width 1:1 with step change, 220ms ease-out. Reduced motion → snap.
- On steps > 5, the numeric label is *always* visible; users lose the mental model past ~5 steps.
- Mounted at the top of every wizard step, immediately below the sticky 56 header.
- Semantics: `<ol role="list" aria-label="Application progress">` with `aria-current="step"` on active. Visual bar is decorative and `aria-hidden`.
- **Never allow skipping ahead** by tapping a future step; the bar is not a navigator.

### 9.2 OTP input

6 boxes for BVN OTP, 4–6 for phone OTP.

- Each cell: 48×56, `--radius-md`, border 1px `--surface-3`, `--text-otp`.
- Focus cell: border `--action-primary` + `--focus-ring`. All prior filled cells are `--surface-2` background.
- **Auto-advance** on digit entry; **auto-back** on backspace in empty cell.
- Paste of a full code fills all cells at once (single event, no per-cell paste flashes).
- Numeric keyboard on mobile: `inputmode="numeric"`, `autocomplete="one-time-code"`, `pattern="\d*"`.
- Below the cells: a right-aligned `Resend code (00:30)` timer. Countdown uses `role="timer"` with `aria-live="off"` (avoid noise).
- Error: cells go `border --danger`, brief 3px shake once, message below in `--danger` starting with what's wrong.
- Success: cells go `border --success` for 200ms, then the screen transitions.

### 9.3 Employment-type selector cards

Choice of {salaried public sector, salaried private, self-employed, …}. Radio-cards, not a select.

- Full-width card, 72 tall (mobile), `--radius-lg`, border 1px `--surface-3`, padding 16.
- Icon left (24×24, `--surface-2` bg circle 40×40), title `--text-h3`, subtitle `--text-body-sm --text-secondary`.
- **Selected state**: border 2px `--action-primary`, background `--navy-100`, radio dot at right becomes filled navy. Border-width increase happens with no layout shift (use inset `box-shadow` for the extra 1px instead of adding a real border).
- Stacked vertically, 12 gap. On ≥ md, can be a 2-column grid.
- `role="radio"` on each, `role="radiogroup"` on the parent, arrow-key navigation.

### 9.4 Salary-channel branching input

The user's salary channel drives eligibility rules — this is the branching point in the wizard. Present as a **select-then-reveal** pattern.

- Primary control: a "Salary channel" picker (bottom sheet on mobile, select on desktop) listing banks / agencies / employers.
- On selection, a dependent panel appears **in place** (not a new step) with the fields required for that channel (staff ID, bank account, employer code).
- Reveal motion: slide-down + fade, 220ms, spring bounce 0. Never let the reveal push the primary CTA off-screen — scroll it into view once expanded.
- If the user changes the channel, the dependent panel clears with a confirm ("This will clear your entries") only if they've typed anything; otherwise silent.

### 9.5 Eligibility / offer card

The most important card in the product. Appears on the "you're eligible for" screen and again on product-selection.

**Anatomy** (mobile, 360-wide):
```
┌─────────────────────────────────────────┐
│  Personal loan · 12 months              │  ← product name + tenor pill
│                                          │
│  ₦250,000.00                             │  ← money-hero
│  ₦22,450 / month                         │  ← money-lg with unit
│                                          │
│  Interest rate    24% p.a.               │  ← key/value row
│  Total payable    ₦269,400.00            │  ← key/value row
│  First payment    15 Aug 2026            │  ← key/value row
│                                          │
│  [ Accept ₦250,000 offer  →           ]  ← primary (accent orange, only here)
│  See full terms                          │  ← link-style secondary
└─────────────────────────────────────────┘
```

- Card border 1px `--surface-3`, `--radius-lg`, padding 20.
- Product name row has an inline pill on the right ("12 months") in `--surface-2` bg, `--text-caption`.
- Key/value rows: label `--text-body-sm --text-secondary`, value `--text-body` `--money-primary` right-aligned, tabular-nums. 12 vertical gap.
- Accept button is `--action-accent` (orange), full-width, 52 tall on mobile. This is one of *very few* places orange appears — it earns it.
- The amount and monthly repayment must be visible without scrolling on 360×740.
- When multiple offers are shown, they stack vertically on mobile with 12 gap; on ≥ md they're a 2- or 3-up grid. **Never a horizontal carousel on mobile** — carousels hide comparison, and comparing offers is the point of this screen.

### 9.6 Verification status badge

Used everywhere: OTP verified, BVN verified, document accepted, employer confirmed.

- Pill, 28 tall, `--radius-pill`, padding 0 12, `--text-caption` weight 600.
- Icon (16×16) left of label, 6 gap.
- Four variants, each with its own icon:

| State | Bg | Text | Icon |
|---|---|---|---|
| Verified | `--status-verified-soft` | `--status-verified` | check-circle |
| Pending | `--status-pending-soft` | `--status-pending` | clock |
| Failed | `--status-failed-soft` | `--status-failed` | alert-circle |
| Neutral / info | `--surface-2` | `--text-secondary` | dot |

- The pending pill's icon may pulse (opacity 0.6 ↔ 1, 1.5s) — respect `prefers-reduced-motion` (no pulse).
- Announced via `role="status" aria-live="polite"` on state transitions.
- **Never used inside a button** — it's a state, not an action.

### 9.7 File upload with status

Used for ID cards, payslips, bank statements. Each accepted file becomes a row.

**Empty state** (drop zone / tap area):
- 96 tall, dashed 1.5px `--surface-4`, `--radius-lg`, `--surface-1` bg.
- Icon + "Tap to upload" primary line + "PDF, JPG, PNG · Max 5 MB" `--text-body-sm --text-secondary`.
- Full-width tap target on mobile; opens the native picker (`accept="application/pdf,image/*"`, `capture="environment"` where photo capture makes sense).

**Uploading row**:
- 64 tall, `--surface-0` with border 1px `--surface-3`, `--radius-md`, padding 12 16.
- File name (truncate middle: `payslip-june-…-2026.pdf`), size below in `--text-body-sm --text-secondary`.
- Right side: a determinate progress ring (24×24) when %-known, spinner when unknown. Cancel × replaces the ring on hover / long-press on mobile.
- Row is **not** removable during upload except via the explicit cancel.

**Uploaded row**: identical to uploading, but progress ring is replaced with the **Verified** status badge (§9.6). Overflow menu (…) offers "Replace" and "Remove".

**Failed row**: badge is **Failed**, and the row expands to show the reason and a **Retry** action button inline.

Live region announces "1 of 3 files uploaded" as rows complete.

### 9.8 Language toggle

Four languages: `en`, `yo`, `ig`, `ha`.

- Placement: top-right of the wizard header on the landing / auth screens, and inside the profile drawer for logged-in surfaces. **Not on every wizard step** — the choice persists.
- Control: chip-style button showing the current language code (`EN`), tap opens a bottom sheet with all four options, each showing the endonym (`English`, `Yorùbá`, `Igbo`, `Hausa`).
- Sheet selection updates the language, closes the sheet, and re-renders. `<html lang>` and text-direction (all four are LTR) update on the same tick.
- Persist choice to `localStorage` under `princeps.lang`.
- The toggle is visible **before** the first field of the app — a user who cannot read the landing page in English must not have to scroll or navigate to switch.

### 9.9 Bottom sheet & modal

Rules of use:
- **Bottom sheet on mobile** for: language picker, salary-channel picker, product filters, "See full terms".
- **Modal (centered) on mobile** for: destructive confirmation ("Cancel application?"), errors that block progress. Not for pickers.
- Bottom sheet: rises with `translateY(100% → 0%)`, spring bounce 0.15 duration 0.32, drag-to-dismiss enabled with a 32×4 drag handle (Apple §5–6). Top corners `--radius-lg`.
- Modal: scale `0.96 → 1` + fade, spring bounce 0 duration 0.24. Scrim `rgba(11,43,85,0.48)`.
- Both trap focus, close on `Esc` (desktop) and on scrim tap. Focus returns to the trigger.

---

## 10. Definition of done (every component and every screen)

- [ ] Uses tokens; no hardcoded hex or px.
- [ ] Standalone Angular component, `OnPush`, signals, `input()` / `output()`.
- [ ] Renders correctly at **360×740** first, then verified at 768 and 1280.
- [ ] Rendered in **all four languages** with the longest translation string; no clipping, no truncation of primary information.
- [ ] Touch targets ≥ 48×48; focus visible; contrast verified.
- [ ] Loading, empty, success, and error states implemented — not just the happy path.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] Money uses the `<money>` primitive (§8), not raw `<span>{{ amount }}</span>`.
- [ ] Every network state has a specific presentation — no bare spinners.

---

## 11. References — Mobbin flows to study before designing new surfaces

**Revolut Business (visual tone / structure)**
- Hub / dashboard (web) — https://mobbin.com/flows/b36b699a-1ec4-46d8-8ff5-a0f4869d3e0a
- Overview (web) — https://mobbin.com/flows/a9eaaa54-d3c6-4f0a-88b8-5967d5053a98
- Account creation 25-step onboarding (web) — **primary wizard reference** — https://mobbin.com/flows/51279444-8cf6-448f-9a67-c736de9d0969

**Revolut Business (mobile responsive patterns)**
- Logging in with verification steps — https://mobbin.com/flows/8db52766-8bea-4c2f-8c59-71b97837aacb
- Uploading a document — https://mobbin.com/flows/3a5c8a4f-ef0c-41e2-8208-2280c9b0f3f7

**Revolut (mobile pattern references for verification-heavy flows)**
- Securing an account (verification) — https://mobbin.com/flows/b65354d2-69c8-41e6-968b-847907167323

For every new screen: pull the closest Revolut Business analogue for **structure**, apply Apple HIG for **motion and hierarchy**, translate palette and tone to Princeps.

---

## 12. Practical tooling recommendations (non-binding)

- `ngx-translate` or Angular's built-in i18n for the four locales. Store all strings in `src/i18n/{en,yo,ig,ha}.json`.
- A `pseudo-loc.ts` dev-only helper that expands English strings by 30% and adds diacritics, so layout regressions in expansion are caught before translation.
- A `MoneyPipe` (`{{ amount | money:'NGN':'hero' }}`) that emits the three-sized primitive from §8 and computes the SR-only label.
- A `LangService` (signal-based) that exposes `current`, `set(lang)`, and side-effects `<html lang>` — single source of truth for language state.

---

## 13. What we're not building (yet)

Named so we don't waste time discussing them at each design review:
- Dark mode. Not in scope for v1; the tokens are structured so a `[data-theme="dark"]` layer can be added later.
- In-app chat / support widget. External channel for now.
- Animated illustrations, Lottie files.
- A design system playground / Storybook route — we build components against the wizard flow itself.
