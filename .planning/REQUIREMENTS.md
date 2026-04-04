# Story X-Ray — MVP Requirements

## Milestone: 1.0 MVP
**Goal:** A working, installable PWA that writers can use today to construct and analyze a story using the 16-step architecture board.

---

## R1 — App Shell & Story Setup
- [ ] App has a start screen with "New Story" and "Load Example" options
- [ ] New story setup collects: title (required), genre (optional), logline (optional)
- [ ] App shell supports basic routing between screens
- [ ] PWA manifest present (name, icons, theme color)

## R2 — 16-Card Board
- [ ] Board displays 4 act columns (Act I, IIA, IIB, III)
- [ ] Each act column contains exactly 4 story step cards
- [ ] Each card displays: step number, label, purpose
- [ ] User can select / focus a card to open the card editor
- [ ] Active card is visually distinguished

## R3 — Card Editor
- [ ] Selected card opens an editor panel
- [ ] Editor has a beat text field (what happens in this step)
- [ ] Editor has a notes field (author working notes)
- [ ] Changes auto-save to localStorage
- [ ] Example / hint text is available for each step to guide the writer

## R4 — Scoring (Actual Scores)
- [ ] Each card has 4 score inputs: connection, pressure, hope, stability
- [ ] Scores are integers 1–10
- [ ] Scores can be entered via slider or numeric input
- [ ] Scores persist to localStorage

## R5 — Target vs Actual Comparison
- [ ] Target scores are displayed alongside actual scores for each dimension
- [ ] Delta (actual − target) is calculated and shown per dimension
- [ ] Positive deltas and negative deltas are visually distinguished

## R6 — Waveform Graph
- [ ] Line chart shows all 4 dimensions across 16 steps
- [ ] Target lines are shown (dashed or lighter) alongside actual lines
- [ ] X-axis: steps 1–16 (with act labels)
- [ ] Y-axis: 1–10
- [ ] Chart is interactive: hovering a step highlights the corresponding card

## R7 — Diagnostics
- [ ] Rule: flag flat zones (3+ consecutive steps where a dimension barely changes)
- [ ] Rule: flag weak ruptures at steps 4, 8, 12 (pressure not high enough, stability not low enough)
- [ ] Rule: flag false safety when relief steps don't show meaningful improvement
- [ ] Rule: flag unresolved endings (step 16 carries excess pressure or insufficient stability)
- [ ] Diagnostics panel shows active warnings with step references

## R8 — Export
- [ ] Export story as JSON (full data model)
- [ ] Export story as Markdown (readable document)
- [ ] User can load a JSON export back into the app (import)
- [ ] Example story is loadable from the start screen

## R9 — Email Capture (Beehiiv)
- [ ] No email required to use the board (anonymous use always allowed)
- [ ] Trigger: After user fills beat text on all 4 Act I cards → post-Act-I popup
- [ ] Trigger: After first export → export-to-email modal
- [ ] Trigger: After opening diagnostics for first time → inline CTA card
- [ ] Trigger: When clicking "Load example stories" or "28-step early access"
- [ ] Capture form integrates with Beehiiv (form embed or API)
- [ ] User can dismiss capture prompts without penalty

## R10 — Persistence & PWA
- [ ] All story data persists in localStorage across sessions
- [ ] Multiple stories can be saved (story list / switcher)
- [ ] App works offline after first load (service worker)
- [ ] App is installable on desktop and mobile

---

## Out of Scope for MVP
- AI features
- Cloud sync / accounts / auth
- Collaboration
- Advanced 28-step mode
- Screenplay import
- Paywall / gating
