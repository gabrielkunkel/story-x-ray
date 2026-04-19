# Phase 26: Router & Path Migration - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace `BrowserRouter` with `HashRouter` so the app navigates correctly on GitHub Pages static hosting (no 404s on direct URL access or page refresh). Audit source files for root-absolute paths that Vite would not rewrite automatically and fix any found.

Creating or modifying the Vite config, PWA manifest, env files, or CI/CD are out of scope — those belong to Phase 25 and Phase 27.

</domain>

<decisions>
## Implementation Decisions

### Router Migration
- **D-01:** Replace `BrowserRouter` with `HashRouter` in `src/App.tsx` — one import swap, one JSX tag swap
- **D-02:** All `useNavigate()` calls (`'/'`, `'/setup'`, `'/story/:id'`) remain unchanged — HashRouter prepends `#` internally, these paths work identically
- **D-03:** Keep the `<Route path="*" element={<Navigate to="/" replace />} />` catch-all as-is — works correctly with HashRouter; no `404.html` trick needed (HashRouter sidesteps the SPA 404 problem entirely)

### Path Audit
- **D-04:** Audit scope: `.tsx`, `.ts`, `.css` source files for root-absolute paths (e.g. `/icons/...`) that Vite would NOT rewrite
- **D-05:** `index.html` entries (`href="/favicon.svg"`, `src="/src/main.tsx"`) — leave as-is; Vite processes `index.html` with the configured `base` during build, so these are compliant with PATH-01
- **D-06:** PWA manifest icon paths in `vite.config.ts` (`/icons/icon-192.png`) — out of scope; Phase 25's responsibility
- **D-07:** Codebase scan result: **zero** root-absolute paths found in `.tsx`/`.ts`/`.css` source files — path audit is verification only, no fixes expected

### Claude's Discretion
- Order of operations (change router first or audit first — either is fine)
- Whether to add a brief inline comment to `HashRouter` explaining why it's used (optional)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §Routing — ROUTE-01 (HashRouter migration)
- `.planning/REQUIREMENTS.md` §Source Path Audit — PATH-01 (no root-absolute paths in source Vite won't rewrite)

No external ADRs or design docs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/App.tsx` — only file to change for router migration; contains the single `BrowserRouter` import and JSX wrapper

### Established Patterns
- All navigation uses `useNavigate()` from `react-router-dom` (not `<Link>`), consistent across `BoardHeader.tsx`, `StartPage.tsx`, `StorySetupPage.tsx`, `StoryWorkspacePage.tsx`
- Route paths use simple string literals (`'/'`, `'/setup'`, `'/story/:id'`) — no `process.env` or config-driven paths

### Integration Points
- `src/App.tsx:1` — router import: `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'`
- `src/App.tsx:11–18` — router JSX wrapping all routes

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 26-router-path-migration*
*Context gathered: 2026-04-18*
