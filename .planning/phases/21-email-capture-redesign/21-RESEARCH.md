# Phase 21: Email Capture Redesign — Research

**Researched:** 2026-04-06
**Domain:** React component enhancement, trigger logic, localStorage/sessionStorage, modal UI
**Confidence:** HIGH — all findings verified directly against codebase

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CAPTURE-01 | Email capture modal triggers after any 4 beats (beatText non-empty) across whole story | Trigger useEffect in StoryWorkspacePage.tsx line 65–74; beat count from `story.steps` array (16 items, all accessible) |
| CAPTURE-02 | Trigger is per-session: shows once per session if email not yet submitted | `hasShownThisSession` / `markShownThisSession` already use `sessionStorage`; existing `act1CheckedRef` ref pattern can be renamed/repurposed |
| CAPTURE-03 | Modal supports optional marketing image — configurable path renders above headline | Modal renders `headline` → `body` → form; image slot goes above headline; path set in `MODAL_CONFIG` constant |
| CAPTURE-04 | Headline and body copy centralized in one place | Currently in `COPY` record at top of `EmailCaptureModal.tsx`; `'act1'` context entry is the one to update |
| CAPTURE-05 | README.md documents how to update image and copy | Existing README has "Enable Beehiiv email capture" section; add a parallel "Customize email modal" section |
</phase_requirements>

---

## Summary

Phase 21 makes two targeted changes to the email capture system: (1) change the trigger from "all Act I beats filled" to "any 4 beats filled across the whole story," and (2) enhance the modal with an optional marketing image and easily-findable configurable copy.

The existing implementation is clean and well-factored. The trigger logic is a single `useEffect` in `StoryWorkspacePage.tsx` (lines 65–74). The modal copy already lives in a `COPY` record constant at the top of `EmailCaptureModal.tsx` — it just needs to be extended with an image config. The session-deduplication infrastructure (`hasShownThisSession` / `markShownThisSession`) already works correctly via `sessionStorage` and needs no changes.

**Primary recommendation:** Two surgical edits — (1) replace the Act I filter with a count of non-empty beats across all steps; (2) add a `MODAL_CONFIG` export in `EmailCaptureModal.tsx` or a new `src/config/emailCapture.ts` file that holds the headline, body, and optional image path for each context. README gets a new "Customize email modal" section.

---

## Project Constraints (from CLAUDE.md)

No `CLAUDE.md` exists at the project root. No overriding project-level constraints detected.

**Observed conventions from codebase:**
- TypeScript with strict mode (inferred from `tsc -b` build step) [VERIFIED: package.json]
- React functional components with hooks only — no class components [VERIFIED: all .tsx files]
- CSS via `src/index.css` global file using CSS custom properties (`var(--bg)`, `var(--text)`, etc.) — no CSS modules or Tailwind [VERIFIED: index.css]
- Config isolated in `src/config/` (existing: `beehiiv.ts`) [VERIFIED: codebase]
- Utility functions isolated in `src/utils/` [VERIFIED: codebase]
- No test framework installed — no vitest/jest in devDependencies [VERIFIED: package.json]
- `npm run build` = `tsc -b && vite build` — TypeScript errors are a blocking build failure [VERIFIED: package.json]

---

## Existing Implementation — Verified Code Map

### Trigger Logic [VERIFIED: src/pages/StoryWorkspacePage.tsx, lines 53–74]

```typescript
// Current trigger — Act I only
const act1CheckedRef = useRef(false)   // prevents re-firing within a session

useEffect(() => {
  if (!story || act1CheckedRef.current) return
  if (hasSubmittedEmail() || hasShownThisSession('act1')) return
  const act1Steps = story.steps.filter(s => s.act === 'I')  // 4 steps (steps 1–4)
  if (act1Steps.every(s => s.beatText.trim().length > 0)) {  // ALL Act I must be filled
    act1CheckedRef.current = true
    markShownThisSession('act1')
    setCaptureContext('act1')
  }
}, [story])
```

**What changes:**
- Replace `act1Steps.every(...)` with a count of `story.steps.filter(s => s.beatText.trim().length > 0).length >= 4`
- Rename `act1CheckedRef` to `beatThresholdCheckedRef` (optional but clearer)
- The session key `'act1'` can stay as-is OR be renamed to `'4beats'` — see Open Questions

