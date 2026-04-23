---
phase: 25-build-config-pwa
verified: 2026-04-18T00:00:00Z
status: passed
score: 12/12
overrides_applied: 0
re_verification:
  previous_status: gaps_found
  previous_score: 10/12
  gaps_closed:
    - "ROADMAP SC naming mismatch: spec now updated to name .env.gh-pages and --mode gh-pages — contract and implementation now agree"
    - "ENV-03 / BUILD-02 requirement text updated to reflect gh-pages mode decision — no longer a gap"
  gaps_remaining:
    - "AVITE_BASE_PATH typo in .env.gh-pages — build:prod silently falls back to base / instead of /story-x-ray/"
  regressions: []
gaps:
  - truth: "Running `npm run build:prod` with `.env.gh-pages` produces a build with base `/story-x-ray/`"
    status: failed
    reason: "`.env.gh-pages` contains `AVITE_BASE_PATH=/story-x-ray/` (leading 'A' typo) instead of `VITE_BASE_PATH=/story-x-ray/`. Vite loads the file but finds no `VITE_BASE_PATH` key, so `env.VITE_BASE_PATH` is undefined, the nullish coalescing falls back to '/', and the gh-pages build silently produces base '/' — identical to the default build. The PWA manifest will have `start_url: '/'` and icon srcs `/icons/...` regardless of which build script is run."
    artifacts:
      - path: ".env.gh-pages"
        issue: "Line 1 reads `AVITE_BASE_PATH=/story-x-ray/` — should be `VITE_BASE_PATH=/story-x-ray/`. Confirmed with hex dump: 0x41 ('A') prefix on the key name."
    missing:
      - "Fix `.env.gh-pages` line 1: replace `AVITE_BASE_PATH=/story-x-ray/` with `VITE_BASE_PATH=/story-x-ray/`"
human_verification:
  - test: "Verify PWA manifest under subpath host (PWA-03)"
    expected: "After running `npm run build:prod` (with the typo fixed), serve the dist/ folder under a `/story-x-ray/` subpath. The service worker should register, the manifest should install correctly, and icon assets should load without 404."
    why_human: "Cannot run a build server or simulate subpath hosting programmatically. PWA-03 correctness (manifest + service worker under subpath) requires a browser or serve-based test of the build output."
  - test: "Verify `npm run build:prod` produces correct manifest after typo fix"
    expected: "dist/manifest.webmanifest contains: `\"start_url\": \"/story-x-ray/\"`, `\"scope\": \"/story-x-ray/\"`, icon srcs `/story-x-ray/icons/icon-192.png` and `/story-x-ray/icons/icon-512.png`"
    why_human: "Build produces side effects (writes dist/); cannot run in a static verification pass. This check is also the regression test for the typo fix."
---

# Phase 25: Build Config & PWA Verification Report

**Phase Goal:** The Vite build is fully ENV-var-controlled and produces a base-aware PWA that resolves assets and service worker correctly under any subpath host
**Verified:** 2026-04-18T00:00:00Z
**Status:** gaps_found
**Re-verification:** Yes — after spec update resolving the .env.production / --mode production naming dispute

## Re-verification Context

The prior VERIFICATION.md (score: 10/12, status: gaps_found) identified two gaps:

1. **ENV-03 / BUILD-02 contract mismatch** — ROADMAP and requirements named `.env.production` / `--mode production`, but implementation shipped `.env.gh-pages` / `--mode gh-pages`.
2. **PWA-03** — human verification pending.

Both spec documents (ROADMAP.md and REQUIREMENTS.md) have since been updated to name `.env.gh-pages` and `--mode gh-pages`, acknowledging the executor's technically correct deviation. Gap #1 is therefore closed.

