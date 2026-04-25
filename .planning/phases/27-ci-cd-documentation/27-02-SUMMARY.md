---
phase: 27-ci-cd-documentation
plan: 02
subsystem: documentation
tags: [readme, deployment, github-pages, hashrouter, env-files, docs]
dependency_graph:
  requires: [27-01]
  provides: [DOC-01, DOC-02, DOC-03, DOC-04]
  affects: [README.md]
tech_stack:
  added: []
  patterns: [env-var-controlled-base-path, hashrouter-spa-routing]
key_files:
  created: []
  modified:
    - README.md
decisions:
  - "Inserted three sections (Environment files, Deploying to GitHub Pages, Routing) between the existing Build section and Enable Beehiiv email capture to maintain logical flow from local dev → env config → deployment → routing → feature config"
metrics:
  duration: "5 minutes"
  completed: "2026-04-25T01:24:18Z"
  tasks_completed: 1
  tasks_total: 1
  files_changed: 1
---

# Phase 27 Plan 02: README Deployment Documentation Summary

README.md updated with four developer documentation additions covering env file system, build commands, GitHub Pages setup, and HashRouter routing convention — no tribal knowledge required for deployment.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add environment files section and deployment section to README.md | 1be22e3 | README.md |

## What Was Built

Three new sections added to README.md between the existing "Build" section and "Enable Beehiiv email capture":

**Environment files (DOC-01):** Table documenting `.env`, `.env.gh-pages`, and `.env.example` with exact `VITE_BASE_PATH` values and a note that both env files are safe to commit (no secrets).

**Deploying to GitHub Pages (DOC-02 + DOC-03):** One-time setup steps (Settings → Pages → Source: GitHub Actions), and build command reference table distinguishing `npm run build:prod` (deployment) from `npm run build` (local verification).

**Routing (DOC-04):** Explanation of HashRouter, the `#/` URL prefix convention with concrete URL examples, and a troubleshooting note pointing to `src/App.tsx`.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None.

## Threat Flags

None. README documents only env var names and base path values — no secrets, no new network surface.

## Self-Check: PASSED

- README.md modified and committed: 1be22e3
- `grep "Environment files" README.md` → line 40 (DOC-01 present)
- `grep "VITE_BASE_PATH" README.md` → 5 matches (local value, gh-pages value, example)
- `grep "build:prod" README.md` → 3 matches (DOC-02 command documented)
- `grep "Settings.*Pages" README.md` → line 65 (DOC-03 setup step present)
- `grep "GitHub Actions" README.md` → 2 matches (workflow reference + Pages source setting)
- `grep "HashRouter" README.md` → 3 matches (DOC-04 routing section present)
- `grep "Local development" README.md` → present (existing section intact)
- `grep "Enable Beehiiv" README.md` → present (existing section intact)
- `grep "Tech stack" README.md` → present (existing section intact)
- `grep "MIT" README.md` → present (license intact)
