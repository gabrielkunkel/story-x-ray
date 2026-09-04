# External Integrations

**Analysis Date:** 2026-09-03

## APIs & External Services

**Email/Newsletter:**
- Beehiiv - Email capture / newsletter signup (opt-in lead magnet, post-value triggers)
  - SDK/Client: None — raw `fetch` to REST API
  - Auth: No auth header; uses publication ID in the URL path (`BEEHIIV_PUBLICATION_ID` constant in `src/config/beehiiv.ts`)
  - Endpoints used: `POST https://api.beehiiv.com/v2/publications/{id}/subscriptions` (body: `email`, `reactivate_existing`, `send_welcome_email`)
  - Currently disabled: `BEEHIIV_PUBLICATION_ID = ''` → submissions are logged to console only (dev mode), no network call

**External APIs:**
- None beyond Beehiiv (see above). No AI, no payment, no analytics, no mapping/geolocation APIs.

## Data Storage

**Databases:**
- None — no backend, no database server. All data is client-side.

**Local Persistence:**
- Browser `localStorage` — stories and app state (`src/services/storage.ts`)
  - Keys: `story-xray:stories` (all stories), `story-xray:activeId` (last active story)
- Browser `sessionStorage` — per-session UI flags (`src/utils/emailCapture.ts` keys `sxr:cap:*`, `src/utils/pwaInstall.ts` keys `sxr:pwa:*`)

**File Storage:**
- None — user data is never uploaded. Export writes files to the local device via `Blob` + anchor download (`src/utils/export.ts`: JSON, Markdown, Fountain, PDF)

**Caching:**
- None (no Redis, no service-worker caching beyond the PWA's default Workbox precache of static assets)

## Authentication & Identity

**Auth Provider:**
- None — no accounts, no login. The product is explicitly local-first and anonymous (see `README_AI.md` constraints: "No AI, no auth, no sync").

**OAuth Integrations:**
- None

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry or equivalent)

**Analytics:**
- None (no Mixpanel/GA/etc.)

**Logs:**
- Console only — `console.log` in `src/utils/emailCapture.ts` for dev-mode email capture; otherwise standard `console` output in the browser. No log aggregation service.

## CI/CD & Deployment

**Hosting:**
- GitHub Pages - Static SPA hosting
  - Deployment: automatic on every push to `main` (also `workflow_dispatch`)
  - Environment vars: `VITE_BASE_PATH=/story-x-ray/` via committed `.env.gh-pages`

**CI Pipeline:**
- GitHub Actions - Build + deploy
  - Workflows: `.github/workflows/deploy.yml`
  - Steps: `actions/checkout@v4` → `actions/setup-node@v4` (Node 20, npm cache) → `npm ci` → `npm run build:prod` → `actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4`
  - Secrets: None required (no API keys in the build)

## Environment Configuration

**Development:**
- Required env vars: `VITE_BASE_PATH` (defaults to `/` if unset)
- Secrets location: none — no secrets exist. `.env`, `.env.gh-pages`, `.env.example` are committed and contain only the base path
- Mock/stub services: Beehiiv runs in dev mode (console logging) when `BEEHIIV_PUBLICATION_ID` is empty

**Staging:**
- Not applicable — no staging environment; only local dev and GitHub Pages production

**Production:**
- Secrets management: none needed (no secrets)
- Failover/redundancy: static files served by GitHub Pages; no data to replicate

## Webhooks & Callbacks

**Incoming:**
- None — no server-side endpoints to receive webhooks

**Outgoing:**
- Beehiiv - email subscription POST fired from the client when a user submits the email capture modal (`src/utils/emailCapture.ts` → `submitEmail()`)
  - Endpoint: `https://api.beehiiv.com/v2/publications/{id}/subscriptions`
  - Retry logic: None — single attempt; failure returns a user-facing error message ("Subscription failed / Network error")
  - Trigger contexts: post-Act-I, export, diagnostics, examples, early-access (`src/config/emailModal.ts`)

---

*Integration audit: 2026-09-03*
*Update when adding/removing external services*
