# Story X-Ray — Requirements

## Milestone: v1.5 Stories Browser & Email Capture

**Goal:** Give users access to all their saved stories from the start screen, fix the PWA console warning, and make the email capture modal more compelling with a smarter trigger and optional marketing image.

---

## PWA Fix (PWA)

- [ ] **PWA-03**: No "Banner not shown" console warning — `e.preventDefault()` removed from `beforeinstallprompt` handler since `deferredPrompt.prompt()` is never called

---

## Story Browser (STORIES)

- [ ] **STORIES-01**: The start screen shows a list of all stories saved in localStorage, ordered by most recently updated
- [ ] **STORIES-02**: Each story in the list shows its title and last-updated date
- [ ] **STORIES-03**: Clicking a story in the list navigates directly to that story's workspace
- [ ] **STORIES-04**: Each story in the list has a delete action that removes it from localStorage with a confirmation step
- [ ] **STORIES-05**: If no stories exist, the list area is hidden (no empty state required — "New Story" button is the primary action)

---

## Email Capture (CAPTURE)

- [ ] **CAPTURE-01**: The email capture modal triggers after any 4 beats (beatText non-empty) are filled across the whole story — not limited to Act I steps
- [ ] **CAPTURE-02**: Trigger behavior is per-session: shows once per session if email not yet submitted (same as current Act I trigger)
- [ ] **CAPTURE-03**: The email capture modal supports an optional marketing image — a configurable image path in the component source that, when set, renders above the headline
- [ ] **CAPTURE-04**: The email capture modal supports configurable marketing copy — headline and body text are defined in one place in source (not hardcoded inline throughout)
- [ ] **CAPTURE-05**: README.md documents how to update the marketing image and copy (file path, image dimensions, where to edit the strings)

---

## Deferred (Future Milestones)

- IndexedDB migration (localStorage is sufficient for current story count)
- Safari / iOS "Add to Home Screen" guidance
- Post-install onboarding

## Out of Scope for v1.5

- Story search or filtering
- Story sorting options beyond recency
- Cloud sync or multi-device access
- Story duplication or templates

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| PWA-03 | Phase 19 | Pending |
| STORIES-01 | Phase 20 | Pending |
| STORIES-02 | Phase 20 | Pending |
| STORIES-03 | Phase 20 | Pending |
| STORIES-04 | Phase 20 | Pending |
| STORIES-05 | Phase 20 | Pending |
| CAPTURE-01 | Phase 21 | Pending |
| CAPTURE-02 | Phase 21 | Pending |
| CAPTURE-03 | Phase 21 | Pending |
| CAPTURE-04 | Phase 21 | Pending |
| CAPTURE-05 | Phase 21 | Pending |
