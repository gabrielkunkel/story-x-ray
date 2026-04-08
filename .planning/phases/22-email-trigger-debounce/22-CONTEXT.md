# Phase 22: Email Trigger Debounce - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the immediate email modal trigger with a debounce-based trigger. The modal fires only at a "genuinely elegant pause" — after the user has met the 4-beat threshold AND has gone idle (10s of no typing) or has clicked away from the specific beat field that completed the threshold. The modal must not interrupt active typing or normal in-app navigation.

Requirements in scope: EMAIL-01, EMAIL-02, EMAIL-03.

</domain>

<decisions>
## Implementation Decisions

### Blur trigger scope (EMAIL-03)
- **D-01:** The immediate-blur trigger fires only from the **specific beat field whose entry pushed the filled-beat count to 4** (the "qualifying field"), not from any other beat field blur.
- **D-02:** Moving to a different story card (card-to-card navigation) does NOT constitute "clicking away" for blur-trigger purposes. The qualifying field's blur must result from leaving the app's engagement context (clicking outside the board, switching tabs, etc.), not from continued in-app movement.

### Active typing definition (EMAIL-01)
- **D-03:** "Actively typing" means any input in either the **beat textarea OR the notes textarea** within the currently open CardEditor. Both fields count as continued engagement.
- **D-04:** Typing in notes resets the 10s idle timer. Notes and beat text are treated symmetrically for timer purposes.

### Card navigation behavior
- **D-05:** Clicking a different story card = continued engagement. The 10s idle timer resets (or continues counting from last actual interaction). The modal does NOT fire immediately on card-to-card navigation.
- **D-06:** The "qualified step" reference is retained across card navigation — the timer still knows which step triggered the threshold, and only blur from that step's beat field will fire the immediate modal.

### Timer behavior
- **D-07:** The 10s timer starts the first time the threshold is met (filledBeats >= 4). Every onChange in beat OR notes, and every card navigation event, resets the timer.
- **D-08:** Once the modal has shown this session (`hasShownThisSession('act1')` is true), no timer or blur should re-trigger it. Existing session-tracking logic is preserved.

### Claude's Discretion
- Mechanism for distinguishing "clicking away from app" vs "navigating to another card" at blur time (e.g., `relatedTarget`, delayed state check, or a `isNavigatingCards` flag — planner decides)
- Whether to extract debounce logic into a custom hook (`useEmailDebounce`) or keep it inline in `StoryWorkspacePage.tsx`
- Timer cleanup on component unmount

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §v1.6 Requirements → Email UX — EMAIL-01, EMAIL-02, EMAIL-03 (acceptance criteria)

### Existing trigger logic
- `src/pages/StoryWorkspacePage.tsx` lines 64–74 — current Trigger 1 useEffect (replace this)
- `src/pages/StoryWorkspacePage.tsx` lines 116–124 — `handleBeatTextChange` (add timer reset here)
- `src/pages/StoryWorkspacePage.tsx` lines 126–134 — `handleNotesChange` (add timer reset here)

### Components needing changes
- `src/components/CardEditor.tsx` — beat textarea and notes textarea (will need `onBlur` prop added to beat textarea to propagate the qualifying-field blur up to page)
- `src/utils/emailCapture.ts` — session tracking utilities (`hasShownThisSession`, `markShownThisSession`)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `hasShownThisSession(trigger)` / `markShownThisSession(trigger)` in `src/utils/emailCapture.ts` — already handles per-session deduplication; no changes needed
- `beatThresholdCheckedRef` (useRef) in `StoryWorkspacePage.tsx` — currently prevents re-evaluation after threshold is met; will need to be repurposed or removed for the debounce approach (timer can handle deduplication instead)

### Established Patterns
- `StoryWorkspacePage.tsx` uses `useRef` for guards (e.g., `beatThresholdCheckedRef`, `installCalloutShownRef`) — consistent pattern for one-shot logic
- `CardEditor.tsx` uses `defaultValue` (uncontrolled textarea) with `key={step.stepNumber}` — will need `onBlur` added as a prop to the beat textarea
- The page passes callbacks down: `onBeatTextChange`, `onNotesChange` — a new `onBeatTextBlur` prop can follow the same pattern

### Integration Points
- `CardEditor.tsx` → `StoryWorkspacePage.tsx` via `onBeatTextChange` / `onNotesChange` callbacks; add `onBeatTextBlur` the same way
- `activeStepNumber` state in `StoryWorkspacePage.tsx` changes when user clicks a different card — this is the card navigation signal to reset the timer
- `setCaptureContext('act1')` in `StoryWorkspacePage.tsx` is what shows the modal — debounce logic calls this same setter

</code_context>

<specifics>
## Specific Ideas

- "The modal should appear only at a genuinely elegant pause: after meaningful progress, after the user is no longer actively typing, after a real idle moment — not during normal navigation inside the workflow."
- The blur trigger (EMAIL-03) is intended for the case where the user fills the 4th beat and immediately leaves (closes tab, clicks outside the app) — not as a trap for in-app movement.

</specifics>

<deferred>
## Deferred Ideas

- **EMAIL-F01**: Configurable debounce timeout (currently hardcoded at 10s) — noted in REQUIREMENTS.md as a future requirement, explicitly out of scope for Phase 22.

</deferred>

---

*Phase: 22-email-trigger-debounce*
*Context gathered: 2026-04-08*