### Session State Infrastructure [VERIFIED: src/utils/emailCapture.ts]

```typescript
const SUBMITTED_KEY = 'sxr:cap:submitted'

export function hasSubmittedEmail(): boolean {
  return localStorage.getItem(SUBMITTED_KEY) === 'true'
}

export function hasShownThisSession(trigger: string): boolean {
  return sessionStorage.getItem(`sxr:cap:${trigger}`) === 'true'
}

export function markShownThisSession(trigger: string): void {
  sessionStorage.setItem(`sxr:cap:${trigger}`, 'true')
}
```

- `hasSubmittedEmail()` — persistent across sessions (localStorage) — already correct
- `hasShownThisSession(trigger)` — per-session (sessionStorage) — already correct
- No changes needed to this file

### Modal Copy Structure [VERIFIED: src/components/EmailCaptureModal.tsx, lines 6–27]

```typescript
export type CaptureContext = 'act1' | 'export' | 'diagnostics' | 'examples' | 'early-access'

const COPY: Record<CaptureContext, { headline: string; body: string }> = {
  'act1': {
    headline: 'Act I mapped — nice work.',
    body: 'Get 5 example story maps, a beat gap checklist, and the structure rescue guide. Free.',
  },
  // ... other contexts
}
```

The `'act1'` entry is the one triggered by the Act I completion hook. This will become the "4 beats filled" trigger's copy. The type name `CaptureContext` and value `'act1'` can stay or be renamed.

### Modal JSX Structure [VERIFIED: src/components/EmailCaptureModal.tsx, lines 59–103]

Current render order inside `.capture-modal`:
1. Close button (`.capture-modal__close`)
2. Headline paragraph (`.capture-modal__headline`)
3. Body paragraph (`.capture-modal__body`)
4. Success state or form
5. "No thanks" skip link

Image slot goes between close button and headline (or above headline). Standard pattern: `{imageSrc && <img className="capture-modal__image" src={imageSrc} alt="" />}`.

### Data Model — Beat Count [VERIFIED: src/types/story.ts, src/data/steps.ts]

```typescript
interface StoryStep {
  stepNumber: number;   // 1–16
  act: 'I' | 'IIA' | 'IIB' | 'III';
  beatText: string;     // user-authored beat content — empty string = not filled
  // ...
}
```

16 total steps: Act I (steps 1–4), Act IIA (5–8), Act IIB (9–12), Act III (13–16).

Count of filled beats: `story.steps.filter(s => s.beatText.trim().length > 0).length`

This is trivially computable. No helper function needed — the expression is readable inline in the useEffect.

### Image Assets Location [VERIFIED: src/assets/, public/]

- `src/assets/hero.png` exists — this is an imported asset (Vite processes it)
- `public/` contains favicon and icons — files here are served at root path (`/filename`)

For the marketing image, two valid approaches:
1. **Vite import** — `import marketingImg from '../assets/marketing.png'` — best for images that change rarely; gets hashed in build output
2. **Public path** — place file in `public/`, reference as `'/marketing.png'` — simpler for "drop a file here" developer experience but no cache-busting

Given the README must explain where to put the file, the `src/assets/` import approach is slightly more complex to explain but more idiomatic for Vite. The `public/` approach is simpler to document: "put the file in `public/` and set the path to `'/your-image.png'`."

---

## Architecture Patterns

### Recommended Config Approach

Two valid locations for the new config. Based on the existing pattern (`src/config/beehiiv.ts` for Beehiiv ID), the right place is a new constant within `EmailCaptureModal.tsx` itself — keeping copy and image co-located with the component that renders them.

**Option A — inline config in EmailCaptureModal.tsx (recommended):**

```typescript
// src/components/EmailCaptureModal.tsx

// ── Marketing config — edit these to change the modal content ──────────────
const MODAL_IMAGE_SRC = ''  // Set to image path, e.g. '/marketing.png', or '' to hide
const COPY: Record<CaptureContext, { headline: string; body: string }> = {
  'act1': {
    headline: 'Your story is taking shape.',
    body: 'Get 5 example story maps, a beat gap checklist, and the structure rescue guide. Free.',
  },
  // ...
}
// ──────────────────────────────────────────────────────────────────────────
```

