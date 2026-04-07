# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

---

## Milestone: v1.5 — Stories Browser & Email Capture

**Shipped:** 2026-04-06
**Phases:** 3 (19–21) | **Plans:** 4 | **Commits:** 16

### What Was Built

- PWA console warning fix (1-line removal of `e.preventDefault()`)
- Story browser on StartPage — list all saved stories, open or delete with confirmation
- Email trigger upgraded from Act I gate to any 4 beats across full story
- Configurable marketing image + copy in modal with README docs

### What Worked

- Phase 21 used full GSD executor flow (research → plan → execute → verify → security) — clean artifact trail
- 4-beat threshold decision was correct: simpler condition, works for non-linear writers
- Storing `MODAL_IMAGE_SRC` as exported constant co-located with the component was the right call — easy to find and edit
- Milestone audit tooling (v1.5-MILESTONE-AUDIT.md) gave confidence to complete despite phases 19/20 being non-GSD

### What Was Inefficient

- Phases 19 and 20 were executed outside GSD executor (committed directly). Resulted in missing SUMMARY.md, VERIFICATION.md, VALIDATION.md for those phases — acceptable for tiny changes but established bad habit
- v1.5 milestone completion (this step) was deferred from previous session, requiring context reconstruction

### Patterns Established

- Small bug/fix phases (Phase 19: 1 file, 1 line) can be committed directly without GSD overhead — document in audit as tech debt
- Marketing configurability pattern: single `// ── Marketing config ──` block at top of component, exported constants consumed by JSX below

### Key Lessons

1. Even 1-line fixes deserve a GSD phase entry — the overhead is small and the traceability is worth it
2. Milestone completion should be done in the same session as the final phase to avoid state drift

### Cost Observations

- Model mix: ~100% Sonnet 4.6 (no Opus or Haiku used in v1.5)
- Sessions: ~2 sessions
- Notable: Small milestone (3 phases, 4 plans) completed efficiently; research phase for Phase 21 was proportionate to scope

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 8 | ~8 | Initial MVP — all greenfield |
| v1.1 | 2 | 4 | First iterative milestone; UI polish workflow established |
| v1.2 | 4 | 4 | Export features; PDF + Fountain patterns established |
| v1.3 | 3 | 4 | PDF overhaul; learned window.print() is insufficient |
| v1.4 | 1 | 2 | PWA install prompt; event-capture-at-root pattern |
| v1.5 | 3 | 4 | Story browser + email redesign; mixed GSD/direct execution |

### Top Lessons (Verified Across Milestones)

1. **Co-locate configuration** — constants that operators need to change should be in one marked block at the top of the relevant file, not scattered inline
2. **Root-level event capture** — PWA/browser events must be captured at `App.tsx` root, not in page components that may mount after the event fires
3. **Small phases, fast feedback** — phases scoped to 1–2 plans each complete faster and are easier to verify than larger combined phases
4. **Architecture beats ambition** — the 16-step board proved more useful as a construction workspace than as a diagnostic tool; ship the tool first, add diagnostics after
