<!-- refreshed: 2026-09-03 -->
# Architecture

**Analysis Date:** 2026-09-03

## Pattern Overview

**Overall:** Client-only React SPA with a layered, page-centric structure (no global state manager, no backend).

**Key Characteristics:**
- Local-first single-page application (SPA) with **no backend, no auth, no database** — all persistence is browser `localStorage`.
- **Hash-based routing** (`HashRouter` from `react-router-dom`) to support static hosting (GitHub Pages) without server-side route config.
- **Page-local state** via React `useState`/`useCallback`/`useEffect`; no Redux, Zustand, Context, or server state library.
- **Immutable update pattern** — every edit clones the story object and replaces the relevant slice before persisting.
- **Pure-function utilities** for domain logic (diagnostics, export) kept separate from React components.
- **Static canonical data** (16-step structure, target scores, hints, examples) loaded from `src/data/`.
- **PWA** via `vite-plugin-pwa` (Workbox), installable and fully offline-capable.

## Layers

**Entry Layer:**
- Purpose: Bootstrap React and mount the root; declare routes.
- Contains: `src/main.tsx` (root render), `src/App.tsx` (route table).
- Depends on: Page layer (`src/pages/`), `src/hooks/usePWAInstall`, `src/index.css`.
- Used by: the browser (via `index.html`).

**Page Layer:**
- Purpose: Route-level containers that own page state, orchestrate data flow, and compose components.
- Contains: `src/pages/StartPage.tsx`, `src/pages/StorySetupPage.tsx`, `src/pages/StoryWorkspacePage.tsx`.
- Depends on: Services (`src/services/storage.ts`), utilities (`src/utils/`), data (`src/data/`), hooks (`src/hooks/`), components (`src/components/`), types (`src/types/story.ts`).
- Used by: Entry layer (`src/App.tsx`).

**Component Layer:**
- Purpose: Presentational + controlled-input components; no direct storage access.
- Contains: `src/components/*.tsx` (`BoardHeader`, `ActColumn`, `StoryCard`, `CardEditor`, `WaveformGraph`, `DiagnosticsPanel`, `ScoreInput`, `ExportDropdown`, `EmailCaptureModal`, `StoryInfoModal`, `PdfExportModal`, `PWAInstallCallout`).
- Depends on: Types (`src/types/story.ts`), data (`src/data/steps.ts`), config (`src/config/emailModal.ts`), utility functions (`src/utils/`), recharts.
- Used by: Page layer.

**Hook Layer:**
- Purpose: Encapsulate reusable side-effect logic (PWA install detection, email-capture debounce).
- Contains: `src/hooks/usePWAInstall.ts`, `src/hooks/useEmailDebounce.ts`.
- Depends on: Utility functions (`src/utils/pwaInstall.ts`, `src/utils/emailCapture.ts`), types.
- Used by: `src/App.tsx` (usePWAInstall), `src/pages/StoryWorkspacePage.tsx` (useEmailDebounce).

**Service Layer:**
- Purpose: All persistence I/O — the single gateway to `localStorage`.
- Contains: `src/services/storage.ts`.
- Depends on: Types (`src/types/story.ts`), browser `localStorage`.
- Used by: Pages, `src/data/exampleStory.ts`.

**Utility Layer:**
- Purpose: Pure/standalone domain functions with no React dependency.
- Contains: `src/utils/diagnostics.ts` (rule engine), `src/utils/export.ts` (JSON/Markdown/Fountain/PDF), `src/utils/emailCapture.ts` (Beehiiv + flags), `src/utils/pwaInstall.ts` (install cooldown logic).
- Depends on: Types, config (`src/config/beehiiv.ts`), `jspdf`/`jspdf-autotable`.
- Used by: Pages, hooks, components.

**Data Layer:**
- Purpose: Static canonical content and factories.
- Contains: `src/data/steps.ts` (STEP_DEFINITIONS, STEP_HINTS, STEP_EXAMPLES, `createFreshSteps()`), `src/data/exampleStory.ts` (`loadExampleStory()`).
- Depends on: Types, Service layer (`src/services/storage.ts`).
- Used by: Pages, components.

