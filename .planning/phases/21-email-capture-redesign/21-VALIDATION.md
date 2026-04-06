---
phase: 21
slug: email-capture-redesign
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 21 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — no vitest/jest installed |
| **Config file** | none |
| **Quick run command** | `npm run build` (TypeScript compile gate) |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + manual browser check
- **Before `/gsd-verify-work`:** Build must be green + all manual checks passed
- **Max feedback latency:** 10 seconds (build only)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|--------|
| 21-01-01 | 01 | 1 | CAPTURE-01 | — | N/A | manual | `npm run build` | ⬜ pending |
| 21-01-02 | 01 | 1 | CAPTURE-02 | — | Session flag prevents double-show | manual | `npm run build` | ⬜ pending |
| 21-01-03 | 01 | 1 | CAPTURE-04 | — | N/A | manual | `npm run build` | ⬜ pending |
| 21-02-01 | 02 | 1 | CAPTURE-03 | — | N/A | manual | `npm run build` | ⬜ pending |
| 21-02-02 | 02 | 1 | CAPTURE-05 | — | N/A | manual | `npm run build` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework installation needed — `npm run build` is the TypeScript compile gate.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Modal fires after any 4 beats filled (not just Act I) | CAPTURE-01 | No test framework | Fill beats in different acts (e.g. 2 Act I + 1 Act IIA + 1 Act IIB), verify modal appears |
| Modal fires exactly once per session | CAPTURE-02 | sessionStorage requires browser | Fill 4 beats → dismiss modal → fill more beats → verify modal does NOT reappear |
| Modal does NOT fire if email already submitted | CAPTURE-02 | localStorage state | Submit email → reload page → fill 4+ beats → verify modal stays hidden |
| Marketing image renders above headline when configured | CAPTURE-03 | Visual check | Set `MODAL_IMAGE_SRC` to a test image path → fill 4 beats → verify image appears above headline |
| Modal renders normally when image path is empty/null | CAPTURE-03 | Visual check | Set `MODAL_IMAGE_SRC = ''` → verify no broken image element |
| Headline and body live in one constant | CAPTURE-04 | Code review | Confirm single source of truth in `EmailCaptureModal.tsx` or `src/config/emailCapture.ts` |
| README explains image + copy updates | CAPTURE-05 | Documentation review | Read README "Customize email modal" section — steps must be self-contained |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
