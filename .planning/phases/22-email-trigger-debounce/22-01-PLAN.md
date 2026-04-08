---
phase: 22
plan: 1
title: Email Trigger Debounce — Hook, Page Wiring, and Blur Prop
wave: 1
depends_on: []
files_modified:
  - src/hooks/useEmailDebounce.ts
  - src/pages/StoryWorkspacePage.tsx
  - src/components/CardEditor.tsx
autonomous: true
requirements: [EMAIL-01, EMAIL-02, EMAIL-03]
---

# Plan 1: Email Trigger Debounce — Hook, Page Wiring, and Blur Prop

## Goal
Replace the immediate 4-beat email modal trigger with a debounce-based trigger: modal fires only after 10s idle or a qualifying blur to outside the board, never during active typing or card-to-card navigation.

## must_haves
- [ ] `src/hooks/useEmailDebounce.ts` exists and exports `useEmailDebounce`
- [ ] `useEmailDebounce` holds `debounceTimerRef` and `qualifyingStepRef` as `useRef` values (not `useState`)
- [ ] `StoryWorkspacePage.tsx` no longer contains the old Trigger 1 `useEffect` (lines 64–74 pattern: `beatThresholdCheckedRef.current = true; markShownThisSession('act1'); setCaptureContext('act1')` executed immediately)
- [ ] `StoryWorkspacePage.tsx` does not import or reference `beatThresholdCheckedRef`
- [ ] `handleBeatTextChange` in `StoryWorkspacePage.tsx` calls `resetDebounceTimer()` (or equivalent reset function from the hook)
- [ ] `handleNotesChange` in `StoryWorkspacePage.tsx` calls `resetDebounceTimer()` (or equivalent reset function from the hook)
- [ ] `CardEditor.tsx` Props interface includes `onBeatTextBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void`
- [ ] Beat textarea in `CardEditor.tsx` has `onBlur={onBeatTextBlur}` attribute
- [ ] `StoryWorkspacePage.tsx` passes `onBeatTextBlur={handleBeatTextBlur}` to `<CardEditor>`
- [ ] `npm run build` exits 0

## threat_model
**Threats identified:**
- Modal fires repeatedly if session-check guard is missing: Mitigated — `hasShownThisSession('act1')` checked inside timer callback AND in blur handler before firing. `markShownThisSession('act1')` called before `setCaptureContext` to prevent race conditions.
- Timer fires after component unmount (stale closure on story navigation): Mitigated — `useEffect` cleanup in `useEmailDebounce` clears `debounceTimerRef.current` on unmount.
- `qualifyingStepRef` captured with `null` activeStepNumber (threshold detected with no card open): Mitigated — guard `if (filledBeats >= 4 && qualifyingStepRef.current === null && activeStepNumber !== null)` prevents null capture.
- False positive blur trigger from in-app navigation: Mitigated — `relatedTarget` checked against `.workspace__board` containment; `StoryCard` is a native `<button>` so it always appears as `relatedTarget` on card click.

**ASVS L1 checks:**
- [ ] V3.3 (Session Management): `sessionStorage` key `sxr:cap:act1` is read-only consumed; no new session keys introduced
- [ ] V5.1 (Input Validation): No new user inputs collected; blur event uses DOM read-only `relatedTarget` — no attacker-controlled input

## Tasks

<task id="1" title="Create useEmailDebounce hook">
<read_first>
- `src/hooks/usePWAInstall.ts` — hook file pattern and export convention for this project
- `src/utils/emailCapture.ts` — exact signatures: `hasShownThisSession(trigger: string)`, `markShownThisSession(trigger: string)`, `hasSubmittedEmail()` — used in the hook
- `src/pages/StoryWorkspacePage.tsx` lines 64–74 — the old Trigger 1 logic being replaced (understand what to supersede)
</read_first>

<action>
Create `src/hooks/useEmailDebounce.ts`.

The hook signature is:

```typescript
export function useEmailDebounce(
  story: Story | null,
  activeStepNumber: number | null,
  setCaptureContext: (ctx: 'act1') => void
): {
  resetDebounceTimer: () => void
  handleBeatTextBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void
}
```

