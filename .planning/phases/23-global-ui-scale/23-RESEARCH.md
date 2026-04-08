# Phase 23: Global UI Scale - Research

**Researched:** 2026-04-08
**Domain:** CSS rem/px scaling, single-stylesheet refactor, Recharts tick props
**Confidence:** HIGH

## Summary

Phase 23 is a targeted CSS scale refactor. The root font size moves from 16px to 17px
in `:root`, and a selective pass converts hardcoded `px` font-size and density-affecting
spacing values to `rem` so they inherit the new base. Everything that should remain crisp
(borders, chart stroke widths, hairlines, icon sizes) stays in `px`.

The entire stylesheet is a single file (`src/index.css`) — no CSS modules, no Tailwind,
no build-time transforms. Changes are centralized and mechanically straightforward. The one
non-CSS change is a direct JSX edit to `WaveformGraph.tsx` to bump Recharts tick
`fontSize` from `10` to `11`.

**Primary recommendation:** Change `:root { font: 16px/150% }` to `font: 17px/150%`, run a
targeted find-and-replace pass converting density-affecting `px` values to `rem`, widen
`.card-editor` from 320px to ~350px, and bump `.board-grid` `minmax(170px, 1fr)` to
approximately `minmax(185px, 1fr)`. All changes are in two files.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Root font size changes from `font: 16px/150%` to `font: 17px/150%` in `:root`.
- **D-02:** Typography (body text, labels, hints, card copy) migrates from hardcoded `px` to `rem` — targeted pass, not exhaustive rewrite.
- **D-03:** Key spacings — card padding, gap between elements, textarea sizing, card density — convert to rem where they would otherwise be left behind.
- **D-04:** Precision values stay in `px`: borders (1px), hairlines, chart strokeWidths, icon sizes, scrollbar dimensions.
- **D-05:** Principle: use rem for things that should scale; keep px for things that should stay crisp.
- **D-06:** `.card-editor` width widens modestly beyond 320px (340–360px range).
- **D-07:** Recharts axis tick `fontSize` bumps from `10` to `11`.
- **D-08:** Board grid `minmax(170px, 1fr)` gets a modest minimum-width increase if larger text makes cards feel cramped.

### Claude's Discretion

- Exact sidebar width value (within 340–360px range)
- Exact board column min-width bump (e.g., 180px, 185px)
- Which specific hardcoded px font-size values to convert vs. leave as-is
- Whether any line-height or letter-spacing values need adjustment at 17px

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SCALE-01 | App root font size is ~17px so text is more readable at default zoom | D-01: single line change in `:root` at line 20 of `src/index.css` |
| SCALE-02 | Card padding, form controls, and textarea height scale proportionally with the new font size | D-02, D-03: targeted rem conversion of font-size and padding/gap values in card and form rules |
| SCALE-03 | Chart labels, legend, and stroke weight remain legible at the new scale without overflow or clipping | D-07: JSX change in `WaveformGraph.tsx` lines 112 and 119; stroke widths stay in px unchanged |
| SCALE-04 | Sidebar width and overall spacing maintain visual balance at the new scale | D-06: `.card-editor { width }` bump; D-08: `.board-grid` `minmax` bump |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS (vanilla) | — | All styling | Single `src/index.css` — no build-time CSS tooling in this project |
| Recharts | (installed) | Chart rendering | Already in use; tick `fontSize` is a JSX prop, not CSS |

No new dependencies are needed. This phase touches existing files only.

**Installation:** None required.

## Architecture Patterns

### Recommended Project Structure

No structural changes. All edits are confined to:

```
src/
├── index.css           # All rem/px conversions + layout widths (primary file)
└── components/
    └── WaveformGraph.tsx  # Recharts tick fontSize: 10 → 11
```

### Pattern 1: Root Font Size as Scale Lever

**What:** Setting `font-size` on `:root` (or using the `font` shorthand) defines the `1rem`
baseline for every element that uses `rem` units. Changing it from 16px to 17px causes all
`rem`-expressed values to scale proportionally — no per-element changes needed for values
already in rem.

**When to use:** Any app-wide scale adjustment. Single change, cascade-wide effect.

**Example:**
```css
/* BEFORE — src/index.css line 20 */
font: 16px/150% var(--sans);

/* AFTER */
font: 17px/150% var(--sans);
```

