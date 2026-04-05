# Roadmap: Story X-Ray

## Milestones

- ✅ **v1.0 MVP** - Phases 1-8 (shipped 2026-04-04)
- ✅ **v1.1 Writer Experience Polish** - Phases 9-10 (shipped 2026-04-05)
- ✅ **v1.2 Story Identity & Export** - Phases 11-14 (shipped 2026-04-05)
- 🚧 **v1.3 Export Polish & Card UX** - Phases 15-17 (in progress)

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

<details>
<summary>✅ v1.1 Writer Experience Polish (Phases 9-10) - SHIPPED 2026-04-05</summary>

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
- [x] 09-01-PLAN.md — Grid/list view toggle with single-column layout
- [x] 09-02-PLAN.md — Beat text preview toggle on story cards

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
- [x] 10-01-PLAN.md — StepExample interface and STEP_EXAMPLES data for all 16 steps
- [x] 10-02-PLAN.md — CardEditor examples section UI and CSS

**UI hint**: yes

</details>

<details>
<summary>✅ v1.2 Story Identity & Export (Phases 11-14) - SHIPPED 2026-04-05</summary>

### Phase 11: List View Card Polish
**Goal**: Single-column cards are full-width and show the beat text excerpt inline in a responsive layout
**Depends on**: Phase 10
**Requirements**: LIST-01, LIST-02, LIST-03, LIST-04
**Success Criteria** (what must be TRUE):
  1. In single-column view, each card occupies the full container width
  2. Cards with beat text show an italicized excerpt to the right of the step info on wide layouts
  3. On narrow layouts the excerpt appears below the step info instead
  4. Cards without beat text show nothing in the excerpt zone

Plans:
- [x] 11-01-PLAN.md — Responsive list card layout with inline beat quote

**UI hint**: yes

### Phase 12: Story Identity
**Goal**: Writers can name their story with title, author, and genre — visible in the board header
**Depends on**: Phase 10
**Requirements**: STORY-01, STORY-02, STORY-03, STORY-04, STORY-05
**Success Criteria** (what must be TRUE):
  1. Writer can open an edit UI from the board header to set story title, author name, and genre tag
  2. The story title replaces any default placeholder in the board header
  3. Author and genre are optional — empty fields show nothing rather than a placeholder
  4. All three fields persist in localStorage across sessions

Plans:
- [x] 12-01-PLAN.md — Story identity data model and board header edit UI

**UI hint**: yes

### Phase 13: PDF Export
**Goal**: Writers can export their story board as a clean, formatted PDF report
**Depends on**: Phase 12
**Requirements**: PDF-01, PDF-02, PDF-03, PDF-04
**Success Criteria** (what must be TRUE):
  1. A "Export PDF" action is accessible from the board
  2. The PDF header shows story title, author, genre, and export date
  3. All 16 steps appear with step number, label, act, beat text, notes, and actual scores
  4. Layout is print-clean — no app chrome, logical page breaks, readable typography

Plans:
- [x] 13-01-PLAN.md — PDF generation and print-friendly layout

**UI hint**: yes

### Phase 14: Fountain Export
**Goal**: Writers can export their beats as a .fountain file compatible with Final Draft and other screenplay tools
**Depends on**: Phase 12
**Requirements**: FTN-01, FTN-02, FTN-03, FTN-04
**Success Criteria** (what must be TRUE):
  1. A "Export Fountain" action is accessible from the export menu
  2. Each step with beat text becomes a Fountain section heading + action block
  3. Steps with no beat text are omitted
  4. Story title and author appear as Fountain title page metadata at the top

Plans:
- [x] 14-01-PLAN.md — Fountain file serializer and export trigger

</details>

### 🚧 v1.3 Export Polish & Card UX (In Progress)

**Milestone Goal:** Replace the broken single-page PDF with a real multi-page jsPDF table export, consolidate all exports into a single dropdown, and clean up list-view card presentation on wide screens.

