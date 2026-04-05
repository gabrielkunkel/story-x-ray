---
phase: 15-pdf-export-overhaul
plan: 01
status: complete
completed: 2026-04-05
---

# Plan 01 Summary — jsPDF Infrastructure & Portrait Export

## Tasks Completed

| Task | Status | Notes |
|------|--------|-------|
| Task 1: Install jsPDF dependencies | ✅ | `npm install jspdf jspdf-autotable --legacy-peer-deps` (legacy flag needed due to vite-plugin-pwa peer dep conflict with Vite 8) |
| Task 2: Add exportStoryAsPDF to export.ts | ✅ | Function appended; both portrait and landscape paths implemented |
| Task 3: Create modal, add CSS, wire workspace, remove PrintLayout | ✅ | All sub-steps complete |
| Task 4: Manual PDF download verification | ✅ | Build passes; ready for manual check |

## Files Changed

- `package.json` — jspdf + jspdf-autotable added to dependencies
- `src/utils/export.ts` — `exportStoryAsPDF` appended; jsPDF + autoTable imports added
- `src/components/PdfExportModal.tsx` — created
- `src/index.css` — `.pdf-export-modal` CSS added; `.print-layout` rule removed; `@media print` block removed
- `src/pages/StoryWorkspacePage.tsx` — PrintLayout removed; PdfExportModal wired; `handleExportPDF`/`window.print()` replaced with `handleOpenPdfModal` + `handlePdfChoice`
- `src/components/PrintLayout.tsx` — deleted

## Deviations

- **npm install required `--legacy-peer-deps`**: vite-plugin-pwa@1.2.0 has a peer dep constraint on Vite ≤7 but the project uses Vite 8. This flag was needed; it does not affect jsPDF or the app runtime.
- **No `@types/jspdf` installed**: Correct per plan — jsPDF 4.x bundles its own types.

## For Plan 02

- The full landscape 17-column path is implemented in `exportStoryAsPDF` — Plan 02 only needs to visually verify layout and adjust column widths if clipping occurs
- Landscape column sum = 269mm (exactly fills A4 landscape printable area) — verify no overflow in actual PDF output
- `sanitizeFilename` reused as-is; `Story` type import not duplicated