**Config Layer:**
- Purpose: Environment/feature configuration decoupled from logic.
- Contains: `src/config/beehiiv.ts` (publication ID), `src/config/emailModal.ts` (email-capture modal copy/type).
- Depends on: nothing internal.
- Used by: Utility layer (`src/utils/emailCapture.ts`), components (`EmailCaptureModal`).

**Type Layer:**
- Purpose: Shared domain model.
- Contains: `src/types/story.ts` (`Dimension`, `DimensionScores`, `StoryStep`, `Story`).
- Depends on: nothing.
- Used by: every other layer.

## Data Flow

**Story Creation (setup flow):**

1. User clicks "New Story" on `src/pages/StartPage.tsx` → `navigate('/setup')`.
2. `src/App.tsx` matches route `/setup` → renders `src/pages/StorySetupPage.tsx`.
3. Form submit in `src/pages/StorySetupPage.tsx` validates title, builds a `Story` (id via `crypto.randomUUID()`), initializes steps with `createFreshSteps()` from `src/data/steps.ts`.
4. `saveStory(story)` + `setActiveStoryId(story.id)` in `src/services/storage.ts` write to `localStorage`.
5. `navigate('/story/${id}')` → workspace loads the story.

**Story Editing (primary workspace flow):**

1. `src/pages/StoryWorkspacePage.tsx` reads `:id` via `useParams`, initializes `story` state lazily with `loadStory(id)` from `src/services/storage.ts`.
2. User interacts with a `StoryCard`/`ActColumn` → `setActiveStepNumber(n)` selects the active step.
3. `CardEditor` receives the active step and invokes `onBeatTextChange`/`onNotesChange`/`onScoreChange`.
4. Each handler builds an **immutable** updated story (`{ ...story, steps: story.steps.map(...) }`) and calls `updateAndSave(updatedStory)` (`setStory` + `saveStory`).
5. `saveStory` in `src/services/storage.ts` upserts into the `story-xray:stories` localStorage array with a fresh `updatedAt`.
6. Derived values recompute: `runDiagnostics(story.steps)` and `WaveformGraph`/`DiagnosticsPanel` re-render from the new state.

**Email capture flow:**

1. Triggers fire from multiple contexts (idle-after-Act-I via `useEmailDebounce`, first export, diagnostics CTA, examples, early-access) in `src/pages/`.
2. Each trigger checks `hasSubmittedEmail()` / `hasShownThisSession()` in `src/utils/emailCapture.ts`, then sets `captureContext`.
3. `EmailCaptureModal` renders copy from `src/config/emailModal.ts`; submit calls `submitEmail()` in `src/utils/emailCapture.ts` — dev-mode logs to console, otherwise POSTs to Beehiiv.

**State Management:**
- No global state library. Page components hold state in `useState` and pass callbacks down.
- Persistence: `localStorage` key `story-xray:stories` (all stories) + `story-xray:activeId`; UI prefs `sx:viewMode`, `sx:showBeatPreview`; PWA/email flags under `sxr:*` keys.
- Session-scoped flags (per-trigger "shown this session") use `sessionStorage`.

## Key Abstractions

**Story (domain model):**
- Purpose: The central aggregate — metadata + 16 ordered steps.
- Examples: `src/types/story.ts` (`Story`, `StoryStep`, `DimensionScores`).
- Pattern: Plain TypeScript interfaces; no classes, no ORM. Scores are `number` (0 = unset, 1–10 = scored).

**Step definitions (canonical structure):**
- Purpose: Immutable source of truth for the 16-step board, target scores, hints, and fiction examples.
- Examples: `src/data/steps.ts` (`STEP_DEFINITIONS`, `STEP_HINTS`, `STEP_EXAMPLES`, `createFreshSteps()`).
- Pattern: Module-level `const` arrays/records + a factory function that maps definitions into fresh `StoryStep[]`.

