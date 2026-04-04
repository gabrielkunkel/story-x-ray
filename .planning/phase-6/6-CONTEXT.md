---
phase: 6
title: Export & Example Story
status: context-ready
date: 2026-04-04
mode: auto
---

# Phase 6 — Export & Example Story: Context

## Phase Goal
Writers can export their work (JSON + Markdown) and import it back. An example story is loadable from the start screen, replacing the "coming soon" stub.

## Prior Decisions (carried forward)
- Stack: React 19 + TypeScript + Vite 8 + localStorage
- `Story` type is fully defined in `src/types/story.ts`
- `saveStory` / `loadStory` are in `src/services/storage.ts`
- `StartPage.tsx` has a "Load Example" button that currently shows `alert('Example stories coming soon!')`
- `BoardHeader` is the toolbar — export UI goes here alongside the existing toggles
- `createFreshSteps()` in `src/data/steps.ts` is the canonical way to initialize steps

---

## Decision: Export Formats

**JSON export:** Full `Story` object serialized as JSON, downloaded as `<story-title>.json`.

**Markdown export:** Human-readable document. Structure:
```
# <story title>
Genre: <genre> | Logline: <logline>

## Step 1 — Safe Baseline (Act I)
**Beat:** <beatText>
**Notes:** <notes>
Scores — Connection: X (target Y) | Pressure: X (target Y) | Hope: X (target Y) | Stability: X (target Y)

...repeat for all 16 steps...
```
Downloaded as `<story-title>.md`.

---

## Decision: Export Utilities Location

Pure functions in `src/utils/export.ts`:
```ts
export function exportStoryAsJSON(story: Story): void   // triggers browser download
export function exportStoryAsMarkdown(story: Story): void
```

Both use the `<a download>` trick: create a Blob, create an object URL, click it, revoke it.

Filename sanitization: replace non-alphanumeric chars with `-`, lowercase.

---

## Decision: JSON Import

Import via `<input type="file" accept=".json">`. On file selection:
1. Read file as text
2. Parse JSON — if invalid, show an inline error message (no alert)
3. Validate it has `id`, `title`, `steps` fields — if missing, show error
4. Generate a new `id` (`crypto.randomUUID()`) to avoid collision with existing stories
5. Save to localStorage via `saveStory`
6. Navigate to the imported story

Import UI: a button in `BoardHeader` labeled "Import" (or an upload icon). On click, programmatically clicks a hidden `<input type="file">`.

---

## Decision: Export UI Placement

Export buttons go in `BoardHeader`, to the left of the existing ∿ and ⚠ toggles.

Two separate buttons: `↓ JSON` and `↓ MD`. Keep labels short.

Import button also in `BoardHeader`: `↑ Import`.

---

## Decision: Example Story

One hardcoded story in `src/data/exampleStory.ts`. It should be a recognizable classic so writers immediately understand the system.

**Story:** A Romeo & Juliet-inspired tragedy (universally known, no copyright issue).

All 16 steps filled with:
- Beat text (1–2 sentences)
- Actual scores that roughly match the target scores (close but not identical — shows the system working realistically)

`loadExample()` function:
1. Create a fresh copy with `crypto.randomUUID()` as id
2. Set `title: 'Romeo & Juliet (Example)'`, genre: `'Tragedy'`, logline: `'Two star-crossed lovers defy their feuding families — and pay the ultimate price.'`
3. Save to localStorage
4. Navigate to `/story/<id>`

---

## Decision: Import Error Handling

Show errors inline in the component (not alert). A small `<p className="import-error">` below the hidden file input that appears on parse failure. Clears on next successful import attempt.

---

## Out of Scope for Phase 6
- Multiple story management (list/delete stories)
- PDF export
- CSV export
- Cloud backup
- Import from Markdown
- Beehiw capture on export (Phase 7)

---

## File Plan
| File | Action |
|---|---|
| `src/utils/export.ts` | Create — JSON + Markdown export functions |
| `src/data/exampleStory.ts` | Create — hardcoded example story data + `loadExample` |
| `src/components/BoardHeader.tsx` | Modify — add export buttons + hidden file import input |
| `src/pages/StartPage.tsx` | Modify — wire "Load Example" to `loadExample()` |
| `src/index.css` | Modify — import error style |
