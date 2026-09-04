# Codebase Concerns

**Analysis Date:** 2026-09-03

## Tech Debt

**No automated test infrastructure:**
- Issue: Zero test framework, zero test files, no `test` script. The project has never had `jest`/`vitest`/`@testing-library` installed.
- Files: `package.json` (no test runner, no `test` script), all of `src/` (no `*.test.ts`/`*.spec.ts` present)
- Why: Local-first MVP prototyped phase-by-phase; every phase was verified manually (`npm run build` + browser checks). Documented as `nyquist_compliant: false` in `.planning/v1.5-MILESTONE-AUDIT.md`.
- Impact: Every future change risks silent regression; no safety net for the pure logic (diagnostics, export serializers, storage) that would be trivial to unit-test.
- Fix approach: Add `vitest` + `@testing-library/react` + `jsdom`; write unit tests for `src/utils/diagnostics.ts`, `src/utils/export.ts`, and `src/services/storage.ts` first.

**Monolithic workspace page component:**
- Issue: `src/pages/StoryWorkspacePage.tsx` (346 lines) holds ~20 event handlers, 8 UI-visibility states, persistence calls, diagnostics computation, and email-capture orchestration in a single component.
- Why: Features (PWA callout, email capture, PDF modal, diagnostics) were added iteratively without extracting state into hooks/reducer.
- Impact: Hard to reason about state interactions; any new feature touches this file; high risk of subtle coupling bugs (already the case with the email-capture debounce interplay).
- Fix approach: Extract per-feature hooks (e.g. `useViewPreferences`, `useEmailCaptureTrigger`, `useImportExport`) and a `useReducer` for workspace UI state; keep the page as a thin shell.

**Duplicated diagnostic rule code:**
- Issue: The "Flat Zone" diagnostic-push block is copy-pasted 3× inside `runDiagnostics` (`src/utils/diagnostics.ts:34-44`, `:54-64`, `:71-81`), and the hardcoded flatness threshold `1.5` appears in multiple rules.
- Why: Rule added with in-loop flush for each exit condition; duplication accepted during Phase 5.
- Impact: Changing the message/severity/id format requires editing 3 identical blocks; easy to fix one and miss another.
- Fix approach: Extract a `pushFlatZone(dim, runSteps)` helper and a named `FLAT_DELTA = 1.5` constant.

**Dead code:**
- Issue: `getActiveStoryId()` (`src/services/storage.ts:39`) is exported but never called anywhere; the `deferredPrompt` ref captured in `src/hooks/usePWAInstall.ts:11` is stored but `.prompt()` is never invoked (install is passive — user is pointed at the Chrome address bar).
- Why: `setActiveStoryId` is still used (setup + example), but the read path was never wired; deferred prompt was captured per the v1.4 plan but the callout ended up being instructional rather than programmatic.
- Impact: Misleads maintainers into thinking there is an active-story restore or a native-install trigger; the deferred prompt is effectively unused code.
- Fix approach: Remove `getActiveStoryId` (or wire it into route resolution); decide whether to call `deferredPrompt.prompt()` from the install callout or drop the ref.

**Dev-mode email logged to console:**
- Issue: `src/utils/emailCapture.ts:23` runs `console.log('[EmailCapture] Dev mode — would subscribe:', email)` when `BEEHIIV_PUBLICATION_ID` is empty.
- Why: Dev-mode fallback so the capture flow can be exercised before Beehiiv is configured.
- Impact: Any email entered in a production build (if the ID is unset) is written to the browser console — an unintended PII leak path.
- Fix approach: Gate behind `import.meta.env.DEV` or replace with a no-op/`console.debug` that strips the address.

## Known Bugs

