# Roadmap: Story X-Ray

## Milestones

- ✅ **v1.0 MVP** - Phases 1-8 (shipped 2026-04-04)
- 🚧 **v1.1 Writer Experience Polish** - Phases 9-10 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-8) - SHIPPED 2026-04-04</summary>

### Phase 1: App Foundation
**Goal**: Working app shell with routing, data model, localStorage, and story setup flow.
**Plans**: Complete

Plans:
- [x] Phase 1 complete — commit `fe71e01`

### Phase 2: 16-Card Board
**Goal**: The board layout is visible and navigable. All 16 cards display correct structural info.
**Plans**: Complete

Plans:
- [x] Phase 2 complete — commit `e8e1b8c`

### Phase 3: Scoring & Target vs Actual
**Goal**: Writers can enter actual scores and see them compared to target scores per step.
**Plans**: Complete

Plans:
- [x] Phase 3 complete — commit `6713a1c`

### Phase 4: Waveform Graph
**Goal**: A line chart visualizes all 4 dimensions across 16 steps, target vs actual.
**Plans**: Complete

Plans:
- [x] Phase 4 complete — commit `8eaa928`

### Phase 5: Diagnostics
**Goal**: Rule-based warnings help writers identify structural problems.
**Plans**: Complete

Plans:
- [x] Phase 5 complete — commit `9189347`

### Phase 6: Export & Example Story
**Goal**: Writers can export their work and load an example to learn the system.
**Plans**: Complete

Plans:
- [x] Phase 6 complete — commit `568eaee`

### Phase 7: Email Capture (Beehiiv)
**Goal**: Triggered (non-gated) email capture at key moments of value delivery.
**Plans**: Complete

Plans:
- [x] Phase 7 complete — commit `205763a`

### Phase 8: PWA Polish & Hardening
**Goal**: App is installable, offline-capable, responsive, and production-ready.
**Plans**: Complete

Plans:
- [x] Phase 8 complete — commit `d7cf16f`

</details>

### 🚧 v1.1 Writer Experience Polish (In Progress)

**Milestone Goal:** Improve how writers see and interact with their story by adding a single-column view, toggleable beat previews, and richer per-step fiction examples.

- [x] **Phase 9: Board View Controls** - View toggle (4-column / single-column) and beat text preview toggle, both persisted
- [ ] **Phase 10: Step Examples** - 2-3 fiction examples per step in the side editor, visually distinct from hint text

## Phase Details

### Phase 9: Board View Controls
**Goal**: Writers can switch how they see the board and preview beat text at a glance
**Depends on**: Phase 8
**Requirements**: VIEW-01, VIEW-02, VIEW-03, VIEW-04, PREVIEW-01, PREVIEW-02, PREVIEW-03, PREVIEW-04
**Success Criteria** (what must be TRUE):
  1. User can click a toggle in the board header to switch between 4-column and single-column layouts
  2. In single-column view, all 16 cards appear stacked in step order and clicking any card opens the side editor
  3. User can click a preview toggle in the board header to show or hide beat text on every card
  4. When preview is on, cards with beat text show an italic excerpt of up to ~80 characters; cards without beat text show nothing
  5. Both the view preference and the preview toggle state survive a page refresh
**Plans**: 2 plans

Plans:
- [ ] 09-01-PLAN.md — Grid/list view toggle with single-column layout
- [ ] 09-02-PLAN.md — Beat text preview toggle on story cards

**UI hint**: yes

### Phase 10: Step Examples
**Goal**: Each step's side editor shows 2-3 labeled fiction examples that help writers understand what belongs at that beat
**Depends on**: Phase 9
**Requirements**: EXAMPLES-01, EXAMPLES-02, EXAMPLES-03
**Success Criteria** (what must be TRUE):
  1. Opening any step's side editor shows 2-3 examples drawn from popular or original fiction
  2. At least one example per step is an original (non-adaptation) scenario
  3. Examples are visually separated from the existing step hint text (different style, label, or section)
**Plans**: 2 plans

Plans:
- [ ] 10-01-PLAN.md — StepExample interface and STEP_EXAMPLES data for all 16 steps
- [ ] 10-02-PLAN.md — CardEditor examples section UI and CSS

**UI hint**: yes

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. App Foundation | v1.0 | - | Complete | 2026-04-04 |
| 2. 16-Card Board | v1.0 | - | Complete | 2026-04-04 |
| 3. Scoring & Target vs Actual | v1.0 | - | Complete | 2026-04-04 |
| 4. Waveform Graph | v1.0 | - | Complete | 2026-04-04 |
| 5. Diagnostics | v1.0 | - | Complete | 2026-04-04 |
| 6. Export & Example Story | v1.0 | - | Complete | 2026-04-04 |
| 7. Email Capture | v1.0 | - | Complete | 2026-04-04 |
| 8. PWA Polish & Hardening | v1.0 | - | Complete | 2026-04-04 |
| 9. Board View Controls | v1.1 | 2/2 | Complete | 2026-04-05 |
| 10. Step Examples | v1.1 | 0/2 | Not started | - |

## Future Milestone (Post-v1.1)

- Advanced 28-step mode
- Multiple story management (story list with names, dates)
- Genre-specific target presets
- Collaborative annotations
- Cloud sync / accounts
- AI-assisted beat suggestions
- Electron desktop wrapper
- Screenplay import
