---
phase: 21
plan: "21-02"
subsystem: email-capture
tags: [modal-image, css, documentation, marketing]
dependency_graph:
  requires: [21-01]
  provides: [CAPTURE-03, CAPTURE-05]
  affects: [src/components/EmailCaptureModal.tsx, src/index.css, README.md]
tech_stack:
  added: []
  patterns: [conditional image render with aria-hidden for decorative images, public/ path for developer-supplied assets]
key_files:
  modified:
    - src/components/EmailCaptureModal.tsx
    - src/index.css
    - README.md
decisions:
  - Conditional render {MODAL_IMAGE_SRC && <img>} ensures no broken image box when config is empty string
  - alt="" with aria-hidden="true" is correct pattern for decorative marketing images (adds no semantic information)
  - Image placed between close button and headline per plan spec
  - CSS rule added immediately before .capture-modal__headline block (logical ordering)
  - README section placed after "Enable Beehiiv" section — same documentation tier
metrics:
  duration: "~5 minutes"
  completed: "2026-04-06"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 3
---

# Phase 21 Plan 02: Marketing Image Support in Modal Summary

**One-liner:** Conditional marketing image rendering above modal headline with supporting CSS and full README documentation for image/copy customization.

## What Was Built

### Task 21-02-01: Conditional image in modal JSX and CSS
- Inserted `{MODAL_IMAGE_SRC && <img className="capture-modal__image" src={MODAL_IMAGE_SRC} alt="" aria-hidden="true" />}` between the close button and the headline paragraph in `EmailCaptureModal.tsx`
- `MODAL_IMAGE_SRC` was already defined and exported by Plan 01 — no new constant needed
- Added `.capture-modal__image` CSS rule to `src/index.css` immediately before `.capture-modal__headline`: `width: 100%`, `border-radius: 8px`, `display: block`, `margin-bottom: 4px`
- When `MODAL_IMAGE_SRC = ''` (default), no `<img>` element is rendered — no broken image box
- Commit: `d3c283d`

### Task 21-02-02: README documentation
- Added "Customize email modal" section to `README.md` after the existing "Enable Beehiiv email capture" section
- Section contains two subsections: "Add a marketing image" (3-step instructions, 688px dimension recommendation) and "Update headline and body copy" (shows `COPY['act1']` entry, lists all other trigger contexts)
- Documents file path (`src/components/EmailCaptureModal.tsx`) and config block name ("Marketing config")
- Commit: `c2fe750`

## Acceptance Criteria

- [x] When `MODAL_IMAGE_SRC` is set to a valid path, the image renders above the headline in the modal
- [x] When `MODAL_IMAGE_SRC` is empty string, no `<img>` element is rendered (no broken image box)
- [x] Image has `alt=""` and `aria-hidden="true"` for accessibility (decorative image)
- [x] `.capture-modal__image` CSS rule sets `width: 100%`, `border-radius: 8px`, `display: block`
- [x] README.md contains "Customize email modal" section with image and copy instructions
- [x] README documents recommended 688px width and 16:9 / 3:1 aspect ratio
- [x] README shows the file path (`src/components/EmailCaptureModal.tsx`) and config block name
- [x] `npm run build` passes with no TypeScript errors

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- `MODAL_IMAGE_SRC = ''` remains empty by default — this is intentional. The README now fully documents how to set it. No broken rendering occurs when empty (conditional render).

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes. The `MODAL_IMAGE_SRC` constant is developer-controlled source code (not user input), consistent with the threat model assessment in the plan.

## Self-Check: PASSED

- FOUND: src/components/EmailCaptureModal.tsx (conditional image JSX at line 74)
- FOUND: src/index.css (.capture-modal__image rule at line 1088)
- FOUND: README.md ("Customize email modal" section at line 50)
- FOUND: commit d3c283d (image JSX + CSS)
- FOUND: commit c2fe750 (README docs)
