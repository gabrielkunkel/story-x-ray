# Story X-Ray — Roadmap

## Milestone 1: MVP

Each phase is a vertical slice — a thin but working end-to-end feature delivered in shippable state.

---

### Phase 1 — App Foundation
**Goal:** Working app shell with routing, data model, localStorage, and story setup flow.

**Delivers:**
- TypeScript data model: `Story`, `StoryStep`, `ActualScores`, `TargetScores`
- 16-step structure data (labels, purposes, target scores) as a static config
- `localStorage` read/write service
- Start screen: "New Story" + "Load Example" (example non-functional yet)
- Story setup form: title (required), genre (optional), logline (optional)
- Basic routing: `/` → `/story/:id`
- PWA manifest (name, icons, colors) + Vite PWA plugin wired up

**Requirements:** R1, R10 (partial)

**UAT:**
- User can open app, click "New Story", fill out title, and land on a (empty) story workspace
- Refreshing the page keeps the story in place (localStorage)

---

### Phase 2 — 16-Card Board
**Goal:** The board layout is visible and navigable. All 16 cards display correct structural info.

**Delivers:**
- 4-column act layout (Act I, IIA, IIB, III)
- 16 `StoryCard` components — each showing step #, label, purpose
- Card selection: clicking a card marks it as active (visual highlight)
- Card editor panel opens on selection — shows step label, purpose, beat text field, notes field
- Beat text + notes save to localStorage on change
- Step hint/example text available in the editor (one hint per step)

**Requirements:** R2, R3

**UAT:**
- All 16 cards visible in correct act columns
- Clicking a card opens the editor; typing saves automatically
- Refreshing preserves beat text and notes

---

### Phase 3 — Scoring & Target vs Actual
**Goal:** Writers can enter actual scores and see them compared to target scores per step.

**Delivers:**
- 4 score inputs on each card (connection, pressure, hope, stability) — range 1–10
- Input method: numeric field + optional slider
- Target scores displayed alongside actuals for each dimension
- Delta (actual − target) displayed with color coding (over/under)
- Scores persist to localStorage

**Requirements:** R4, R5

**UAT:**
- Can enter scores on any card; values display correctly
- Target scores appear next to actuals
- Delta shows correct value and color

---

### Phase 4 — Waveform Graph
**Goal:** A line chart visualizes all 4 dimensions across 16 steps, target vs actual.

**Delivers:**
- Recharts (or equivalent) line chart component
- 4 actual lines (connection, pressure, hope, stability) in distinct colors
- 4 target lines (dashed/lighter) in matching colors
- X-axis: steps 1–16 with act section labels
- Y-axis: 1–10
- Hovering a point on the chart highlights the corresponding card on the board
- Chart updates live as scores change

**Requirements:** R6

**UAT:**
- Chart renders with target lines (dashed) and actual lines (solid)
- Hovering step 7 on chart highlights card 7 on the board
- Entering a new score on a card instantly updates the chart

---

### Phase 5 — Diagnostics
**Goal:** Rule-based warnings help writers identify structural problems.

**Delivers:**
- Diagnostic engine: evaluates all 4 rules against current scores
  - Flat zone: 3+ consecutive steps where a dimension changes < 1.5
  - Weak rupture: at steps 4, 8, 12 — pressure < 7 or stability > 4
  - False safety: relief steps (3, 7, 11) — connection or hope not meaningfully higher than prior step
  - Unresolved ending: step 16 — pressure > 4 or stability < 6
- Diagnostics panel (sidebar or collapsible) listing active warnings
- Each warning links to the relevant step(s)
- Warning count badge on board header

**Requirements:** R7

**UAT:**
- With default empty scores, no warnings or appropriate warnings shown
- Setting step 4 pressure to 4 triggers a weak rupture warning
- Clicking a warning highlights the relevant card

---

### Phase 6 — Export & Example Story
**Goal:** Writers can export their work and load an example to learn the system.

**Delivers:**
- JSON export: full story data as downloadable `.json`
- Markdown export: readable document with all steps, beats, scores
- JSON import: load a previously exported `.json` file back into the app
- Example story: one pre-filled story loadable from the start screen (hardcoded data)
- Export UI: accessible from board toolbar

**Requirements:** R8

**UAT:**
- Exporting a story produces a valid downloadable file
- Importing a JSON file restores the story correctly
- Loading the example story fills all 16 cards with pre-written beats and scores

---

### Phase 7 — Email Capture (Beehiiv)
**Goal:** Triggered (non-gated) email capture at key moments of value delivery.

**Delivers:**
- Beehiiv form integration (embed or API POST to subscription endpoint)
- **Trigger 1:** Post-Act-I popup — fires when beat text exists on all 4 Act I cards (once per session)
- **Trigger 2:** Export modal — fires on first export; offers to send story map via email
- **Trigger 3:** Diagnostics CTA — inline card appears in diagnostics panel on first open
- **Trigger 4:** "Load example stories" CTA on start screen links to capture
- **Trigger 5:** "28-step early access" button triggers capture
- All prompts are dismissible with no penalty
- Dismissed prompts respect a `localStorage` flag (don't re-show same session)

**Requirements:** R9

**UAT:**
- Completing all Act I cards triggers the popup once
- Dismissing the popup and completing Act I again does not re-trigger in same session
- Submitting email sends to Beehiiv successfully (verify in Beehiiv dashboard)

---

### Phase 8 — PWA Polish & Hardening
**Goal:** App is installable, offline-capable, responsive, and production-ready.

**Delivers:**
- Service worker (via `vite-plugin-pwa`) — caches app shell for offline use
- App installable on desktop (Chrome, Safari) and mobile
- Responsive layout: board adapts for tablet and mobile (horizontal scroll or stacked)
- Final CSS polish: consistent spacing, typography, color palette
- Error states: empty state for new story, graceful handling of corrupted localStorage
- `README.md` updated with project description and local dev instructions
- Production build verified (`vite build` passes)

**Requirements:** R10 (full), R1 (PWA part)

**UAT:**
- App installs on Chrome desktop via the browser install prompt
- App loads and works after disabling network (offline mode)
- Board is usable on a 768px-wide screen without broken layout

---

## Future Milestone (Post-MVP)

- Advanced 28-step mode
- Multiple story management (story list with names, dates)
- Genre-specific target presets
- Collaborative annotations
- Cloud sync / accounts
- AI-assisted beat suggestions
- Electron desktop wrapper
- Screenplay import
