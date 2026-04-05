---
phase: 9
title: Board View Controls
status: context-ready
date: 2026-04-04
mode: discuss
---

# Phase 9 — Board View Controls: Context

## Phase Goal
Writers can switch how they see the board (4-column ↔ single-column) and toggle beat text previews on/off. Both preferences persist across sessions.

## Requirements
- VIEW-01: User can switch between 4-column board view and single-column list view
- VIEW-02: Single-column view shows all 16 cards stacked vertically in step order
- VIEW-03: Click-to-open-editor behavior is identical in both views
- VIEW-04: View preference persists in localStorage
- PREVIEW-01: User can toggle beat text preview on/off from the board header
- PREVIEW-02: When on, each card shows up to ~80 chars of beat text in italics
- PREVIEW-03: Cards with no beat text show no preview placeholder
- PREVIEW-04: Preview toggle state persists in localStorage

---

## Decision: Header Layout

**Decision:** Add view and preview toggles to `BoardHeader` in one row, grouped together with a visual separator between them and the existing export buttons.

The existing toggle pattern (∿ for graph, ⚠ for diagnostics) is the model — icon buttons with a CSS active modifier. The new toggles follow the same pattern.

Layout order (left → right):
```
← [title] | ↓JSON  ↓MD  ↑  |  ⊞  👁  |  ∿  ⚠
           [export group]   [view group] [panel group]
```

Visual separator: a subtle divider (e.g., `border-left` or spacing) between export actions and view controls.

---

## Decision: View Toggle Icon & Labels

**Decision:** Claude's discretion — suggest a simple icon that reads clearly (e.g., ⊞ for grid/4-col, ☰ for list/single-col). Toggle switches between the two states. Active state uses existing `--active` CSS modifier pattern.

---

## Decision: Single-Column Layout Structure

**Decision:** Flat list of all 16 cards in step order (1→16), with act labels as section headers between groups.

Structure:
```
Act I
  Card 1, Card 2, Card 3, Card 4
Act IIA
  Card 5, Card 6, Card 7, Card 8
Act IIB
  Card 9, Card 10, Card 11, Card 12
Act III
  Card 13, Card 14, Card 15, Card 16
```

Does not reuse `ActColumn` — renders a new flat layout component or inline in `StoryWorkspacePage`. Cards remain `StoryCard` components (no new card component needed).

---

## Decision: Beat Preview Appearance

**Decision:** When preview is on, `StoryCard` renders an italic line below the label/purpose area showing up to ~80 chars of `beatText`. Clipped with ellipsis if longer.

- No placeholder shown when `beatText` is empty
- The existing filled-dot indicator (`story-card__filled`) remains — preview coexists with it
- Preview always visible on active card (card appearance does not change based on editor state)

---

## Decision: Persistence

**Decision:** Both `viewMode` and `showBeatPreview` are user-level preferences (not per-story). Store in `localStorage` under simple keys:

- `sx:viewMode` → `"grid"` | `"list"` (default: `"grid"`)
- `sx:showBeatPreview` → `"true"` | `"false"` (default: `"false"`)

Read on mount in `StoryWorkspacePage`, write on toggle. No new abstraction needed — direct `localStorage.getItem/setItem` calls.

---

## File Plan

| File | Action |
|------|--------|
| `src/components/BoardHeader.tsx` | Add `viewMode`, `onToggleView`, `showBeatPreview`, `onToggleBeatPreview` props + new toggle buttons with separator |
| `src/components/StoryCard.tsx` | Add `showBeatPreview` prop + conditional italic preview rendering |
| `src/components/ActColumn.tsx` | Pass `showBeatPreview` through to `StoryCard` |
| `src/pages/StoryWorkspacePage.tsx` | Add `viewMode` + `showBeatPreview` state (localStorage-initialized), wire to `BoardHeader`, render flat list when `viewMode === 'list'` |
| `src/index.css` | Add separator style, list-view layout, beat preview text style |

## Out of Scope
- Inline card editing (no side panel in single-column view)
- Per-story view preferences
- Keyboard shortcuts for view toggle
