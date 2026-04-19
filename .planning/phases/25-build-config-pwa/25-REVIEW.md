---
phase: 25-build-config-pwa
reviewed: 2026-04-18T23:15:00Z
depth: standard
files_reviewed: 5
files_reviewed_list:
  - vite.config.ts
  - package.json
  - .env
  - .env.gh-pages
  - .env.example
findings:
  critical: 0
  warning: 2
  info: 1
  total: 3
status: issues_found
---

# Phase 25: Code Review Report

**Reviewed:** 2026-04-18T23:15:00Z
**Depth:** standard
**Files Reviewed:** 5
**Status:** issues_found

## Summary

Phase 25 successfully rewrites `vite.config.ts` to use the `defineConfig(({ mode }) => ...)` + `loadEnv` pattern, wires the PWA manifest to derive `start_url`, `scope`, and icon `src` paths from `VITE_BASE_PATH`, and adds a `build:prod` npm script. The core `vite.config.ts` logic is correct and complete.

However, the implementation deviated from the plan spec on one consequential naming decision: the plan specified `--mode production` (loading `.env.production`) but the implementation uses `--mode gh-pages` (loading `.env.gh-pages`). Both are internally consistent pairs — the script and env file match each other — but the name `gh-pages` diverges from Vite's conventional `production` mode and from the ROADMAP's stated requirement. This creates a real risk that Phase 27 (CI/CD) will produce a broken GitHub Pages build if it references `--mode production` or `.env.production`, which the ROADMAP line 225 explicitly names.

The second warning is a PWA manifest icon `purpose` field that combines `any` and `maskable` in a single entry — this is a deprecated pattern per W3C Web App Manifest spec and causes warnings in Lighthouse and browser DevTools.

---

## Warnings

### WR-01: `build:prod` uses `--mode gh-pages` instead of `--mode production`

**File:** `package.json:9`
**Issue:** The `build:prod` script is `tsc -b && vite build --mode gh-pages`, which loads `.env.gh-pages`. The plan spec (25-01-PLAN.md line 259, PATTERNS.md line 148) and ROADMAP (line 225) both specify `--mode production` loading `.env.production`. The env file shipped is `.env.gh-pages`, not `.env.production`.

This is internally consistent (the script matches the env file that exists), but it diverges from Vite's conventional `production` mode. Vite also automatically applies production optimizations when mode is `production`; with `--mode gh-pages`, Vite's mode is set to `gh-pages`, not `production`, so `import.meta.env.PROD` will be `false` at runtime and `import.meta.env.MODE` will be `'gh-pages'` instead of `'production'`. Any code or library that keys on `import.meta.env.PROD` or `MODE === 'production'` will behave as in development mode.

Additionally, Phase 27 (CI/CD) is expected to call `npm run build:prod`; if any CI template references `--mode production` or `.env.production` directly, it will not pick up the GitHub Pages base path.

**Fix:** Rename `.env.gh-pages` to `.env.production` and update `package.json` `build:prod` to use `--mode production`:

```bash
mv .env.gh-pages .env.production
```

```json
"build:prod": "tsc -b && vite build --mode production"
```

This aligns with Vite's convention that `production` mode sets `import.meta.env.PROD = true`, and matches the ROADMAP and plan spec exactly.

---

### WR-02: PWA manifest icon combines `any` and `maskable` purpose in a single entry

**File:** `vite.config.ts:37`
**Issue:** The 512x512 icon entry uses `purpose: 'any maskable'` (a space-separated string combining two purposes). Per the W3C Web App Manifest spec and Google's PWA guidance, each purpose should be declared in a separate icon entry. Browsers and Lighthouse treat `'any maskable'` as a deprecated pattern and may display warnings. More critically, maskable icons require safe-zone-aware artwork (content within the central 80% of the canvas); if the same PNG is used for both `any` and `maskable`, the maskable display will clip the icon depending on the device's mask shape.

```typescript
// line 37 — current (deprecated combined form)
purpose: 'any maskable',
```

**Fix:** Split into two separate icon entries:

```typescript
{
  src: `${base}icons/icon-512.png`,
  sizes: '512x512',
  type: 'image/png',
  purpose: 'any',
},
{
  src: `${base}icons/icon-512-maskable.png`,
  sizes: '512x512',
  type: 'image/png',
  purpose: 'maskable',
},
```

If a separate maskable icon asset is not yet available, the minimum safe fix is to use `purpose: 'any'` only, which avoids the clipping issue:

```typescript
purpose: 'any',
```

---

## Info

### IN-01: `.env.example` documents only local dev default, not GitHub Pages value

**File:** `.env.example:1-3`
**Issue:** The example file shows `VITE_BASE_PATH=/` and mentions `/story-x-ray/` in comments, but does not show the actual GitHub Pages value as a commented-out example. Developers cloning the repo must read the comment carefully to discover the correct production value. This is a minor discoverability issue, not a bug.

**Fix:** Add the production value as a commented-out line:

```bash
# Base path for the app. Set to '/' for local dev, '/story-x-ray/' for GitHub Pages.
# Copy this file to .env and adjust for your environment.
VITE_BASE_PATH=/
# VITE_BASE_PATH=/story-x-ray/
```

---

---

_Reviewed: 2026-04-18T23:15:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
