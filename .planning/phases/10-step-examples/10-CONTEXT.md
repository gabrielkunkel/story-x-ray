---
phase: 10
title: Step Examples
status: context-ready
date: 2026-04-05
mode: discuss
---

# Phase 10 — Step Examples: Context

## Phase Goal
Each step's side editor shows 2-3 labeled fiction examples that help writers understand what belongs at that beat. Examples are visually distinct from the existing Writing hint.

## Requirements
- EXAMPLES-01: Each step's side editor shows 2–3 examples from popular fiction
- EXAMPLES-02: Each step includes at least 1 original made-up example
- EXAMPLES-03: Examples are visually distinct from the existing step hint text

---

## Decision A: Visual Placement

**Decision:** Examples appear in their own collapsible `<details>` section labeled "Examples", placed directly below the existing "Writing hint" collapsible in `CardEditor`.

Editor order (top → bottom):
```
[ Step N header ]
[ Purpose ]
▸ Writing hint       ← existing
▸ Examples           ← new
[ Scores ]
[ Beat textarea ]
[ Notes textarea ]
```

Both sections start collapsed. Writers expand on demand — keeps the editor uncluttered. The `<details>` pattern matches the existing "Writing hint" implementation exactly.

---

## Decision B: Example Format

**Decision:** Each example entry shows a **title line** (work name) followed by **2-3 sentences** of context — enough to show why this moment fits the beat, even for writers unfamiliar with the source.

Format:
```
Harry Potter (Philosopher's Stone)
Harry receives his Hogwarts letter. The Dursleys try to suppress it, but
the letters keep coming. The rupture is not dramatic — it's bureaucratic,
relentless, and unstoppable.
```

- Title is the source name (bold or heading treatment)
- Body is 2-3 sentences, written to illuminate the beat (not just plot summary)
- Original examples use the same format but are flagged (see Decision D)

---

## Decision C: Fiction Sources

**Decision:** Draw examples from these four works, user-specified:
- Harry Potter (Philosopher's Stone / series)
- Star Wars (Original Trilogy — Episodes IV–VI)
- The Godfather (film/novel)
- Pride & Prejudice (Austen)

Each step gets 2-3 examples: typically 2 from this list (whichever fit best) + 1 original. Not every source needs to appear at every step — pick whichever 2 from the list most clearly illustrate the beat, then add an original.

---

## Decision D: Labeling Originals

**Decision:** Original (non-adaptation) examples are labeled with a visible `[Original]` marker to distinguish them from sourced examples.

Display:
```
[Original]
A marine biologist returns from a remote expedition to find her university
has shut down her lab. There was no confrontation — just a locked door and
a forwarding address. The rupture arrived while she wasn't looking.
```

The `[Original]` label is rendered as a small tag/badge (not the example title). The made-up scenario still has a title-like source line if helpful, or can omit it.

---

## Data Structure

Examples live in `src/data/steps.ts` alongside `STEP_HINTS`, as a new `STEP_EXAMPLES` export:

```typescript
export interface StepExample {
  source: string        // e.g. "Harry Potter (Philosopher's Stone)" or "[Original]"
  isOriginal?: boolean  // true for made-up scenarios
  text: string          // 2-3 sentence description
}

export const STEP_EXAMPLES: Record<number, StepExample[]> = {
  1: [
    { source: 'Harry Potter (Philosopher\'s Stone)', text: '...' },
    { source: 'Pride & Prejudice', text: '...' },
    { source: '[Original]', isOriginal: true, text: '...' },
  ],
  // ... steps 2-16
}
```

---

## File Plan

| File | Action |
|------|--------|
| `src/data/steps.ts` | Add `StepExample` interface and `STEP_EXAMPLES` export with all 16 steps × 2-3 examples each |
| `src/components/CardEditor.tsx` | Import `STEP_EXAMPLES`, render new `<details class="card-editor__examples">` section below Writing hint |
| `src/index.css` | Add `.card-editor__examples`, `.example-item`, `.example-item__source`, `.example-item__text`, `.example-item--original` styles |

---

## Out of Scope
- Examples shown on the card itself (requirements explicitly exclude this)
- Per-user customization of examples
- More than 4 source works (user selected these 4)
- Collapsible per-example (all examples visible within the expanded section)

---

## Canonical refs
- `.planning/REQUIREMENTS.md` — EXAMPLES-01, EXAMPLES-02, EXAMPLES-03
- `.planning/ROADMAP.md` — Phase 10 success criteria
- `src/data/steps.ts` — data file where STEP_EXAMPLES will live
- `src/components/CardEditor.tsx` — component to modify