**Unvalidated JSON import can crash the workspace:**
- Symptoms: Importing a hand-edited or truncated story JSON causes a blank/erroring workspace; `WaveformGraph` (`src/components/WaveformGraph.tsx:38-41`) and `runDiagnostics` (`src/utils/diagnostics.ts`) dereference `actualScores.*`/`targetScores.*` on steps that lack them.
- Trigger: Use the import button (`src/components/BoardHeader.tsx:65-78`) with a file that has a valid `title` and a `steps` array but malformed step objects.
- Files: `src/pages/StoryWorkspacePage.tsx:146-161` (`handleImportJSON` only checks `parsed.title` and `Array.isArray(parsed.steps)`, then spreads the raw object with `{ ...parsed, id: crypto.randomUUID() }`).
- Workaround: Re-export a valid story from the app and import that.
- Root cause: No per-step shape/score validation or coercion on import; `parsed` is trusted as a full `Story`.
- Fix: Validate/coerce each imported step (`stepNumber`, `act`, `label`, `actualScores`, `targetScores`) and reject with the existing `importError` path.

**Corrupted install-dismiss flag crashes the install callout:**
- Symptoms: The PWA install callout effect throws, breaking the workspace render, if the stored dismiss record is malformed.
- Trigger: `localStorage['sxr:pwa:dismiss']` contains invalid JSON (e.g. tampered or a partial write).
- Files: `src/utils/pwaInstall.ts:35` (`JSON.parse(raw)`) and `:44` (`JSON.parse(raw)`) — neither is wrapped in try/catch.
- Workaround: Manually clear the `sxr:pwa:dismiss` key in devtools.
- Root cause: Unlike `src/services/storage.ts`, the PWA helper trusts stored JSON unconditionally.
- Fix: Wrap both parses in try/catch and fall back to `{ count: 0, timestamp: 0 }` on failure.

**Silent data loss on corrupted story store:**
- Symptoms: All stories vanish (the start page shows an empty list) with no error.
- Trigger: `localStorage['story-xray:stories']` becomes unparseable (partial write, quota edge, manual edit).
- Files: `src/services/storage.ts:6-13` (`loadAllStories` returns `[]` on any `JSON.parse` throw).
- Workaround: None in-app; restore from a prior JSON export.
- Root cause: Catch-all silently swallows corruption and presents it as an empty library.
- Fix: Preserve the raw string for recovery, surface a "data corrupted" notice, and consider a schema version + migration on load.

## Security Considerations

**Direct browser POST to Beehiiv public API:**
- Risk: `submitEmail` (`src/utils/emailCapture.ts:29`) calls `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions` straight from the client. There is no server proxy, no rate limiting, and the publication ID ships in the client bundle. The endpoint can be spammed or abused directly.
- Current mitigation: None beyond Beehiiv's own public-form handling; `BEEHIIV_PUBLICATION_ID` is empty (`src/config/beehiiv.ts:5`), so live capture is off.
- Recommendations: Route subscriptions through a serverless function that rate-limits and hides the publication ID, or add a CAPTCHA/honeypot before enabling live mode.

**Untrusted file import into app state:**
- Risk: Imported JSON is spread directly into app state (`src/pages/StoryWorkspacePage.tsx:155`). JSON.parse is not XSS-vectorized (no eval), but malformed data causes runtime crashes (see Known Bugs) and arbitrary extra fields are accepted into the `Story` object.
- Current mitigation: None — only a top-level `title`/`steps` presence check.
- Recommendations: Validate and coerce step/scores on import; strip unknown fields before persisting.

**Story content stored unencrypted in localStorage:**
- Risk: Full story text and notes persist in plaintext in `localStorage['story-xray:stories']` (`src/services/storage.ts:24`).
- Current mitigation: Local-first, no account, no server — exposure is limited to the local device/browser profile.
- Recommendations: Acceptable for the current scope; revisit only if a sync/backend feature is added.

## Performance Bottlenecks

**Full-store serialize on every keystroke:**
- Problem: `handleBeatTextChange` and `handleNotesChange` (`src/pages/StoryWorkspacePage.tsx:110-132`) call `updateAndSave` on every keystroke, which calls `saveStory` → `loadAllStories()` (parse entire stories array) → `JSON.stringify` (all stories) → `setItem`. Scoring (`handleScoreChange`, `:134-144`) triggers the same on every slider tick.
- Measurement: O(total stored bytes) per keystroke; with several long-form stories this is a blocking serialize on the main thread.
- Cause: Persistence is synchronous and unbounded, with no debounce or dirty-tracking.
- Improvement path: Debounce persistence (~300-500ms) and/or persist only the edited story; move to IndexedDB or a versioned store.