**Imports required:**
```typescript
import { useRef, useEffect, useCallback } from 'react'
import type { Story } from '../types/story'
import { hasShownThisSession, markShownThisSession, hasSubmittedEmail } from '../utils/emailCapture'
```

**Internal refs (both `useRef`, never `useState`):**
```typescript
const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
const qualifyingStepRef = useRef<number | null>(null)
```

**`resetDebounceTimer` function (wrap in `useCallback`):**
```typescript
const resetDebounceTimer = useCallback(() => {
  if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
  if (hasShownThisSession('act1') || hasSubmittedEmail()) return
  if (qualifyingStepRef.current === null) return

  debounceTimerRef.current = setTimeout(() => {
    if (!hasShownThisSession('act1') && !hasSubmittedEmail()) {
      markShownThisSession('act1')
      setCaptureContext('act1')
    }
  }, 10_000)
}, [setCaptureContext])
```

**Threshold detection useEffect (replaces old Trigger 1 — detects qualifying step):**
```typescript
useEffect(() => {
  if (!story) return
  if (hasShownThisSession('act1') || hasSubmittedEmail()) return
  if (qualifyingStepRef.current !== null) return  // already captured

  const filledBeats = story.steps.filter(s => s.beatText.trim().length > 0).length
  if (filledBeats >= 4 && activeStepNumber !== null) {
    qualifyingStepRef.current = activeStepNumber
    resetDebounceTimer()
  }
}, [story, activeStepNumber, resetDebounceTimer])
```

**Card navigation reset useEffect (D-05, D-07):**
```typescript
useEffect(() => {
  if (qualifyingStepRef.current !== null) {
    resetDebounceTimer()
  }
}, [activeStepNumber, resetDebounceTimer])
```

**Unmount cleanup useEffect (prevents stale closure firing after story navigation):**
```typescript
useEffect(() => {
  return () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
  }
}, [])
```

**`handleBeatTextBlur` function (wrap in `useCallback`) — implements D-01, D-02, EMAIL-03:**
```typescript
const handleBeatTextBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
  if (hasShownThisSession('act1') || hasSubmittedEmail()) return
  if (qualifyingStepRef.current === null) return
  if (activeStepNumber !== qualifyingStepRef.current) return  // not the qualifying field (D-01)

  const boardEl = document.querySelector('.workspace__board')
  const target = e.relatedTarget as Node | null
  const isInAppNavigation = boardEl !== null && target !== null && boardEl.contains(target)

  if (!isInAppNavigation) {
    // Blur was to outside the board — fire immediately (D-02)
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    markShownThisSession('act1')
    setCaptureContext('act1')
  }
  // If isInAppNavigation: card-to-card navigation — do nothing, timer continues
}, [activeStepNumber, setCaptureContext])
```

Return `{ resetDebounceTimer, handleBeatTextBlur }`.

Do NOT use `useState` anywhere in this hook. Do NOT use lodash debounce or any external debounce utility — raw `setTimeout`/`clearTimeout` is the correct approach per research.
</action>

<acceptance_criteria>
- `src/hooks/useEmailDebounce.ts` exists
- `src/hooks/useEmailDebounce.ts` contains `export function useEmailDebounce`
- `src/hooks/useEmailDebounce.ts` contains `clearTimeout`
- `src/hooks/useEmailDebounce.ts` contains `10_000`
- `src/hooks/useEmailDebounce.ts` contains `qualifyingStepRef`
- `src/hooks/useEmailDebounce.ts` contains `debounceTimerRef`
- `src/hooks/useEmailDebounce.ts` contains `workspace__board`
- `src/hooks/useEmailDebounce.ts` contains `relatedTarget`
- `src/hooks/useEmailDebounce.ts` contains `markShownThisSession`
- `src/hooks/useEmailDebounce.ts` contains `hasSubmittedEmail`
- `src/hooks/useEmailDebounce.ts` does NOT contain `useState`
- `npm run build` exits 0 after this task
</acceptance_criteria>
</task>

<task id="2" title="Wire useEmailDebounce into StoryWorkspacePage — replace Trigger 1, add timer resets">
<read_first>
- `src/pages/StoryWorkspacePage.tsx` — full file; executor must see the current state before modifying
- `src/hooks/useEmailDebounce.ts` — the hook just created; understand its return signature `{ resetDebounceTimer, handleBeatTextBlur }`
</read_first>

