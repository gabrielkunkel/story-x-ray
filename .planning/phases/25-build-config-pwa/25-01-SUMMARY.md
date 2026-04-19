---
phase: 25-build-config-pwa
plan: 01
subsystem: infra
tags: [vite, pwa, env, build-config, vite-plugin-pwa, loadEnv]

# Dependency graph
requires: []
provides:
  - ENV-var-controlled vite.config.ts using defineConfig(({ mode }) => ...) + loadEnv
  - PWA manifest with base-aware start_url, scope, and icon src paths
  - .env (VITE_BASE_PATH=/) for local development builds
  - .env.gh-pages (VITE_BASE_PATH=/story-x-ray/) for GitHub Pages production builds
  - .env.example documenting VITE_BASE_PATH usage
  - build:prod npm script (tsc -b && vite build --mode gh-pages)
affects: [26-router-path-migration, 27-ci-cd]

# Tech tracking
tech-stack:
  added: []
  patterns: [loadEnv-base-path, env-file-per-mode, base-aware-pwa-manifest]

key-files:
  created: [.env, .env.gh-pages, .env.example]
  modified: [vite.config.ts, package.json]

key-decisions:
  - "Use --mode gh-pages (not production) for build:prod — Vite default build mode is production so .env.production would override local build; gh-pages mode isolates the GitHub Pages env file"
  - "Rename .env.production to .env.gh-pages — required by the mode naming decision; .env.gh-pages loaded only by --mode gh-pages, not by default npm run build"
  - "PWA manifest scope and start_url both set to computed base variable; icon srcs use template literals ${base}icons/..."
  - "VITE_BASE_PATH ?? '/' nullish coalescing — loadEnv returns Record<string,string> so absent key is undefined at runtime despite type"

patterns-established:
  - "loadEnv-base-path: defineConfig(({ mode }) => { const env = loadEnv(mode, process.cwd(), ''); const base = env.VITE_BASE_PATH ?? '/'; return { base, ... } })"
  - "env-file-per-mode: .env = local (base /), .env.gh-pages = GitHub Pages (base /story-x-ray/), loaded by matching --mode flag"
  - "base-aware-pwa-manifest: scope: base, start_url: base, icon src: \`${base}icons/...\`"

requirements-completed: [VITE-01, VITE-02, VITE-03, PWA-01, PWA-02, PWA-03, ENV-01, ENV-02, ENV-03, ENV-04, BUILD-01, BUILD-02]

# Metrics
duration: 2min
completed: 2026-04-19
---

# Phase 25 Plan 01: Build Config & PWA Summary

**ENV-var-controlled vite.config.ts with loadEnv + VITE_BASE_PATH; PWA manifest scope/start_url/icons derived from base; two-mode build pipeline (default=/, gh-pages=/story-x-ray/)**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-19T04:03:58Z
- **Completed:** 2026-04-19T04:05:53Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Rewrote vite.config.ts to function form with loadEnv; base derived from VITE_BASE_PATH env var defaulting to '/'
- Wired PWA manifest scope, start_url, and both icon srcs to the computed base variable
- Created .env (.env.gh-pages, .env.example) establishing the env-file-per-mode pattern
- Added build:prod script using --mode gh-pages; verified both builds produce correct manifests

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite vite.config.ts with loadEnv and base-aware PWA manifest** - `bc79243` (feat)
2. **Task 2: Create env files and add build:prod script to package.json** - `f6e5d95` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `vite.config.ts` - Rewritten to defineConfig(({ mode }) => ...) + loadEnv; base-aware PWA manifest
- `package.json` - Added build:prod script: `tsc -b && vite build --mode gh-pages`
- `.env` - VITE_BASE_PATH=/ for local development
- `.env.gh-pages` - VITE_BASE_PATH=/story-x-ray/ for GitHub Pages production
- `.env.example` - Documents VITE_BASE_PATH with comment

## Decisions Made
- **--mode gh-pages instead of --mode production for build:prod:** Vite's default build mode is `production`, which automatically loads `.env.production`. Using `--mode production` for `build:prod` and `--mode production` for `npm run build` would make both scripts identical (both pick up `.env.production`). The fix was to use `--mode gh-pages` so the GitHub Pages env file is only loaded when explicitly requested, leaving the default `npm run build` to load only `.env` (base=/).
- **Renamed .env.production to .env.gh-pages:** Follows from the mode naming decision. The plan specified `.env.production` but this name conflicts with Vite's default build mode. `.env.gh-pages` is semantically accurate and matches the `--mode gh-pages` flag.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Used --mode gh-pages instead of --mode production for build:prod**
- **Found during:** Task 2 (Create env files and add build:prod script)
- **Issue:** Plan specified `"build:prod": "tsc -b && vite build --mode production"` and `.env.production` with `VITE_BASE_PATH=/story-x-ray/`. Vite's default build mode is already `production`, so `npm run build` (no --mode flag) loads `.env.production` and produces base `/story-x-ray/` — violating the must_have truth that the default build produces base `/`.
- **Fix:** Renamed `.env.production` to `.env.gh-pages`; changed `build:prod` script to `--mode gh-pages`. Both builds verified: default produces `"start_url": "/"`, build:prod produces `"start_url": "/story-x-ray/"`.
- **Files modified:** `.env.gh-pages` (renamed from `.env.production`), `package.json`
- **Verification:** `npm run build` → manifest `start_url: /`; `npm run build:prod` → manifest `start_url: /story-x-ray/`, `scope: /story-x-ray/`, icon srcs `/story-x-ray/icons/icon-192.png`
- **Committed in:** f6e5d95 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug: plan's --mode production conflicted with Vite default build mode)
**Impact on plan:** Fix was necessary for correctness. Functionally identical to plan intent; only the mode name and env filename changed. Phase 27 CI/CD should call `npm run build:prod` (unchanged script name).

## Issues Encountered
- Vite's default `vite build` mode is `production`, not `development`. This caused `.env.production` to be loaded by both `npm run build` and `npm run build:prod`, making them equivalent. Resolved by using a custom mode name (`gh-pages`) that doesn't collide with Vite's default.

## User Setup Required
None - no external service configuration required. Both env files are committed to the repo.

## Next Phase Readiness
- Phase 26 (HashRouter migration): vite.config.ts base is set; import path audits can proceed against the correct base
- Phase 27 (CI/CD): `npm run build:prod` is ready; workflow should call this script to produce GitHub Pages artifacts with base `/story-x-ray/`
- Note for Phase 27: the CI script should use `npm run build:prod` (not `npm run build:production` or any other variant)

---
*Phase: 25-build-config-pwa*
*Completed: 2026-04-19*
