# Phase 25: Build Config & PWA - Pattern Map

**Mapped:** 2026-04-18
**Files analyzed:** 5
**Analogs found:** 1 / 5

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `vite.config.ts` | config | transform | `vite.config.ts` (current) | self — rewrite |
| `package.json` | config | — | `package.json` (current) | self — edit |
| `.env` | config | — | none | no analog |
| `.env.production` | config | — | none | no analog |
| `.env.example` | config | — | none | no analog |

## Pattern Assignments

### `vite.config.ts` (config, transform)

**Analog:** `vite.config.ts` (current — full file, lines 1–37)

This file is a rewrite of itself. All existing content must be preserved and wrapped in the function form. The current file is the authoritative source for plugin options to carry forward.

**Current static form to be replaced** (`vite.config.ts` lines 1–37):

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  optimizeDeps: {
    include: ['recharts', 'react-is'],
  },
  plugins: [
    react(),
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
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
```

**Target pattern — function form with loadEnv** (per D-07, D-08, D-03, D-04, D-05):

```typescript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH ?? '/'

  return {
    base,
    optimizeDeps: {
      include: ['recharts', 'react-is'],
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Story X-Ray',
          short_name: 'StoryXRay',
          description: 'See the shape of your story. Find what comes next.',
          theme_color: '#aa3bff',
          background_color: '#16171d',
          display: 'standalone',
          scope: base,
          start_url: base,
          icons: [
            {
              src: `${base}icons/icon-192.png`,
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: `${base}icons/icon-512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
  }
})
```

**Key changes from current to target:**
- `import { defineConfig }` becomes `import { defineConfig, loadEnv }`
- `defineConfig({})` becomes `defineConfig(({ mode }) => { ... return { ... } })`
- `base` computed from `env.VITE_BASE_PATH ?? '/'`
- `start_url: '/'` becomes `start_url: base`
- `scope: base` added (new field per D-03)
- Icon `src` values change from `'/icons/...'` to `` `${base}icons/...` ``
- All other fields (`optimizeDeps`, `registerType`, manifest metadata, icon sizes/types) are unchanged

---

### `package.json` (config — scripts edit)

**Analog:** `package.json` (current — lines 6–11)

**Current scripts block** (`package.json` lines 6–11):

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
},
```

**Target scripts block** (per D-09, D-10 — add `build:prod` alongside existing `build`):

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "build:prod": "tsc -b && vite build --mode production",
  "lint": "eslint .",
  "preview": "vite preview"
},
```

**Only change:** Insert `"build:prod"` line after `"build"`. All other fields in `package.json` are untouched.

---

### `.env` (new file)

**Analog:** None — this project has no existing `.env` files.

**Content** (per ENV-02, D-01):

```
VITE_BASE_PATH=/
```

---

### `.env.production` (new file)

**Analog:** None.

**Content** (per ENV-03, D-01):

```
VITE_BASE_PATH=/story-x-ray/
```

---

### `.env.example` (new file)

**Analog:** None.

**Content** (per ENV-01; comment wording at Claude's discretion):

```
# Base path for the app. Set to '/' for local dev, '/story-x-ray/' for GitHub Pages.
# Copy this file to .env and adjust for your environment.
VITE_BASE_PATH=/
```

---

## Shared Patterns

### loadEnv TypeScript typing
**Applies to:** `vite.config.ts` only
**Decision:** D-07 and Claude's Discretion item for TypeScript typing of `env`.

`loadEnv` returns `Record<string, string>`. Property access `env.VITE_BASE_PATH` is type-safe without a cast because `Record<string, string>` allows any string key and returns `string`. The `?? '/'` nullish coalescing is still correct since an absent key returns `undefined` at runtime despite the type. No `@ts-check` comment or explicit type assertion is needed.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `.env` | config | — | No existing env files in project; this phase establishes the pattern |
| `.env.production` | config | — | Same — no prior env file pattern |
| `.env.example` | config | — | Same — no prior env file pattern |

---

## Metadata

**Analog search scope:** Project root (`vite.config.ts`, `package.json`, `.gitignore`), `.env*` glob
**Files scanned:** 4
**Pattern extraction date:** 2026-04-18

**`.gitignore` note:** The existing `*.local` entry (line 14) already excludes `.env.local`. `.env` and `.env.production` are NOT matched by this pattern and will be committed as intended (ENV-04 — no `.gitignore` change required).