<action>
Modify `src/pages/StoryWorkspacePage.tsx` to:

**1. Add import for the new hook (add after existing imports):**
```typescript
import { useEmailDebounce } from '../hooks/useEmailDebounce'
```

**2. Remove `beatThresholdCheckedRef`:**
Delete the line:
```typescript
const beatThresholdCheckedRef = useRef(false)
```

**3. Remove the old Trigger 1 useEffect (lines 64–74):**
Delete the entire block:
```typescript
// Trigger 1 — 4-beat threshold popup
useEffect(() => {
  if (!story || beatThresholdCheckedRef.current) return
  if (hasSubmittedEmail() || hasShownThisSession('act1')) return
  const filledBeats = story.steps.filter(s => s.beatText.trim().length > 0).length
  if (filledBeats >= 4) {
    beatThresholdCheckedRef.current = true
    markShownThisSession('act1')
    setCaptureContext('act1')
  }
}, [story])
```

**4. Add hook invocation after the `updateAndSave` callback (before `diagnostics = ...`):**
```typescript
const { resetDebounceTimer, handleBeatTextBlur } = useEmailDebounce(
  story,
  activeStepNumber,
  setCaptureContext
)
```

**5. Modify `handleBeatTextChange` to reset the timer (D-03, EMAIL-01):**
Replace the existing function with:
```typescript
function handleBeatTextChange(value: string) {
  if (activeStepNumber === null) return
  updateAndSave({
    ...story!,
    steps: story!.steps.map(s =>
      s.stepNumber === activeStepNumber ? { ...s, beatText: value } : s
    ),
  })
  // Reset idle timer on every keystroke — EMAIL-01, D-03
  if (story) resetDebounceTimer()
}
```

**6. Modify `handleNotesChange` to reset the timer (D-04, EMAIL-01):**
Replace the existing function with:
```typescript
function handleNotesChange(value: string) {
  if (activeStepNumber === null) return
  updateAndSave({
    ...story!,
    steps: story!.steps.map(s =>
      s.stepNumber === activeStepNumber ? { ...s, notes: value } : s
    ),
  })
  // D-04: Notes resets timer symmetrically with beat text — EMAIL-01
  if (story) resetDebounceTimer()
}
```

**7. No other changes to the file.** The `setCaptureContext` setter is still used by Triggers 2 and 3 and the diagnostic CTA — do not remove it. The `markShownThisSession` and `hasShownThisSession` imports are still used by Trigger 2 / Trigger 3 — do not remove them.

After this task, `StoryWorkspacePage.tsx` must not reference `beatThresholdCheckedRef` anywhere.
</action>

<acceptance_criteria>
- `src/pages/StoryWorkspacePage.tsx` does NOT contain `beatThresholdCheckedRef`
- `src/pages/StoryWorkspacePage.tsx` contains `useEmailDebounce`
- `src/pages/StoryWorkspacePage.tsx` contains `resetDebounceTimer()`
- `src/pages/StoryWorkspacePage.tsx` contains `handleBeatTextBlur`
- `src/pages/StoryWorkspacePage.tsx` does NOT contain the pattern `beatThresholdCheckedRef.current = true`
- `src/pages/StoryWorkspacePage.tsx` does NOT contain the old immediate trigger pattern `markShownThisSession('act1')` inside the Trigger 1 useEffect block (the export and diagnostics trigger still use `markShownThisSession` — check that the old `useEffect(() => { ... beatThresholdCheckedRef ...})` block is gone, not that the string is gone entirely)
- `npm run build` exits 0 after this task
</acceptance_criteria>
</task>

<task id="3" title="Add onBeatTextBlur prop to CardEditor and wire it in the page">
<read_first>
- `src/components/CardEditor.tsx` — full file; executor must see current Props interface and beat textarea before modifying
- `src/pages/StoryWorkspacePage.tsx` — see how `onBeatTextChange` and `onNotesChange` are passed to `<CardEditor>` so `onBeatTextBlur` follows the same pattern
</read_first>

<action>
**1. Modify `src/components/CardEditor.tsx`:**