- [ ] **Phase 15: PDF Export Overhaul** - jsPDF + autoTable generates a real downloadable multi-page PDF table with optional score columns
- [ ] **Phase 16: Export Dropdown** - A single "Export ▾" dropdown replaces all individual export buttons, housing PDF, Fountain, JSON, and Markdown
- [ ] **Phase 17: List View Card Polish** - Purple dot hides on wide screens when italic beat excerpt is visible; excerpt right-aligns within card space

## Phase Details

### Phase 15: PDF Export Overhaul
**Goal**: Writers can download a real multi-page PDF table of their story — not a browser print dialog
**Depends on**: Phase 14
**Requirements**: PDF2-01, PDF2-02, PDF2-03, PDF2-04, PDF2-05, PDF2-06, PDF2-07
**Success Criteria** (what must be TRUE):
  1. Clicking the PDF export option downloads a .pdf file directly — no browser print dialog appears
  2. The PDF opens with a header showing story title, author, genre, and export date
  3. All 16 steps appear as table rows with Step, Label, Act, Beat Text, and Notes columns; empty cells are blank, not placeholder text
  4. When "With Scores" is selected, the table gains Connection, Pressure, Hope, Stability, Target, and Delta columns per dimension
  5. Column headers repeat on each page when the table spans multiple pages
**Plans**: TBD

Plans:
- [ ] 15-01-PLAN.md — jsPDF + autoTable setup, table structure, header metadata
- [ ] 15-02-PLAN.md — Score columns, multi-page rendering, "include scores" toggle

**UI hint**: yes

### Phase 16: Export Dropdown
**Goal**: All export formats are accessible from a single "Export ▾" dropdown — no scattered individual buttons
**Depends on**: Phase 15
**Requirements**: EXP-01, EXP-02, EXP-03, EXP-04
**Success Criteria** (what must be TRUE):
  1. The board shows a single "Export ▾" button; all previously individual export buttons are gone
  2. Opening the dropdown reveals exactly four items: PDF, Fountain (.fountain), JSON, Markdown
  3. Clicking "PDF" opens a choice (modal or sub-menu) to select "With Scores" or "Without Scores" before generating
  4. Clicking Fountain, JSON, or Markdown triggers the existing export immediately with no extra steps
**Plans**: TBD

Plans:
- [ ] 16-01-PLAN.md — Export dropdown component and PDF score-choice modal

**UI hint**: yes

### Phase 17: List View Card Polish
**Goal**: On wide screens the purple filled dot hides when the beat excerpt is visible, and the excerpt is right-aligned within the card
**Depends on**: Phase 11
**Requirements**: CARD-01, CARD-02, CARD-03
**Success Criteria** (what must be TRUE):
  1. On a wide-screen list view, cards with a beat excerpt visible do not show the purple filled dot
  2. On a narrow-screen list view, the purple filled dot is still shown on cards that have beat content
  3. On wide screens the italic beat excerpt is right-aligned within the available card space
**Plans**: TBD

Plans:
- [ ] 17-01-PLAN.md — Dot visibility breakpoint logic and excerpt right-alignment

**UI hint**: yes

---

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
| 10. Step Examples | v1.1 | 2/2 | Complete | 2026-04-05 |
| 11. List View Card Polish | v1.2 | 1/1 | Complete | 2026-04-05 |
| 12. Story Identity | v1.2 | 1/1 | Complete | 2026-04-05 |
| 13. PDF Export | v1.2 | 1/1 | Complete | 2026-04-05 |
| 14. Fountain Export | v1.2 | 1/1 | Complete | 2026-04-05 |
| 15. PDF Export Overhaul | v1.3 | 0/2 | Not started | - |
| 16. Export Dropdown | v1.3 | 0/1 | Not started | - |
| 17. List View Card Polish | v1.3 | 0/1 | Not started | - |
