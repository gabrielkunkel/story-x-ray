# Technology Stack

**Analysis Date:** 2026-09-03

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code under `src/` (strict mode enabled in `tsconfig.app.json`)

**Secondary:**
- JavaScript (ESM) - Build/config tooling: `vite.config.ts`, `eslint.config.js`
- CSS - Styling in `src/index.css` (no CSS framework, no CSS-in-JS)
- HTML - Single shell page `index.html`

## Runtime

**Environment:**
- Node.js 20.x - Build/development runtime only (CI pins `node-version: 20` in `.github/workflows/deploy.yml`)
- No server runtime — the app is a pure client-side SPA/PWA. All code runs in the browser (modern evergreen browsers; PWA targets Chrome/Safari)

**Package Manager:**
- npm (lockfile v3)
- Lockfile: `package-lock.json` present (CI uses `npm ci`)
- No `.nvmrc` and no `engines` field in `package.json` — Node version is only pinned in CI workflow

## Frameworks

**Core:**
- React 19.2.4 - UI library (`react`, `react-dom`, `react-is`)
- React Router 7.14.0 - Client-side routing via `HashRouter` (`react-router-dom`), required for GitHub Pages static hosting

**Charting:**
- Recharts 3.8.1 - Waveform graph (8-line chart of target vs actual emotional dimensions)

**PDF Generation:**
- jsPDF 4.2.1 + jspdf-autotable 5.0.7 - Client-side PDF export with score tables

**Testing:**
- None — no test runner, assertion library, or test files configured in the project

**Build/Dev:**
- Vite 8.0.3 - Bundler and dev server
- @vitejs/plugin-react 6.0.1 - React JSX transform
- vite-plugin-pwa 1.2.0 - PWA manifest + service worker (Workbox), `registerType: 'autoUpdate'`
- TypeScript 5.9.3 - Type checking and compilation (`tsc -b` before Vite build)
- ESLint 9.39.4 - Linting (flat config)
- typescript-eslint 8.58.0 - TypeScript lint rules
- eslint-plugin-react-hooks 7.0.1, eslint-plugin-react-refresh 0.5.2 - React lint rules

## Key Dependencies

**Critical:**
- react 19.2.4 - Core UI runtime; whole app is React components
- react-router-dom 7.14.0 - Routing; `HashRouter` is a hard requirement for GitHub Pages static hosting (avoids SPA 404 on refresh)
- recharts 3.8.1 - Waveform visualization (`src/components/WaveformGraph.tsx`)
- jspdf 4.2.1 + jspdf-autotable 5.0.7 - PDF export (`src/utils/export.ts`)

**Infrastructure:**
- vite 8.0.3 - Build/dev server; reads `VITE_BASE_PATH` via `loadEnv` to set the asset base path
- vite-plugin-pwa 1.2.0 - Generates the PWA manifest and service worker (offline capability, install prompt)
- typescript 5.9.3 - Static typing; `verbatimModuleSyntax`, `noEmit` (bundler-mode via Vite)
- eslint 9.39.4 - Code quality gate (`npm run lint`)

## Configuration

**Environment:**
- Vite `loadEnv` in `vite.config.ts` reads `VITE_BASE_PATH` at build time to set the asset `base`
- `VITE_BASE_PATH=/` for local dev, `/story-x-ray/` for GitHub Pages
- Env files (committed, contain no secrets): `.env`, `.env.gh-pages`, `.env.example`
- No API keys or secrets required at runtime; `BEEHIIV_PUBLICATION_ID` is a hardcoded string constant in `src/config/beehiiv.ts` (empty = dev mode)

**Build:**
- `vite.config.ts` - Base path, PWA manifest, `optimizeDeps` for `recharts`/`react-is`
- `tsconfig.json` - Project references to `tsconfig.app.json` (app, target ES2023, strict) and `tsconfig.node.json` (Vite config)
- `eslint.config.js` - Flat config (ignores `dist`)
- `package.json` scripts: `dev`, `build` (`tsc -b && vite build`), `build:prod` (`--mode gh-pages`), `lint`, `preview`

## Platform Requirements

**Development:**
- Any platform with Node.js 20+ and npm
- No external services or local database required — fully local (localStorage)
- Run `npm install` then `npm run dev` (serves at http://localhost:5173)

**Production:**
- Static hosting on GitHub Pages (deployed via GitHub Actions on push to `main`)
- Serves a single `index.html` (SPA) — requires hash-based routing, which the app already uses
- Installed as a PWA from Chrome/Safari; works fully offline after first load

---

*Stack analysis: 2026-09-03*
*Update after major dependency changes*
