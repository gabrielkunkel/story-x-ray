# Phase 5 — Diagnostics: Plan

## Goal
Rule-based diagnostic engine + panel that surfaces structural warnings to writers. Diagnostics are a support layer — the board stays central.

## UAT Criteria (from roadmap)
1. With default empty scores, no warnings shown
2. Setting step 4 pressure to 4 triggers a "Weak Rupture" warning
3. Clicking a warning step chip highlights the relevant card on the board

---

## Task 1 — Create diagnostic engine (`src/utils/diagnostics.ts`)

Create a pure function module. No React imports, no side effects.

```ts
import type { StoryStep } from '../types/story'

export type DiagnosticRule = 'flat-zone' | 'weak-rupture' | 'false-safety' | 'unresolved-ending'

export interface Diagnostic {
  id: string
  rule: DiagnosticRule
  label: string
  message: string
  stepNumbers: number[]
  severity: 'warning'
}

export function runDiagnostics(steps: StoryStep[]): Diagnostic[]
```

### Rule implementations inside `runDiagnostics`:

**Rule 1 — Flat Zone**
- For each of the 4 dimensions, scan all 16 steps looking for runs of 3+ consecutive steps where `Math.abs(score[i+1] - score[i]) < 1.5`
- Zero-score guard: skip any pair where either step's score for that dimension is `=== 0`
- Collect all distinct flat runs (a new diagnostic per contiguous run per dimension)
- `id`: `flat-zone-${dim}-${firstStep}`
- `label`: `"Flat Zone"`
- `message`: `"${capitalize(dim)} barely changes across steps ${steps.join(', ')} — readers may feel no momentum."`
- `stepNumbers`: all steps in the run

**Rule 2 — Weak Rupture**
- Check steps 4, 8, 12
- For each: skip if `actualScores.pressure === 0 && actualScores.stability === 0`
- Trigger if `actualScores.pressure < 7 || actualScores.stability > 4`
- `id`: `weak-rupture-${stepNumber}`
- `label`: `"Weak Rupture"`
- `message`: `"Step ${n} should feel explosive (pressure ≥ 7, stability ≤ 4)."`
- `stepNumbers`: [stepNumber]

**Rule 3 — False Safety**
- Check steps 3, 7, 11
- For each: find prior step (step - 1); skip if the relief step OR prior step has both `connection === 0 && hope === 0`
- Trigger if `actualScores.connection - prior.connection < 1.5 || actualScores.hope - prior.hope < 1.5`
- `id`: `false-safety-${stepNumber}`
- `label`: `"False Safety"`
- `message`: `"Step ${n} should feel like a meaningful breath — connection or hope should rise ≥ 1.5 from the prior step."`
- `stepNumbers`: [stepNumber]

**Rule 4 — Unresolved Ending**
- Check step 16
- Skip if `actualScores.pressure === 0 && actualScores.stability === 0`
- Trigger if `actualScores.pressure > 4 || actualScores.stability < 6`
- `id`: `unresolved-ending`
- `label`: `"Unresolved Ending"`
- `message`: `"Step 16 should feel settled (pressure ≤ 4, stability ≥ 6) — the story hasn't fully resolved."`
- `stepNumbers`: [16]

Helper: `function capitalize(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1) }`

---

## Task 2 — Create DiagnosticsPanel component (`src/components/DiagnosticsPanel.tsx`)

Props:
```ts
interface Props {
  diagnostics: Diagnostic[]
  onStepClick: (stepNumber: number) => void
}
```

Render:
- Outer `<div className="diagnostics-panel">`
- If `diagnostics.length === 0`: render `<p className="diagnostics-panel__empty">No structural warnings.</p>`
- Else: render `<ul className="diagnostics-panel__list">` with one `<li className="diagnostic-card">` per diagnostic
  - `<div className="diagnostic-card__header"><span className="diagnostic-card__label">{d.label}</span></div>`
  - `<p className="diagnostic-card__message">{d.message}</p>`
  - `<div className="diagnostic-card__steps">` with one `<button className="diagnostic-step-chip" onClick={() => onStepClick(n)}>Step {n}</button>` per step in `d.stepNumbers`

---

## Task 3 — Update BoardHeader (`src/components/BoardHeader.tsx`)

Add props:
```ts
showDiagnostics: boolean
diagnosticCount: number
onToggleDiagnostics: () => void
```

