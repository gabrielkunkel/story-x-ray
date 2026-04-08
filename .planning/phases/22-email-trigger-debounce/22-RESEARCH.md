# Phase 22: Email Trigger Debounce - Research

**Researched:** 2026-04-08
**Domain:** React event timing, debounce patterns, focus/blur event handling
**Confidence:** HIGH

## Summary

Phase 22 is a behavior-only change to `StoryWorkspacePage.tsx` and `CardEditor.tsx`. No new libraries are needed — the entire implementation uses native browser events (`onChange`, `onBlur`, `relatedTarget`), React's `useRef` and `useEffect` hooks, and existing state (`activeStepNumber`). The current Trigger 1 `useEffect` (lines 64–74 of `StoryWorkspacePage.tsx`) fires the modal immediately when the beat threshold is met; this phase replaces that with a debounce approach using `setTimeout` managed via a `useRef`.

The three trigger paths (idle timeout, qualifying-field blur, card navigation reset) map cleanly to existing React patterns already in use in the file. The key implementation challenge is the blur distinction: distinguishing "leaving the app" from "clicking another card." The `relatedTarget` API is the correct mechanism — confirmed safe because `StoryCard` renders as a native `<button>`, which is always focusable and always appears as `relatedTarget` when clicked.

**Primary recommendation:** Implement `useEmailDebounce` as a custom hook extracted from `StoryWorkspacePage.tsx`, keeping the page file readable. Use `relatedTarget` on the blur event to detect app-external blur — no flag mechanism needed.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** The immediate-blur trigger fires only from the **specific beat field whose entry pushed the filled-beat count to 4** (the "qualifying field"), not from any other beat field blur.
- **D-02:** Moving to a different story card (card-to-card navigation) does NOT constitute "clicking away" for blur-trigger purposes. The qualifying field's blur must result from leaving the app's engagement context (clicking outside the board, switching tabs, etc.), not from continued in-app movement.
- **D-03:** "Actively typing" means any input in either the **beat textarea OR the notes textarea** within the currently open CardEditor. Both fields count as continued engagement.
- **D-04:** Typing in notes resets the 10s idle timer. Notes and beat text are treated symmetrically for timer purposes.
- **D-05:** Clicking a different story card = continued engagement. The 10s idle timer resets (or continues counting from last actual interaction). The modal does NOT fire immediately on card-to-card navigation.
- **D-06:** The "qualified step" reference is retained across card navigation — the timer still knows which step triggered the threshold, and only blur from that step's beat field will fire the immediate modal.
- **D-07:** The 10s timer starts the first time the threshold is met (filledBeats >= 4). Every onChange in beat OR notes, and every card navigation event, resets the timer.
- **D-08:** Once the modal has shown this session (`hasShownThisSession('act1')` is true), no timer or blur should re-trigger it. Existing session-tracking logic is preserved.

### Claude's Discretion

- Mechanism for distinguishing "clicking away from app" vs "navigating to another card" at blur time (e.g., `relatedTarget`, delayed state check, or a `isNavigatingCards` flag — planner decides)
- Whether to extract debounce logic into a custom hook (`useEmailDebounce`) or keep it inline in `StoryWorkspacePage.tsx`
- Timer cleanup on component unmount

### Deferred Ideas (OUT OF SCOPE)

- **EMAIL-F01**: Configurable debounce timeout (currently hardcoded at 10s)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EMAIL-01 | Email modal does not appear while user is actively typing in a beat field | `onChange` on beat textarea AND notes textarea resets a `useRef`-held `setTimeout`. Both fields already have `onChange` wired to page callbacks. |
| EMAIL-02 | Email modal appears after user stops typing in a beat field for 10 seconds (when 4-beat threshold is met) | 10s `setTimeout` starts when `filledBeats >= 4` first becomes true; fires `setCaptureContext('act1')`. Reset on every onChange and card navigation. |
| EMAIL-03 | Email modal appears when user clicks away from (blurs) a beat field that completed the 4-beat threshold | Beat textarea `onBlur` propagated from `CardEditor` to page via new `onBeatTextBlur` prop. Only fires if the blurred step is the qualifying step AND `relatedTarget` is outside the board. `StoryCard` is a `<button>` so it will reliably appear as `relatedTarget` on card navigation. |
</phase_requirements>