**Existing rem values that already scale correctly (no change needed):**
- `h1 { font-size: 2rem }` (line 70)
- `h2 { font-size: 1.25rem }` (line 75)
- `.tagline { font-size: 1.1rem }` (line 208)
- `.card-editor__label { font-size: 1.1rem }` (line 478)
- `.capture-modal__headline { font: 700 1.15rem/1.3 }` (line 1096)
- `.board-header__title { font-size: 1rem }` (line 656)

[VERIFIED: direct source read of src/index.css]

### Pattern 2: px → rem Conversion for Density-Affecting Font Sizes

**What:** Hardcoded px font-size values do NOT inherit the root font change. Multiplying
the current px value by (1/16) gives the rem equivalent that will be the same visual size
at 16px base and larger at 17px base.

**Conversion reference (px → rem at 16px base):**
| px | rem equivalent |
|----|----------------|
| 10 | 0.625rem |
| 11 | 0.6875rem |
| 12 | 0.75rem |
| 13 | 0.8125rem |
| 14 | 0.875rem |
| 15 | 0.9375rem |
| 16 | 1rem |
| 18 | 1.125rem |

**Judgment: which px values to convert vs. leave**

The CONTEXT.md principle is "targeted pass — only values that affect the bigger feel."
Based on codebase analysis [VERIFIED: direct source read], the high-impact values are:

**Convert (body text and UI copy — will feel cramped if left behind):**
- `input, textarea, select { font: 15px/1.5 }` → `font: 0.9375rem/1.5`
- `.btn-primary { font: 600 15px/1 }` → `font: 600 0.9375rem/1`
- `.btn-secondary { font: 600 15px/1 }` → `font: 600 0.9375rem/1`
- `.btn-ghost { font: 500 15px/1 }` → `font: 500 0.9375rem/1`
- `.field label { font: 600 14px/1 }` → `font: 600 0.875rem/1`
- `.story-card__label { font: 600 13px/1.3 }` → `font: 600 0.8125rem/1.3`
- `.card-editor__purpose { font-size: 13px }` → `font-size: 0.8125rem`
- `.card-editor__hint { font-size: 13px }` → `font-size: 0.8125rem`
- `.card-editor__examples { font-size: 13px }` → `font-size: 0.8125rem`
- `.capture-modal__body { font-size: 14px }` → `font-size: 0.875rem`

**Leave in px (compact UI elements where scaling would waste space):**
- `.story-card__number { font: 700 11px/1 var(--mono) }` — step number badge
- `.story-card__purpose { font: 400 11px/1.4 }` — card preview (very compact)
- `.story-card__preview { font: italic 400 11px/1.4 }` — card preview line
- `.act-column__header { font: 700 11px/1 }` — uppercase act label
- `.card-editor__step-num { font: 700 11px/1 var(--mono) }` — step number in editor
- `.score-input__label { font: 600 12px/1 }` — score row label
- `.waveform-legend__item { font: 500 11px/1 }` — legend text
- `.start-note { font-size: 13px }` — fine print
- `.board-header__action { font-size: 12px }` — compact toolbar buttons
- Badge/chip micro-labels (10px, 11px) — these are decorative and intentionally small

These are all secondary or micro-typography elements. Scaling them with the body would
make them feel over-large relative to their purpose. [ASSUMED — judgment call per principle]

### Pattern 3: Key Spacings to rem

**What:** Padding and gap values that determine density around content should scale.
Very small precision gaps (4px, 6px) are fine to leave.

**Convert:**
- `.card-editor { padding: 24px }` → `padding: 1.5rem`
- `.card-editor { gap: 16px }` → `gap: 1rem`
- `.story-card { padding: 12px }` → `padding: 0.75rem`
- `textarea { min-height: 80px }` → `min-height: 5rem` (scales with font base)
- `input, textarea, select { padding: 9px 12px }` → `padding: 0.5625rem 0.75rem`
- `.workspace__board { padding: 24px }` → `padding: 1.5rem`
- `.board-grid { gap: 16px }` → `gap: 1rem`

