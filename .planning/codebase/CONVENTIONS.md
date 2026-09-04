# Coding Conventions

**Analysis Date:** 2026-09-03

## Naming Patterns

**Files:**
- PascalCase for React components (`.tsx`): `StoryCard.tsx`, `CardEditor.tsx`, `WaveformGraph.tsx`
- camelCase for non-component modules (`.ts`): `storage.ts`, `diagnostics.ts`, `emailCapture.ts`, `pwaInstall.ts`
- Hooks prefixed `use`: `usePWAInstall.ts`, `useEmailDebounce.ts`
- Pages live in `src/pages/` and are PascalCase with `Page` suffix: `StartPage.tsx`, `StorySetupPage.tsx`, `StoryWorkspacePage.tsx`

**Functions:**
- camelCase for all functions: `runDiagnostics`, `createFreshSteps`, `loadAllStories`
- Event handlers named `handleEventName`: `handleSubmit`, `handleToggleView`, `handleBeatTextChange`, `handleImportJSON`
- Callback props named `onEventName`: `onClick`, `onChange`, `onStepClick`, `onSave`, `onClose`
- No special prefix for async functions (`submitEmail`, `handleImportJSON` are async without an `async` name marker)

**Variables:**
- camelCase for variables: `activeStepNumber`, `importError`, `debounceTimerRef`
- UPPER_SNAKE_CASE for module-level constants: `STORIES_KEY`, `DIMENSIONS`, `STEP_DEFINITIONS`, `COOLDOWNS_MS`, `ACT_BOUNDARIES`, `COLORS`
- `ref` suffix for `useRef` values: `deferredPrompt`, `debounceTimerRef`, `installCalloutShownRef`, `containerRef`, `fileInputRef`
- No underscore prefix for private members (no private markers in TS)

**Types:**
- PascalCase for interfaces, no `I` prefix: `Story`, `StoryStep`, `DimensionScores`, `Props`, `Diagnostic`
- PascalCase for type aliases: `Dimension`, `CaptureContext`, `DiagnosticRule`, `ChartPoint`
- String-literal unions for domain enums rather than `enum`: `type Dimension = 'connection' | 'pressure' | 'hope' | 'stability'` (`src/types/story.ts:1`), `type CaptureContext = 'act1' | 'export' | 'diagnostics' | 'examples' | 'early-access'` (`src/config/emailModal.ts:10`)
- `interface` for object shapes; `type` for unions and utility aliases (e.g. `type StepDefinition = Omit<StoryStep, ...>` in `src/data/steps.ts:4`)

## Code Style

**Formatting:**
- No Prettier or dedicated formatter configured — formatting is enforced only by ESLint + `tsc`
- 2-space indentation
- Single quotes for strings (double quotes appear only in prose-heavy data files where the string contains apostrophes, e.g. `src/data/exampleStory.ts`)
- Trailing commas in multiline objects, arrays, and call signatures
- No semicolons (the dominant style across `src/`)
- Note: `src/services/storage.ts`, `src/types/story.ts`, and `src/data/steps.ts` still use semicolons — legacy deviation; write new code without semicolons

**Linting:**
- ESLint 9 flat config in `eslint.config.js`
- Extends `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-plugin-react-hooks` flat recommended, `eslint-plugin-react-refresh` vite
- Ignores `dist/` via `globalIgnores`
- Run: `npm run lint`
- No `no-console` rule — a single `console.log` exists in dev mode only

**TypeScript strictness:**
- `strict: true` plus `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` in `tsconfig.app.json`
- `verbatimModuleSyntax: true` — type-only imports MUST use `import type` (see Import Organization)
- `erasableSyntaxOnly: true` — no enums/namespaces; use string-literal unions and `const` objects

## Import Organization

**Order:**
1. External packages (`react`, `react-router-dom`, `recharts`, `jspdf`)
2. Internal modules via relative paths (`../types/story`, `../services/storage`, `./components/StoryCard`)
3. Type-only imports using `import type` (required by `verbatimModuleSyntax`)

**Grouping:**
- Blank line between external and internal groups
- Type imports placed after value imports within the same file
- Inline `type` modifier inside named imports for mixed imports: `import { useState, type FormEvent } from 'react'` (`src/pages/StorySetupPage.tsx:1`)

**Path Aliases:**
- None. No `@/` alias or `paths` mapping in `tsconfig.app.json`. All imports are relative.

**Extension style:**
- Extensionless imports are the norm: `import App from './App'`, `import type { Story } from '../types/story'`
- `src/main.tsx:4` is the sole exception (`import App from './App.tsx'`) — `allowImportingTsExtensions` permits both; prefer extensionless

## Error Handling

**Patterns:**
- Defensive try/catch with empty catch blocks that swallow parse/storage failures and return safe defaults: `src/services/storage.ts:6-13`, `src/utils/emailCapture.ts:46-48`
- Result-object pattern for fallible async operations instead of throwing: `submitEmail` returns `Promise<{ ok: boolean; error?: string }>` (`src/utils/emailCapture.ts:21`)
- Form validation returns early and sets a local `error` string state, never throws (`src/pages/StorySetupPage.tsx:15-20`, `src/components/StoryInfoModal.tsx:16-24`)
- No custom Error classes, no `.catch()` chains — async work uses try/catch

