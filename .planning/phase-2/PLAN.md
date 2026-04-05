# Phase 2 — 16-Card Board
**Goal:** Replace the workspace placeholder with a working 4-column story board, 16 interactive cards, and a card editor that auto-saves to localStorage.

## Architecture Overview

```
StoryWorkspacePage          ← holds all state, orchestrates layout
  BoardHeader               ← story title, back nav
  4× ActColumn              ← one per act (I, IIA, IIB, III)
    4× StoryCard            ← step #, label, purpose, filled indicator, active state
  CardEditor                ← right-panel editor for selected step
```

**State lives in `StoryWorkspacePage`:**
- `story: Story` — full story object, updated in-place on every edit
- `activeStepNumber: number | null` — which card is open (null = none)

**Auto-save strategy:** Call `saveStory(story)` on every `onChange` — localStorage writes are synchronous and fast enough for MVP. No debounce needed.

**Layout:** Two-panel flex. Board (left, scrollable) + Editor (right, sticky). Stacks vertically on mobile.

---

## Task 1 — StoryCard Component
**File:** `src/components/StoryCard.tsx` *(create)*

Displays a single story step. Clicking it sets it as active in the parent.

```tsx
import type { StoryStep } from '../types/story'

interface Props {
  step: StoryStep
  isActive: boolean
  onClick: () => void
}

export default function StoryCard({ step, isActive, onClick }: Props) {
  const hasBeat = step.beatText.trim().length > 0

  return (
    <button
      className={`story-card${isActive ? ' story-card--active' : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Step ${step.stepNumber}: ${step.label}`}
    >
      <div className="story-card__number">
        {String(step.stepNumber).padStart(2, '0')}
      </div>
      <div className="story-card__body">
        <div className="story-card__label">{step.label}</div>
        <div className="story-card__purpose">{step.purpose}</div>
      </div>
      {hasBeat && (
        <div className="story-card__filled" aria-label="Beat text added" />
      )}
    </button>
  )
}
```

**CSS classes to add to `index.css`:**
```css
.story-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  background: var(--bg);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  position: relative;

  &:hover {
    border-color: var(--accent-border);
    background: var(--accent-bg);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.story-card--active {
  border-color: var(--accent);
  background: var(--accent-bg);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.story-card__number {
  font: 700 11px/1 var(--mono);
  color: var(--accent);
  padding-top: 2px;
  flex-shrink: 0;
}

.story-card__body {
  flex: 1;
  min-width: 0;
}

.story-card__label {
  font: 600 13px/1.3 var(--sans);
  color: var(--text-h);
  margin-bottom: 3px;
}

.story-card__purpose {
  font: 400 11px/1.4 var(--sans);
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.story-card__filled {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
  margin-top: 4px;
}
```

**Acceptance:** Card renders step number (zero-padded), label, purpose. Active card has purple border. Filled dot appears only when `beatText` is non-empty.

---

## Task 2 — ActColumn Component
**File:** `src/components/ActColumn.tsx` *(create)*

Renders one act column: header label + 4 `StoryCard` children.

```tsx
import type { StoryStep } from '../types/story'
import StoryCard from './StoryCard'

interface Props {
  actLabel: string           // 'Act I', 'Act IIA', 'Act IIB', 'Act III'
  steps: StoryStep[]         // exactly 4 steps
  activeStepNumber: number | null
  onCardClick: (stepNumber: number) => void
}

export default function ActColumn({ actLabel, steps, activeStepNumber, onCardClick }: Props) {
  return (
    <div className="act-column">
      <div className="act-column__header">{actLabel}</div>
      <div className="act-column__cards">
        {steps.map(step => (
          <StoryCard
            key={step.stepNumber}
            step={step}
            isActive={activeStepNumber === step.stepNumber}
            onClick={() => onCardClick(step.stepNumber)}
          />
        ))}
      </div>
    </div>
  )
}
```

**CSS:**
```css
.act-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;
  flex: 1;
}

.act-column__header {
  font: 700 11px/1 var(--sans);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text);
  padding: 4px 2px 8px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}

.act-column__cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

**Acceptance:** Column header shows act label. Exactly 4 cards rendered. Active card highlights correctly.

---

## Task 3 — CardEditor Component
**File:** `src/components/CardEditor.tsx` *(create)*

Editor panel for the selected step. Shows structural info (read-only) and editable beat text + notes. Calls callbacks on change — parent handles saving.

```tsx
import { STEP_HINTS } from '../data/steps'
import type { StoryStep } from '../types/story'

interface Props {
  step: StoryStep
  onBeatTextChange: (value: string) => void
  onNotesChange: (value: string) => void
}

export default function CardEditor({ step, onBeatTextChange, onNotesChange }: Props) {
  const hint = STEP_HINTS[step.stepNumber]

  return (
    <aside className="card-editor">
      <div className="card-editor__header">
        <span className="card-editor__step-num">
          Step {step.stepNumber}
        </span>
        <h2 className="card-editor__label">{step.label}</h2>
      </div>

      <div className="card-editor__purpose">{step.purpose}</div>

      {hint && (
        <details className="card-editor__hint">
          <summary>Writing hint</summary>
          <p>{hint}</p>
        </details>
      )}

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

**Note on `key={step.stepNumber}`:** Using `key` on the textareas tied to `stepNumber` forces React to remount when switching cards, correctly resetting the uncontrolled textarea to the new step's value. This is intentional — do not remove it.

**CSS:**
```css
.card-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: var(--surface);
  border-left: 1px solid var(--border);
  min-width: 280px;
  max-width: 380px;
  overflow-y: auto;
}

.card-editor__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-editor__step-num {
  font: 700 11px/1 var(--mono);
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.card-editor__label {
  font-size: 1.1rem;
  color: var(--text-h);
}

.card-editor__purpose {
  font-size: 13px;
  color: var(--text);
  line-height: 1.5;
  padding: 10px 12px;
  background: var(--bg);
  border-radius: 6px;
  border: 1px solid var(--border);
}

.card-editor__hint {
  font-size: 13px;
  color: var(--text);

  summary {
    cursor: pointer;
    font-weight: 600;
    color: var(--accent);
    padding: 4px 0;

    &:hover {
      opacity: 0.8;
    }
  }

  p {
    margin-top: 8px;
    line-height: 1.5;
    padding: 8px 12px;
    background: var(--accent-bg);
    border-radius: 6px;
    border: 1px solid var(--accent-border);
  }
}

.card-editor__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

**Acceptance:** Switching cards updates all fields to the new step's data. Beat text and notes are independently editable. Hint is collapsible via `<details>`. No React key-related stale value bugs.

---

## Task 4 — BoardHeader Component
**File:** `src/components/BoardHeader.tsx` *(create)*

Thin top bar: story title (truncated) + back-to-start nav.

```tsx
import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
}

export default function BoardHeader({ title }: Props) {
  const navigate = useNavigate()

  return (
    <header className="board-header">
      <button className="btn-ghost board-header__back" onClick={() => navigate('/')}>
        ←
      </button>
      <h1 className="board-header__title">{title}</h1>
    </header>
  )
}
```

**CSS:**
```css
.board-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  position: sticky;
  top: 0;
  z-index: 10;
}

.board-header__back {
  padding: 6px 10px;
  font-size: 18px;
  flex-shrink: 0;
}

.board-header__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-h);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
```

**Acceptance:** Title visible and truncated if long. Back arrow navigates to `/`.

---

## Task 5 — StoryWorkspacePage (replace placeholder)
**File:** `src/pages/StoryWorkspacePage.tsx` *(rewrite)*

Full replacement of the Phase 1 placeholder. Owns all board state, routes story data and callbacks to child components, and persists on every edit.

```tsx
import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loadStory, saveStory } from '../services/storage'
import type { Story } from '../types/story'
import BoardHeader from '../components/BoardHeader'
import ActColumn from '../components/ActColumn'
import CardEditor from '../components/CardEditor'

