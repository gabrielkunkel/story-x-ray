# Story X-Ray — Project State

## Current Status
- Milestone: v1.3 Export Polish & Card UX — IN PROGRESS
- Active Phase: None — defining requirements
- Last updated: 2026-04-05

## Completed Phases
- **Phase 1 — App Foundation** (2026-04-04) — commit `fe71e01`
  - Data model, 16-step config, localStorage service, routing, 3 pages, PWA manifest
- **Phase 2 — 16-Card Board** (2026-04-04) — commit `e8e1b8c`
  - 4-column board, 16 StoryCard components, CardEditor with beat/notes/hints, auto-save
- **Phase 3 — Scoring & Target vs Actual** (2026-04-04) — commit `6713a1c`
  - ScoreInput component, 4 dimensions per card, delta with color coding, localStorage persistence
- **Phase 4 — Waveform Graph** (2026-04-04) — commit `8eaa928`
  - Recharts LineChart, 4 target (dashed) + 4 actual (solid) lines, hover→card sync, graph toggle
- **Phase 5 — Diagnostics** (2026-04-04) — commit `9189347`
  - Pure diagnostic engine (4 rules), DiagnosticsPanel with step chips, ⚠ toggle in BoardHeader
- **Phase 6 — Export & Example Story** (2026-04-04) — commit `568eaee`
  - JSON + Markdown export, JSON import with error handling, Romeo & Juliet example story
- **Phase 7 — Email Capture** (2026-04-04) — commit `205763a`
  - Beehiiv integration (placeholder), 5 triggers, dismissible modal, session/localStorage guards
- **Phase 8 — PWA Polish & Hardening** (2026-04-04) — commit `d7cf16f`
  - README rewritten, mobile header polish, empty state hint, production build verified
- **Phase 9 — Board View Controls** (2026-04-05) — commit `36eea96`
  - Grid/list view toggle + beat text preview toggle, both persisted to localStorage

- **Phase 10 — Step Examples** (2026-04-05) — commit `55dc382`
  - 48 fiction examples (16 steps × 3) in CardEditor collapsible; teal/amber palette
- **Phase 11 — List View Card Polish** (2026-04-05) — commit `834d75a`
  - Full-width list cards; responsive beat quote inline (right on wide, below on narrow)
- **Phase 12 — Story Identity** (2026-04-05) — commit `1a8f3ed`
  - author field added; ✎ edit modal in board header for title/author/genre
- **Phase 13 — PDF Export** (2026-04-05) — commit `f791ced`
  - PrintLayout component + @media print; ↓ PDF button triggers window.print()
- **Phase 14 — Fountain Export** (2026-04-05) — commit `2c7e07b`
  - .fountain file export; title page metadata, act/step headings, beat text as action

## In Progress
- None — v1.2 milestone complete

## Decisions Log
| Date | Decision | Rationale |
|---|---|---|
| 2026-04-04 | App name: Story X-Ray | Repo name; README_AI used "Story Architecture Board" but user prefers Story X-Ray |
| 2026-04-04 | Email capture in MVP | Lead gen via Beehiiv is part of MVP, not post-MVP |
| 2026-04-04 | Phase style: vertical slices | Each phase delivers thin but working end-to-end feature |
| 2026-04-04 | PWA first, no Electron | Simpler MVP; Electron can be added post-validation |
| 2026-04-04 | No AI in MVP | Deliberate positioning: construction tool, not AI tool |
| 2026-04-04 | VIEW + PREVIEW combined into Phase 9 | Both touch BoardHeader and StoryCard layout — same components, same PR |
| 2026-04-04 | EXAMPLES separate Phase 10 | Content data file (16×3 entries) plus UI wiring is distinct from layout toggles |

## Notes
- README_AI.md in project root is the canonical product spec — read it for full context
- 16-step structure data (labels, purposes, target scores) is fully defined in PROJECT.md
- Beehiiv is the email platform (free tier for MVP)
- Stack: React 19 + TypeScript + Vite 8 + localStorage + Recharts
