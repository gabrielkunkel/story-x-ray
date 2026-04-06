# Phase 18: PWA Install Prompt — Research

**Researched:** 2026-04-05
**Domain:** Progressive Web App installability, Chrome `beforeinstallprompt` API, React callout UI
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PWA-01 | Manifest includes at least one icon with `purpose: "maskable"` | Manifest icon array config in vite.config.ts; maskable purpose verified via vite-plugin-pwa docs |
| PWA-02 | `beforeinstallprompt` fires in Chrome during local dev and production build — verified manually | Service worker + HTTPS/localhost criteria documented; dev options for vite-plugin-pwa confirmed |
| INSTALL-01 | Prompt only appears when `beforeinstallprompt` has fired | `deferredPrompt` ref pattern — show UI only when event captured |
| INSTALL-02 | First shown after the user creates their first story | Navigation from `StorySetupPage` to `/story/:id` is the trigger point |
| INSTALL-03 | Simple callout pointing to Chrome URL bar install button with benefit statement | Non-modal callout component (no backdrop) patterned after EmailCaptureModal |
| INSTALL-04 | Dismissal saves timestamp; re-prompts after 3d → 1w → 1mo → permanent suppress | `sxr:pwa:dismiss` localStorage key storing JSON with `count` + `timestamp` |
| INSTALL-05 | After `appinstalled` event, callout permanently suppressed | `sxr:pwa:installed` localStorage key; `appinstalled` event listener in App.tsx |
| INSTALL-06 | Non-Chrome browsers: no callout, no install messaging | `isChrome()` guard using `navigator.userAgentData?.brands` with UA string fallback |
</phase_requirements>

---

## Summary

Phase 18 is split into two natural plans. Plan 1 fixes the single missing installability piece — the manifest lacks any icon with `purpose: "maskable"`. Adding `purpose: 'any maskable'` (or a separate maskable-only entry) to the 512px icon in `vite.config.ts` is a one-line manifest change, after which `beforeinstallprompt` should fire reliably in Chrome. Plan 2 adds the callout component, the Chrome-detection guard, the `beforeinstallprompt`/`appinstalled` event plumbing in `App.tsx`, and the localStorage-based progressive re-prompting logic.

The codebase already has a working pattern for deferred-dismissal UI (`EmailCaptureModal`) and a consistent localStorage key namespace (`sxr:*`). The install callout should follow those conventions — a non-blocking, non-modal component rather than an overlay. Critically, the callout must NOT call `deferredPrompt.prompt()` directly; the design is INSTALL-03: point the user to the Chrome address bar install icon and explain the benefit. No native prompt needed.

The `beforeinstallprompt` API is Chrome/Chromium-only and experimental. Chrome-specific detection is required before showing any install UI. `navigator.userAgentData.brands` provides clean detection on all Chromium browsers; checking for the "Google Chrome" brand string (absent in Edge) distinguishes Chrome from other Chromium forks.

**Primary recommendation:** Add maskable icon in Plan 1; build the callout + localStorage re-prompting in Plan 2. Use a `usePWAInstall` custom hook to encapsulate all event logic so `StoryWorkspacePage` stays clean.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite-plugin-pwa | 1.2.0 (installed) | Generates manifest + service worker | Already in project; `manifest.icons` is the only change needed |
| React (hooks) | 19.x (installed) | `useEffect`, `useRef`, `useState` for event capture | No additional library needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| localStorage (native) | — | Persist dismissal count + timestamp + installed flag | Already used throughout the project for `sxr:*` keys |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-rolled Chrome detection | `bowser`, `ua-parser-js` | External libs are overkill for a single `brands` check; INSTALL-06 is narrow in scope |
| Custom hook | Inline event logic in StoryWorkspacePage | Hook keeps the component clean, same pattern as EmailCapture utilities |

**Installation:** No new packages needed. Everything is satisfied by the existing stack.

**Version verification:**
```bash
npm view vite-plugin-pwa version  # 1.2.0 confirmed [VERIFIED: npm registry]
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── utils/
│   └── pwaInstall.ts        # Chrome detection + localStorage helpers
├── hooks/
│   └── usePWAInstall.ts     # Event capture, state management hook
├── components/
│   └── PWAInstallCallout.tsx # Callout UI component
└── pages/
    └── StoryWorkspacePage.tsx  # Mounts callout, passes hook state
```