**Error Types:**
- Return `null` or `[]` for "not found / no data" (`loadStory` returns `Story | null`, `loadAllStories` returns `[]`)
- Return a typed result object for expected failures (`{ ok: false, error }`)
- Throwing is reserved for unrecoverable/invariant situations and is rare in this codebase

## Logging

**Framework:**
- None. Plain `console` only.

**Patterns:**
- Single `console.log` in dev mode when a config flag is unset: `console.log('[EmailCapture] Dev mode — would subscribe:', email)` (`src/utils/emailCapture.ts:23`)
- Prefixed log tags in square brackets when logging: `[EmailCapture]`
- No structured logging, no logger utility — match this minimal approach in new code

## Comments

**When to Comment:**
- Explain why, not what — especially decision references and triggers: `// Trigger 2 — first export capture` (`src/pages/StoryWorkspacePage.tsx:163`), `// Threshold detection — detects qualifying step (replaces old Trigger 1)` (`src/hooks/useEmailDebounce.ts:29`)
- Reference design-decision IDs inline: `// per D-10, D-11` (`src/utils/export.ts:117`), `// Reset idle timer on every keystroke — EMAIL-01, D-03`
- Document non-obvious workarounds and backfills: `// Backfill author for stories created before Phase 12` (`src/services/storage.ts:30`)

**JSDoc/TSDoc:**
- Used only for top-level config modules to document editable fields: `src/config/emailModal.ts` and `src/config/beehiiv.ts`
- Not required for functions/components — self-documenting signatures are preferred

**TODO Comments:**
- None found in `src/` (no `TODO`, `FIXME`, `HACK`, or `XXX` markers)

## Function Design

**Size:**
- Small focused functions are the norm; handlers in pages are ~5-15 lines
- Large functions are tolerated for single-purpose algorithms/config: `runDiagnostics` (`src/utils/diagnostics.ts:18`), `exportStoryAsPDF` (`src/utils/export.ts:111`), static data (`src/data/steps.ts`)
- Extract small pure helpers (`capitalize` in `src/utils/diagnostics.ts:14`, `sanitizeFilename`/`formatDelta` in `src/utils/export.ts`)

**Parameters:**
- Components take a single destructured `Props` object: `function StoryCard({ step, isActive, ... }: Props)`
- Hooks/utilities take positional params, 3 max: `useEmailDebounce(story, activeStepNumber, setCaptureContext)`
- Optional props use defaults in destructuring: `variant = 'grid'` (`src/components/StoryCard.tsx:11`)

**Return Values:**
- Explicit return statements; early-return guard clauses (`if (!story) return` in hooks, `if (hasShownThisSession(...)) return`)
- `void` explicit for functions with no return (`saveStory(story: Story): void`)

## Module Design

**Exports:**
- Components: single default export (`export default function StoryCard(...)`)
- Utilities, services, hooks, data, config: named exports (`export function saveStory`, `export const STEP_DEFINITIONS`)
- Re-export of a type from a component: `export type { CaptureContext } from '../config/emailModal'` (`src/components/EmailCaptureModal.tsx:10`)

**Barrel Files:**
- None. No `index.ts` barrel files in the codebase — import from the specific module file directly.

**Directory organization:**
- `src/components/` — presentational + modal components (one file per component)
- `src/pages/` — route-level page components
- `src/hooks/` — custom React hooks (`use*`)
- `src/utils/` — pure logic and DOM/file side effects (`diagnostics.ts`, `export.ts`, `emailCapture.ts`, `pwaInstall.ts`)
- `src/services/` — persistence (`storage.ts`)
- `src/data/` — static content and seed data (`steps.ts`, `exampleStory.ts`)
- `src/config/` — user-editable configuration (`beehiiv.ts`, `emailModal.ts`)
- `src/types/` — shared TypeScript types (`story.ts`)

## React & State Conventions

- Function components only (no class components); hooks imported directly from `react`
- Local state via `useState`, lazy initializers for storage-derived state: `useState(() => id ? loadStory(id) : null)` (`src/pages/StoryWorkspacePage.tsx:37`)
- Persistence to `localStorage`/`sessionStorage` with a namespaced key scheme (`story-xray:stories`, `sxr:cap:submitted`, `sx:viewMode`, `sxr:pwa:dismiss`)
- No global state library (no Redux/Zustand/Context) — state lives in page components and is passed down via props
- Keyboard/toggle preferences persisted on change inside the setter callback (`src/pages/StoryWorkspacePage.tsx:102-108`)

## CSS Conventions

- Single stylesheet `src/index.css` (~1500 lines), no CSS modules or CSS-in-JS
- BEM-like class naming: block `__element` and `--modifier` (`story-card__main`, `story-card--active`, `capture-modal__close`, `board-header__view-toggle--active`)
- Design tokens as CSS custom properties in `:root`, with dark mode via `@media (prefers-color-scheme: dark)` (`src/index.css:1-47`)
- Theme values referenced as `var(--text)`, `var(--accent)`, etc. (e.g. `src/components/WaveformGraph.tsx:112`)

---

*Convention analysis: 2026-09-03*
*Update when patterns change*