**Storage service:**
- Purpose: Thin, try/catch-guarded wrapper around `localStorage` CRUD.
- Examples: `src/services/storage.ts` (`loadAllStories`, `saveStory`, `loadStory`, `deleteStory`, `getActiveStoryId`, `setActiveStoryId`).
- Pattern: Module functions (no class/singleton); `saveStory` upserts by `id` and stamps `updatedAt`.

**Diagnostic rule engine:**
- Purpose: Pure function converting steps → structural warnings.
- Examples: `src/utils/diagnostics.ts` (`runDiagnostics`, `Diagnostic`, `DiagnosticRule`).
- Pattern: Pure function; returns `Diagnostic[]` with rule ids (`flat-zone`, `weak-rupture`, `false-safety`, `unresolved-ending`).

**Exporter:**
- Purpose: Serialize a `Story` to JSON/Markdown/Fountain/PDF and trigger browser download.
- Examples: `src/utils/export.ts` (`exportStoryAsJSON`, `exportStoryAsMarkdown`, `exportStoryAsFountain`, `exportStoryAsPDF`).
- Pattern: Standalone functions using `Blob` + `URL.createObjectURL` + anchor `download`; PDF via `jsPDF` + `jspdf-autotable`.

**Component (presentational):**
- Purpose: Render UI from props and emit callbacks; never read/write storage directly.
- Examples: `src/components/StoryCard.tsx`, `src/components/CardEditor.tsx`, `src/components/WaveformGraph.tsx`.
- Pattern: Default-export function components with an `interface Props` (or inline prop types); controlled inputs use `onChange` callbacks upward.

## Entry Points

**HTML entry:**
- Location: `index.html`
- Triggers: Browser load.
- Responsibilities: Mount `<div id="root">`, load `/src/main.tsx`, define `<title>` and favicon.

**React root:**
- Location: `src/main.tsx`
- Triggers: Loaded by `index.html`.
- Responsibilities: `createRoot(...).render(<StrictMode><App /></StrictMode>)`, import global `src/index.css`.

**Router:**
- Location: `src/App.tsx`
- Triggers: Mounted by `src/main.tsx`.
- Responsibilities: Wrap `HashRouter`; define routes `/` (StartPage), `/setup` (StorySetupPage), `/story/:id` (StoryWorkspacePage), `*` → redirect `/`. Calls `usePWAInstall()` to pass `isInstallable` into the workspace.

## Error Handling

**Strategy:** Localized `try/catch` with graceful fallback; no global error boundary or error-reporting service.

**Patterns:**
- `loadAllStories()` in `src/services/storage.ts` wraps `JSON.parse` in try/catch and returns `[]` on corruption.
- `handleImportJSON` in `src/pages/StoryWorkspacePage.tsx` validates required fields (`title`, `steps` array) and catches parse errors, surfacing `importError` state.
- `submitEmail()` in `src/utils/emailCapture.ts` returns `{ ok, error? }` rather than throwing; network/HTTP failures become user-visible messages.
- Form validation is manual and fail-fast: `StorySetupPage` and `StoryInfoModal` require a non-empty title before submit.

## Cross-Cutting Concerns

**Logging:**
- Minimal; `console.log` only for dev-mode email capture (`src/utils/emailCapture.ts`). No logging framework.

**Validation:**
- Manual inline form validation (required title). Import validation in `StoryWorkspacePage` checks `title`/`steps` shape only — no schema library (no Zod).

**Authentication:**
- None. Anonymous, local-first by design (per `README_AI.md` constraints: no auth, no accounts).

**Styling:**
- Single global stylesheet `src/index.css` (~1500 lines) using CSS custom properties as design tokens (light/dark via `prefers-color-scheme`), with BEM-like class naming (`--` modifiers, `__` elements).

**Persistence:**
- `localStorage` for durable data/prefs; `sessionStorage` for per-session email-capture flags. Keys namespaced (`story-xray:*`, `sx:*`, `sxr:*`).

---

*Architecture analysis: 2026-09-03*
*Update when major patterns change*
