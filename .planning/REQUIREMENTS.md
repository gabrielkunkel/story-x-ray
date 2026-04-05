# Story X-Ray — Requirements

## Milestone: v1.4 PWA Install Prompt
**Goal:** Ensure the app meets Chrome's full installability criteria and guide first-time users to install it, with progressive re-prompting for users who dismiss.

---

## PWA Installability (PWA)

- [ ] **PWA-01**: The web app manifest includes at least one icon with `purpose: "maskable"` so Chrome's install criteria are fully met
- [ ] **PWA-02**: `beforeinstallprompt` fires in Chrome during local dev and production build — verified manually

## Install Prompt (INSTALL)

- [ ] **INSTALL-01**: On Chrome, the install prompt only appears when the browser has fired the `beforeinstallprompt` event (i.e., the app is actually installable)
- [ ] **INSTALL-02**: The install prompt is first shown after the user creates their first story — not on first load
- [ ] **INSTALL-03**: The prompt is a simple callout that points to the Chrome URL bar install button and briefly explains the benefit (add to desktop or apps folder)
- [ ] **INSTALL-04**: Dismissing the prompt saves the timestamp to localStorage; the prompt re-appears after 3 days, then 1 week, then 1 month — after which it stops appearing
- [ ] **INSTALL-05**: Once the user installs the app (browser fires `appinstalled` event), the prompt is permanently suppressed and never shown again
- [ ] **INSTALL-06**: On non-Chrome browsers, no install prompt or install-related messaging appears

---

## Deferred (Future Milestones)
- Safari / iOS "Add to Home Screen" guidance
- In-app install instructions for Firefox / Edge
- Post-install onboarding or welcome screen

## Out of Scope for v1.4
- Forcing or gating the app behind installation
- Modifying the PWA service worker strategy (already handled by vite-plugin-pwa)
- Install analytics or tracking

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| PWA-01 | Phase 18 | Pending |
| PWA-02 | Phase 18 | Pending |
| INSTALL-01 | Phase 18 | Pending |
| INSTALL-02 | Phase 18 | Pending |
| INSTALL-03 | Phase 18 | Pending |
| INSTALL-04 | Phase 18 | Pending |
| INSTALL-05 | Phase 18 | Pending |
| INSTALL-06 | Phase 18 | Pending |