const ACT_LABELS: Record<string, string> = {
  I:   'Act I',
  IIA: 'Act IIA',
  IIB: 'Act IIB',
  III: 'Act III',
}
const ACT_ORDER = ['I', 'IIA', 'IIB', 'III'] as const

export default function StoryWorkspacePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [story, setStory] = useState<Story | null>(() =>
    id ? loadStory(id) : null
  )
  const [activeStepNumber, setActiveStepNumber] = useState<number | null>(null)

  const updateAndSave = useCallback((updatedStory: Story) => {
    setStory(updatedStory)
    saveStory(updatedStory)
  }, [])

  if (!story) {
    return (
      <main className="workspace-error">
        <p>Story not found.</p>
        <button className="btn-ghost" onClick={() => navigate('/')}>
          Back to start
        </button>
      </main>
    )
  }

  const activeStep = activeStepNumber !== null
    ? story.steps.find(s => s.stepNumber === activeStepNumber) ?? null
    : null

  function handleBeatTextChange(value: string) {
    if (!activeStepNumber) return
    const updatedStory: Story = {
      ...story!,
      steps: story!.steps.map(s =>
        s.stepNumber === activeStepNumber ? { ...s, beatText: value } : s
      ),
    }
    updateAndSave(updatedStory)
  }

  function handleNotesChange(value: string) {
    if (!activeStepNumber) return
    const updatedStory: Story = {
      ...story!,
      steps: story!.steps.map(s =>
        s.stepNumber === activeStepNumber ? { ...s, notes: value } : s
      ),
    }
    updateAndSave(updatedStory)
  }

  return (
    <div className="workspace">
      <BoardHeader title={story.title} />

      <div className="workspace__body">
        <div className="workspace__board">
          <div className="board-grid">
            {ACT_ORDER.map(act => (
              <ActColumn
                key={act}
                actLabel={ACT_LABELS[act]}
                steps={story.steps.filter(s => s.act === act)}
                activeStepNumber={activeStepNumber}
                onCardClick={stepNum =>
                  setActiveStepNumber(prev => prev === stepNum ? null : stepNum)
                }
              />
            ))}
          </div>
        </div>

        {activeStep && (
          <CardEditor
            step={activeStep}
            onBeatTextChange={handleBeatTextChange}
            onNotesChange={handleNotesChange}
          />
        )}
      </div>
    </div>
  )
}
```

**Note on card toggle:** Clicking an already-active card deselects it (`prev === stepNum ? null : stepNum`). This closes the editor.

**CSS:**
```css
.workspace {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
}

