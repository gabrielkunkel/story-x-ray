# Story X-Ray — Requirements

## Milestone: v1.3 Export Polish & Card UX
**Goal:** Replace the broken single-page PDF with a real multi-page jsPDF table export, consolidate all exports into a single dropdown, and clean up list-view card presentation on wide screens.

---

## PDF Export Overhaul (PDF2)
- [ ] **PDF2-01**: User can trigger a PDF export from the export dropdown with an option to include or exclude scores
- [ ] **PDF2-02**: Generated PDF is a real downloadable file (not a browser print dialog), produced by jsPDF + autoTable
- [ ] **PDF2-03**: PDF header shows story title, author, genre, and export date
- [ ] **PDF2-04**: PDF body is a table with columns: Step #, Label, Act, Beat Text, Notes (always shown)
- [ ] **PDF2-05**: When "include scores" is selected, the table adds columns: Connection, Pressure, Hope, Stability (actual), Target values, and Delta (actual − target) per dimension
- [ ] **PDF2-06**: All 16 steps appear in the table; empty beat text and notes cells are left blank
- [ ] **PDF2-07**: Table spans multiple pages cleanly with column headers repeated on each page

## Export Dropdown (EXP)
- [ ] **EXP-01**: A single "Export ▾" dropdown button replaces all individual export buttons on the board
- [ ] **EXP-02**: The dropdown contains four items: "PDF", "Fountain (.fountain)", "JSON", "Markdown"
- [ ] **EXP-03**: PDF item opens a sub-choice or modal to select "With Scores" vs "Without Scores" before generating
- [ ] **EXP-04**: Fountain, JSON, and Markdown items trigger their existing export logic unchanged

## List View Card Polish (CARD)
- [ ] **CARD-01**: In list view on wide screens (where the italic beat excerpt is visible to the right), the purple filled dot is hidden
- [ ] **CARD-02**: On narrow screens (where the beat excerpt collapses below the step info), the purple dot is shown as before to signal card has content
- [ ] **CARD-03**: On wide screens, the italic beat excerpt is right-aligned within the remaining card space (flex end / text-align right)

---

## Deferred (Future Milestones)
- Multiple story management (story list, rename, delete)
- Advanced 28-step mode
- Genre-specific target score presets
- Cloud sync / accounts
- AI-assisted beat suggestions
- Electron desktop wrapper
- Collaborative annotations

## Out of Scope for v1.3
- Changing Fountain, JSON, or Markdown export content/format
- PDF page-size or margin customization
- Removing the dot from board (grid) view cards
- CSV/spreadsheet export

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| PDF2-01 | Phase 15 | Pending |
| PDF2-02 | Phase 15 | Pending |
| PDF2-03 | Phase 15 | Pending |
| PDF2-04 | Phase 15 | Pending |
| PDF2-05 | Phase 15 | Pending |
| PDF2-06 | Phase 15 | Pending |
| PDF2-07 | Phase 15 | Pending |
| EXP-01 | Phase 16 | Pending |
| EXP-02 | Phase 16 | Pending |
| EXP-03 | Phase 16 | Pending |
| EXP-04 | Phase 16 | Pending |
| CARD-01 | Phase 17 | Pending |
| CARD-02 | Phase 17 | Pending |
| CARD-03 | Phase 17 | Pending |