Pros: one file to open, matches the "defined in one place" requirement, README can say "open `src/components/EmailCaptureModal.tsx` and look for the marketing config block."

**Option B — separate `src/config/emailCapture.ts`:**

Pros: mirrors `src/config/beehiiv.ts` pattern, slightly easier to find by path.
Cons: splits config from the component that renders it, adds an import.

Both work. Option A is simpler for a two-property config.

### Trigger Refactor Pattern

```typescript
// Replace the Act I trigger useEffect with this:
const beatThresholdCheckedRef = useRef(false)

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

Note: The session key `'act1'` is reused intentionally. If a user in an existing session already dismissed the `'act1'` modal, they won't see it again this session — correct behavior per CAPTURE-02.

### Image in Modal Pattern

```tsx
{MODAL_IMAGE_SRC && (
  <img
    className="capture-modal__image"
    src={MODAL_IMAGE_SRC}
    alt=""
    aria-hidden="true"
  />
)}
<p className="capture-modal__headline">{headline}</p>
```

CSS for the image element (add to `src/index.css`):
```css
.capture-modal__image {
  width: 100%;
  border-radius: 8px;
  display: block;
  margin-bottom: 4px;
}
```

`alt=""` with `aria-hidden="true"` is correct for decorative marketing images — the image adds no information the surrounding text doesn't convey.

---

## Standard Stack

No new libraries needed. This phase uses only what's already installed.

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19.2.4 | Component rendering and hooks |
| TypeScript | 5.9.3 | Type checking |
| Vite | 8.0.1 | Asset processing (if image imported via src/assets/) |

[VERIFIED: package.json]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Session deduplication | Custom session tracking | Existing `hasShownThisSession` / `markShownThisSession` in `src/utils/emailCapture.ts` | Already implemented, tested by existing usage |
| Persistent submission state | New localStorage key | Existing `hasSubmittedEmail` / `markEmailSubmitted` | Same key, same behavior |

---

## Common Pitfalls

### Pitfall 1: Re-firing trigger on every story save

**What goes wrong:** The `useEffect` depends on `[story]`, which updates on every beatText keystroke. Without the ref guard, the modal fires again mid-session after the user dismisses it.

**Why it happens:** `story` state changes with every character typed in `CardEditor`.

**How to avoid:** The existing `act1CheckedRef` (to be renamed `beatThresholdCheckedRef`) prevents re-checking once the threshold is met. Keep it. Do not remove the ref just because the condition changed.

**Warning signs:** Modal appears multiple times without page reload.

### Pitfall 2: Session key collision with old `'act1'` key

**What goes wrong:** If you rename the sessionStorage key from `'act1'` to something like `'4beats'`, existing sessions where the user already dismissed the `'act1'` modal will see it again after a code update (since the new key isn't set).

**Why it happens:** `sessionStorage` keys are string-matched exactly.

**How to avoid:** Keep using `'act1'` as the session key for the trigger. The key is an implementation detail, not user-visible. CAPTURE-02 says "same as current Act I trigger" — using the same key preserves this behavior.

**Warning signs:** Modal appears twice in a single session for users who were mid-session during a deploy.

### Pitfall 3: Image path silently 404s

**What goes wrong:** `MODAL_IMAGE_SRC` is set to a path that doesn't exist (e.g., `/marketing.png` but file not added to `public/`). Browser shows broken image; no JS error.

**Why it happens:** Image `src` failures are silent in React.

**How to avoid:** The conditional `{MODAL_IMAGE_SRC && <img ... />}` ensures the element is not rendered when the string is empty. When a path IS set, verify the file exists at that path. Recommend testing with dev server before shipping.

**Warning signs:** Empty image box appears in modal above headline.

### Pitfall 4: TypeScript error if `CaptureContext` type is changed

**What goes wrong:** `CaptureContext` is exported and consumed in `StoryWorkspacePage.tsx` (`import { type CaptureContext }`). If the type's string literal union is changed or `'act1'` is removed, TypeScript will error at every callsite.

**Why it happens:** The type is a discriminated union used as a prop type and state type.

**How to avoid:** If renaming `'act1'` to `'4beats'` in the union, update all references: `StoryWorkspacePage.tsx` state initialization, `setCaptureContext('act1')` calls, and the `COPY` record keys.

---

## Code Examples

### Verified: Current Act I Trigger (to be replaced)

```typescript
// Source: src/pages/StoryWorkspacePage.tsx, lines 53–74
const act1CheckedRef = useRef(false)

