# Phase 3 — Scoring & Target vs Actual
**Goal:** Writers can enter actual scores (1–10) for each dimension on every step, see target scores alongside them, and read a color-coded delta at a glance.

## Architecture

Scores live in each `StoryStep.actualScores`. Target scores are already in `StoryStep.targetScores` (copied from static config at story creation). Nothing new in the data model — it's all already there.

**Score of 0 = unset.** The slider ranges 0–10. When value is 0, display "—" and skip delta. Valid user scores are 1–10.

**Callback chain:**
```
ScoreInput.onChange(val)
  → CardEditor.onScoreChange(dimension, val)
    → StoryWorkspacePage.handleScoreChange(dimension, val)
      → updateAndSave(updatedStory)
```

**Files changed:**
- `src/components/ScoreInput.tsx` *(create)* — single dimension row with slider + display
- `src/components/CardEditor.tsx` *(edit)* — add scores section + new prop
- `src/pages/StoryWorkspacePage.tsx` *(edit)* — add `handleScoreChange` handler
- `src/index.css` *(append)* — score input styles

---

## Task 1 — ScoreInput Component
**File:** `src/components/ScoreInput.tsx` *(create)*

One row: dimension label, slider, actual value, target value, delta.

```tsx
import type { Dimension } from '../types/story'

const DIMENSION_LABELS: Record<Dimension, string> = {
  connection: 'Connection',
  pressure:   'Pressure',
  hope:       'Hope',
  stability:  'Stability',
}

interface Props {
  dimension: Dimension
  actual: number        // 0 = unset, 1–10 = scored
  target: number        // always 1–10 from static config
  onChange: (value: number) => void
}

export default function ScoreInput({ dimension, actual, target, onChange }: Props) {
  const isSet = actual > 0
  const delta = isSet ? actual - target : null

  let deltaClass = 'score-delta'
  if (delta !== null) {
    if (delta > 0) deltaClass += ' score-delta--above'
    else if (delta < 0) deltaClass += ' score-delta--below'
    else deltaClass += ' score-delta--exact'
  }

  return (
    <div className="score-input">
      <span className="score-input__label">{DIMENSION_LABELS[dimension]}</span>

      <div className="score-input__controls">
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={actual}
          onChange={e => onChange(Number(e.target.value))}
          className="score-input__slider"
          aria-label={`${DIMENSION_LABELS[dimension]} score`}
        />

        <span className="score-input__actual">
          {isSet ? actual : '—'}
        </span>
      </div>

      <div className="score-input__comparison">
        <span className="score-input__target" title="Target score">
          T: {target}
        </span>
        {delta !== null && (
          <span className={deltaClass}>
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </div>
    </div>
  )
}
```

**CSS to add:**
```css
/* ── Score Input ──────────────────────────────────────────── */

.score-input {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  align-items: center;
  gap: 10px;
}

.score-input__label {
  font: 600 12px/1 var(--sans);
  color: var(--text);
  text-transform: capitalize;
}

.score-input__controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-input__slider {
  flex: 1;
  height: 4px;
  accent-color: var(--accent);
  cursor: pointer;
  /* reset browser defaults */
  border: none;
  background: transparent;
  padding: 0;
  width: auto;
  box-shadow: none;

  &:focus {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
    box-shadow: none;
    border-color: transparent;
  }
}

.score-input__actual {
  font: 700 14px/1 var(--mono);
  color: var(--text-h);
  width: 20px;
  text-align: right;
  flex-shrink: 0;
}

.score-input__comparison {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  min-width: 40px;
}

.score-input__target {
  font: 400 10px/1 var(--mono);
  color: var(--text);
  opacity: 0.7;
}

.score-delta {
  font: 700 11px/1 var(--mono);
  color: var(--text);
}

.score-delta--above {
  color: #22c55e;
}

.score-delta--below {
  color: #ef4444;
}

.score-delta--exact {
  color: var(--text);
  opacity: 0.5;
}
```

**Acceptance:** Row shows label, slider (0–10), actual value (or "—" when 0), target ("T: N"), and delta (colored "+N"/"-N"/absent when unset). Dragging slider updates the actual value display instantly.

---

## Task 2 — CardEditor: add scores section
**File:** `src/components/CardEditor.tsx` *(edit)*

Add a new `onScoreChange` prop and a "Scores" section below the hint, above the beat/notes fields. Import `ScoreInput` and `Dimension`.

**New prop interface:**
```tsx
interface Props {
  step: StoryStep
  onBeatTextChange: (value: string) => void
  onNotesChange: (value: string) => void
  onScoreChange: (dimension: Dimension, value: number) => void  // ADD
}
```

**New section to insert between hint and fields:**
```tsx
import type { Dimension } from '../types/story'
import ScoreInput from './ScoreInput'

const DIMENSIONS: Dimension[] = ['connection', 'pressure', 'hope', 'stability']

// Inside JSX, between card-editor__hint and card-editor__fields:
<div className="card-editor__scores">
  <div className="card-editor__scores-heading">Scores</div>
  {DIMENSIONS.map(dim => (
    <ScoreInput
      key={dim}
      dimension={dim}
      actual={step.actualScores[dim]}
      target={step.targetScores[dim]}
      onChange={val => onScoreChange(dim, val)}
    />
  ))}
</div>
```