Update the `Props` interface to add the optional blur prop:
```typescript
interface Props {
  step: StoryStep
  onBeatTextChange: (value: string) => void
  onNotesChange: (value: string) => void
  onScoreChange: (dimension: Dimension, value: number) => void
  onBeatTextBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
}
```

Update the function signature to destructure the new prop:
```typescript
export default function CardEditor({ step, onBeatTextChange, onNotesChange, onScoreChange, onBeatTextBlur }: Props) {
```

Add `onBlur` to the beat textarea (the textarea with `id="beat-text"`):
```typescript
<textarea
  id="beat-text"
  key={step.stepNumber}
  defaultValue={step.beatText}
  onChange={e => onBeatTextChange(e.target.value)}
  onBlur={onBeatTextBlur}
  placeholder="What happens in this step of your story?"
  rows={6}
/>
```

Do NOT add `onBlur` to the notes textarea — only the beat textarea fires the qualifying-field blur event.

**2. Modify `src/pages/StoryWorkspacePage.tsx`:**

Locate the `<CardEditor>` JSX (around line 298–304 of the current file):
```tsx
{activeStep && (
  <CardEditor
    step={activeStep}
    onBeatTextChange={handleBeatTextChange}
    onNotesChange={handleNotesChange}
    onScoreChange={handleScoreChange}
  />
)}
```

Add `onBeatTextBlur`:
```tsx
{activeStep && (
  <CardEditor
    step={activeStep}
    onBeatTextChange={handleBeatTextChange}
    onNotesChange={handleNotesChange}
    onScoreChange={handleScoreChange}
    onBeatTextBlur={handleBeatTextBlur}
  />
)}
```

`handleBeatTextBlur` comes from the `useEmailDebounce` hook destructuring added in Task 2.
</action>

<acceptance_criteria>
- `src/components/CardEditor.tsx` Props interface contains `onBeatTextBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void`
- `src/components/CardEditor.tsx` beat textarea (id="beat-text") contains `onBlur={onBeatTextBlur}`
- `src/components/CardEditor.tsx` notes textarea does NOT contain `onBlur`
- `src/pages/StoryWorkspacePage.tsx` `<CardEditor>` JSX contains `onBeatTextBlur={handleBeatTextBlur}`
- `npm run build` exits 0 after this task
</acceptance_criteria>
</task>

## Verification

Manual test checklist (run in browser after all tasks complete). All 6 items must pass before marking phase done:

- [ ] Fill beats 1–4 with text; keep typing continuously in beat field — modal must NOT appear, even after 10 seconds of continuous typing (EMAIL-01)
- [ ] Fill beats 1–4; stop all typing; wait 10 seconds — modal MUST appear after the 10s idle expires (EMAIL-02)
- [ ] Fill beats 1–4; stop typing; resume typing before the 10s expires — modal must NOT appear during resumed typing (EMAIL-01 + EMAIL-02)
- [ ] Fill beats 1–4 in one step; immediately click outside the browser (URL bar, desktop, another app) — modal MUST appear immediately without waiting 10s (EMAIL-03)
- [ ] Fill beats 1–4 in one step; click a different story card — modal must NOT appear immediately; timer continues running (EMAIL-03 / D-02)
- [ ] Complete any of steps 1–5 until modal appears, dismiss it, then reload page — modal must NOT reappear on next session (D-08)

Build check (automated):
- [ ] `npm run build` exits 0

## Success Criteria

1. `src/hooks/useEmailDebounce.ts` exists, exports `useEmailDebounce`, uses only `useRef`/`useEffect`/`useCallback` (no `useState`), contains 10s timer logic, `relatedTarget` board containment check, and unmount cleanup.
2. `StoryWorkspacePage.tsx` has no reference to `beatThresholdCheckedRef`, no immediate modal-trigger pattern on beat threshold, and calls `resetDebounceTimer()` from both `handleBeatTextChange` and `handleNotesChange`.
3. `CardEditor.tsx` beat textarea has `onBlur={onBeatTextBlur}` with the optional prop wired through `Props`.
4. All 6 manual browser tests pass.
5. `npm run build` exits 0.

## Output

After completion, create `.planning/phases/22-email-trigger-debounce/22-1-SUMMARY.md` with:
- Files modified and key changes made
- Which decisions (D-01 through D-08) each change implements
- Any deviations from the plan and why
- Build and manual test status
