# Phase 26: Router & Path Migration - Pattern Map

**Mapped:** 2026-04-18
**Files analyzed:** 1
**Analogs found:** 1 / 1

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/App.tsx` | config/router | request-response | `src/App.tsx` (current state) | exact — this IS the file |

## Pattern Assignments

### `src/App.tsx` (router config, request-response)

**Analog:** `src/App.tsx` — this is the only file changing; the analog is the file itself (current state vs. target state).

**Current import block** (line 1):
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
```

**Target import block** (line 1 — only change needed):
```typescript
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
```

**Current JSX router wrapper** (lines 11 and 18):
```tsx
<BrowserRouter>
  ...
</BrowserRouter>
```

**Target JSX router wrapper** (lines 11 and 18 — only change needed):
```tsx
<HashRouter>
  ...
</HashRouter>
```

**Full current file for reference** (lines 1–20):
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StartPage from './pages/StartPage'
import StorySetupPage from './pages/StorySetupPage'
import StoryWorkspacePage from './pages/StoryWorkspacePage'
import { usePWAInstall } from './hooks/usePWAInstall'

export default function App() {
  const { isInstallable } = usePWAInstall()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/setup" element={<StorySetupPage />} />
        <Route path="/story/:id" element={<StoryWorkspacePage isInstallable={isInstallable} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

**Implementation notes:**
- Only two tokens change: `BrowserRouter` → `HashRouter` in the import destructure (line 1) and the JSX open/close tags (lines 11 and 18).
- All `<Route>` definitions, paths, and the catch-all `<Navigate to="/" replace />` remain unchanged — HashRouter prepends `#` internally so relative path strings continue to work identically.
- Per D-02/D-03 in CONTEXT.md, `useNavigate()` call sites in `BoardHeader.tsx`, `StartPage.tsx`, `StorySetupPage.tsx`, and `StoryWorkspacePage.tsx` do NOT need changes.
- An optional brief inline comment may be added (Claude's Discretion): `{/* HashRouter: required for GitHub Pages static hosting — sidesteps SPA 404 on direct URL/refresh */}`

---

## Shared Patterns

### No Shared Patterns Apply

This phase touches a single file with a two-token substitution. There are no cross-cutting auth, error-handling, validation, or logging patterns to propagate.

---

## Path Audit Results

**Scope:** All `.tsx`, `.ts`, and `.css` files under `src/`

**Audit grep pattern applied:** `["'\`]/[a-zA-Z]` (string literals beginning with `/`) and `url\(/[a-zA-Z]` (CSS url() references)

| Check | Result |
|-------|--------|
| Root-absolute string literals in `.tsx`/`.ts` | 0 matches |
| Root-absolute `url()` references in `.css` | 0 matches |

**Conclusion:** Path audit is verification-only; no fixes required. Confirms D-07 from CONTEXT.md.

---

## No Analog Found

Not applicable — the only file is `src/App.tsx`, which exists and was read directly.

---

## Metadata

**Analog search scope:** `src/` (all `.tsx`, `.ts`, `.css`)
**Files scanned:** 29 source files (via Glob) + targeted Grep across full `src/`
**Pattern extraction date:** 2026-04-18