**CSS to add:**
```css
.card-editor__scores {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-editor__scores-heading {
  font: 700 11px/1 var(--sans);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
}
```

**Full updated CardEditor.tsx:**
```tsx
import type { Dimension } from '../types/story'
import { STEP_HINTS } from '../data/steps'
import type { StoryStep } from '../types/story'
import ScoreInput from './ScoreInput'

const DIMENSIONS: Dimension[] = ['connection', 'pressure', 'hope', 'stability']

interface Props {
  step: StoryStep
  onBeatTextChange: (value: string) => void
  onNotesChange: (value: string) => void
  onScoreChange: (dimension: Dimension, value: number) => void
}

export default function CardEditor({ step, onBeatTextChange, onNotesChange, onScoreChange }: Props) {
  const hint = STEP_HINTS[step.stepNumber]

  return (
    <aside className="card-editor">
      <div className="card-editor__header">
        <span className="card-editor__step-num">Step {step.stepNumber}</span>
        <h2 className="card-editor__label">{step.label}</h2>
      </div>

      <div className="card-editor__purpose">{step.purpose}</div>

      {hint && (
        <details className="card-editor__hint">
          <summary>Writing hint</summary>
          <p>{hint}</p>
        </details>
      )}

      <div className="card-editor__scores">
        <div className="card-editor__scores-heading">Scores</div>
        {DIMENSIONS.map(dim => (
          <ScoreInput
            key={dim}
            dimension={dim}
            actual={step.actualScores[dim]}
            target={step.targetScores[dim]}
            onChange={val => onScoreChange(dim, val)}
          />
        ))}
      </div>

      <div className="card-editor__fields">
        <div className="field">
          <label htmlFor="beat-text">Beat</label>
          <textarea
            id="beat-text"
            key={step.stepNumber}
            defaultValue={step.beatText}
            onChange={e => onBeatTextChange(e.target.value)}
            placeholder="What happens in this step of your story?"
            rows={6}
          />
        </div>

        <div className="field">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            key={step.stepNumber}
            defaultValue={step.notes}
            onChange={e => onNotesChange(e.target.value)}
            placeholder="Working notes, ideas, questions…"
            rows={3}
          />
        </div>
      </div>
    </aside>
  )
}
```

**Acceptance:** Scores section appears in the editor with 4 rows (connection, pressure, hope, stability). Each row shows a slider, actual value, target, and delta. TypeScript compiles with no errors.

---

## Task 3 — StoryWorkspacePage: add score handler
**File:** `src/pages/StoryWorkspacePage.tsx` *(edit)*

Add `handleScoreChange` and pass `onScoreChange` to `CardEditor`. No state shape changes — `actualScores` already exists in `StoryStep`.

**Add this function alongside the existing handlers:**
```tsx
function handleScoreChange(dimension: Dimension, value: number) {
  if (activeStepNumber === null) return
  const updatedStory: Story = {
    ...story!,
    steps: story!.steps.map(s =>
      s.stepNumber === activeStepNumber
        ? { ...s, actualScores: { ...s.actualScores, [dimension]: value } }
        : s
    ),
  }
  updateAndSave(updatedStory)
}
```

**Update the import line to include `Dimension`:**
```tsx
import type { Story, Dimension } from '../types/story'
```

**Update `<CardEditor>` JSX to pass the new prop:**
```tsx
<CardEditor
  step={activeStep}
  onBeatTextChange={handleBeatTextChange}
  onNotesChange={handleNotesChange}
  onScoreChange={handleScoreChange}
/>
```

**Acceptance:** Changing a slider value updates `actualScores` in localStorage immediately. Refreshing the page and reopening the card shows the saved scores. TypeScript 0 errors.

---

## Task 4 — CSS additions
**File:** `src/index.css` *(append)*

Append two CSS blocks after the existing workspace styles:
1. `/* ── Score Input ── */` (from Task 1)
2. `/* ── Card Editor Scores ── */` (from Task 2)

---

## Commit Instructions
```
git add src/components/ScoreInput.tsx src/components/CardEditor.tsx \
        src/pages/StoryWorkspacePage.tsx src/index.css
git commit -m "feat: Phase 3 — score inputs with target vs actual comparison and delta"
```

---

## UAT Checklist
- [ ] Opening any card shows 4 score rows (connection, pressure, hope, stability)
- [ ] Each row has a slider (0–10), actual value, target value, and delta
- [ ] Unset scores (0) show "—" for actual and no delta
- [ ] Setting a score to match target shows delta "0" (muted)
- [ ] Score above target shows green "+N" delta
- [ ] Score below target shows red "-N" delta
- [ ] Sliding to a new value updates display instantly (no save button)
- [ ] Hard-refresh preserves all entered scores
- [ ] Switching cards shows that card's scores (no stale values)
- [ ] `tsc --noEmit` — 0 errors
