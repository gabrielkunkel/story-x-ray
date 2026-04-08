---
phase: 22
plan: 1
title: Email Trigger Debounce — Hook, Page Wiring, and Blur Prop
subsystem: email-capture
tags: [email, debounce, hooks, ux]
completed: "2026-04-08T20:53:17Z"
duration_estimate: "~30 min"

dependency_graph:
  requires: []
  provides: [useEmailDebounce hook, debounce-based email trigger]
  affects: [src/hooks/useEmailDebounce.ts, src/pages/StoryWorkspacePage.tsx, src/components/CardEditor.tsx]

tech_stack:
  added: []
  patterns: [useRef for timer state, useCallback for stable function refs, relatedTarget for blur containment]

key_files:
  created:
    - src/hooks/useEmailDebounce.ts
  modified:
    - src/pages/StoryWorkspacePage.tsx
    - src/components/CardEditor.tsx

decisions:
  - "Used raw setTimeout/clearTimeout (not lodash debounce) per research spec — no external dep needed"
  - "qualifyingStepRef captures the step number when 4-beat threshold is first crossed; subsequent blur checks compare activeStepNumber against it (D-01)"
  - "relatedTarget board containment check uses .workspace__board CSS class — StoryCard is a native button so always appears as relatedTarget on card click (D-02)"
  - "Both handleBeatTextChange and handleNotesChange call resetDebounceTimer symmetrically (D-03, D-04)"
  - "useRef for debounceTimerRef and qualifyingStepRef avoids re-render cascade that useState would cause"

metrics:
  tasks_completed: 3
  tasks_total: 3
  files_created: 1
  files_modified: 2
---

# Phase 22 Plan 1: Email Trigger Debounce — Hook, Page Wiring, and Blur Prop Summary

**One-liner:** Replaced immediate 4-beat email modal trigger with a `useEmailDebounce` hook using 10s idle timer and outside-board blur detection via `relatedTarget` containment.

## Tasks Completed

| Task | Title | Commit | Key Files |
|------|-------|--------|-----------|
| 1 | Create useEmailDebounce hook | d6db005 | src/hooks/useEmailDebounce.ts (created) |
| 2 | Wire hook into StoryWorkspacePage, remove Trigger 1 | 58112d1 | src/pages/StoryWorkspacePage.tsx |
| 3 | Add onBeatTextBlur prop to CardEditor | 58112d1 | src/components/CardEditor.tsx |

## What Changed

### src/hooks/useEmailDebounce.ts (new)

Exports `useEmailDebounce(story, activeStepNumber, setCaptureContext)` returning `{ resetDebounceTimer, handleBeatTextBlur }`.

- `debounceTimerRef` — `useRef` holding the active `setTimeout` handle; cleared and restarted on every keystroke
- `qualifyingStepRef` — `useRef` capturing the `activeStepNumber` at the moment the 4-beat threshold is first crossed; `null` until then
- `resetDebounceTimer` — `useCallback`; clears existing timer, returns early if already shown/submitted or threshold not yet crossed, otherwise starts a fresh 10s timer that fires `setCaptureContext('act1')` (EMAIL-01, EMAIL-02)
- Threshold detection `useEffect` — watches `story` and `activeStepNumber`; once `filledBeats >= 4` and `activeStepNumber !== null`, captures `qualifyingStepRef.current` and starts the timer (replaces old Trigger 1)
- Card navigation `useEffect` — resets timer whenever `activeStepNumber` changes while threshold already crossed (D-05, D-07)
- Unmount cleanup `useEffect` — clears `debounceTimerRef.current` on unmount to prevent stale closure firing after story navigation
- `handleBeatTextBlur` — `useCallback`; checks session guards, then uses `relatedTarget` + `.workspace__board` containment to distinguish outside-board blur (fires immediately, EMAIL-03) from card-to-card navigation blur (does nothing, timer continues)

### src/pages/StoryWorkspacePage.tsx (modified)

- Removed `beatThresholdCheckedRef` ref declaration
- Removed old Trigger 1 `useEffect` (immediate `markShownThisSession('act1'); setCaptureContext('act1')` on 4-beat count)
- Added `import { useEmailDebounce }` after email capture imports
- Added hook invocation after `updateAndSave` callback: `const { resetDebounceTimer, handleBeatTextBlur } = useEmailDebounce(...)`
- `handleBeatTextChange` now calls `resetDebounceTimer()` after saving (D-03, EMAIL-01)
- `handleNotesChange` now calls `resetDebounceTimer()` after saving (D-04, EMAIL-01)
- `<CardEditor>` JSX gains `onBeatTextBlur={handleBeatTextBlur}` prop

### src/components/CardEditor.tsx (modified)

- `Props` interface adds `onBeatTextBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void` (optional)
- Function signature destructures the new prop
- Beat textarea (`id="beat-text"`) gains `onBlur={onBeatTextBlur}`
- Notes textarea unchanged — no `onBlur` added (qualifying field is beat text only)

## Decisions Implemented

| Decision | Implementation |
|----------|---------------|
| D-01 | `handleBeatTextBlur` checks `activeStepNumber !== qualifyingStepRef.current` — skips if not the qualifying step |
| D-02 | `relatedTarget` + `.workspace__board` containment — fires immediately only when focus leaves the board entirely |
| D-03 | `handleBeatTextChange` calls `resetDebounceTimer()` on every keystroke |
| D-04 | `handleNotesChange` calls `resetDebounceTimer()` symmetrically |
| D-05 | Card navigation `useEffect` in hook resets timer on `activeStepNumber` change |
| D-07 | Same card navigation reset effect covers this case |
| D-08 | `hasShownThisSession('act1')` guard in both timer callback and blur handler prevents re-fire after dismiss |

## Deviations from Plan

None — plan executed exactly as written. Tasks 2 and 3 were committed together in one commit (`58112d1`) because the TypeScript compiler flagged `handleBeatTextBlur` as unused until `<CardEditor>` received the prop; this kept the build green at commit time and is consistent with the plan's intent.

## Build Status

- `npm run build` exits 0 after all tasks
- No TypeScript errors
- No new linting issues introduced

## Manual Test Checklist

These require browser verification after deployment:

- [ ] Fill beats 1–4; keep typing continuously — modal must NOT appear even after 10s of continuous typing (EMAIL-01)
- [ ] Fill beats 1–4; stop all typing; wait 10s — modal MUST appear (EMAIL-02)
- [ ] Fill beats 1–4; stop typing; resume before 10s expires — modal must NOT appear during resumed typing (EMAIL-01 + EMAIL-02)
- [ ] Fill beats 1–4; immediately click outside browser (URL bar, desktop) — modal MUST appear immediately (EMAIL-03)
- [ ] Fill beats 1–4; click a different story card — modal must NOT appear immediately; timer continues (D-02)
- [ ] Modal appears, dismiss it, reload — modal must NOT reappear next session (D-08)

## Known Stubs

None.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced. The `sessionStorage` key `sxr:cap:act1` was already present; no new session keys added (V3.3 ASVS check passed).

## Self-Check: PASSED

- src/hooks/useEmailDebounce.ts — FOUND
- Commit d6db005 (Task 1) — FOUND
- Commit 58112d1 (Tasks 2+3) — FOUND
- `npm run build` exits 0 — VERIFIED
