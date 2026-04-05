# Story X-Ray — Requirements

## Milestone: v1.1 Writer Experience Polish
**Goal:** Improve how writers see and interact with their story by adding a single-column view, toggleable beat previews, and richer per-step fiction examples.

---

## View Toggle (VIEW)
- [ ] **VIEW-01**: User can switch between 4-column board view and single-column list view
- [ ] **VIEW-02**: Single-column view shows all 16 cards stacked vertically in step order
- [ ] **VIEW-03**: Click-to-open-editor behavior is identical in both views (click card → open side panel)
- [ ] **VIEW-04**: View preference persists in localStorage across sessions

## Beat Preview (PREVIEW)
- [ ] **PREVIEW-01**: User can toggle beat text preview on/off from the board header
- [ ] **PREVIEW-02**: When preview is on, each card shows up to ~80 chars of beat text in italics
- [ ] **PREVIEW-03**: Cards with no beat text show no preview placeholder when preview is on
- [ ] **PREVIEW-04**: Preview toggle state persists in localStorage across sessions

## Step Examples (EXAMPLES)
- [ ] **EXAMPLES-01**: Each step's side editor shows 2–3 examples from popular fiction
- [ ] **EXAMPLES-02**: Each step includes at least 1 original made-up example
- [ ] **EXAMPLES-03**: Examples are visually distinct from the existing step hint text

---

## Deferred (Future Milestones)
- Multiple story management (story list, rename, delete)
- Advanced 28-step mode
- Genre-specific target presets
- Cloud sync / accounts
- AI-assisted beat suggestions
- Electron desktop wrapper
- Screenplay import

## Out of Scope for v1.1
- Inline card editing (no side panel) — keep consistent interaction model
- Examples shown on the card itself — side form only keeps cards clean
- Per-step example customization by user

---

## Traceability
| REQ-ID | Phase |
|--------|-------|
| VIEW-01–04 | Phase 9 |
| PREVIEW-01–04 | Phase 9 |
| EXAMPLES-01–03 | Phase 10 |