The `hooks/` directory does not currently exist. Create it. The `utils/` directory exists; `pwaInstall.ts` follows the same pattern as `emailCapture.ts`.

### Pattern 1: Manifest Maskable Icon

**What:** Add `purpose: 'any maskable'` to the 512px icon entry in `vite.config.ts`. The vite-plugin-pwa converts the purpose array to a space-separated string in the generated manifest.

**When to use:** Required once (Plan 1). No new files; one property addition.

**Example:**
```typescript
// Source: vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html [CITED]
icons: [
  {
    src: '/icons/icon-192.png',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: '/icons/icon-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any maskable',  // ADD THIS
  },
],
```

### Pattern 2: Capture and Defer `beforeinstallprompt`

**What:** Listen for the event at the app root, prevent default, store the event reference. Expose it via a custom hook.

**When to use:** Must happen at mount time before any navigation. Best placed in `App.tsx` or a global hook consumed by `StoryWorkspacePage`.

**Example:**
```typescript
// Source: web.dev/articles/customize-install [CITED]
// hooks/usePWAInstall.ts
import { useEffect, useRef, useState } from 'react'

export function usePWAInstall() {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    function handleBeforeInstall(e: Event) {
      e.preventDefault()
      deferredPrompt.current = e as BeforeInstallPromptEvent
      setIsInstallable(true)
    }
    function handleAppInstalled() {
      deferredPrompt.current = null
      setIsInstallable(false)
      markPWAInstalled()  // writes sxr:pwa:installed to localStorage
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return { isInstallable, deferredPrompt }
}
```

Note: `BeforeInstallPromptEvent` is not in the standard TypeScript lib. Declare it locally:

```typescript
// Source: MDN BeforeInstallPromptEvent [CITED]
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>
}
```

### Pattern 3: Progressive Re-Prompting via localStorage

**What:** Track dismissal count and timestamp. Show callout only when the cooldown has elapsed.

**localStorage key:** `sxr:pwa:dismiss` — JSON object `{ count: number, timestamp: number }` (ms epoch)
**localStorage key:** `sxr:pwa:installed` — string `'true'`

**Cooldown schedule:**
| dismissals so far | next show after |
|-------------------|----------------|
| 0 (first dismiss) | 3 days |
| 1 | 7 days |
| 2 | 30 days |
| 3+ | never show again |

```typescript
// utils/pwaInstall.ts
const DISMISS_KEY = 'sxr:pwa:dismiss'
const INSTALLED_KEY = 'sxr:pwa:installed'

const COOLDOWNS_MS = [
  3 * 24 * 60 * 60 * 1000,   // 3 days
  7 * 24 * 60 * 60 * 1000,   // 7 days
  30 * 24 * 60 * 60 * 1000,  // 30 days
]
const MAX_DISMISSALS = COOLDOWNS_MS.length  // 3 — after 3rd dismiss, suppress permanently

export function isPWAInstalled(): boolean {
  return localStorage.getItem(INSTALLED_KEY) === 'true'
}

export function markPWAInstalled(): void {
  localStorage.setItem(INSTALLED_KEY, 'true')
}

export function shouldShowInstallCallout(): boolean {
  if (isPWAInstalled()) return false
  const raw = localStorage.getItem(DISMISS_KEY)
  if (!raw) return true  // never dismissed
  const { count, timestamp } = JSON.parse(raw) as { count: number; timestamp: number }
  if (count >= MAX_DISMISSALS) return false  // permanently suppressed
  const cooldown = COOLDOWNS_MS[count - 1] ?? 0
  return Date.now() - timestamp >= cooldown
}

export function recordInstallDismiss(): void {
  const raw = localStorage.getItem(DISMISS_KEY)
  const prev = raw ? JSON.parse(raw) as { count: number; timestamp: number } : { count: 0, timestamp: 0 }
  localStorage.setItem(DISMISS_KEY, JSON.stringify({
    count: prev.count + 1,
    timestamp: Date.now(),
  }))
}
```

### Pattern 4: Chrome-Only Detection

**What:** Return `true` only in Google Chrome. Block Edge, Brave, Samsung Internet, and non-Chromium browsers.