---

## Standard Stack

### Core (no new dependencies)

| Library/API | Version | Purpose | Why Standard |
|-------------|---------|---------|--------------|
| React `useRef` | 19.2.4 (already installed) | Hold `setTimeout` ID and qualifying step number without triggering re-renders | Established pattern in this file (`beatThresholdCheckedRef`, `installCalloutShownRef`) |
| React `useEffect` | 19.2.4 (already installed) | React to `activeStepNumber` changes (card navigation) to reset timer | Already used for Trigger 1 |
| `setTimeout` / `clearTimeout` | Native browser API | 10s idle timer | Standard debounce primitive — no library needed at this scale |
| `FocusEvent.relatedTarget` | DOM Level 3 | Detect whether blur was to an in-app element vs. outside | Synchronous, reliable because `StoryCard` is a native `<button>` (always focusable) |

**Installation:** No new packages needed. [VERIFIED: package.json in codebase]

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Raw `setTimeout` | lodash `debounce` or `use-debounce` library | Overkill for a single 10s timer with manual reset control. Raw setTimeout is already the pattern used in this project. |
| `relatedTarget` check | `isNavigatingCards` flag | Flag approach requires wrapping every card click handler, which is more brittle. `relatedTarget` is synchronous and self-contained on the blur event. `StoryCard` is a native `<button>` so `relatedTarget` is always populated on card-to-card navigation — flag approach is unnecessary. |
| Custom hook `useEmailDebounce` | Inline in `StoryWorkspacePage.tsx` | Hook improves readability and testability. `StoryWorkspacePage.tsx` already has 347 lines; extracting the ~40-line debounce block keeps the page manageable. |

---

## Architecture Patterns

### Recommended Project Structure (no new files if inline; one new file if hook)

Option A (recommended — custom hook):
```
src/
├── hooks/
│   └── useEmailDebounce.ts    # new — encapsulates timer + blur logic
├── pages/
│   └── StoryWorkspacePage.tsx # modified — replace Trigger 1 useEffect, add onBeatTextBlur
├── components/
│   └── CardEditor.tsx          # modified — add onBeatTextBlur prop to beat textarea
└── utils/
    └── emailCapture.ts         # unchanged
```

Option B (inline):
```
src/
├── pages/
│   └── StoryWorkspacePage.tsx # all changes here
├── components/
│   └── CardEditor.tsx          # modified — onBeatTextBlur prop
└── utils/
    └── emailCapture.ts         # unchanged
```

### Pattern 1: Debounce with useRef Timer

**What:** Hold a `setTimeout` ID in a `useRef` so it persists across renders. Cancel and restart the timer on every reset event.

**When to use:** Any "fire after idle" behavior in a React component.

**Example:**
```typescript
// Source: Established React pattern — [CITED: React docs useRef]
const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
const qualifyingStepRef = useRef<number | null>(null)

function resetDebounceTimer() {
  if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
  if (hasShownThisSession('act1') || hasSubmittedEmail()) return
  if (qualifyingStepRef.current === null) return

  debounceTimerRef.current = setTimeout(() => {
    if (!hasShownThisSession('act1') && !hasSubmittedEmail()) {
      markShownThisSession('act1')
      setCaptureContext('act1')
    }
  }, 10_000)
}
```

### Pattern 2: Threshold Detection and Qualifying Step Capture

**What:** Replace `beatThresholdCheckedRef` with a `qualifyingStepRef` that stores the step number that triggered the threshold. Once set, the ref is never cleared (the timer handles deduplication via `hasShownThisSession`).

**When to use:** When the "one-shot" guard needs to carry identity information (which step), not just a boolean.

**Example:**
```typescript
// Source: [ASSUMED] — based on existing beatThresholdCheckedRef pattern in this codebase
// Runs inside useEffect([story]) or inside handleBeatTextChange
const filledBeats = story.steps.filter(s => s.beatText.trim().length > 0).length
if (filledBeats >= 4 && qualifyingStepRef.current === null) {
  qualifyingStepRef.current = activeStepNumber  // capture which step just qualified
  resetDebounceTimer()
}
```

### Pattern 3: Qualifying-Field Blur via relatedTarget

