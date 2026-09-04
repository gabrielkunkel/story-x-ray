# Codebase Structure

**Analysis Date:** 2026-09-03

## Directory Layout

```
story-x-ray/
├── .github/workflows/   # CI: GitHub Pages deploy workflow
├── .opencode/           # GSD tooling (skills, gsd-core templates)
├── .planning/           # GSD roadmap, phases, state, codebase maps
├── public/              # Static assets (favicon, icons, icons.svg)
├── src/                 # Application source (all TS/TSX/CSS)
│   ├── assets/          # Bundled images (hero.png, react/vite svgs)
│   ├── components/      # React presentational components
│   ├── config/          # Feature config (Beehiiv ID, email modal copy)
│   ├── data/            # Static 16-step definitions + example story
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Route-level page components
│   ├── services/        # localStorage persistence
│   ├── types/           # TypeScript domain types
│   ├── utils/           # Pure functions (diagnostics, export, email, PWA)
│   ├── App.tsx          # Router + route table
│   ├── index.css        # Global stylesheet (design tokens + components)
│   └── main.tsx         # React entry point
├── dist/                # Vite build output (gitignored)
├── .env                 # VITE_BASE_PATH=/ (committed, no secrets)
├── .env.gh-pages        # VITE_BASE_PATH=/story-x-ray/ (committed)
├── .env.example         # Template (committed)
├── index.html           # HTML entry
├── vite.config.ts       # Vite + React + PWA config
├── eslint.config.js     # ESLint flat config
├── tsconfig.json        # TS project references
├── tsconfig.app.json    # App TS config (src/)
├── tsconfig.node.json   # Node TS config (vite.config.ts)
├── package.json         # Manifest + scripts
└── README.md / README_AI.md  # Docs
```

## Directory Purposes

**src/pages/:**
- Purpose: Route-level containers that own page state and orchestrate data flow.
- Contains: `StartPage.tsx`, `StorySetupPage.tsx`, `StoryWorkspacePage.tsx`.
- Key files: `StoryWorkspacePage.tsx` (346 lines — the main workspace; largest file).

**src/components/:**
- Purpose: Presentational and controlled-input components; no direct storage access.
- Contains: `BoardHeader.tsx`, `ActColumn.tsx`, `StoryCard.tsx`, `CardEditor.tsx`, `WaveformGraph.tsx`, `DiagnosticsPanel.tsx`, `ScoreInput.tsx`, `ExportDropdown.tsx`, `EmailCaptureModal.tsx`, `StoryInfoModal.tsx`, `PdfExportModal.tsx`, `PWAInstallCallout.tsx`.
- Key files: `WaveformGraph.tsx` (recharts chart), `CardEditor.tsx` (beat/notes/scores editor).

**src/services/:**
- Purpose: Persistence I/O — the only module that touches `localStorage` for stories.
- Contains: `storage.ts`.
- Key files: `storage.ts` (loadAllStories, saveStory, loadStory, deleteStory, getActiveStoryId, setActiveStoryId).

**src/utils/:**
- Purpose: Pure/standalone domain functions with no React dependency.
- Contains: `diagnostics.ts`, `export.ts`, `emailCapture.ts`, `pwaInstall.ts`.
- Key files: `export.ts` (218 lines — JSON/Markdown/Fountain/PDF), `diagnostics.ts` (rule engine).

**src/data/:**
- Purpose: Static canonical content and story factory.
- Contains: `steps.ts`, `exampleStory.ts`.
- Key files: `steps.ts` (303 lines — STEP_DEFINITIONS, STEP_HINTS, STEP_EXAMPLES, createFreshSteps).

**src/hooks/:**
- Purpose: Reusable side-effect logic.
- Contains: `usePWAInstall.ts`, `useEmailDebounce.ts`.
- Key files: `useEmailDebounce.ts` (idle-timer email capture trigger).

**src/config/:**
- Purpose: Feature/configuration constants decoupled from logic.
- Contains: `beehiiv.ts`, `emailModal.ts`.
- Key files: `emailModal.ts` (modal copy, `CaptureContext` type), `beehiiv.ts` (publication ID, empty = dev mode).

**src/types/:**
- Purpose: Shared TypeScript domain model.
- Contains: `story.ts`.
- Key files: `story.ts` (`Dimension`, `DimensionScores`, `StoryStep`, `Story`).

**src/assets/:**
- Purpose: Bundled image assets.
- Contains: `hero.png`, `react.svg`, `vite.svg`.

**public/:**
- Purpose: Static files served verbatim at the build base path.
- Contains: `favicon.svg`, `icons.svg`, `icons/` (PWA `icon-192.png`, `icon-512.png`).

**.planning/:**
- Purpose: GSD project state — roadmap, requirements, phases, milestone audits, and this `codebase/` map.
- Contains: `PROJECT.md`, `ROADMAP.md`, `REQUIREMENTS.md`, `MILESTONES.md`, `STATE.md`, `phases/`, `phase-1..9/`, `milestones/`.

