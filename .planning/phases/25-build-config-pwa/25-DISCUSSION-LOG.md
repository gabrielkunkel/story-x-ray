# Phase 25: Build Config & PWA - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-18
**Phase:** 25-build-config-pwa
**Areas discussed:** Env files in git, PWA manifest scope, Dev-mode PWA behavior

---

## Env files in git

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, commit both | Other developers and CI get correct values automatically. Safe because no secrets in these files. | ✓ |
| Commit only .env.example | Treat .env and .env.production as local setup — more friction, less value here. | |

**User's choice:** Yes, commit both `.env` and `.env.production`
**Notes:** Files contain only `VITE_BASE_PATH` values — no secrets.

---

## PWA manifest scope

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit scope: base | Set scope to computed base (e.g. /story-x-ray/ in production). Guarantees correct PWA install scope. | ✓ |
| Let VitePWA infer it | VitePWA sets scope from start_url automatically. Simpler but less explicit. | |

**User's choice:** Explicit `scope: base`
**Notes:** Prevents browser from inferring wrong scope from start_url.

---

## Dev-mode PWA behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Disabled in dev | Default VitePWA behavior (no devOptions). No stale cache issues during development. | ✓ |
| Enable in dev | devOptions: { enabled: true }. Allows local PWA install testing but adds caching complexity. | |

**User's choice:** Disabled in dev (default)
**Notes:** Test PWA behavior via `npm run preview`.

---

## Claude's Discretion

- TypeScript typing for `loadEnv` result
- Whether to add type assertions for `VITE_BASE_PATH`
- `.env.example` comment content

## Deferred Ideas

None.