**Leave in px (fine precision / crispness / layout anchors):**
- All `border: 1px`, `border: 1.5px` — hairlines stay crisp
- `gap: 6px`, `gap: 8px` — small inter-element gaps
- `gap: 4px` — micro spacing
- `.board-grid { min-width: 720px }` — hard layout anchor, not density-related
- `.capture-overlay { padding: 24px }` — viewport-relative, not content-relative

[ASSUMED — judgment call on boundary between "density-affecting" and "precision"]

### Pattern 4: Recharts Tick FontSize

**What:** Recharts `<XAxis>` and `<YAxis>` `tick` prop accepts a style object with
`fontSize`. This is a number (SVG/CSS pixel equivalent), not a CSS rem value. It cannot
receive rem units — it must stay as a numeric literal.

**Change:** `tick={{ fontSize: 10, ... }}` → `tick={{ fontSize: 11, ... }}` in both axes.
Stroke widths on `<Line>` components (`strokeWidth={1.5}`, `strokeWidth={2}`) are SVG
units and should NOT change. [VERIFIED: direct source read of WaveformGraph.tsx lines 112–119]

**Example:**
```tsx
// src/components/WaveformGraph.tsx — both XAxis and YAxis
<XAxis
  dataKey="step"
  tick={{ fontSize: 11, fill: 'var(--text)' }}  // was 10
  tickLine={false}
  axisLine={false}
/>
<YAxis
  domain={[0, 10]}
  ticks={[0, 2, 4, 6, 8, 10]}
  tick={{ fontSize: 11, fill: 'var(--text)' }}  // was 10
  tickLine={false}
  axisLine={false}
  width={20}
/>
```

### Pattern 5: Card Editor Width and Board Grid Column

**What:** Fixed-width sidebar and grid column minimum need a modest upward adjustment
to maintain visual balance with larger text.

**Sidebar:** `.card-editor { width: 320px }` — bump to 350px (middle of 340–360px range).
The responsive breakpoint `@media (max-width: 768px) { .card-editor { width: 100% } }`
requires no change.

**Board grid:** `.board-grid { grid-template-columns: repeat(4, minmax(170px, 1fr)) }`
— bump minimum to 185px. This keeps 4 columns intact on typical desktop widths while
giving card text more breathing room.

[ASSUMED — exact values within ranges specified by CONTEXT.md D-06 and D-08]

### Anti-Patterns to Avoid

- **Converting ALL px values to rem:** The phase calls for a targeted pass. Converting
  precision values (borders, hairlines, chart strokes, icon sizes) to rem would make them
  fuzzy at non-integer multipliers.
- **Using em instead of rem:** `em` is relative to the parent element font-size, causing
  compounding. `rem` is always relative to the root — consistent and predictable.
- **Using CSS custom properties for font scale tokens:** The project doesn't currently
  use CSS variables for font sizes, only for colors. Adding a `--font-base` variable would
  be an overengineering deviation from project patterns. Change the root directly.
- **Changing Recharts strokeWidth:** Chart line widths are SVG units designed for
  crispness at any scale. They should not change.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scale responsiveness | Custom JS zoom logic | CSS rem cascade | Browser handles the math; no JS needed |
| Recharts tick size | CSS override | Direct JSX prop | Recharts renders ticks as SVG text; CSS selectors on SVG ticks are fragile |

**Key insight:** CSS rem cascade is the correct primitive for proportional UI scaling.
No custom logic, no JavaScript, no CSS variables for font scale needed — change the root
and let inheritance do the work.

## Common Pitfalls

### Pitfall 1: Forgetting the `font` Shorthand Resets font-family