**New gap discovered during re-verification:** `.env.gh-pages` contains `AVITE_BASE_PATH` (with a leading `A`) instead of `VITE_BASE_PATH`. This is a blocker — the gh-pages build silently falls back to base `/`, making it identical to the default build.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `npm run build` (no env override) produces base `/` | ✓ VERIFIED | `vite.config.ts` fallback `?? '/'` is correct; `.env` correctly sets `VITE_BASE_PATH=/`; key correctly named |
| 2 | `npm run build:prod` produces base `/story-x-ray/` | ✗ FAILED | `.env.gh-pages` has `AVITE_BASE_PATH` (typo) — `VITE_BASE_PATH` not found, `base` falls back to `'/'`; manifest will have `start_url: '/'` regardless of build script used |
| 3 | PWA manifest `start_url`, `scope`, icon srcs derived from computed `base` | ✓ VERIFIED | `vite.config.ts:25-34` — `scope: base`, `start_url: base`, `` src: `${base}icons/icon-192.png` ``, `` src: `${base}icons/icon-512.png` `` — wiring is correct; gap is in data source, not wiring |
| 4 | `.env`, `.env.gh-pages`, and `.env.example` exist with correct `VITE_BASE_PATH` values | ✗ FAILED | `.env` correct (`VITE_BASE_PATH=/`); `.env.example` correct; `.env.gh-pages` has typo key `AVITE_BASE_PATH` instead of `VITE_BASE_PATH` — effective value is undefined |
| 5 | `.gitignore` preserves committability of both env files | ✓ VERIFIED | `git ls-files .env .env.gh-pages` returns both files as tracked; `.gitignore` uses `*.local` only |
| 6 | `vite.config.ts` uses `defineConfig(({ mode }) => ...)` + `loadEnv` | ✓ VERIFIED | Line 5: `export default defineConfig(({ mode }) => {`; Line 6: `const env = loadEnv(mode, process.cwd(), '')` |
| 7 | `base` computed from `VITE_BASE_PATH` with `'/'` fallback | ✓ VERIFIED | Line 7: `const base = env.VITE_BASE_PATH ?? '/'` |
| 8 | All existing config preserved (React plugin, optimizeDeps, VitePWA) | ✓ VERIFIED | `optimizeDeps: { include: ['recharts', 'react-is'] }` intact; `react()` plugin present; `registerType: 'autoUpdate'` unchanged; theme/background colors intact |
| 9 | `package.json` retains `"build": "tsc -b && vite build"` | ✓ VERIFIED | Line 8 of package.json confirmed |
| 10 | `package.json` adds `"build:prod": "tsc -b && vite build --mode gh-pages"` | ✓ VERIFIED | Line 9 of package.json confirmed — script name and mode flag match updated spec |
| 11 | ENV-03: `.env.gh-pages` is the GitHub Pages env file (spec now matches) | ✗ FAILED | File exists and is tracked, but key name is `AVITE_BASE_PATH` not `VITE_BASE_PATH` — typo makes the file ineffective |
| 12 | BUILD-02: `build:prod` uses `--mode gh-pages` (spec now matches) | ✓ VERIFIED | `package.json` line 9: `"tsc -b && vite build --mode gh-pages"` — exact match |

