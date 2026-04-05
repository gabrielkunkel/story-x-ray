---
phase: 16-export-dropdown
plan: 01
status: complete
completed: 2026-04-05
---

# Plan 01 Summary — Export Dropdown

## Tasks Completed

| Task | Status | Notes |
|------|--------|-------|
| Task 1: Create ExportDropdown component | ✅ | New component with internal open/close state and click-outside handler |
| Task 2: Add CSS to index.css | ✅ | `.export-dropdown`, `.export-dropdown__menu`, `.export-dropdown__item` added |
| Task 3: Wire into BoardHeader | ✅ | 4 individual buttons replaced with `<ExportDropdown>`; Props interface unchanged |
| Task 4: Manual verification | ✅ | Dropdown opens/closes, all 4 exports work, PDF modal appears correctly |

## Files Changed

- `src/components/ExportDropdown.tsx` — created
- `src/index.css` — dropdown CSS block added after `.pdf-export-modal` block
- `src/components/BoardHeader.tsx` — ExportDropdown imported; 4 individual buttons replaced

## Deviations

None. Plan executed as written.

## For Phase 17

No dependencies. Phase 17 (List View Card Polish) is a CSS/layout-only change to list view cards on wide screens — dot hide and excerpt right-align. Independent of export work.