**What:** When the beat textarea in `CardEditor` fires `onBlur`, pass the event up to the page. The page checks: (1) is the blurred step the qualifying step? (2) is `relatedTarget` outside the board (i.e., null or not a descendant of `.workspace__board`)?

**When to use:** Detecting "left the app" vs "clicked another element inside the app."

**Key behavior of relatedTarget — confirmed safe:**
- Tab switch / window blur: `relatedTarget` is `null` — app-external, modal fires
- Click on another `StoryCard` (a `<button>`): `relatedTarget` is the button element, which IS inside `.workspace__board` — card navigation, modal does NOT fire [VERIFIED: StoryCard.tsx renders as native `<button>`]
- Click on browser chrome or outside app window: `relatedTarget` is `null` — fires

**Example:**
```typescript
// Source: [VERIFIED: MDN FocusEvent.relatedTarget — https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget]
// Source: [VERIFIED: codebase StoryCard.tsx — root element is <button>]
function handleBeatTextBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
  if (hasShownThisSession('act1') || hasSubmittedEmail()) return
  if (qualifyingStepRef.current === null) return
  if (activeStepNumber !== qualifyingStepRef.current) return  // not the qualifying field

  const boardEl = document.querySelector('.workspace__board')
  const target = e.relatedTarget as Node | null
  const isInAppNavigation = boardEl && target && boardEl.contains(target)

  if (!isInAppNavigation) {
    // Blur was to outside the board — fire immediately
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    markShownThisSession('act1')
    setCaptureContext('act1')
  }
  // If in-app navigation: blur was to another card button — do nothing, timer continues
}
```

### Pattern 4: CardEditor onBeatTextBlur Prop

**What:** Follow the existing `onBeatTextChange` / `onNotesChange` prop pattern to wire blur events from the textarea up to the page.

**Example:**
```typescript
// CardEditor.tsx — minimal addition
interface Props {
  step: StoryStep
  onBeatTextChange: (value: string) => void
  onNotesChange: (value: string) => void
  onScoreChange: (dimension: Dimension, value: number) => void
  onBeatTextBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void  // new, optional
}

// In the beat textarea JSX:
<textarea
  id="beat-text"
  key={step.stepNumber}
  defaultValue={step.beatText}
  onChange={e => onBeatTextChange(e.target.value)}
  onBlur={onBeatTextBlur}   // new
  placeholder="What happens in this step of your story?"
  rows={6}
/>
```

### Pattern 5: useEffect for Card Navigation Reset

**What:** `activeStepNumber` is already in state. A `useEffect` that watches `activeStepNumber` can reset the timer when the user navigates between cards — consistent with D-05 and D-07.

**Example:**
```typescript
// Source: [ASSUMED] — consistent with existing useEffect([story]) pattern on line 65
useEffect(() => {
  if (qualifyingStepRef.current !== null) {
    resetDebounceTimer()
  }
}, [activeStepNumber])
```

### Pattern 6: Component Unmount Cleanup

**What:** Clear the timer on component unmount to prevent firing after navigation away from the workspace.

**Example:**
```typescript
// Source: [CITED: React useEffect cleanup docs]
useEffect(() => {
  return () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
  }
}, [])
```

### Anti-Patterns to Avoid

- **Using `useState` for the timer ID:** `setState` causes re-renders; `useRef` is correct for mutable values that don't need to trigger renders. [CITED: React docs on useRef vs useState]
- **Re-checking `filledBeats` on every render:** The qualifying step should be captured once, not recalculated. Use a ref guard like `qualifyingStepRef.current === null` to ensure one-time capture.
- **Clearing `qualifyingStepRef` on card navigation:** The qualifying step identity must persist across card navigation (D-06). Only `hasShownThisSession` controls whether the modal can fire.
- **Using `isNavigatingCards` flag instead of `relatedTarget`:** Unnecessary complexity — `StoryCard` is a `<button>` so `relatedTarget` is always populated on card click. The flag approach requires wrapping all card click handlers.
- **Checking `relatedTarget` containment against the entire document:** Check against `.workspace__board` specifically to avoid false positives from the sidebar, graph, or diagnostics panel. Per D-02, only blur out of the board context is "app-external" for the blur trigger.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Debounce library | Custom debounce class/utility | Raw `setTimeout` + `useRef` | 10s single-instance timer needs no abstraction |
| Focus trap / outside-click detection library | Custom event listener on document | `FocusEvent.relatedTarget` | Native DOM API, synchronous, no setup cost; `StoryCard` is `<button>` so it always populates `relatedTarget` |
| Session deduplication | Custom storage key logic | `hasShownThisSession('act1')` / `markShownThisSession('act1')` | Already implemented in `emailCapture.ts`, proven across 3 trigger paths |