**What goes wrong:** `font: 17px/150% var(--sans)` is correct — it sets size, line-height,
and family in one declaration. If someone changes only `font-size: 17px` as a separate
property WHILE the `font` shorthand is present, the shorthand takes precedence (last-write
wins in CSS specificity, but within `:root` they're the same specificity, so order matters).

**How to avoid:** Edit the existing `font` shorthand on line 20. Do not add a separate
`font-size` declaration.

[VERIFIED: direct source read of src/index.css line 20]

### Pitfall 2: rem Values at 17px Base Don't Produce Round Pixel Values

**What goes wrong:** At 17px base, `0.9375rem` = 15.9375px (not a round pixel). Browsers
sub-pixel render this fine for text, but it can cause single-pixel jitter on borders or
layout elements if those are accidentally expressed in rem.

**How to avoid:** Keep borders and hairlines in `px`. Only typography and spacing go to rem.

### Pitfall 3: `.card-editor` Width in a Flex Row

**What goes wrong:** `.card-editor` has `flex-shrink: 0` and a fixed `width`. Widening it
reduces the space available for `.workspace__board`. At very narrow viewports the board
could become unusable before the 768px breakpoint triggers the stacked layout.

**How to avoid:** The 350px change is modest — at 768px the breakpoint stacks anyway.
No additional breakpoint adjustment is needed. Verify the board still has at least ~400px
at typical small-desktop widths (1024px viewport: 1024 - 350 = 674px for board — fine).

[VERIFIED: direct source read of src/index.css lines 452–461 and 732–746]

### Pitfall 4: Recharts fontSize Accepts Number, Not CSS String

**What goes wrong:** Passing `fontSize: '11px'` or `fontSize: '0.6875rem'` to the Recharts
`tick` prop will either be ignored or produce unexpected output. Recharts interprets this
as an SVG presentation attribute where the raw number maps to px.

**How to avoid:** Pass the numeric literal `11` (no units).

[VERIFIED: direct source read of WaveformGraph.tsx line 112]

### Pitfall 5: Missed px Font-Size Values in Responsive Blocks

**What goes wrong:** The file has `@media (max-width: 768px)` blocks that override some
font sizes (e.g., `.board-header__action { font-size: 11px }` in the responsive block at
line 754). If the base rule is converted to rem but the media override is left in px, the
media block will unintentionally override the rem value at desktop widths too (specificity
cascade).

**How to avoid:** After converting base rules, grep for any media-query overrides that
redeclare the same property in px for the same selector.

## Code Examples

### Root Font Size Change

```css
/* src/index.css — line 20. Edit in place. */
:root {
  /* ... color tokens unchanged ... */
  font: 17px/150% var(--sans);  /* was 16px/150% */
  /* rest unchanged */
}
```
[VERIFIED: src/index.css line 20]

### Card Editor Width

```css
/* src/index.css — .card-editor rule (~line 452) */
.card-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;          /* was 16px */
  padding: 1.5rem;    /* was 24px */
  background: var(--surface);
  border-left: 1px solid var(--border);
  width: 350px;       /* was 320px */
  flex-shrink: 0;
  overflow-y: auto;
}
```
[VERIFIED: src/index.css lines 452–462]

### Board Grid Column Minimum

```css
/* src/index.css — .board-grid rule (~line 696) */
.board-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(185px, 1fr));  /* was 170px */
  gap: 1rem;          /* was 16px */
  min-width: 720px;   /* unchanged */
}
```
[VERIFIED: src/index.css lines 696–701]

### Recharts Tick Change

```tsx
// src/components/WaveformGraph.tsx — both axes
<XAxis
  dataKey="step"
  tick={{ fontSize: 11, fill: 'var(--text)' }}
  tickLine={false}
  axisLine={false}
/>
<YAxis
  domain={[0, 10]}
  ticks={[0, 2, 4, 6, 8, 10]}
  tick={{ fontSize: 11, fill: 'var(--text)' }}
  tickLine={false}
  axisLine={false}
  width={20}
/>
```
[VERIFIED: WaveformGraph.tsx lines 110–123]

### Form Controls

```css
/* src/index.css — base input/textarea/select rule */
input,
textarea,
select {
  font: 0.9375rem/1.5 var(--sans);   /* was 15px/1.5 */
  padding: 0.5625rem 0.75rem;        /* was 9px 12px */
  /* other properties unchanged */
}

textarea {
  resize: vertical;
  min-height: 5rem;   /* was 80px — scales with base font */
}
```
[VERIFIED: src/index.css lines 164–192]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| px for everything | rem for scalable, px for crisp | Modern CSS (2013+) | Enables root-driven scaling |
| Browser zoom only | App-level rem base | Ongoing best practice | Consistent across zoom levels |

**No deprecated features in scope.** All CSS used (rem, font shorthand, grid minmax) is
universally supported. [ASSUMED — based on training knowledge for standard CSS properties]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Small/micro typography (11px, 12px labels) should stay in px rather than convert | Pattern 2 (convert vs. leave list) | Mild — worst case these elements feel slightly small relative to body; easy to adjust post-implementation |
| A2 | 350px is the right sidebar width within the 340–360px range | Pattern 5, Code Examples | Low — within the explicitly authorized range; user can adjust |
| A3 | 185px is the right board grid column minimum | Pattern 5, Code Examples | Low — within reasonable range; easy to tweak |
| A4 | Small precision gaps (4px, 6px, 8px) should stay in px | Pattern 3 | Minimal — these are inter-element micro-gaps; scaling them would be imperceptible |
| A5 | CSS rem and px are universally supported in target browsers | State of the Art | Negligible — both are supported in all browsers since 2013+ |

## Open Questions

1. **Line-height and letter-spacing at 17px base**
   - What we know: Current `:root` has `letter-spacing: 0.16px` and `line-height: 150%`
   - What's unclear: Whether 0.16px tracking (set in px, not em) will feel tighter
     relative to the larger base, or whether it needs adjustment
   - Recommendation: Leave unchanged initially; address only if visual inspection shows
     tighter-than-intended tracking. The risk is low — 0.16px is a very small absolute value.

2. **`story-card--list` grid column widths**
   - What we know: `.story-card--list { grid-template-columns: minmax(160px, 280px) 1fr }`
     uses px values for the label column
   - What's unclear: Whether 160px minimum feels cramped with 17px base text
   - Recommendation: Leave as px for now. This is a fixed column constraint, not a
     density spacing. Monitor in visual inspection.

## Environment Availability

Step 2.6: SKIPPED (no external dependencies — all changes are CSS and JSX edits to existing files; no new tools, services, or runtimes required).

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no `pytest.ini`, `jest.config.*`, `vitest.config.*`, or `tests/` directory found |
| Config file | None |
| Quick run command | `npm run build` (TypeScript compile catches JSX errors) |
| Full suite command | `npm run build` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCALE-01 | Root font-size is 17px | manual | Visual inspection after `npm run dev` | N/A |
| SCALE-02 | Card padding and form controls scale proportionally | manual | Visual inspection after `npm run dev` | N/A |
| SCALE-03 | Chart labels legible, no overflow | manual | Visual inspection after `npm run dev` | N/A |
| SCALE-04 | Sidebar width and spacing balanced | manual | Visual inspection after `npm run dev` | N/A |

All SCALE requirements are purely visual/CSS. There is no automated test that can verify
"looks comfortable" or "feels balanced." Verification is by visual inspection in browser.
TypeScript compile (`npm run build`) catches the only code change (WaveformGraph.tsx).

### Sampling Rate

- **Per task commit:** `npm run build` — confirms no TypeScript errors
- **Per wave merge:** `npm run build` + visual check in browser
- **Phase gate:** Full build green + visual inspection confirming all 4 SCALE criteria

### Wave 0 Gaps

None — no test infrastructure gaps. CSS visual changes are inherently manual-verification
only. Build validation via `npm run build` is sufficient for the single JSX change.

## Security Domain

This phase makes no changes to authentication, session management, access control, input
handling, cryptography, or data storage. ASVS categories V2–V6 do not apply. The changes
are confined to visual presentation (CSS font sizes, spacing, and one JSX prop value).

Security domain: NOT APPLICABLE for this phase.

## Sources

### Primary (HIGH confidence)
- Direct read of `src/index.css` (1450 lines) — all font-size, padding, gap, and width
  values catalogued from source
- Direct read of `src/components/WaveformGraph.tsx` — Recharts tick props confirmed at
  lines 112–119
- `23-CONTEXT.md` — all locked decisions (D-01 through D-08) and discretion scope

### Secondary (MEDIUM confidence)
- CSS rem specification behavior (relative to root font-size) — standard CSS behavior,
  universally documented

### Tertiary (LOW confidence)
- None — no unverified claims presented as guidance

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; changes verified in source
- Architecture: HIGH — change set fully inventoried from source files
- Pitfalls: HIGH — all pitfalls grounded in specific lines of source code or CSS mechanics
- Discretion values (exact widths): ASSUMED — within ranges authorized by user

**Research date:** 2026-04-08
**Valid until:** 2026-05-08 (stable domain — vanilla CSS, no version-sensitive dependencies)