useEffect(() => {
  if (!story || act1CheckedRef.current) return
  if (hasSubmittedEmail() || hasShownThisSession('act1')) return
  const act1Steps = story.steps.filter(s => s.act === 'I')
  if (act1Steps.every(s => s.beatText.trim().length > 0)) {
    act1CheckedRef.current = true
    markShownThisSession('act1')
    setCaptureContext('act1')
  }
}, [story])
```

### Verified: All Beat Steps Available

```typescript
// Source: src/types/story.ts + src/data/steps.ts
// story.steps is always length 16 when loaded (created by createFreshSteps())
// Each step has: beatText: string (empty string = not filled)
// Count filled: story.steps.filter(s => s.beatText.trim().length > 0).length
```

### Verified: Modal Close and Session Tracking

```typescript
// Source: src/components/EmailCaptureModal.tsx, lines 40–43
function handleDismiss() {
  markShownThisSession(context)  // prevents re-showing this session
  onClose()
}
```

Note: `markShownThisSession` is called on dismiss (not on open). The trigger in `StoryWorkspacePage` calls `markShownThisSession` at trigger time (line 72 of current code). Both guard the same key — this is intentional: trigger marks it AND dismiss marks it, so if the modal opens and the page is refreshed before dismiss, the key is already set.

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| Act I gate (all 4 Act I steps must be filled) | Any 4 beats across all 16 steps | Phase 21 change — catches writers who fill non-linearly |
| Copy hardcoded inline | `COPY` record constant at top of component | Already centralized; just needs image config added |

---

## Runtime State Inventory

This is not a rename/refactor phase — no data migration required. However, existing sessionStorage keys are relevant:

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | `sxr:cap:submitted` in localStorage (permanent submission flag); `sxr:cap:act1` in sessionStorage (per-session shown flag) | None — both keys remain valid after the trigger logic change |
| Live service config | None | None |
| OS-registered state | None | None |
| Secrets/env vars | `BEEHIIV_PUBLICATION_ID` in `src/config/beehiiv.ts` — code change does not affect this | None |
| Build artifacts | None | None |

**Key insight:** No existing user data is invalidated by this change. The `sxr:cap:submitted` key continues to prevent the modal from showing to users who already submitted. The `sxr:cap:act1` session key is preserved.

---

## Environment Availability

Step 2.6: SKIPPED — this phase is code-only changes to existing React/TypeScript source files. No new external dependencies, CLI tools, or services are required.

---

## Validation Architecture

No test framework is installed in this project (no vitest, no jest). [VERIFIED: package.json devDependencies]

Validation is therefore manual and build-verified.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — no test runner installed |
| Config file | None |
| Quick run command | `npm run build` (TypeScript + Vite compile check) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements — Test Map

| Req ID | Behavior | Test Type | How to Validate |
|--------|----------|-----------|-----------------|
| CAPTURE-01 | Modal fires when exactly 4 beats filled (non-Act-I mix) | Manual | Open story, fill beats 1, 5, 9, 13 (one per act) — modal should appear |
| CAPTURE-01 | Modal does NOT fire at 3 filled beats | Manual | Fill 3 beats, confirm no modal |
| CAPTURE-01 | Modal fires at 4 beats regardless of which 4 | Manual | Fill beats 5, 6, 7, 8 (all Act IIA) — modal should appear |
| CAPTURE-02 | Modal shows only once per session | Manual | Dismiss modal, continue filling beats — modal must not reappear without page reload |
| CAPTURE-02 | Modal does not show if email already submitted | Manual | Set `localStorage.setItem('sxr:cap:submitted','true')` in DevTools, reload, fill 4+ beats — no modal |
| CAPTURE-02 | Modal does not show if already shown this session | Manual | Dismiss modal, reload page (new session), fill 4 beats — modal appears again |
| CAPTURE-03 | Image renders above headline when `MODAL_IMAGE_SRC` is set | Manual | Set a valid image path in config, open modal — image appears above headline |
| CAPTURE-03 | No broken image box when `MODAL_IMAGE_SRC` is empty string | Manual | Leave config empty, open modal — no image element rendered |
| CAPTURE-04 | Headline and body are in one place in source | Code review | Open `EmailCaptureModal.tsx`, confirm `COPY['act1']` or equivalent block contains both strings |
| CAPTURE-05 | README.md explains image + copy update procedure | Code review | README has section with file location, image dimensions guidance, and string locations |

### Build Gate

`npm run build` must pass (TypeScript clean + Vite bundle) before any plan is marked complete. This catches:
- Type errors from `CaptureContext` changes
- Missing imports
- Syntax errors

### Wave 0 Gaps

None — no test infrastructure to scaffold. Validation is manual via dev server (`npm run dev`).

---

## Open Questions

1. **Rename `'act1'` session key to `'4beats'`?**
   - What we know: The key is internal-only, not user-visible. Renaming prevents false deduplication for users who saw the Act I modal before this deploy and have it cached in their current session.
   - What's unclear: Whether existing sessions in the wild will see a doubled prompt (old key set, new key unset — user sees modal again this session after deploy).
   - Recommendation: Keep the key as `'act1'` to avoid any double-show risk. The string is an implementation detail. If a user had Act I complete before this deploy, they likely have 4 beats filled anyway, so the behavior is identical.

2. **Rename `CaptureContext` value `'act1'` to `'4beats'`?**
   - What we know: It's a TypeScript string literal union used in 2 files.
   - What's unclear: Whether cleaner naming is worth the refactor.
   - Recommendation: Keep `'act1'` as the type value. It does not appear in UI. The planner can add a rename as an optional cleanup task if desired.

3. **Where should the marketing image live — `src/assets/` or `public/`?**
   - What we know: Both work. `src/assets/` requires an import statement and gets a hashed filename. `public/` uses a plain path string and is simpler to document.
   - Recommendation: Use `public/` for the marketing image. The README instruction becomes: "Add your image to the `public/` directory and set `MODAL_IMAGE_SRC = '/your-image.png'` in `EmailCaptureModal.tsx`." No import change needed when swapping images.

4. **What image dimensions should README recommend?**
   - What we know: The modal is `max-width: 400px` with `padding: 28px`. The image will be constrained to `width: 100%` of the content area — effectively 344px max rendered width.
   - Recommendation: Recommend 2x for retina: **688px wide**, aspect ratio ~16:9 or ~3:1 (banner-style fits better than tall images in a modal). Document this in README.

---

## Sources

### Primary (HIGH confidence)
- `src/utils/emailCapture.ts` — session state functions, localStorage/sessionStorage keys
- `src/components/EmailCaptureModal.tsx` — modal JSX, COPY record, CaptureContext type
- `src/pages/StoryWorkspacePage.tsx` — trigger useEffect (lines 65–74), all three trigger points
- `src/types/story.ts` — StoryStep interface, beatText field
- `src/data/steps.ts` — 16 step definitions, act distribution
- `src/index.css` — .capture-modal CSS (lines 1052–1135, 1240–1250)
- `src/config/beehiiv.ts` — config file pattern
- `package.json` — dependencies, devDependencies, build scripts
- `README.md` — documentation style and existing "Enable Beehiiv" section pattern

### Secondary (MEDIUM confidence)
- None required — all research was direct codebase verification

### Tertiary (LOW confidence)
- None

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Marketing image at `public/` path avoids Vite import complexity and is simpler to document | Open Questions #3 | If team prefers hashed asset filenames, use `src/assets/` import instead — minor refactor |
| A2 | 688px wide at 2x is appropriate for retina marketing image | Open Questions #4 | Image may look blurry (if too small) or oversized (if aspect ratio is wrong) — adjust after seeing actual image |

---

## Metadata

**Confidence breakdown:**
- Trigger logic location: HIGH — read directly from StoryWorkspacePage.tsx
- Session state infrastructure: HIGH — read directly from emailCapture.ts
- Modal structure: HIGH — read directly from EmailCaptureModal.tsx
- Beat data model: HIGH — read directly from story.ts and steps.ts
- Image asset strategy: MEDIUM — public/ vs assets/ recommendation is reasoned, not mandated

**Research date:** 2026-04-06
**Valid until:** Stable — no external dependencies. Valid until component files are significantly refactored.
