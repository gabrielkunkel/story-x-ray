---
phase: 27-ci-cd-documentation
plan: "01"
subsystem: infra
tags: [github-actions, github-pages, ci-cd, vite, oidc, deploy]

# Dependency graph
requires:
  - phase: 25-build-config
    provides: build:prod script (tsc -b && vite build --mode gh-pages) and .env.gh-pages env file
  - phase: 26-router-path-migration
    provides: HashRouter migration making app compatible with static hosting
provides:
  - GitHub Actions workflow that auto-deploys on push to main via OIDC + Pages artifact
  - Concurrency control preventing overlapping deployments
affects: [future-ci, readme-docs, deployment-verification]

# Tech tracking
tech-stack:
  added: [github-actions, actions/checkout@v4, actions/setup-node@v4, actions/upload-pages-artifact@v3, actions/deploy-pages@v4]
  patterns: [split build/deploy jobs, OIDC Pages deployment, concurrency group cancellation]

key-files:
  created:
    - .github/workflows/deploy.yml
  modified: []

key-decisions:
  - "Workflow uses npm ci (not npm install) for reproducible installs"
  - "node-version: 20 (LTS) selected for stability"
  - "No manual env var injection needed — .env.gh-pages is committed and Vite reads it via --mode gh-pages"
  - "Actions pinned to major versions (v4/v3) for stability; Dependabot handles security updates on public repos"

patterns-established:
  - "Split build/deploy jobs pattern: build job uploads artifact, deploy job deploys via OIDC — matches GitHub Pages recommended pattern"
  - "concurrency.group: pages + cancel-in-progress: true ensures only the latest push deploys"

requirements-completed: [CI-01, CI-02, CI-03, CI-04, CI-05]

# Metrics
duration: 1min
completed: 2026-04-25
---

# Phase 27 Plan 01: CI/CD Documentation Summary

**GitHub Actions split build/deploy workflow with OIDC permissions, concurrency control, and npm run build:prod for automated GitHub Pages deployment on push to main**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-04-25T01:21:00Z
- **Completed:** 2026-04-25T01:21:39Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Created `.github/workflows/deploy.yml` satisfying all 5 CI requirements (CI-01 through CI-05)
- Split build/deploy jobs with correct OIDC permissions (`contents: read`, `pages: write`, `id-token: write`)
- Concurrency group prevents overlapping deployments — only the latest push to main deploys
- Uses `npm run build:prod` (not `npm run build`) ensuring `--mode gh-pages` loads `.env.gh-pages` with correct `VITE_BASE_PATH`

## Task Commits

Each task was committed atomically:

1. **Task 1: Create .github/workflows/deploy.yml** - `010c16f` (feat)

**Plan metadata:** _(to be committed with SUMMARY.md)_

## Files Created/Modified
- `.github/workflows/deploy.yml` - GitHub Actions workflow: push-triggered build (npm ci + build:prod + upload artifact) and OIDC-authenticated deploy to GitHub Pages

## Decisions Made
- Used `node-version: 20` (LTS) for stability across all future runs
- `npm ci` instead of `npm install` for reproducible, locked-version installs in CI
- No env var injection in workflow — `.env.gh-pages` is already committed; Vite's `--mode gh-pages` loads it automatically
- Action versions pinned at major (v4/v3) — breaking changes require explicit bump; Dependabot covers security patches

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required beyond enabling GitHub Pages in the repository settings (Settings > Pages > Source: GitHub Actions).

## Threat Surface Scan

No new threat surface beyond what was documented in the plan's threat model. The workflow's OIDC permissions (`pages: write`, `id-token: write`) are scoped correctly — only the deploy job can push to Pages, and `contents: read` limits the build job's checkout scope.

## Next Phase Readiness
- `.github/workflows/deploy.yml` is ready; push to main will trigger first deployment
- GitHub repository must have Pages enabled with "Source: GitHub Actions" for the deploy job to succeed
- Phase 27 Plan 02 (README deployment documentation) can proceed immediately

---
*Phase: 27-ci-cd-documentation*
*Completed: 2026-04-25*