**Why `userAgentData` wins over UA string:** Edge Chromium includes "Edg/" in the UA string but "Microsoft Edge" (not "Google Chrome") in `userAgentData.brands`. Samsung Internet includes "SamsungBrowser" in the UA string. Using `userAgentData.brands` is cleaner.

```typescript
// utils/pwaInstall.ts
export function isChromeBrowser(): boolean {
  // userAgentData only available in Chromium-based browsers
  if (typeof navigator === 'undefined') return false
  const uad = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData
  if (uad?.brands) {
    // "Google Chrome" present in Chrome; absent in Edge ("Microsoft Edge"), Brave (no brand), Samsung
    return uad.brands.some(b => b.brand === 'Google Chrome')
  }
  // Fallback: UA string — check for Chrome token and absence of Edge/OPR/Brave tokens
  const ua = navigator.userAgent
  return /Chrome\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua)
}
```

### Pattern 5: Trigger Point — First Story Created

**What:** The callout appears when the user first navigates to `/story/:id`. "First story" means the first time they land on the workspace after setup. This is already the natural flow: `StorySetupPage` calls `navigate('/story/${story.id}')` after saving.

**Implementation:** In `StoryWorkspacePage`, after checking `isInstallable` and `shouldShowInstallCallout()`, set a state flag `showInstallCallout`. The callout renders below the board header (above the board body), not as a modal overlay.

**IMPORTANT:** The callout does NOT call `deferredPrompt.prompt()`. Per INSTALL-03, it points the user to the Chrome URL bar install icon. The `deferredPrompt` is captured solely to know the app is installable (INSTALL-01 guard) — it does not need to be triggered.

### Anti-Patterns to Avoid

- **Calling `prompt()` on every page visit:** The `beforeinstallprompt` event fires at most once per page load. Store the ref in `useRef`, not `useState`, to avoid re-render loops.
- **Showing the callout on the `StartPage`:** INSTALL-02 requires the prompt to appear after the first story is created. Only mount it in `StoryWorkspacePage`.
- **Using a modal/overlay for the callout:** The design calls for a callout (INSTALL-03), not a blocking overlay. The existing `capture-overlay` pattern from `EmailCaptureModal` is wrong for this use case.
- **Treating `appinstalled` as the only installation signal:** The `appinstalled` event fires when Chrome installs, but the user may have already installed via the address bar before our UI shows. Call `shouldShowInstallCallout()` on mount which checks `sxr:pwa:installed` first.
- **Putting event listeners in a child component:** `beforeinstallprompt` fires early (sometimes before React mounts). Place the listener in `useEffect` at the top of `StoryWorkspacePage` (or in a hook consumed there), ensuring it's registered promptly.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Icon generation with maskable safe zone | Custom image processing | Manually supply a maskable-safe icon file OR use `@vite-pwa/assets-generator` | Maskable icons need content in the center 80% — if the existing `icon-512.png` has content to the edges it will clip on Android; verify first |
| Service worker | Custom SW | vite-plugin-pwa's `autoUpdate` SW (already in place) | The existing SW satisfies the fetch handler requirement |
| Progressive cooldown math | Date.now() string ops | Simple millisecond arithmetic (`Date.now() - timestamp >= cooldownMs`) | No library needed; dates are just numbers |

**Key insight:** The `beforeinstallprompt` event itself tells you whether the app is installable — no Lighthouse audit script needed at runtime. Trust the event.

---

## Common Pitfalls

### Pitfall 1: Maskable Icon Safe Zone Violation
**What goes wrong:** Adding `purpose: 'any maskable'` to an icon whose content extends to the edges causes the icon to appear clipped on Android (adaptive icon masks cut off ~20% from edges).
**Why it happens:** Maskable icons require all meaningful content to be within the central 80% "safe zone" circle.
**How to avoid:** Open `public/icons/icon-512.png` and verify whether the logo/art is centered with padding. If the icon fills edge-to-edge, either (a) generate a new maskable variant with padding, or (b) add a separate icon entry with `purpose: 'maskable'` pointing to a padded file, and leave the existing entry as `purpose: 'any'`.
**Warning signs:** Lighthouse warns "Maskable icon does not pass the safe zone check" in the PWA audit.