Add diagnostics toggle button after the existing graph toggle button:
```tsx
<button
  className={`btn-ghost board-header__diag-toggle${showDiagnostics ? ' board-header__diag-toggle--active' : ''}`}
  onClick={onToggleDiagnostics}
  title={showDiagnostics ? 'Hide diagnostics' : 'Show diagnostics'}
>
  ⚠{diagnosticCount > 0 ? ` ${diagnosticCount}` : ''}
</button>
```

Add CSS class in `src/index.css` (same section as `board-header__graph-toggle`):
```css
.board-header__diag-toggle {
  font-size: 15px;
  padding: 4px 10px;
  flex-shrink: 0;
}

.board-header__diag-toggle--active {
  color: var(--accent);
}
```

---

## Task 4 — Wire up StoryWorkspacePage (`src/pages/StoryWorkspacePage.tsx`)

**Imports to add:**
```ts
import { runDiagnostics } from '../utils/diagnostics'
import DiagnosticsPanel from '../components/DiagnosticsPanel'
```

**State to add** (alongside `showGraph`):
```ts
const [showDiagnostics, setShowDiagnostics] = useState(false)
```

**Derive diagnostics** (inside component body, before return, derived from `story`):
```ts
const diagnostics = story ? runDiagnostics(story.steps) : []
```

**Update `<BoardHeader>` call** to pass new props:
```tsx
<BoardHeader
  title={story.title}
  showGraph={showGraph}
  onToggleGraph={() => setShowGraph(v => !v)}
  showDiagnostics={showDiagnostics}
  diagnosticCount={diagnostics.length}
  onToggleDiagnostics={() => setShowDiagnostics(v => !v)}
/>
```

**Add DiagnosticsPanel** after the `WaveformGraph` block:
```tsx
{showDiagnostics && (
  <DiagnosticsPanel
    diagnostics={diagnostics}
    onStepClick={setActiveStepNumber}
  />
)}
```

---

## Task 5 — Add DiagnosticsPanel CSS to `src/index.css`

Append to the end of the file:

```css
/* ── Diagnostics Panel ────────────────────────────────────── */

.diagnostics-panel {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
  max-height: 240px;
  overflow-y: auto;
}

.diagnostics-panel__empty {
  font-size: 13px;
  color: var(--text);
  opacity: 0.6;
  text-align: center;
  padding: 8px 0;
}

.diagnostics-panel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.diagnostic-card {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid #f59e0b66;
  background: rgba(245, 158, 11, 0.06);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.diagnostic-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.diagnostic-card__label {
  font: 700 12px/1 var(--sans);
  color: #b45309;
}

@media (prefers-color-scheme: dark) {
  .diagnostic-card__label {
    color: #fbbf24;
  }

  .diagnostic-card {
    border-color: rgba(245, 158, 11, 0.3);
    background: rgba(245, 158, 11, 0.08);
  }
}

.diagnostic-card__message {
  font: 400 12px/1.5 var(--sans);
  color: var(--text);
}

.diagnostic-card__steps {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.diagnostic-step-chip {
  font: 600 11px/1 var(--mono);
  color: var(--accent);
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  border-radius: 4px;
  padding: 3px 8px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(170, 59, 255, 0.2);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}
```

---

## Verification Checklist

- [ ] `runDiagnostics([])` returns `[]`
- [ ] All 16 steps with default scores (all 0) → returns `[]` (zero-score guard)
- [ ] Step 4 with `pressure: 4, stability: 2` → returns 1 weak-rupture diagnostic for step 4
- [ ] Step 16 with `pressure: 6, stability: 4` → returns 1 unresolved-ending diagnostic
- [ ] 3 consecutive steps with same connection score → returns 1 flat-zone diagnostic
- [ ] DiagnosticsPanel renders "No structural warnings." when `diagnostics=[]`
- [ ] DiagnosticsPanel renders warning cards and step chips
- [ ] Clicking a step chip fires `onStepClick` with correct step number
- [ ] BoardHeader renders `⚠ 3` when `diagnosticCount=3`
- [ ] BoardHeader renders `⚠` (no number) when `diagnosticCount=0`
- [ ] Diagnostics panel hidden by default on workspace load
- [ ] Toggling ⚠ button shows/hides panel
- [ ] `vite build` passes
