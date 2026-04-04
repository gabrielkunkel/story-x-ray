---
phase: 5
title: Diagnostics
status: context-ready
date: 2026-04-04
mode: auto
---

# Phase 5 — Diagnostics: Context

## Phase Goal
Rule-based warnings help writers identify structural problems. The board stays central; diagnostics are a support layer.

## Prior Decisions (from earlier phases)
- Stack: React 19 + TypeScript + Vite 8 + localStorage + Recharts
- State lives in `StoryWorkspacePage` as `story: Story | null`, updated via `updateAndSave`
- `BoardHeader` currently has: title, showGraph toggle (∿ button), back button
- `StoryStep.actualScores` is `DimensionScores` with values 1–10 (default 0 = not entered)
- Graph is a toggleable panel rendered at the bottom of the workspace

---

## Decision: Diagnostic Engine Location

**Decision:** Pure function module at `src/utils/diagnostics.ts`

Exports:
```ts
export interface Diagnostic {
  id: string           // stable key for React rendering
  rule: 'flat-zone' | 'weak-rupture' | 'false-safety' | 'unresolved-ending'
  label: string        // short title, e.g. "Flat Zone"
  message: string      // human-readable explanation
  stepNumbers: number[] // affected steps (1–16)
  severity: 'warning'  // all are warnings in MVP
}

export function runDiagnostics(steps: StoryStep[]): Diagnostic[]
```

No React, no side effects. Pure input → output. This keeps it testable and reusable.

---

## Decision: Rule Definitions

### Rule 1 — Flat Zone
**Trigger:** 3 or more consecutive steps where a single dimension's actual score changes by < 1.5 between each adjacent pair.

**Zero-score guard:** Skip any sequence where any step in the sequence has `actualScores` for that dimension === 0 (not entered yet).

**Steps reported:** All steps in the flat sequence.

**Example:** Steps 5,6,7 — connection scores 5, 5.2, 5 → flat zone on connection.

---

### Rule 2 — Weak Rupture
**Trigger:** At rupture steps (4, 8, 12) — `pressure < 7` OR `stability > 4`.

**Zero-score guard:** Skip if both `pressure === 0` and `stability === 0` (step not scored yet). If only one dimension is scored, evaluate that dimension only.

**Actually:** Simpler guard — skip the check for a step if `actualScores.pressure === 0 && actualScores.stability === 0`.

**Steps reported:** The specific rupture step (4, 8, or 12).

---

### Rule 3 — False Safety
**Trigger:** At relief steps (3, 7, 11) — `connection` or `hope` is NOT meaningfully higher (< +1.5) compared to the prior step.

**"Meaningfully higher":** `actualScores[dim][step] - actualScores[dim][step-1] < 1.5`

**Zero-score guard:** Skip if the relief step or its prior step has 0 for both connection and hope.

**Steps reported:** The relief step (3, 7, or 11).

---

### Rule 4 — Unresolved Ending
**Trigger:** At step 16 — `pressure > 4` OR `stability < 6`.

**Zero-score guard:** Skip if `actualScores.pressure === 0 && actualScores.stability === 0`.

**Steps reported:** [16]

---

## Decision: Diagnostics Panel UI

**Placement:** Collapsible panel, same pattern as the waveform graph — rendered below the graph in `StoryWorkspacePage`, toggled by a button in `BoardHeader`.

**Toggle button:** Added to `BoardHeader` alongside the existing ∿ button. Icon: ⚠ (warning triangle). Shows a count badge when diagnostics exist: `⚠ 3`.

**Panel layout:**
- If no diagnostics: "No structural warnings." in muted text
- If diagnostics exist: list of warning cards
  - Each card: rule label (bold) + message + "Step X" chip(s)
  - Clicking a "Step X" chip sets `activeStepNumber` in the workspace (same mechanic as chart hover)

**Panel is hidden by default** (same as graph which starts visible — but diagnostics starts hidden to keep it non-intrusive).

Actually: Per roadmap, diagnostics should be visible when opened. **Default state: hidden**, toggled on demand.

---

## Decision: BoardHeader Changes

Add two new props to `BoardHeader`:
```ts
showDiagnostics: boolean
diagnosticCount: number
onToggleDiagnostics: () => void
```

Badge only shows when `diagnosticCount > 0`. Button label: `⚠` with a superscript count, or just `⚠ {n}` inline.

---

## Decision: Warning Count Badge on Board Header

Show `diagnosticCount` in the diagnostics toggle button when > 0. No separate standalone badge element needed — the button itself communicates count.

Format: `⚠ {n}` (e.g., `⚠ 3`)
When count is 0 or panel is empty: just `⚠` (no number).

---

## Decision: Step Navigation from Diagnostics

Clicking a step chip in the diagnostics panel calls the existing `setActiveStepNumber` handler (passed down as a prop). No new state or routing needed.

---

## Decision: Zero-Score Handling

A step is considered "not yet scored" if all four `actualScores` values are 0. Rules that check specific dimensions use per-dimension zero checks as described per rule above.

This prevents false positives when the user hasn't entered scores yet.

---

## Out of Scope for Phase 5
- Severity levels beyond 'warning'
- Custom rule configuration
- Dismissing/snoozing individual warnings
- Exporting diagnostic report
- Beehiiv email capture trigger on diagnostics open (Phase 7)

---

## File Plan (for planner reference)
| File | Action |
|---|---|
| `src/utils/diagnostics.ts` | Create — pure diagnostic engine |
| `src/components/DiagnosticsPanel.tsx` | Create — warning list UI |
| `src/components/BoardHeader.tsx` | Modify — add diagnostics toggle + count |
| `src/pages/StoryWorkspacePage.tsx` | Modify — wire showDiagnostics state + panel |
| `src/index.css` (or inline) | Modify — panel + chip styles |
