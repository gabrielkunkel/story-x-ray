# Phase 18 Summary — PWA Install Prompt

**Shipped:** 2026-04-06
**Milestone:** v1.4
**Plans:** 2 (18-01 manifest fix, 18-02 install callout)
**Commits:** 82efac9, 5fb6318, d3234a7, 18a59a0, df69200

## What Was Built

The app now fully meets Chrome's PWA installability criteria and guides first-time users to install it via an inline callout banner.

**Plan 18-01 — Manifest Fix (PWA-01, PWA-02):**
- Added `purpose: 'any maskable'` to the 512px icon in `vite.config.ts`
- Verified `icon-512.png` is a solid-fill square — safe zone compliant
- Chrome now fires `beforeinstallprompt` reliably in production build

**Plan 18-02 — Install Callout (INSTALL-01–06):**
- `src/utils/pwaInstall.ts` — Chrome detection (`isChromeBrowser`), localStorage helpers for dismiss tracking (`shouldShowInstallCallout`, `recordInstallDismiss`) and install flag (`isPWAInstalled`, `markPWAInstalled`)
- `src/hooks/usePWAInstall.ts` — captures `beforeinstallprompt` and `appinstalled` events; hook lives in `App.tsx` (root) to avoid timing miss on StartPage
- `src/components/PWAInstallCallout.tsx` — inline banner (not modal), dashed accent border matching `diag-capture-cta` pattern, copy points to Chrome URL bar
- Progressive dismiss cooldown: 3 days → 7 days → 30 days → permanent suppress
- Permanent suppress after `appinstalled` fires (`sxr:pwa:installed`)
- Chrome-only guard blocks callout on Firefox, Safari, Edge

## Key Decisions

- Hook moved to `App.tsx` (not `StoryWorkspacePage`) — `beforeinstallprompt` fires on StartPage before workspace mounts; capturing at root avoids the timing miss
- Callout does NOT call `deferredPrompt.prompt()` — points to URL bar per INSTALL-03 design; `deferredPrompt` is captured only to gate the `isInstallable` flag
- localStorage key namespace: `sxr:pwa:dismiss` (JSON `{count, timestamp}`) and `sxr:pwa:installed` (`'true'`)

## Requirements Coverage

| Req | Status |
|-----|--------|
| PWA-01 | ✅ Manifest has `purpose: any maskable` |
| PWA-02 | ✅ `beforeinstallprompt` fires in Chrome production build |
| INSTALL-01 | ✅ Callout only shows when `isInstallable` is true |
| INSTALL-02 | ✅ Callout shown on workspace after first story creation |
| INSTALL-03 | ✅ Inline banner pointing to Chrome URL bar, no backdrop |
| INSTALL-04 | ✅ Progressive dismiss: 3d → 7d → 30d → permanent |
| INSTALL-05 | ✅ `appinstalled` → `sxr:pwa:installed` → never shows again |
| INSTALL-06 | ✅ `isChromeBrowser()` guards all callout logic |
