---
phase: 23
slug: global-ui-scale
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-08
---

# Phase 23 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected — no pytest.ini, jest.config.*, vitest.config.*, or tests/ directory found |
| **Config file** | None |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + visual check in browser
- **Before `/gsd-verify-work`:** Full build green + visual inspection confirming all 4 SCALE criteria
- **Max feedback latency:** ~10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 23-01-01 | 01 | 1 | SCALE-01 | — | N/A | manual | `npm run build` (TypeScript gate) | N/A | ⬜ pending |
| 23-01-02 | 01 | 1 | SCALE-02 | — | N/A | manual | `npm run build` | N/A | ⬜ pending |
| 23-01-03 | 01 | 1 | SCALE-03 | — | N/A | manual + build | `npm run build` (WaveformGraph.tsx JSX) | ✅ | ⬜ pending |
| 23-01-04 | 01 | 1 | SCALE-04 | — | N/A | manual | `npm run build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*None — Existing infrastructure covers all phase requirements.*

All SCALE requirements are purely visual/CSS. TypeScript compile (`npm run build`) is sufficient for the single JSX change in WaveformGraph.tsx.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Root font-size is ~17px, body text more readable | SCALE-01 | CSS visual — no automated check for rendered readability | `npm run dev`, inspect `:root` font-size in browser devtools, verify body text comfort |
| Card padding, form controls, textarea scale proportionally | SCALE-02 | Visual balance check | Open app, inspect cards, inputs, textarea — nothing cramped or misaligned |
| Chart labels/legend legible, no overflow or clip | SCALE-03 | Visual legibility | Navigate to waveform graph, verify tick labels render without clipping at new scale |
| Sidebar width and spacing visually balanced | SCALE-04 | Visual proportion check | Verify sidebar ~350px, content area feels balanced, nothing crowded or sparse |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
