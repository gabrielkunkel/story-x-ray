---
phase: 15
slug: pdf-export-overhaul
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-05
---

# Phase 15 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — no automated test framework in project |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + manual PDF download check
- **Before `/gsd-verify-work`:** Build green + all manual verifications below
- **Max feedback latency:** 15 seconds (build)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 15-01-01 | 01 | 0 | PDF2-01 | — | N/A | manual | `npm run build` | ✅ | ✅ green |
| 15-01-02 | 01 | 1 | PDF2-02 | — | N/A | manual | `npm run build` | ✅ | ✅ green |
| 15-01-03 | 01 | 1 | PDF2-03 | — | N/A | manual | `npm run build` | ✅ | ✅ green |
| 15-01-04 | 01 | 1 | PDF2-04 | — | N/A | manual | `npm run build` | ✅ | ✅ green |
| 15-02-01 | 02 | 1 | PDF2-05 | — | N/A | manual | `npm run build` | ✅ | ✅ green |
| 15-02-02 | 02 | 1 | PDF2-06 | — | N/A | manual | `npm run build` | ✅ | ✅ green |
| 15-02-03 | 02 | 1 | PDF2-07 | — | N/A | manual | `npm run build` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `npm install jspdf jspdf-autotable` — installed in Plan 01

*No test file stubs needed — no automated test infrastructure in this project.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| PDF export modal opens on button click | PDF2-01 | No test runner | Click "↓ PDF" button → modal with two choices appears |
| .pdf file downloads (no print dialog) | PDF2-02 | Browser behavior | Select choice → browser downloads file, no print dialog |
| Header shows title, author, genre, date | PDF2-03 | PDF content | Open downloaded PDF, inspect top of first page |
| 5-column portrait table | PDF2-04 | PDF layout | "Without Scores" → count 5 columns in portrait orientation |
| 17-column landscape table with scores | PDF2-05 | PDF layout | "With Scores" → count 17 columns in landscape orientation |
| 16 rows, blank cells for empty content | PDF2-06 | PDF content | Check row count = 16; empty beatText/notes cells are blank (not "—") |
| Column headers repeat on page 2+ | PDF2-07 | Multi-page behavior | Add content to many steps, export, verify headers on page 2 |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s (build check)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** complete — 2026-04-05
