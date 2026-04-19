# Phase 25: Build Config & PWA - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Rewrite `vite.config.ts` to be ENV-var-controlled via `loadEnv`, wire the PWA manifest to use the computed base path (start_url, icon paths, scope), create `.env`, `.env.production`, and `.env.example` files, and add a `build:prod` npm script. Routing migration and source path audit are Phase 26.

Requirements in scope: VITE-01, VITE-02, VITE-03, PWA-01, PWA-02, PWA-03, ENV-01, ENV-02, ENV-03, ENV-04, BUILD-01, BUILD-02.

</domain>

<decisions>
## Implementation Decisions

### Env files git strategy
- **D-01:** `.env` and `.env.production` are committed to the repo. Both files contain only `VITE_BASE_PATH` values — no secrets. Committing them ensures CI and other developers get correct values without manual setup.
- **D-02:** `.gitignore` requires no changes to env entries — the existing `*.local` pattern correctly excludes `.env.local` but leaves `.env` and `.env.production` commitable.

### PWA manifest configuration
- **D-03:** The manifest includes an explicit `scope: base` field set to the computed base path (e.g. `/story-x-ray/` in production, `/` locally). This guarantees correct PWA install scope rather than relying on browser inference from `start_url`.
- **D-04:** `start_url` is set to the computed `base` value.
- **D-05:** Icon `src` paths are built as template literals: `${base}icons/icon-192.png` and `${base}icons/icon-512.png`.

### Dev-mode PWA
- **D-06:** PWA service worker is **disabled** in `npm run dev` (default VitePWA behavior — no `devOptions` needed). PWA behavior is tested via `npm run preview`.

### vite.config.ts pattern
- **D-07:** Use `defineConfig(({ mode }) => { const env = loadEnv(mode, process.cwd(), ''); const base = env.VITE_BASE_PATH ?? '/'; return { base, ...plugins }; })` pattern.
- **D-08:** All existing config is preserved: `optimizeDeps.include`, `react()` plugin, `VitePWA` plugin with all current manifest fields.

### Build scripts
- **D-09:** `package.json` retains `"build": "tsc -b && vite build"` unchanged.
- **D-10:** `package.json` adds `"build:prod": "tsc -b && vite build --mode production"` for GitHub Pages deployment.

### Claude's Discretion
- Exact TypeScript typing for the `env` object returned by `loadEnv`
- Whether to add a `// @ts-check` comment or type assertion for `VITE_BASE_PATH`
- Content of `.env.example` comments

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §v1.7 Requirements — VITE-01 through BUILD-02 (full acceptance criteria for this phase)

### Existing config to preserve and extend
- `vite.config.ts` — current config (optimizeDeps, react plugin, VitePWA with manifest); must be preserved in the rewrite

### No external specs
No external design docs — all requirements fully captured in REQUIREMENTS.md and decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `vite.config.ts` (current) — static `defineConfig({})` form; all existing options migrate into the function form

### Established Patterns
- No existing env file pattern — this phase establishes it
- No existing `build:prod` script — this phase adds it
- `.gitignore` uses `*.local` to exclude secrets; no change required for committing `.env` and `.env.production`

### Integration Points
- `package.json` scripts section — `build:prod` added alongside existing `build`
- `vite.config.ts` — becomes the single source of truth for base path; PWA manifest derives all path values from it
- CI/CD workflow (Phase 27) will call `npm run build:prod` — this script must exist and work correctly before Phase 27

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard `loadEnv` approach as documented in Vite docs.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 25-build-config-pwa*
*Context gathered: 2026-04-18*