.workspace-error {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 48px 24px;
}

.workspace__body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.workspace__board {
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  padding: 24px;
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(170px, 1fr));
  gap: 16px;
  min-width: 720px;
}

@media (max-width: 768px) {
  .workspace__body {
    flex-direction: column;
  }

  .card-editor {
    max-width: 100%;
    border-left: none;
    border-top: 1px solid var(--border);
  }
}
```

**Acceptance:**
- 4 act columns render with correct headers
- 16 cards total, in correct act groupings
- Clicking a card opens the editor on the right
- Clicking the same card again closes the editor
- Typing in beat text / notes saves immediately to localStorage
- Refreshing the page and re-opening the same card shows previously typed content
- Filled dot appears on cards that have beat text

---

## Task 6 — CSS additions
**File:** `src/index.css` *(append)*

Append all the CSS blocks defined in Tasks 1–5 to `index.css`. These should go at the bottom, after the existing page layout classes.

Sections to add (in order):
1. `/* ── Story Card ─── */`
2. `/* ── Act Column ─── */`
3. `/* ── Card Editor ─── */`
4. `/* ── Board Header ─── */`
5. `/* ── Workspace ─── */`

**Acceptance:** No visual regressions on StartPage or StorySetupPage. Board renders correctly in both light and dark mode.

---

## Commit Instructions
```
git add src/components/StoryCard.tsx src/components/ActColumn.tsx \
        src/components/CardEditor.tsx src/components/BoardHeader.tsx \
        src/pages/StoryWorkspacePage.tsx src/index.css
git commit -m "feat: Phase 2 — 16-card board with act columns, card editor, auto-save"
```

---

## UAT Checklist
- [ ] Board shows 4 columns labeled "Act I", "Act IIA", "Act IIB", "Act III"
- [ ] Each column has exactly 4 cards
- [ ] Cards display step number (zero-padded), label, and purpose
- [ ] Clicking a card opens the editor panel on the right
- [ ] Clicking the same card again closes the editor
- [ ] Editor shows step number, label, purpose (read-only), and hint (collapsible)
- [ ] Beat text field is editable; changes are reflected immediately
- [ ] Notes field is editable; changes are reflected immediately
- [ ] Switching to a different card shows that card's data (no stale content)
- [ ] Hard-refreshing the page preserves beat text and notes (localStorage)
- [ ] Filled dot (•) appears on cards that have been given beat text
- [ ] Back arrow navigates to start page
- [ ] Board is horizontally scrollable at narrow widths (mobile)
- [ ] `tsc --noEmit` — 0 errors