**Un-memoized recomputation on every render:**
- Problem: `const diagnostics = story ? runDiagnostics(story.steps) : []` runs on every render (`src/pages/StoryWorkspacePage.tsx:68`), and `WaveformGraph` rebuilds `buildChartData` each render (`src/components/WaveformGraph.tsx:93`).
- Measurement: Trivial for 16 steps, but scales with re-renders (every keystroke) and future story sizes (e.g. 28-step mode).
- Cause: No `useMemo`/`useCallback` wrapping of derived data.
- Improvement path: Wrap `runDiagnostics` and `buildChartData` in `useMemo` keyed on `story.steps`.

## Fragile Areas

**localStorage data layer:**
- Files: `src/services/storage.ts`
- Why fragile: Single-key blob for all stories; catch-all `[]` on parse error; no schema versioning beyond an `author` backfill in `loadStory` (`:28-32`); no quota/error handling in `saveStory`.
- Common failures: Corrupted JSON → all stories disappear; `QuotaExceededError` → save throws with unsaved work lost.
- Safe modification: Add try/catch + versioned schema + partial-recovery before changing the storage format; keep `loadStory`'s backfill behavior intact.
- Test coverage: None.

**Email-capture debounce + session-flag orchestration:**
- Files: `src/hooks/useEmailDebounce.ts`, `src/pages/StoryWorkspacePage.tsx`
- Why fragile: The trigger depends on the interaction of `qualifyingStepRef`, `sessionStorage['sxr:cap:act1']`, the 10s idle timer, and `relatedTarget` containment checks on blur (`useEmailDebounce.ts:56-72`). The retrospective (`RETROSPECTIVE.md`) already flagged that the `relatedTarget` approach "was not obvious from plan."
- Common failures: Modal fires at the wrong time, or is suppressed for a session after a false trigger; hard to reproduce without stepping through the ref/timer state.
- Safe modification: Add unit tests around the debounce/qualifying-step state machine before refactoring; avoid changing the trigger semantics silently.
- Test coverage: None (manual browser checks only).

**PDF export column layout:**
- Files: `src/utils/export.ts:188-214`
- Why fragile: `columnStyles` hardcodes widths for 17 columns (indices 0-16) that must match the exact header ordering in `scoreHeaders`/`head` (`:142-146`). Any reordering of score dimensions silently misaligns the table.
- Common failures: Misaligned or clipped columns after a header change.
- Safe modification: Derive column widths from a single `DIMENSIONS` ordering rather than hardcoded indices; add a snapshot test of the generated table shape.
- Test coverage: None.

## Scaling Limits

**localStorage capacity (~5MB/origin):**
- Current capacity: Browser-dependent, typically 5MB total per origin; every story (16 steps × beat text + notes) plus the single `story-xray:stories` key shares this.
- Limit: A handful of long-form stories can approach the quota.
- Symptoms at limit: `QuotaExceededError` thrown in `saveStory` (`src/services/storage.ts:24`), silent save failure, lost edits.
- Scaling path: Migrate persistence to IndexedDB (`src/services/storage.ts`), or add backend/cloud sync.

**Single-device, local-first data model:**
- Current capacity: All data bound to one browser profile; no accounts, no sync, no cloud.
- Limit: Data is unrecoverable if browser storage is cleared or the device is lost; JSON export is the only backup path and is per-story/manual.
- Symptoms at limit: Total story loss with no in-app recovery.
- Scaling path: Add a bulk export-all, optional cloud sync/account, or at minimum an auto-backup.

## Dependencies at Risk

**vite ^8.0.1 + CI Node 20 pin:**
- Risk: Very new major version; Vite 8 requires Node 20.19+ / 22.12+, but `package.json` declares no `engines` and `.github/workflows/deploy.yml:25` pins `node-version: 20` (which may resolve below 20.19).
- Impact: CI build could fail on Node version resolution, or local dev breaks for contributors on older Node.
- Migration plan: Pin CI to `node-version: 22` (or `20.19+`), add an `engines` field, and lock Vite to a tested minor.

