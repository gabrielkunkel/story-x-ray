# Roadmap: Story X-Ray

## Milestones

- ✅ **v1.0 MVP** - Phases 1-8 (shipped 2026-04-04)
- ✅ **v1.1 Writer Experience Polish** - Phases 9-10 (shipped 2026-04-05)
- ✅ **v1.2 Story Identity & Export** - Phases 11-14 (shipped 2026-04-05)
- ✅ **v1.3 Export Polish & Card UX** - Phases 15-17 (shipped 2026-04-05) — [archive](.planning/milestones/v1.3-ROADMAP.md)
- ✅ **v1.4 PWA Install Prompt** - Phase 18 (shipped 2026-04-06) — [archive](.planning/milestones/v1.4-ROADMAP.md)
- ✅ **v1.5 Stories Browser & Email Capture** - Phases 19-21 (shipped 2026-04-06) — [archive](.planning/milestones/v1.5-ROADMAP.md)
- ✅ **v1.6 Polish & Content Config** - Phases 22-24 (shipped 2026-04-10) — [archive](.planning/milestones/v1.6-ROADMAP.md)
- 🚧 **v1.7 GitHub Pages Deployment** - Phases 25-27 (in progress)

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

<details>
<summary>✅ v1.3 Export Polish & Card UX (Phases 15-17) - SHIPPED 2026-04-05 — [archive](.planning/milestones/v1.3-ROADMAP.md)</summary>

See archived roadmap for phase details.

</details>

<details>
<summary>✅ v1.4 PWA Install Prompt (Phase 18) - SHIPPED 2026-04-06 — <a href=".planning/milestones/v1.4-ROADMAP.md">archive</a></summary>

See archived roadmap for phase details.

</details>

<details>
<summary>✅ v1.5 Stories Browser & Email Capture (Phases 19-21) - SHIPPED 2026-04-06 — <a href=".planning/milestones/v1.5-ROADMAP.md">archive</a></summary>

See archived roadmap for phase details.

</details>

<details>
<summary>✅ v1.6 Polish & Content Config (Phases 22-24) — SHIPPED 2026-04-10 — <a href=".planning/milestones/v1.6-ROADMAP.md">archive</a></summary>

- [x] Phase 22: Email Trigger Debounce (1/1 plans) — completed 2026-04-08
- [x] Phase 23: Global UI Scale (1/1 plans) — completed 2026-04-08
- [x] Phase 24: Modal Content Config (1/1 plans) — completed 2026-04-08

</details>

### 🚧 v1.7 GitHub Pages Deployment (In Progress)

**Milestone Goal:** Make the app deployable to GitHub Pages via ENV-var-controlled base path, base-aware PWA manifest, HashRouter migration, GitHub Actions CI/CD, and updated documentation.

- [x] **Phase 25: Build Config & PWA** - Rewrite vite.config.ts with loadEnv, base-aware PWA manifest, env files, and build scripts
- [ ] **Phase 26: Router & Path Migration** - Replace BrowserRouter with HashRouter and audit source for root-absolute paths
- [ ] **Phase 27: CI/CD & Documentation** - GitHub Actions deploy workflow and README deployment docs

## Phase Details

### Phase 25: Build Config & PWA
**Goal**: The Vite build is fully ENV-var-controlled and produces a base-aware PWA that resolves assets and service worker correctly under any subpath host
**Depends on**: Phase 24
**Requirements**: VITE-01, VITE-02, VITE-03, PWA-01, PWA-02, PWA-03, ENV-01, ENV-02, ENV-03, ENV-04, BUILD-01, BUILD-02
**Success Criteria** (what must be TRUE):
  1. Running `npm run build` with no env file set produces a build with base `/` that works locally
  2. Running `npm run build:prod` with `.env.production` produces a build with base `/story-x-ray/` where all asset URLs include the subpath
  3. The PWA manifest `start_url` and icon `src` paths reflect the active base in each build output
  4. `.env.example` exists and documents `VITE_BASE_PATH`; `.env` and `.env.production` are committed with correct per-mode values
**Plans**: 1 plan

Plans:
- [x] 25-01-PLAN.md — vite.config.ts loadEnv rewrite + base-aware PWA manifest + env files + build:prod script

### Phase 26: Router & Path Migration
**Goal**: The app navigates correctly on GitHub Pages static hosting — no 404s on direct URL access or page refresh
**Depends on**: Phase 25
**Requirements**: ROUTE-01, PATH-01
**Success Criteria** (what must be TRUE):
  1. Navigating directly to `/#/setup` or `/#/story/:id` in a browser loads the correct page without a 404
  2. Refreshing the browser on any route keeps the user on the correct page
  3. No root-absolute paths (e.g. `/icons/...`) remain in source files that Vite would not rewrite during build
**Plans**: TBD

Plans:
- [ ] 26-01: HashRouter migration + root-absolute path audit and fix

### Phase 27: CI/CD & Documentation
**Goal**: Pushing to `main` automatically deploys to GitHub Pages and the README gives a developer everything needed to understand, run, and deploy the project
**Depends on**: Phase 26
**Requirements**: CI-01, CI-02, CI-03, CI-04, CI-05, DOC-01, DOC-02, DOC-03, DOC-04
**Success Criteria** (what must be TRUE):
  1. A push to `main` triggers the workflow and deploys the production build to GitHub Pages without manual steps
  2. The workflow uses split build/deploy jobs with correct permissions; overlapping runs are cancelled automatically
  3. A developer reading the README can set up env files, run dev and prod builds, enable GitHub Pages, and understand the `#/` routing convention without asking anyone
**Plans**: TBD

Plans:
- [ ] 27-01: GitHub Actions deploy.yml workflow
- [ ] 27-02: README deployment documentation

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
| 15. PDF Export Overhaul | v1.3 | 2/2 | Complete | 2026-04-05 |
| 16. Export Dropdown | v1.3 | 1/1 | Complete | 2026-04-05 |
| 17. List View Card Polish | v1.3 | 1/1 | Complete | 2026-04-05 |
| 18. PWA Install Prompt | v1.4 | 2/2 | Complete | 2026-04-06 |
| 19. PWA Console Warning Fix | v1.5 | - | Complete | 2026-04-06 |
| 20. Story Project Browser | v1.5 | - | Complete | 2026-04-06 |
| 21. Email Capture Redesign | v1.5 | 2/2 | Complete | 2026-04-06 |
| 22. Email Trigger Debounce | v1.6 | 1/1 | Complete | 2026-04-08 |
| 23. Global UI Scale | v1.6 | 1/1 | Complete | 2026-04-08 |
| 24. Modal Content Config | v1.6 | 1/1 | Complete | 2026-04-08 |
| 25. Build Config & PWA | v1.7 | 1/1 | Complete | 2026-04-19 |
| 26. Router & Path Migration | v1.7 | 0/1 | Not started | - |
| 27. CI/CD & Documentation | v1.7 | 0/2 | Not started | - |