---

## Common Pitfalls

### Pitfall 1: relatedTarget is null on card click — NOT a risk here

**Status: RESOLVED — not a risk for this codebase.**

`StoryCard` renders as a native `<button>` element (verified in `StoryCard.tsx`). Native buttons are always focusable and always appear as `relatedTarget` when clicked. The `relatedTarget === null` path (which fires the modal) is only reached on genuine app-external events: tab switch, window blur, clicking outside the browser viewport. No special handling needed.

[VERIFIED: `src/components/StoryCard.tsx` — root element is `<button aria-pressed={isActive}>` with no `tabindex` needed]

### Pitfall 2: Timer fires after story navigation (unmount)

**What goes wrong:** User fills 4 beats, immediately navigates to a different story (via the home screen), and the modal fires on the new story's workspace after 10s.

**Why it happens:** If the `useEffect` cleanup doesn't clear the timer on component unmount, the `setTimeout` callback still holds a stale `setCaptureContext` closure reference.

**How to avoid:** Always return a cleanup function from the debounce `useEffect` (Pattern 6 above).

**Warning signs:** Modal appears on a different story page without any typing.

### Pitfall 3: Timer resets unnecessarily before threshold is met

**What goes wrong:** `useEffect([activeStepNumber])` fires on every card navigation. If `resetDebounceTimer()` is called unconditionally, it runs unnecessary work (clearTimeout on a null timer) for every card click before the threshold is met.

**Why it happens:** `useEffect([activeStepNumber])` runs on every card navigation, even before threshold.

**How to avoid:** Guard `resetDebounceTimer()` calls with `if (qualifyingStepRef.current !== null)`.

### Pitfall 4: Qualifying step captured with null activeStepNumber

**What goes wrong:** If `activeStepNumber` is `null` at the moment the threshold is first detected (e.g., story state updates while no card is open), `qualifyingStepRef.current` gets set to `null`, defeating the qualifying-field logic.

**Why it happens:** The threshold check runs inside `useEffect([story])` which can fire independently of card selection state.

**How to avoid:** Add guard: `if (filledBeats >= 4 && qualifyingStepRef.current === null && activeStepNumber !== null)`. If threshold is met with no active card, skip capturing until next onChange (by which point a card will be active).

### Pitfall 5: ESLint exhaustive-deps warnings on useEffect

**What goes wrong:** `useEffect` with `resetDebounceTimer` in the body may trigger `react-hooks/exhaustive-deps` lint warnings if `resetDebounceTimer` is defined as a regular function rather than `useCallback`.

**Why it happens:** The project uses `eslint-plugin-react-hooks` (confirmed in devDependencies). Functions referenced in `useEffect` that are not listed as dependencies cause lint warnings.

**How to avoid:** If extracting to `useEmailDebounce` hook: define `resetDebounceTimer` with `useCallback` and list only stable refs in the dependency array. If inline: be prepared to suppress or satisfy the lint rule. Using `useCallback` for `resetDebounceTimer` is the cleaner path.

---

## Code Examples

### Complete Timer Management Block

```typescript
// Source: [ASSUMED] — synthesized from existing codebase patterns and React docs
// In StoryWorkspacePage.tsx or useEmailDebounce.ts

const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
const qualifyingStepRef = useRef<number | null>(null)

function resetDebounceTimer() {
  if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
  if (hasShownThisSession('act1') || hasSubmittedEmail()) return
  if (qualifyingStepRef.current === null) return

  debounceTimerRef.current = setTimeout(() => {
    if (!hasShownThisSession('act1') && !hasSubmittedEmail()) {
      markShownThisSession('act1')
      setCaptureContext('act1')
    }
  }, 10_000)
}

// Unmount cleanup
useEffect(() => {
  return () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
  }
}, [])

// Card navigation reset
useEffect(() => {
  if (qualifyingStepRef.current !== null) {
    resetDebounceTimer()
  }
}, [activeStepNumber])
```

