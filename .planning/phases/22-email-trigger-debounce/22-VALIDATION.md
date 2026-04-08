---
phase: 22
slug: email-trigger-debounce
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-08
---

# Phase 22 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no test framework installed in project |
| **Config file** | None |
| **Quick run command** | N/A — no framework installed |
| **Full suite command** | N/A — no framework installed |
| **Estimated runtime** | N/A — manual browser testing only |

---

## Sampling Rate

- **After every task commit:** Manual browser smoke test (modal does not fire mid-typing)
- **After every plan wave:** Full 6-item manual test checklist
- **Before `/gsd-verify-work`:** All 6 manual checklist items must pass
- **Max feedback latency:** ~60 seconds (manual browser test)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 22-01-01 | 01 | 1 | EMAIL-01 | — | Modal does not fire during active typing | manual-only | N/A | N/A | ⬜ pending |
| 22-01-02 | 01 | 1 | EMAIL-02 | — | Modal fires after 10s idle post-threshold | manual-only | N/A | N/A | ⬜ pending |
| 22-01-03 | 01 | 1 | EMAIL-03 | — | Modal fires on qualifying blur outside board | manual-only | N/A | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework to install — all verifications are manual.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Modal does not fire during continuous typing | EMAIL-01 | Requires real browser timing/event interaction | Fill 4 beats; keep typing — modal must NOT appear even after 10s of continuous typing |
| Modal fires after 10s idle post-threshold | EMAIL-02 | Requires real browser timer | Fill 4 beats; stop typing for 10s — modal MUST appear after exactly 10s idle |
| Typing resumes before 10s idle — modal suppressed | EMAIL-02 | Requires real browser timer | Fill 4 beats; stop typing; resume before 10s — modal must NOT appear during resumed typing |
| Modal fires on blur outside board | EMAIL-03 | Requires real browser focus event | Fill 4 beats; click away from app (URL bar or desktop) — modal MUST appear immediately |
| Modal does NOT fire when clicking another story card | EMAIL-03 | relatedTarget detection required | Fill 4 beats; click another story card — modal must NOT appear immediately (timer continues) |
| Session tracking preserved across reload | EMAIL-01/02/03 | Requires real sessionStorage | Reload page after completing steps 1–5 — modal must NOT reappear |

---

## Validation Sign-Off

- [ ] All tasks have manual verify instructions documented
- [ ] Manual test checklist matches all 4 phase Success Criteria
- [ ] No automated tests required (no framework installed; manual is correct path)
- [ ] `nyquist_compliant: true` set in frontmatter when checklist is complete

**Approval:** pending
