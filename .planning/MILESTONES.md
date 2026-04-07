# Story X-Ray — Milestones

## v1.5 — Stories Browser & Email Capture

**Shipped:** 2026-04-06
**Phases:** 19–21 (3 phases)
**Plans:** 4 total
**Commits:** d597ace → ce2383a (16 commits)
**Files changed:** 5 source files (+188/-15 lines)

### Key Accomplishments

1. **PWA console warning eliminated** — Removed `e.preventDefault()` from `beforeinstallprompt`; callout continues to work correctly
2. **Story browser on StartPage** — All saved stories listed by recency; click to open, delete with confirmation; hidden when no stories exist
3. **Smarter email trigger** — 4-beat threshold across all 16 steps replaces Act I–only gate
4. **Configurable modal copy** — Single `COPY` + `MODAL_IMAGE_SRC` config block at top of `EmailCaptureModal.tsx`
5. **Marketing image support** — Conditional `<img>` render above headline with correct accessibility attributes
6. **Developer documentation** — README "Customize email modal" section with step-by-step instructions

### Known Tech Debt

- Phases 19 & 20 executed outside GSD executor — no SUMMARY.md, VERIFICATION.md, or VALIDATION.md for these phases
- Phase 21 `nyquist_compliant: false` — manual-only validation; no automated test framework in project

[Archive](.planning/milestones/v1.5-ROADMAP.md)

---

## v1.4 — PWA Install Prompt

**Shipped:** 2026-04-06
**Phases:** 18 (1 phase)
**Plans:** 2 total

### Key Accomplishments

1. Maskable icon added to Vite manifest — Chrome PWA installability criteria met
2. Chrome-only inline install callout — points to URL bar, no native `prompt()` call
3. Progressive dismiss cooldown: 3d → 7d → 30d → permanent suppress
4. Permanent suppress after `appinstalled` event fires

[Archive](.planning/milestones/v1.4-ROADMAP.md)

---

## v1.3 — Export Polish & Card UX

**Shipped:** 2026-04-05
**Phases:** 15–17 (3 phases)
**Plans:** 4 total

### Key Accomplishments

1. jsPDF + autoTable PDF download (portrait summary + landscape full scores)
2. Single "Export ▾" dropdown replacing 4 individual export buttons
3. List view: dot hidden on wide screens when excerpt visible; excerpt right-aligned

[Archive](.planning/milestones/v1.3-ROADMAP.md)

---

## v1.2 — Story Identity & Export

**Shipped:** 2026-04-05
**Phases:** 11–14 (4 phases)
**Plans:** 4 total

### Key Accomplishments

1. Story title, author, genre in board header (localStorage persistent)
2. PDF export via browser print
3. Fountain screenplay export
4. List view cards full-width with beat excerpt inline

---

## v1.1 — Writer Experience Polish

**Shipped:** 2026-04-05
**Phases:** 9–10 (2 phases)
**Plans:** 4 total

### Key Accomplishments

1. View toggle: 4-column board ↔ single-column list
2. Beat text preview toggle — italic ~80-char preview on every card
3. 2–3 fiction examples per step in the side form editor

---

## v1.0 — MVP

**Shipped:** 2026-04-04
**Phases:** 1–8 (8 phases)

### Key Accomplishments

1. 16-card board with 4-column act layout and card editor
2. Actual vs target scoring with 4 dimensions + delta readout
3. Waveform line chart (target vs actual)
4. Rule-based diagnostics
5. JSON + Markdown + example story
6. Email capture via Beehiiv (triggered, not gated)
7. PWA installable and offline-capable