**recharts ^3.8.1:**
- Risk: Recharts 3.x is a recent major with breaking API changes from 2.x; the app relies on `LineChart`/`ReferenceLine`/`connectNulls` behavior (`src/components/WaveformGraph.tsx`).
- Impact: A minor bump could alter chart rendering (gaps, tooltip, axis) with no automated tests to catch it.
- Migration plan: Add a chart smoke/snapshot test; pin to a known-good minor until verified.

**jspdf ^4.2.1 + jspdf-autotable ^5.0.7:**
- Risk: `autoTable(doc, {...})` uses the v5 function-call API (`src/utils/export.ts:171`); the two packages are loosely coupled and either could break the other's API on upgrade.
- Impact: PDF export breaks with no test coverage to detect it.
- Migration plan: Pin both to tested minors; add a minimal "PDF generates without throwing" test.

**vite-plugin-pwa ^1.2.0:**
- Risk: Workbox generation tied to the Vite major; base-path handling is central to the GitHub Pages deployment (Phase 25).
- Impact: A plugin regression could emit wrong manifest/service-worker scope under `/story-x-ray/`.
- Migration plan: Keep in lockstep with the Vite upgrade; verify `dist/manifest.webmanifest` `start_url`/`scope` after every build.

## Missing Critical Features

**Email capture not live (Beehiiv unconfigured):**
- Problem: `src/config/beehiiv.ts:5` sets `BEEHIIV_PUBLICATION_ID = ''`, so production builds log submissions to console instead of subscribing anyone.
- Current workaround: None — the capture flow is effectively disabled until the operator pastes a publication ID.
- Blocks: Any real lead capture / newsletter growth; the whole email-capture machinery (modal, debounce, triggers) ships dormant.
- Implementation complexity: Low — set the ID and rebuild; but do so only after adding the rate-limiting/proxy noted under Security.

**No data backup or bulk export:**
- Problem: No export-all, auto-backup, or cloud sync; the only recovery is manual per-story JSON export.
- Current workaround: Users must remember to export each story individually.
- Blocks: Multi-device usage, confidence against accidental browser-data clearing.
- Implementation complexity: Low-medium — a bulk "export all as JSON" plus (optionally) IndexedDB persistence.

**No undo for story deletion:**
- Problem: `deleteStory` (`src/services/storage.ts:34`) permanently removes a story; the only guard is an inline confirm in `src/pages/StartPage.tsx:57-71`.
- Current workaround: None — deletion is immediate and irreversible.
- Blocks: Safe experimentation; recovering accidental deletes.
- Implementation complexity: Low — soft-delete/trash flag or a short undo toast.

## Test Coverage Gaps

**Entire application (no framework installed):**
- What's not tested: Everything — routing, workspace state, persistence, components.
- Risk: Any change can regress behavior with no automated signal; verification is entirely manual.
- Priority: High
- Difficulty to test: Low for logic (pure functions); the blocker is standing up the framework, not the tests themselves.

**Structural diagnostics rules:**
- What's not tested: `runDiagnostics` flat-zone/weak-rupture/false-safety/unresolved-ending logic (`src/utils/diagnostics.ts`).
- Risk: A scoring rule produces wrong warnings silently; it is the app's core differentiator.
- Priority: High
- Difficulty to test: Low — pure function over `StoryStep[]`; ideal first target.

**Export serializers (Markdown/Fountain/JSON/PDF):**
- What's not tested: `exportStoryAsMarkdown`, `exportStoryAsFountain`, `exportStoryAsJSON`, `exportStoryAsPDF` (`src/utils/export.ts`).
- Risk: Format regressions (wrong delimiters, missing sections, misaligned PDF columns) ship unnoticed.
- Priority: Medium
- Difficulty to test: Low-medium — Markdown/Fountain/JSON are pure string builders; PDF needs jsdom/browser or a "does not throw" smoke test.

**Storage layer and corruption handling:**
- What's not tested: `loadAllStories`/`saveStory`/`loadStory` (`src/services/storage.ts`), including the parse-failure and quota paths.
- Risk: Data-loss and corruption-handling bugs (already fragile) go undetected.
- Priority: High
- Difficulty to test: Low — mock `localStorage` with corrupted/edge-case fixtures.

---

*Concerns audit: 2026-09-03*
*Update as issues are fixed or new ones discovered*