**Score:** 10/12 truths verified (2 failed due to typo in `.env.gh-pages`, 2 require human build verification)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `vite.config.ts` | ENV-var-controlled config with base-aware PWA manifest | ✓ VERIFIED | All key patterns present and correct |
| `package.json` | `build:prod` script using `--mode gh-pages` | ✓ VERIFIED | Line 9: `"build:prod": "tsc -b && vite build --mode gh-pages"` |
| `.env` | `VITE_BASE_PATH=/` | ✓ VERIFIED | Exact content confirmed |
| `.env.gh-pages` | `VITE_BASE_PATH=/story-x-ray/` | ✗ BROKEN | File exists and is tracked, but contains `AVITE_BASE_PATH=/story-x-ray/` — leading `A` typo makes the key unrecognizable to Vite/loadEnv |
| `.env.example` | Documents `VITE_BASE_PATH` with comment | ✓ VERIFIED | Comment line present; `VITE_BASE_PATH=/` set correctly |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `vite.config.ts` | `.env` | `loadEnv(mode, ...)` reads `VITE_BASE_PATH` | ✓ WIRED | Default build (mode=production) reads `.env`; `VITE_BASE_PATH=/` found correctly |
| `vite.config.ts` | `.env.gh-pages` | `loadEnv(mode, ...)` reads `VITE_BASE_PATH` with `--mode gh-pages` | ✗ BROKEN | Vite loads the file but key `VITE_BASE_PATH` is absent (only `AVITE_BASE_PATH` exists); `env.VITE_BASE_PATH` is undefined; base falls back to `'/'` |
| `vite.config.ts` | VitePWA manifest | `base` used in `scope`, `start_url`, icon src template literals | ✓ WIRED | Lines 25-34 confirmed; wiring is correct — the bug is upstream in the env file |
| `package.json` build:prod | `.env.gh-pages` | `--mode gh-pages` loads `.env.gh-pages` | ✓ WIRED (file load) / ✗ BROKEN (value) | Vite correctly selects `.env.gh-pages` for `--mode gh-pages`; the file is loaded; but the key name typo means no useful value is read |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `vite.config.ts` | `base` (default build) | `env.VITE_BASE_PATH` from `.env` | Yes — `VITE_BASE_PATH=/` found | ✓ FLOWING |
| `vite.config.ts` | `base` (build:prod) | `env.VITE_BASE_PATH` from `.env.gh-pages` | No — key is `AVITE_BASE_PATH`, not `VITE_BASE_PATH`; value is undefined; fallback `'/'` used | ✗ DISCONNECTED (typo) |
| PWA manifest fields | `scope`, `start_url`, icon `src` | `base` variable | Correct for default build; wrong for build:prod | ✗ HOLLOW for gh-pages builds |

### Behavioral Spot-Checks

Step 7b: SKIPPED — build output (`dist/`) does not exist in the repo. Verifying manifest content requires running `npm run build` or `npm run build:prod`, which produces side effects (writes dist/). Routed to human verification.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| VITE-01 | 25-01-PLAN.md | `vite.config.ts` uses `defineConfig(({ mode }) => ...)` + `loadEnv` | ✓ SATISFIED | Lines 1, 5-6 of vite.config.ts confirmed |
| VITE-02 | 25-01-PLAN.md | Base path controlled by `VITE_BASE_PATH`, defaulting to `'/'` | ✓ SATISFIED | Line 7: `env.VITE_BASE_PATH ?? '/'` — logic is correct; bug is in data source |
| VITE-03 | 25-01-PLAN.md | All existing config preserved (React plugin, optimizeDeps, VitePWA) | ✓ SATISFIED | All three preserved verbatim |
| PWA-01 | 25-01-PLAN.md | `start_url` uses computed `base`, not hardcoded `'/'` | ✓ SATISFIED (wiring) | Line 26: `start_url: base` — wiring correct; gh-pages build will produce wrong value until typo fixed |
| PWA-02 | 25-01-PLAN.md | Icon `src` paths built from computed `base` | ✓ SATISFIED (wiring) | Lines 29, 34: template literals confirmed |
| PWA-03 | 25-01-PLAN.md | Service worker and manifest resolve correctly under subpath host | ? NEEDS HUMAN | Cannot verify without running build and serving under subpath; additionally blocked until typo is fixed |
| ENV-01 | 25-01-PLAN.md | `.env.example` documents `VITE_BASE_PATH` and its purpose | ✓ SATISFIED | Comment line present, `VITE_BASE_PATH=/` set |
| ENV-02 | 25-01-PLAN.md | `.env` sets `VITE_BASE_PATH=/` for local development | ✓ SATISFIED | `.env` content: `VITE_BASE_PATH=/` — correct key name |
| ENV-03 | 25-01-PLAN.md | `.env.gh-pages` sets `VITE_BASE_PATH=/story-x-ray/` (spec updated to reflect gh-pages naming) | ✗ BLOCKED | File exists with value `/story-x-ray/` but key name is `AVITE_BASE_PATH` — one-character typo makes it a no-op |
| ENV-04 | 25-01-PLAN.md | `.gitignore` preserves correct entries (excludes `*.local`, commits `.env` and `.env.gh-pages`) | ✓ SATISFIED | Both files tracked by git; `*.local` is the only exclude pattern |
| BUILD-01 | 25-01-PLAN.md | `package.json` retains `"build": "tsc -b && vite build"` | ✓ SATISFIED | Confirmed at package.json:8 |
| BUILD-02 | 25-01-PLAN.md | `package.json` adds `"build:prod": "tsc -b && vite build --mode gh-pages"` (spec updated) | ✓ SATISFIED | Confirmed at package.json:9 — exact match with updated spec |