### Threshold Detection (replaces Trigger 1 useEffect)

```typescript
// Replaces lines 64–74 of StoryWorkspacePage.tsx
useEffect(() => {
  if (!story) return
  if (hasShownThisSession('act1') || hasSubmittedEmail()) return
  if (qualifyingStepRef.current !== null) return  // already captured

  const filledBeats = story.steps.filter(s => s.beatText.trim().length > 0).length
  if (filledBeats >= 4 && activeStepNumber !== null) {
    qualifyingStepRef.current = activeStepNumber
    resetDebounceTimer()
  }
}, [story])
```

### handleBeatTextChange with Timer Reset

```typescript
// Replaces lines 116–124 of StoryWorkspacePage.tsx
function handleBeatTextChange(value: string) {
  if (activeStepNumber === null) return
  updateAndSave({
    ...story!,
    steps: story!.steps.map(s =>
      s.stepNumber === activeStepNumber ? { ...s, beatText: value } : s
    ),
  })
  // Reset idle timer on every keystroke (EMAIL-01)
  if (qualifyingStepRef.current !== null) {
    resetDebounceTimer()
  }
}
```

### handleNotesChange with Timer Reset

```typescript
// Replaces lines 126–134 of StoryWorkspacePage.tsx
function handleNotesChange(value: string) {
  if (activeStepNumber === null) return
  updateAndSave({
    ...story!,
    steps: story!.steps.map(s =>
      s.stepNumber === activeStepNumber ? { ...s, notes: value } : s
    ),
  })
  // D-04: Notes resets timer symmetrically with beat text (EMAIL-01)
  if (qualifyingStepRef.current !== null) {
    resetDebounceTimer()
  }
}
```

---

## Runtime State Inventory

> This is a behavior change, not a rename/migration phase. No stored data keys are changing. `hasShownThisSession('act1')` uses `sessionStorage` key `sxr:cap:act1` — unchanged. `hasSubmittedEmail()` uses `localStorage` key `sxr:cap:submitted` — unchanged.

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | `sessionStorage['sxr:cap:act1']`, `localStorage['sxr:cap:submitted']` | None — keys are preserved; no migration |
| Live service config | None — no external service config changed | None |
| OS-registered state | None | None |
| Secrets/env vars | None | None |
| Build artifacts | None — TypeScript compilation only | None |

---

## State of the Art

| Old Approach | Current Approach | Impact for This Phase |
|--------------|-----------------|----------------------|
| Trigger 1 fires modal immediately when `filledBeats >= 4` | Debounced: fires after 10s idle OR qualifying blur | This IS the change Phase 22 makes |
| `beatThresholdCheckedRef` (boolean) prevents re-check | `qualifyingStepRef` (number) serves same guard but carries step identity | Replace `beatThresholdCheckedRef` — the boolean is subsumed by the ref being non-null |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | ~~`StoryCard` root element is not focusable~~ — RESOLVED: `StoryCard` IS a native `<button>`. `relatedTarget` will always be populated on card click. | Pitfall 1 | No risk — verified. |
| A2 | Qualifying step should be captured against `activeStepNumber` at threshold-met time | Pattern 2 | If threshold is detected during a save cycle where no card is open, capturing `activeStepNumber` as `null` breaks the blur check. Guard in Pitfall 4 addresses this. |
| A3 | Extracting to `useEmailDebounce` hook is the right structural choice | Architecture Patterns | If planner prefers inline, all patterns still apply; only file organization changes. |

**A1 is fully resolved — no user confirmation needed for that item.**

---

## Open Questions

1. **beatThresholdCheckedRef fate**
   - What we know: `beatThresholdCheckedRef` is a boolean ref that currently prevents the threshold check from re-running after modal fires. CONTEXT.md says it "will need to be repurposed or removed."
   - Recommendation: Remove `beatThresholdCheckedRef` and replace with `qualifyingStepRef<number | null>`. The non-null check on `qualifyingStepRef` serves the same boolean guard role while also carrying step identity. This is a clean 1-for-1 replacement.

