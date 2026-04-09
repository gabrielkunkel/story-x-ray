# Requirements: Story X-Ray

**Defined:** 2026-04-08
**Core Value:** A 16-step architecture board that helps writers see, construct, and refine the complete shape of their story

## v1.6 Requirements

Requirements for the Polish & Content Config milestone.

### Email UX

- [x] **EMAIL-01**: Email modal does not appear while user is actively typing in a beat field
- [x] **EMAIL-02**: Email modal appears after user stops typing in a beat field for 10 seconds (when 4-beat threshold is met)
- [x] **EMAIL-03**: Email modal appears when user clicks away from (blurs) a beat field that completed the 4-beat threshold

### UI Scale

- [x] **SCALE-01**: App root font size is ~17px so text is more readable at default zoom
- [x] **SCALE-02**: Card padding, form controls, and textarea height scale proportionally with the new font size
- [x] **SCALE-03**: Chart labels, legend, and stroke weight remain legible at the new scale without overflow or clipping
- [x] **SCALE-04**: Sidebar width and overall spacing maintain visual balance at the new scale

### Modal Config

- [x] **MODAL-01**: Email modal copy lives in a dedicated config file (`src/config/emailModal.ts`)
- [x] **MODAL-02**: Config file exposes: title, subtitle, CTA button text, bullet list, image src, and optional footer text
- [x] **MODAL-03**: Modal body supports rich/formatted content (HTML or safe structured equivalent) not limited to plain strings
- [x] **MODAL-04**: `EmailCaptureModal` component reads from config and handles only layout, timing, dismissal, and submission logic
- [x] **MODAL-05**: README documents how to edit `src/config/emailModal.ts` — fields, rich text usage, and deploy workflow

## Future Requirements

Features considered but deferred.

### Email UX

- **EMAIL-F01**: Configurable debounce timeout (currently hardcoded at 10s)

### UI Scale

- **SCALE-F01**: User-adjustable UI density / zoom preference persisted to localStorage

## Out of Scope

| Feature | Reason |
|---------|--------|
| Runtime CMS editing of modal copy | File edit + redeploy is sufficient; runtime editing adds unnecessary complexity |
| User-adjustable zoom slider | Out of scope for this milestone; app-level scaling is the goal |
| AI integrations | Explicitly excluded from MVP and all current milestones |
| Cloud sync / accounts | Not in scope until a future milestone |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| EMAIL-01 | Phase 22 | Complete |
| EMAIL-02 | Phase 22 | Complete |
| EMAIL-03 | Phase 22 | Complete |
| SCALE-01 | Phase 23 | Complete |
| SCALE-02 | Phase 23 | Complete |
| SCALE-03 | Phase 23 | Complete |
| SCALE-04 | Phase 23 | Complete |
| MODAL-01 | Phase 24 | Complete |
| MODAL-02 | Phase 24 | Complete |
| MODAL-03 | Phase 24 | Complete |
| MODAL-04 | Phase 24 | Complete |
| MODAL-05 | Phase 24 | Complete |

**Coverage:**
- v1.6 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-08*
*Last updated: 2026-04-07 after roadmap creation*