**Requirements with issues:** ENV-03 (BLOCKED — typo in `.env.gh-pages` key name).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `.env.gh-pages` | 1 | `AVITE_BASE_PATH` key name (leading `A` typo) | 🛑 Blocker | gh-pages build silently produces base `/` instead of `/story-x-ray/`; all gh-pages asset/manifest paths are wrong |
| `vite.config.ts` | 37 | `purpose: 'any maskable'` — combined purpose string (deprecated W3C pattern) | ⚠️ Warning | Lighthouse warnings, potential icon clipping on maskable displays. Does not affect base path or PWA registration correctness. |

No TODO/FIXME/placeholder comments. No empty return stubs.

### Human Verification Required

#### 1. Build output inspection — default build base `/`

**Test:** Run `npm run build` from project root. After build completes, run:
```bash
grep '"start_url"' dist/manifest.webmanifest
grep '"scope"' dist/manifest.webmanifest
grep 'icon-192' dist/manifest.webmanifest
```
**Expected:** `"start_url": "/"`, `"scope": "/"`, icon src `"/icons/icon-192.png"`
**Why human:** Build produces side effects (writes dist/); cannot run in verification pass.

#### 2. Build output inspection — gh-pages build base `/story-x-ray/`

**Test:** After fixing `.env.gh-pages` typo, run `npm run build:prod`. Then inspect:
```bash
grep '"start_url"' dist/manifest.webmanifest
grep '"scope"' dist/manifest.webmanifest
grep 'icon-192' dist/manifest.webmanifest
grep 'icon-512' dist/manifest.webmanifest
```
**Expected:** `"start_url": "/story-x-ray/"`, `"scope": "/story-x-ray/"`, icon srcs `/story-x-ray/icons/icon-192.png` and `/story-x-ray/icons/icon-512.png`
**Why human:** Build produces side effects. This check also serves as the regression test confirming the typo fix worked.

#### 3. PWA manifest under subpath host (PWA-03)

**Test:** After `npm run build:prod` (with typo fixed), serve dist/ using `npx serve dist -l 3000`, then access `http://localhost:3000/story-x-ray/` (or configure a dev server to serve under that subpath). In browser DevTools → Application → Manifest — verify service worker registers, manifest parses without errors, icons load.
**Expected:** Service worker registers at `/story-x-ray/`, manifest shows correct `start_url` and `scope`, icons are accessible.
**Why human:** Requires browser, PWA install flow, and subpath simulation — not automatable in a static grep pass.

### Gaps Summary

**One blocker remaining:** A one-character typo (`AVITE_BASE_PATH` instead of `VITE_BASE_PATH`) in `.env.gh-pages` line 1 makes the entire gh-pages build pipeline ineffective. When `npm run build:prod` runs:
1. Vite loads `.env.gh-pages` correctly (mode naming is now correct)
2. `loadEnv` reads the file but finds no key named `VITE_BASE_PATH` (only `AVITE_BASE_PATH`)
3. `env.VITE_BASE_PATH` is `undefined`
4. Nullish coalescing falls back to `'/'`
5. The gh-pages build silently produces base `/` — identical to the default build

**Fix:** Edit `.env.gh-pages` line 1 to read `VITE_BASE_PATH=/story-x-ray/`.

**Previously resolved:** The two gaps from the prior verification (`.env.production` naming mismatch, `--mode production` vs `--mode gh-pages`) are closed — ROADMAP.md and REQUIREMENTS.md have been updated to name `.env.gh-pages` and `--mode gh-pages`. The implementation and spec now agree on naming.

**After fix:** The only remaining item is PWA-03 human verification (browser-based subpath hosting test), which cannot be automated. Once the typo is fixed and human build verification passes, overall status should be `human_needed` pending PWA-03.

---

_Verified: 2026-04-18T00:00:00Z_
_Verifier: Claude (gsd-verifier)_
