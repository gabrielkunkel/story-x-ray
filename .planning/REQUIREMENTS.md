# Requirements: Story X-Ray

**Defined:** 2026-04-18
**Core Value:** A 16-step architecture board that helps writers see, construct, and refine the complete shape of their story

## v1.7 Requirements

Requirements for GitHub Pages deployment milestone.

### Vite Configuration

- [ ] **VITE-01**: `vite.config.ts` uses `defineConfig(({ mode }) => ...)` + `loadEnv` to read env vars for the active mode
- [ ] **VITE-02**: App base path is controlled by `VITE_BASE_PATH` env var, defaulting to `'/'` when not set
- [ ] **VITE-03**: All existing config (React plugin, `optimizeDeps`, VitePWA plugin) is preserved

### PWA Manifest

- [ ] **PWA-01**: `start_url` in the manifest uses the computed `base`, not hardcoded `'/'`
- [ ] **PWA-02**: Icon `src` paths in the manifest are built from the computed `base` (e.g. `${base}icons/icon-192.png`)
- [ ] **PWA-03**: Service worker and manifest resolve correctly under a subpath host

### Environment Files

- [ ] **ENV-01**: `.env.example` documents `VITE_BASE_PATH` and its purpose
- [ ] **ENV-02**: `.env` sets `VITE_BASE_PATH=/` for local development
- [ ] **ENV-03**: `.env.production` sets `VITE_BASE_PATH=/story-x-ray/` for GitHub Pages
- [ ] **ENV-04**: `.gitignore` preserves correct entries (excludes `.env.local`/`*.local` but commits `.env` and `.env.production`)

### Build Scripts

- [ ] **BUILD-01**: `package.json` retains `"build": "tsc -b && vite build"` for local/generic use
- [ ] **BUILD-02**: `package.json` adds `"build:prod": "tsc -b && vite build --mode production"` for GitHub Pages deployment

### Routing

- [ ] **ROUTE-01**: `BrowserRouter` replaced with `HashRouter` so direct navigation to `/setup` and `/story/:id` works on GitHub Pages static hosting

### Source Path Audit

- [ ] **PATH-01**: No root-absolute paths (e.g. `/icons/...`, `/manifest...`) remain in source that Vite would not rewrite automatically

### GitHub Actions

- [ ] **CI-01**: `.github/workflows/deploy.yml` triggers on push to `main` and `workflow_dispatch`
- [ ] **CI-02**: Workflow uses split `build`/`deploy` jobs with correct `permissions` (contents: read, pages: write, id-token: write)
- [ ] **CI-03**: Build job calls `npm run build:prod` and uploads `dist/` as a Pages artifact
- [ ] **CI-04**: Deploy job uses `actions/deploy-pages@v4` with `environment: github-pages`
- [ ] **CI-05**: `concurrency: group: pages, cancel-in-progress: true` prevents overlapping deployments

### Documentation

- [ ] **DOC-01**: README explains what `.env`, `.env.production`, and `.env.example` are for
- [ ] **DOC-02**: README documents `npm run dev` (local) and `npm run build:prod` (deployment) commands
- [ ] **DOC-03**: README includes GitHub Pages setup steps: Settings → Pages → Source: GitHub Actions
- [ ] **DOC-04**: README notes the HashRouter change and that routes use `#/` prefix

## Future Requirements

### Deployment

- **DEPLOY-01**: Configurable deployment target beyond GitHub Pages (Netlify, Vercel, custom domain)
- **DEPLOY-02**: Staging environment with preview URLs

## Out of Scope

| Feature | Reason |
|---------|--------|
| Custom domain setup | Requires DNS changes outside repo scope; documented as follow-up |
| Server-side rendering | Local-first PWA; no server needed |
| Runtime config system | Vite env/mode is sufficient; no custom config loader |
| Branch preview deploys | Out of scope for v1.7; can be added later |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| VITE-01 | Phase 25 | Pending |
| VITE-02 | Phase 25 | Pending |
| VITE-03 | Phase 25 | Pending |
| PWA-01 | Phase 25 | Pending |
| PWA-02 | Phase 25 | Pending |
| PWA-03 | Phase 25 | Pending |
| ENV-01 | Phase 25 | Pending |
| ENV-02 | Phase 25 | Pending |
| ENV-03 | Phase 25 | Pending |
| ENV-04 | Phase 25 | Pending |
| BUILD-01 | Phase 25 | Pending |
| BUILD-02 | Phase 25 | Pending |
| ROUTE-01 | Phase 26 | Pending |
| PATH-01 | Phase 26 | Pending |
| CI-01 | Phase 27 | Pending |
| CI-02 | Phase 27 | Pending |
| CI-03 | Phase 27 | Pending |
| CI-04 | Phase 27 | Pending |
| CI-05 | Phase 27 | Pending |
| DOC-01 | Phase 27 | Pending |
| DOC-02 | Phase 27 | Pending |
| DOC-03 | Phase 27 | Pending |
| DOC-04 | Phase 27 | Pending |

**Coverage:**
- v1.7 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-18*
*Last updated: 2026-04-18 — traceability confirmed at roadmap creation*