**.opencode/:**
- Purpose: GSD tooling installed for the repo (skills, `gsd-core` templates/workflows/references). Not application code.

## Key File Locations

**Entry Points:**
- `index.html` — HTML bootstrap; loads `/src/main.tsx` and mounts `#root`.
- `src/main.tsx` — React `createRoot` render in `StrictMode`.
- `src/App.tsx` — `HashRouter` + route table.

**Configuration:**
- `vite.config.ts` — Vite, `@vitejs/plugin-react`, `VitePWA` (Workbox); reads `VITE_BASE_PATH` via `loadEnv`.
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` — TypeScript project references (strict).
- `eslint.config.js` — ESLint 9 flat config (js, tseslint, react-hooks, react-refresh).
- `package.json` — scripts (`dev`, `build`, `build:prod`, `lint`, `preview`) + deps.
- `.env` / `.env.gh-pages` / `.env.example` — `VITE_BASE_PATH` base-path values (committed, no secrets).

**Core Logic:**
- `src/services/storage.ts` — persistence gateway.
- `src/data/steps.ts` — canonical 16-step structure + target scores.
- `src/utils/diagnostics.ts` — structural warning engine.
- `src/utils/export.ts` — export serializers.
- `src/pages/StoryWorkspacePage.tsx` — workspace orchestration.

**Testing:**
- None present — no `*.test.*` / `*.spec.*` files, no test runner config, no test script in `package.json`.

**Documentation:**
- `README.md` — user/dev guide (setup, build, env files, routing, email modal, deploy).
- `README_AI.md` — product spec (16-step model, dimensions, targets, MVP scope, lead-gen).

## Naming Conventions

**Files:**
- PascalCase.tsx for React components: `StoryCard.tsx`, `CardEditor.tsx`, `StoryWorkspacePage.tsx`.
- camelCase.ts for non-component modules: `storage.ts`, `diagnostics.ts`, `exampleStory.ts`.
- `use` prefix for hooks: `usePWAInstall.ts`, `useEmailDebounce.ts`.
- `Page` suffix for route containers: `StartPage.tsx`, `StorySetupPage.tsx`, `StoryWorkspacePage.tsx`.
- No `index.ts` barrel files; imports point at explicit module paths.

**Directories:**
- Lowercase plural for collections: `components/`, `pages/`, `services/`, `utils/`, `hooks/`, `types/`, `config/`, `data/`, `assets/`.

**Special Patterns:**
- Component files default-export the component; prop shape is an `interface Props` (or inline object type).
- Types/interfaces use PascalCase; `type` unions for string literals (e.g. `Dimension`, `CaptureContext`, `DiagnosticRule`).
- CSS class names use BEM-style: block `story-card`, element `story-card__label`, modifier `story-card--active`, `board-header__view-toggle--active`.

## Where to Add New Code

**New Feature / Page:**
- Primary code: `src/pages/{NewPage}.tsx`
- Route registration: `src/App.tsx` (add a `<Route>`)
- Components: `src/components/{ComponentName}.tsx`
- Tests: none established (add a test runner config first if testing is introduced).

**New Component/Module:**
- Implementation: `src/components/{ComponentName}.tsx`
- Types (if domain types): `src/types/story.ts` or a new `src/types/{domain}.ts`
- Reusable logic (no JSX): `src/utils/` (pure) or `src/hooks/` (stateful/effectful).

**New Persistence/Storage Concern:**
- Implementation: extend `src/services/storage.ts` (or add `src/services/{concern}.ts`), namespacing keys consistently (`story-xray:*`, `sx:*`, `sxr:*`).

**New Static Data:**
- Implementation: `src/data/{name}.ts`, exporting `const` arrays/records; mirror the factory pattern in `createFreshSteps()` if producing `Story` instances.

**New Configuration/Feature Flag:**
- Implementation: `src/config/{name}.ts`, exporting typed `const`; import from logic, never hardcode in components.

**Utilities:**
- Shared pure helpers: `src/utils/{name}.ts`
- Type definitions: `src/types/{name}.ts`

## Special Directories

**dist/:**
- Purpose: Vite production build output (deployed to GitHub Pages).
- Source: Generated by `npm run build` / `npm run build:prod`.
- Committed: No (listed in `.gitignore`).

**node_modules/:**
- Purpose: Installed dependencies.
- Source: `npm install`.
- Committed: No (listed in `.gitignore`).

**public/icons/:**
- Purpose: PWA manifest icons referenced by `vite.config.ts`.
- Source: Static assets.
- Committed: Yes.

**.planning/codebase/:**
- Purpose: GSD codebase map documents (this file, plus STACK/INTEGRATIONS/CONVENTIONS/TESTING/CONCERNS).
- Source: Written by `/gsd-map-codebase`.
- Committed: Yes.

---

*Structure analysis: 2026-09-03*
*Update when directory structure changes*