### Pitfall 2: `beforeinstallprompt` Does Not Fire in Vite Dev
**What goes wrong:** The event fires in production builds but not in `vite dev` because vite-plugin-pwa disables service worker registration in development by default.
**Why it happens:** Without a registered service worker, the Chrome installability check may not pass (the service worker fetch handler is still part of the internal heuristic even though it's not in the public docs as a hard requirement).
**How to avoid:** To verify locally, either (a) run `npm run build && vite preview` (production-like server with HTTPS-exempt localhost) or (b) add `devOptions: { enabled: true }` to the VitePWA config temporarily. The success criterion PWA-02 explicitly requires verification in both local dev and production build.
**Warning signs:** No install icon appears in the Chrome address bar after several seconds; DevTools Application > Manifest shows no errors but "Install" is greyed out.

### Pitfall 3: `BeforeInstallPromptEvent` TypeScript Type Missing
**What goes wrong:** TypeScript complains that `BeforeInstallPromptEvent` does not exist because it is non-standard and not in `lib.dom.d.ts`.
**Why it happens:** The event is experimental and not part of the official TypeScript DOM lib.
**How to avoid:** Declare the interface locally in `usePWAInstall.ts` (see Pattern 2 above). Do not add a global `@types` override.
**Warning signs:** `TS2304: Cannot find name 'BeforeInstallPromptEvent'`

### Pitfall 4: Edge Chromium Passes the Chrome Detection Guard
**What goes wrong:** Edge users see the install callout because the UA string contains "Chrome/".
**Why it happens:** Edge Chromium includes "Chrome/NN" in its user-agent string for compatibility.
**How to avoid:** Always check `navigator.userAgentData.brands` first and look for "Google Chrome" specifically. Fall back to UA string only if `userAgentData` is not available — and in the fallback, also exclude "Edg/" in the UA.
**Warning signs:** `navigator.userAgent` on Edge: `"Mozilla/5.0 ... Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0"` — "Chrome/" is present but so is "Edg/".

### Pitfall 5: `prompt()` Can Only Be Called Once
**What goes wrong:** Calling `deferredPrompt.prompt()` a second time on the same event instance silently fails or throws.
**Why it happens:** The spec says each `BeforeInstallPromptEvent` instance can only be prompted once. The browser fires a new event on the next page load if the user dismissed.
**How to avoid:** In this codebase, we are NOT calling `prompt()` at all (INSTALL-03 points to the address bar). This pitfall is irrelevant unless the design changes. Document it for awareness.

### Pitfall 6: Cooldown Logic Off-By-One
**What goes wrong:** The callout re-appears one dismissal too early (e.g., shows after 3 days when it should wait 7).
**Why it happens:** The `count` in localStorage records dismissals, but the cooldown index needs to reference the count of previous dismissals, not the current one.
**How to avoid:** After the first dismiss, `count = 1`. The next cooldown is `COOLDOWNS_MS[1 - 1]` = `COOLDOWNS_MS[0]` = 3 days. After the second dismiss, `count = 2`, cooldown = `COOLDOWNS_MS[1]` = 7 days. After the third, `count = 3 >= MAX_DISMISSALS (3)` → permanent suppress. Validate with unit tests.

---

## Code Examples

### Chrome Detection (complete util function)
```typescript
// Source: MDN Navigator.userAgentData [CITED: developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData]
export function isChromeBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  // Modern API — only available in Chromium-based browsers
  const uad = (navigator as Navigator & {
    userAgentData?: { brands: Array<{ brand: string; version: string }> }
  }).userAgentData
  if (uad?.brands) {
    return uad.brands.some(b => b.brand === 'Google Chrome')
  }
  // Legacy fallback — exclude Edge and Opera
  const ua = navigator.userAgent
  return /Chrome\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua)
}
```

### `appinstalled` event handler
```typescript
// Source: web.dev/articles/customize-install [CITED]
window.addEventListener('appinstalled', () => {
  deferredPrompt.current = null
  markPWAInstalled()  // localStorage.setItem('sxr:pwa:installed', 'true')
})
```

### Callout visibility decision in StoryWorkspacePage
```typescript
// [ASSUMED] — pattern derived from existing EmailCapture trigger logic in StoryWorkspacePage
const [showInstallCallout, setShowInstallCallout] = useState(false)
const installCalloutShownRef = useRef(false)

useEffect(() => {
  if (installCalloutShownRef.current) return
  if (!isChromeBrowser()) return
  if (!isInstallable) return           // beforeinstallprompt not yet fired
  if (!shouldShowInstallCallout()) return
  installCalloutShownRef.current = true
  setShowInstallCallout(true)
}, [isInstallable])
```

---

## Codebase Context

### Existing PWA Setup (verified by reading vite.config.ts)
```typescript
// Current state [VERIFIED: read vite.config.ts]
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Story X-Ray',
    short_name: 'StoryXRay',
    description: 'See the shape of your story. Find what comes next.',
    theme_color: '#aa3bff',
    background_color: '#16171d',
    display: 'standalone',
    start_url: '/',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      // MISSING: purpose: 'any maskable' — this is PWA-01
    ],
  },
})
```

**Gap:** Neither icon has a `purpose` field. Adding `purpose: 'any maskable'` to the 512px entry satisfies PWA-01. First verify the icon's safe zone (see Pitfall 1).

### Existing localStorage Key Namespace (verified)
| Key | Owner | Type |
|-----|-------|------|
| `story-xray:stories` | storage.ts | JSON array |
| `story-xray:activeId` | storage.ts | string |
| `sx:viewMode` | StoryWorkspacePage | `'grid'` or `'list'` |
| `sx:showBeatPreview` | StoryWorkspacePage | `'true'` or `'false'` |
| `sxr:cap:submitted` | emailCapture.ts | `'true'` |
| `sxr:pwa:dismiss` | **NEW Phase 18** | JSON `{ count, timestamp }` |
| `sxr:pwa:installed` | **NEW Phase 18** | `'true'` |

**Convention:** Use `sxr:pwa:*` prefix to stay consistent with the `sxr:cap:*` pattern in `emailCapture.ts`.

### Existing Modal/Callout Pattern (verified)
The `EmailCaptureModal` uses `capture-overlay` (fixed full-screen backdrop) + `capture-modal` (centered dialog). The install callout should be a **non-blocking banner or callout**, not a modal — no overlay backdrop. This means new CSS classes are needed (`install-callout`, etc.), not reuse of `capture-overlay`.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Service worker fetch handler required | Removed from Chrome 108/112 | 2022-2023 | Our `autoUpdate` SW still provides a fetch handler; no action needed |
| Maskable icon required for install | Recommended, not required | ~2023 (Chrome blog) | PWA-01 adds it anyway for best UX — still the right thing to do |
| UA string only for browser detection | `navigator.userAgentData.brands` | Chrome 90+ | More reliable; always fall back to UA string for older Chrome |

**Deprecated/outdated:**
- Checking `window.BeforeInstallPromptEvent !== undefined` to detect support: use feature detection on the event itself via the listener, not a global check.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The existing `icon-512.png` file has its content in the central safe zone and can safely be declared maskable | Pitfall 1, PWA-01 fix | If not, a separate padded icon file must be generated; easy to verify by opening the image |
| A2 | `devOptions: { enabled: true }` in vite-plugin-pwa makes the service worker register in `vite dev`, allowing `beforeinstallprompt` to fire | Pitfall 2, PWA-02 | If the event still doesn't fire in dev, Plan 2 testing requires `vite preview` only |
| A3 | The callout should appear on the first visit to `/story/:id` (the workspace), not after some deeper engagement | Trigger point section, INSTALL-02 | If "first story" should mean more engagement (e.g., first saved beat), the trigger logic needs to change |

---

## Open Questions

1. **Is `icon-512.png` safe-zone compliant for maskable use?**
   - What we know: The file exists at `public/icons/icon-512.png`
   - What's unclear: Whether content bleeds to the edges (need to view the image)
   - Recommendation: Plan 1 task should include opening the icon and verifying before adding `purpose: 'any maskable'`; if unsafe, generate a padded variant

2. **Should the callout also appear on return visits to an existing story, or only on the very first story creation?**
   - What we know: INSTALL-02 says "after the user creates their first story" — this suggests only the first time they reach the workspace
   - What's unclear: Whether "creates" means the single act of submitting the setup form, or whether the callout can also show on subsequent visits if dismissed
   - Recommendation: Interpret as: the callout becomes eligible (not suppressed) after the user has at least one story. On every workspace visit, call `shouldShowInstallCallout()`. If eligible, show once. Re-show based on dismissal cooldown. This is consistent with INSTALL-04.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Chrome (browser) | PWA-02 verification | Manual | Latest | — |
| vite-plugin-pwa | PWA-01 manifest fix | ✓ | 1.2.0 | — |
| Node.js / npm | Build | ✓ | in project | — |

**Missing dependencies with no fallback:** None that block code writing. PWA-02 verification requires a Chrome browser — this is a manual step, not a code dependency.

---

## Validation Architecture

Config has no `workflow.nyquist_validation: false`, so this section is included.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — project has no test runner configured |
| Config file | None |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PWA-01 | Manifest includes maskable icon purpose | manual | Chrome DevTools > Application > Manifest | N/A |
| PWA-02 | `beforeinstallprompt` fires in Chrome dev + prod | manual | Load app in Chrome, check for install icon in address bar | N/A |
| INSTALL-01 | Callout only appears when `beforeinstallprompt` fired | manual | Open in non-Chrome (Firefox/Safari) — no callout | N/A |
| INSTALL-02 | Callout first appears after story creation | manual | Create first story, verify callout appears on workspace | N/A |
| INSTALL-03 | Callout content correct — points to URL bar | visual | Inspect rendered component | N/A |
| INSTALL-04 | Cooldown logic: 3d → 7d → 30d → suppress | unit | `shouldShowInstallCallout()` with mocked Date.now() | ❌ Wave 0 |
| INSTALL-05 | `appinstalled` fires → callout never shows again | manual | Install app, reload, verify no callout | N/A |
| INSTALL-06 | Non-Chrome: no callout, no install text | manual | Open in Firefox/Safari, inspect DOM | N/A |

The cooldown logic in `pwaInstall.ts` is the only unit-testable logic in this phase. A test file verifying `shouldShowInstallCallout()` with various localStorage states and mocked timestamps should be written.

### Wave 0 Gaps
- [ ] `src/utils/pwaInstall.test.ts` — unit tests for `shouldShowInstallCallout`, `recordInstallDismiss`, `isPWAInstalled` with mocked localStorage and Date.now()
- [ ] No test runner installed — if Wave 0 includes tests, add vitest: `npm install --save-dev vitest`

*(Note: The project currently has no test infrastructure. The planner may decide unit tests for the cooldown logic are out of scope for this phase given the lightweight nature of the feature.)*

---

## Security Domain

This phase handles no authentication, sessions, user data transmission, or cryptography. The only data written is `sxr:pwa:*` localStorage flags — dismiss count/timestamp and installed boolean. No ASVS categories apply.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | no | No user input in install flow |
| V6 Cryptography | no | — |

No threat patterns specific to this feature.

---

## Sources

### Primary (HIGH confidence)
- [web.dev/articles/install-criteria](https://web.dev/articles/install-criteria) — Chrome PWA installability requirements
- [web.dev/articles/customize-install](https://web.dev/articles/customize-install) — `beforeinstallprompt` capture, defer, trigger, `appinstalled` pattern
- [vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html](https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html) — vite-plugin-pwa manifest icon purpose configuration
- [MDN: BeforeInstallPromptEvent](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent) — API properties, methods, browser compatibility
- [MDN: Navigator.userAgentData](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData) — `brands` array, Chrome vs Edge detection
- [developer.chrome.com/blog/update-install-criteria](https://developer.chrome.com/blog/update-install-criteria) — Chrome's evolving install criteria; maskable recommended not required
- [VERIFIED: npm registry] — `vite-plugin-pwa@1.2.0` is latest

### Secondary (MEDIUM confidence)
- [MDN: Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) — supplementary install criteria reference
- [Chrome Developers: installable-manifest Lighthouse audit](https://developer.chrome.com/docs/lighthouse/pwa/installable-manifest) — verification tooling

### Tertiary (LOW confidence)
- WebSearch results re: service worker requirement removal (Chrome 108/112) — cross-confirmed with Chrome blog post above, elevated to MEDIUM

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; existing vite-plugin-pwa and React hooks are sufficient
- Architecture: HIGH — patterns verified against official web.dev and MDN documentation
- Pitfalls: HIGH — edge cases verified against Chrome blog, MDN, and codebase inspection
- Chrome detection: HIGH — `userAgentData.brands` pattern verified against MDN

**Research date:** 2026-04-05
**Valid until:** 2026-07-05 (stable web platform APIs; Chrome criteria changes slowly)
