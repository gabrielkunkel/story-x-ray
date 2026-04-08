# Phase 23: Global UI Scale - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Scale the entire app up so it reads comfortably at default zoom — approximately "Chrome at 110%" feel. Root font size moves from 16px to 17px. Typography and key spacings migrate toward rem so they scale proportionally. Borders, hairlines, and chart strokes stay in px for crispness. This is a targeted scale refactor, not an exhaustive full-system rewrite.

Requirements in scope: SCALE-01, SCALE-02, SCALE-03, SCALE-04.

</domain>

<decisions>
## Implementation Decisions

### Scaling strategy
- **D-01:** Root font size changes from `font: 16px/150%` to `font: 17px/150%` in `:root`.
- **D-02:** Typography (body text, labels, hints, card copy) migrates from hardcoded `px` to `rem` so it scales with root. This is a targeted pass — only values that affect the "bigger feel" get converted, not an exhaustive rewrite of every pixel.
- **D-03:** Key spacings — card padding, gap between elements, textarea sizing, card density — should scale with the rem change. Convert these to rem where they'd otherwise be left behind.
- **D-04:** Precision values that should stay crisp remain in `px`: borders (1px), hairlines, chart strokeWidths, icon sizes, scrollbar dimensions.
- **D-05:** The guiding principle: **use rem for things that should scale; keep px for things that should stay crisp.**

### Sidebar (card editor) width
- **D-06:** The card editor sidebar widens modestly beyond 320px — enough for textareas and copy to breathe better. Exact value is Claude's discretion (likely 340–360px range), but the intent is a modest bump, not a redesign.

### Chart tick labels
- **D-07:** Recharts axis tick `fontSize` bumps from `10` to `11` — keeping chart labels visually consistent with the rest of the scaled interface. Chart stroke widths stay in px.

### Board card column minimum width
- **D-08:** Board grid `minmax(170px, 1fr)` gets a modest minimum-width increase if the larger text makes cards feel cramped. Exact value is Claude's discretion; the principle is roomier cards over large text stuffed into old tiny dimensions.

### Claude's Discretion
- Exact sidebar width value (within 340–360px range)
- Exact board column min-width bump (e.g., 180px, 185px — whatever feels right at 17px base)
- Which specific hardcoded px font-size values to convert vs. leave as-is (judgment call per element)
- Whether any line-height or letter-spacing values need adjustment at 17px

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §v1.6 Requirements → Global UI Scale — SCALE-01, SCALE-02, SCALE-03, SCALE-04 (acceptance criteria)

### Primary CSS file (all sizing lives here)
- `src/index.css` — `:root` font declaration (line 21), all component font-size and spacing values. This is the only stylesheet; all changes happen here.

### Chart component
- `src/components/WaveformGraph.tsx` lines 112–120 — Recharts `<XAxis>` and `<YAxis>` tick props (hardcoded `fontSize: 10`, to be bumped to `11`)

### Card editor component
- `src/index.css` `.card-editor` rule (line 452) — `width: 320px` to be modestly widened

### Board grid
- `src/index.css` `.board-grid` rule (line 696) — `minmax(170px, 1fr)` column minimum

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `:root` CSS custom properties (`--text`, `--accent`, `--bg`, etc.) — already token-based for colors; same pattern should be extended to font scales if needed
- All styling lives in a single `src/index.css` — no CSS modules or Tailwind; changes are centralized

### Established Patterns
- Most font-size declarations are hardcoded px (11px, 12px, 13px, 14px, 15px, 16px, 18px). A few use rem (2rem for h1, 1.25rem for h2, 1.1rem for card-editor__label). The rem values already scale correctly — only px values need conversion.
- Spacing (padding, gap) is universally in px. Key layout-affecting spacings should move to rem; small precision gaps (4px, 6px) can stay.
- Recharts `<Line>` strokeWidth uses numeric literals (1.5, 2) — these are SVG units and should stay as-is.

### Integration Points
- `src/index.css` `:root` font declaration → affects all rem-based values cascade-wide
- `src/components/WaveformGraph.tsx` → Recharts tick props need direct JSX changes (not CSS)
- `.card-editor { width: 320px }` → needs a small bump; also check `.card-editor` responsive breakpoint at `@media (max-width: 768px)` where it becomes `width: 100%` (no change needed there)

</code_context>

<specifics>
## Specific Ideas

- "The app should feel like a clean, intentional version of Chrome at ~110%, not like random bigger text pasted into the old layout."
- Typography and spacings that affect the overall density feeling get converted to rem. Borders, hairlines, and chart strokes stay px.
- "Use rem for things that should scale; keep px for things that should stay crisp."

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 23-global-ui-scale*
*Context gathered: 2026-04-08*