2. **Does `src/hooks/` directory exist?**
   - Not verified in this research session. If it doesn't exist, the planner's Wave 0 task should create it before adding `useEmailDebounce.ts`.
   - This is trivially resolved at implementation time — no blocker.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 22 is a pure code change to existing React/TypeScript files. No external tools, databases, CLIs, or services are introduced.

---

## Validation Architecture

`workflow.nyquist_validation` is not set in `.planning/config.json` — treat as enabled.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — no test framework installed [VERIFIED: no vitest/jest config files found, no test files in src/] |
| Config file | None |
| Quick run command | N/A — no framework installed |
| Full suite command | N/A — no framework installed |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EMAIL-01 | Modal does not fire during active typing | manual-only | N/A — no test framework | No framework |
| EMAIL-02 | Modal fires after 10s idle post-threshold | manual-only | N/A — no test framework | No framework |
| EMAIL-03 | Modal fires on qualifying blur outside board | manual-only | N/A — no test framework | No framework |

**Note:** All three requirements are timing/event-interaction behaviors that require a real browser or jsdom environment with fake timer support to test automatically. Manual verification via browser is the correct validation path for this phase. The planner should include a manual test checklist matching the phase Success Criteria.

**Manual test checklist (for verification plan):**
1. Fill 4 beats; keep typing — modal must NOT appear, even after 10s of continuous typing
2. Fill 4 beats; stop typing for 10s — modal MUST appear after exactly 10s idle
3. Fill 4 beats; stop typing; resume typing before 10s — modal must NOT appear during resumed typing
4. Fill 4 beats; click away from app (browser URL bar or desktop) — modal MUST appear immediately
5. Fill 4 beats; click another story card — modal must NOT appear immediately (timer continues)
6. Reload page after completing steps 1–5 — modal must NOT reappear (session tracking preserved)

### Wave 0 Gaps

No test framework is installed. Installing one (vitest + @testing-library/react) is out of scope for Phase 22. Manual testing via browser is the validation path.

*(If the project installs a test framework in a future phase, EMAIL-01/02/03 are candidates for `userEvent` + `vi.useFakeTimers()` tests.)*

---

## Security Domain

Phase 22 introduces no new data collection, no new input surfaces, and no new authentication paths. The email modal already existed; this phase changes only when it fires. No new ASVS categories are implicated.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Not applicable |
| V3 Session Management | No | `sessionStorage` use unchanged |
| V4 Access Control | No | Not applicable |
| V5 Input Validation | No | No new inputs introduced |
| V6 Cryptography | No | Not applicable |

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: codebase] `src/pages/StoryWorkspacePage.tsx` — existing Trigger 1 logic (lines 64–74), handleBeatTextChange (116–124), handleNotesChange (126–134), existing ref patterns (`beatThresholdCheckedRef`, `installCalloutShownRef`)
- [VERIFIED: codebase] `src/components/CardEditor.tsx` — existing Props interface, beat textarea (`onChange` wired), notes textarea (`onChange` wired); no `onBlur` currently
- [VERIFIED: codebase] `src/components/StoryCard.tsx` — root element is native `<button aria-pressed>`, confirming `relatedTarget` will be populated on card click
- [VERIFIED: codebase] `src/utils/emailCapture.ts` — `hasShownThisSession`, `markShownThisSession`, `hasSubmittedEmail`, `sessionStorage` key format `sxr:cap:{trigger}`
- [VERIFIED: codebase] `package.json` — React 19.2.4, `eslint-plugin-react-hooks` in devDependencies, no test framework installed
- [VERIFIED: MDN] `FocusEvent.relatedTarget` — https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget

### Secondary (MEDIUM confidence)
- [CITED: React docs] `useRef` for mutable values that do not trigger re-renders — standard React pattern
- [CITED: React docs] `useEffect` cleanup function for timer teardown on unmount

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; all patterns verified against existing codebase
- Architecture: HIGH — patterns directly derived from verified source files; `StoryCard` button confirmed
- Pitfalls: HIGH — Pitfall 1 (relatedTarget null on card click) resolved as non-issue; remaining pitfalls are standard React ref/cleanup patterns

**Research date:** 2026-04-08
**Valid until:** 2026-05-08 (stable domain — React hooks + DOM events do not change)
