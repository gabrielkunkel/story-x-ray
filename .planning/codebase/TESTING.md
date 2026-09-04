# Testing Patterns

**Analysis Date:** 2026-09-03

## Test Framework

**Runner:**
- Not configured. No test framework is installed — no Vitest, Jest, or Playwright in `package.json` dependencies or devDependencies.

**Assertion Library:**
- Not applicable — no assertion library present.

**Run Commands:**
```bash
npm run lint                # ESLint static analysis (the primary automated check)
npm run build               # Type-check (tsc -b) + production build (vite build)
npm run dev                 # Dev server
npm run preview             # Preview the production build
```

There is no `test` script and no test config file (`jest.config.*`, `vitest.config.*`, `playwright.config.*` all absent).

## Test File Organization

**Location:**
- No test files exist. A repo-wide search for `*.test.*` / `*.spec.*` finds only third-party tests inside `.opencode/node_modules/zod/` (dependency code, not project code).

**Naming:**
- Not established.

**Structure:**
```
src/
  components/       # no *.test.tsx files present
  pages/
  hooks/
  utils/
  services/
  data/
  config/
  types/
```

## Test Structure

**Suite Organization:**
- Not established — no `describe`/`it`/`test` blocks exist in project code.

**Patterns:**
- Not applicable.

## Mocking

**Framework:**
- Not configured. No mocking library is installed.

**Patterns:**
- Not applicable.

**What to Mock:**
- Not established.

**What NOT to Mock:**
- Not established.

## Fixtures and Factories

**Test Data:**
- No test fixtures or factories exist.

**Location:**
- Not applicable.

## Coverage

**Requirements:**
- None. No coverage tool or target is configured.

**Configuration:**
- None.

**View Coverage:**
```bash
# No coverage command available.
```

## Test Types

**Unit Tests:**
- None. Pure logic that would benefit most from unit testing lives in `src/utils/diagnostics.ts` (`runDiagnostics`) and `src/utils/pwaInstall.ts` (cooldown/dismiss logic) — currently untested.

**Integration Tests:**
- None. Persistence logic in `src/services/storage.ts` (localStorage read/write with JSON parsing and backfill) is exercised only manually.

**E2E Tests:**
- None. No Playwright/Cypress setup. The app is verified manually in a browser (PWA install flow, email capture modal, export formats).

## Common Patterns

**Async Testing:**
- Not applicable — no async tests exist.

**Error Testing:**
- Not applicable — no error-path tests exist.

**Snapshot Testing:**
- Not used.

## Verification Approach (what exists today)

The project relies on **static analysis and manual verification** rather than automated tests:

1. **Type-checking** via `tsc -b` (strict mode) run as part of `npm run build` — catches type errors, unused locals/params, and non-exhaustive switch cases.
2. **Linting** via `npm run lint` — `@eslint/js` + `typescript-eslint` + `react-hooks` + `react-refresh` rules.
3. **Manual browser verification** for flows: story creation, card editing, waveform rendering (`recharts`), JSON/Markdown/Fountain/PDF export (`jspdf`), email capture modal, and PWA install callout.

## Recommended conventions when tests are introduced

If a test framework is added, the following would align with the existing stack and structure:

- **Framework:** Vitest (matches the Vite 8 toolchain; add `vitest` + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom` for component tests).
- **Config:** `vitest.config.ts` at the project root, merged with the existing `vite.config.ts` react plugin.
- **Scripts:** add `"test": "vitest run"`, `"test:watch": "vitest"`, and `"test:coverage": "vitest run --coverage"` to `package.json`.
- **Location:** co-locate `*.test.ts` / `*.test.tsx` next to source (mirrors the extensionless, relative-import convention used throughout `src/`).
- **Style:** no semicolons, single quotes, trailing commas, `import type` for type-only imports, named exports for utilities — match `CONVENTIONS.md`.
- **Priority targets:** unit-test `runDiagnostics` (`src/utils/diagnostics.ts`) and the cooldown/dismiss logic in `src/utils/pwaInstall.ts`; component-test `StoryCard` and `ScoreInput` with Testing Library.

---

*Testing analysis: 2026-09-03*
*Update when test patterns change*
