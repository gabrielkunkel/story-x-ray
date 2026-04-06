---
phase: 21
plan: "21-01"
subsystem: email-capture
tags: [trigger-logic, modal-copy, config, marketing]
dependency_graph:
  requires: []
  provides: [CAPTURE-01, CAPTURE-02, CAPTURE-04]
  affects: [src/pages/StoryWorkspacePage.tsx, src/components/EmailCaptureModal.tsx]
tech_stack:
  added: []
  patterns: [ref-guard pattern for useEffect deduplication, marketing config block at top of component file]
key_files:
  modified:
    - src/pages/StoryWorkspacePage.tsx
    - src/components/EmailCaptureModal.tsx
decisions:
  - Session key 'act1' preserved intentionally to avoid double-show risk for existing sessions
  - MODAL_IMAGE_SRC placed inline in EmailCaptureModal.tsx (Option A) — keeps config co-located with rendering component
metrics:
  duration: "~5 minutes"
  completed: "2026-04-06"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 21 Plan 01: Trigger Logic Change + Configurable Copy Summary

**One-liner:** 4-beat threshold trigger replacing Act I gate, with exported MODAL_IMAGE_SRC constant and updated headline copy centralized in a clearly-marked config block.

## What Was Built

### Task 21-01-01: Replace Act I trigger with 4-beat threshold
- Renamed `act1CheckedRef` to `beatThresholdCheckedRef` in `StoryWorkspacePage.tsx`
- Replaced `act1Steps.every(s => s.beatText.trim().length > 0)` (Act I–only filter) with `story.steps.filter(s => s.beatText.trim().length > 0).length >= 4` (all 16 steps)
- Comment updated from "Post-Act-I popup" to "4-beat threshold popup"
- Session key `'act1'` preserved — avoids double-show for users mid-session at deploy time
- Commit: `7cfe05f`

### Task 21-01-02: Add marketing config block and update copy
- Added `// ── Marketing config ──` comment block above the `COPY` constant in `EmailCaptureModal.tsx`
- Added `export const MODAL_IMAGE_SRC = ''` constant (empty string = no image rendered; set to `/marketing.png` path to enable)
- Updated `COPY['act1'].headline` from `'Act I mapped — nice work.'` to `'Your story is taking shape.'`
- Added closing `// ── End marketing config ──` comment after COPY constant
- Commit: `60d2a26`

## Acceptance Criteria

- [x] Email trigger useEffect counts all beats across all acts, not just Act I
- [x] Trigger fires when `filledBeats >= 4` (any 4 non-empty beatText values)
- [x] Session key `'act1'` preserved — no double-show risk for existing sessions
- [x] `MODAL_IMAGE_SRC` constant exported from `EmailCaptureModal.tsx` with empty string default
- [x] `COPY['act1'].headline` updated to `'Your story is taking shape.'`
- [x] Marketing config comment block clearly marks where to edit modal content
- [x] `npm run build` passes with no TypeScript errors

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- `MODAL_IMAGE_SRC = ''` is intentionally empty by default — image rendering in modal JSX is deferred to Plan 02 per plan scope. The constant is exported so Plan 02 can consume it without further changes to this file.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced. Modal remains non-gated marketing UI with no security implications.

## Self-Check: PASSED

- FOUND: src/pages/StoryWorkspacePage.tsx
- FOUND: src/components/EmailCaptureModal.tsx
- FOUND: .planning/phases/21-email-capture-redesign/21-01-SUMMARY.md
- FOUND: commit 7cfe05f (trigger logic)
- FOUND: commit 60d2a26 (config block + copy)
