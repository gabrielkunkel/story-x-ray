---
phase: 23-global-ui-scale
plan: 01
subsystem: ui
tags: [css, rem, typography, layout, recharts]

# Dependency graph
requires: []
provides:
  - Root font scaled from 16px to 17px via CSS font shorthand
  - Targeted rem conversions for density-affecting typography and spacing
  - Card editor sidebar widened from 320px to 350px
  - Board grid column minimum raised from 170px to 185px
  - WaveformGraph axis tick labels bumped from 10px to 11px
affects: [any phase touching src/index.css typography, card editor layout, or waveform chart]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Precision-vs-density separation: borders/hairlines/stroke widths stay in px; typography and breathing-room spacing converted to rem"
    - "Recharts tick fontSize must be a numeric literal (not rem string) — SVG presentation attribute constraint"

key-files:
  created: []
  modified:
    - src/index.css
    - src/components/WaveformGraph.tsx

key-decisions:
  - "Root font set to 17px (not 18px) — gives 'Chrome at 110%' feel without breaking layout anchors"
  - "Borders, hairlines, and chart stroke widths left in px — crisp rendering requires pixel precision"
  - "Layout anchors (min-width: 720px, board-list grid columns) left in px — not density-related"
  - "Micro-text sizes (11px badges, 12px toolbar labels) left in px — intentionally small UI elements"
  - "WaveformGraph tick set to numeric 11, not '11px' — Recharts SVG presentation attribute requires raw number"

patterns-established:
  - "Density scaling: convert typography and spacing to rem against a bumped root; leave precision values (borders, strokes, layout anchors) in px"

requirements-completed: [SCALE-01, SCALE-02, SCALE-03, SCALE-04]

# Metrics
duration: ~30min
completed: 2026-04-08
---

# Phase 23 Plan 01: Global UI Scale Summary

**Root font bumped from 16px to 17px with targeted rem conversions across buttons, form controls, card labels, and card editor spacing — giving the app a "Chrome at 110%" reading density with crisp borders and chart strokes unchanged**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-04-08
- **Completed:** 2026-04-08T23:27:21Z
- **Tasks:** 3 (2 auto + 1 human verify)
- **Files modified:** 2

## Accomplishments
- Root font size raised from 16px to 17px in `src/index.css` `:root` shorthand, propagating through all rem-expressed values
- Targeted rem conversions applied to 15 CSS rules: buttons, form controls, textarea, field labels, story card labels, card editor body text (purpose/hint/examples), modal body, card editor padding/gap, story card padding, board padding, board grid gap
- Card editor sidebar widened from 320px to 350px; board grid column minimum raised from 170px to 185px
- WaveformGraph tick fontSize bumped from 10 to 11 (numeric literal) on both XAxis and YAxis
- All borders, hairlines, and chart stroke widths left at their original px values — no visual regression
- Human visual verification passed: scale approved as comfortable

## Task Commits

Each task was committed atomically:

1. **Task 1: CSS scale refactor — root font, rem conversions, layout width bumps** - `2a42493` (feat)
2. **Task 2: WaveformGraph chart tick font size bump** - `e8e6e8b` (feat)
3. **Task 3: Visual verification** - human approved (no code commit)

## Files Created/Modified
- `src/index.css` - Root font to 17px; 15 targeted rem conversions; sidebar 350px; board column 185px
- `src/components/WaveformGraph.tsx` - XAxis and YAxis tick fontSize 10 -> 11

## Decisions Made
- Root font set to 17px (not 18px) — 17px gives the intended "Chrome at 110%" feel without displacing layout anchors
- Precision values left in px: all `border: 1px`, hairlines (`letter-spacing: 0.16px`), chart `strokeWidth` props — crisp rendering requires pixel precision
- Layout anchors left in px: `.board-grid { min-width: 720px }`, `.story-card--list` grid columns — these are hard layout constraints unrelated to reading density
- Micro-text sizes left in px: 11px step badges, 11px act labels, 12px toolbar font-size — intentionally small UI chrome that should not scale with body density
- WaveformGraph tick receives numeric `11`, not `'11px'` — Recharts passes this as an SVG `font-size` presentation attribute which requires a raw number

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Global UI scale is complete and visually verified
- Any future phase touching `src/index.css` should follow the precision-vs-density pattern established here: rem for typography/breathing-room, px for borders/hairlines/strokes/anchors
- No blockers

---
*Phase: 23-global-ui-scale*
*Completed: 2026-04-08*
