---
phase: 21
slug: email-capture-redesign
status: verified
threats_open: 0
asvs_level: 1
created: 2026-04-06
---

# Phase 21 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Browser ↔ Source Code | Marketing config constants (`MODAL_IMAGE_SRC`, `COPY`) are set in source and bundled at build time — not runtime user input | Static strings, no user data |
| Browser ↔ sessionStorage | Modal shown-state flag (`sxr:cap:act1`) read/written by the app | Boolean flag, no PII |
| Browser ↔ localStorage | Email submission flag (`sxr:cap:submitted`) read/written by the app | Boolean flag, no PII |
| Browser ↔ Image Origin | Marketing image loaded from configured path (recommended: same origin via `public/`) | Image bytes only |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-21-01 | Tampering | sessionStorage `sxr:cap:act1` | accept | No security impact — modal is non-gated marketing UI, not access control. User forcing/suppressing display has no security consequence. | closed |
| T-21-02 | Tampering | localStorage `sxr:cap:submitted` | accept | Desired behavior if user wants to resubscribe. No gating, no sensitive data exposed. | closed |
| T-21-03 | Tampering | Beat count trigger (DevTools) | accept | Modal is helpful, not harmful. Gaming threshold to show modal early has no security consequence. | closed |
| T-21-04 | Information Disclosure | `MODAL_IMAGE_SRC` external URL | accept | Constant is developer-controlled source code, not user input. README recommends local `public/` paths. No user data sent to image origin. | closed |
| T-21-05 | Availability | Large marketing image | accept | Developer chooses the image. README recommends 688px width to keep file size reasonable. No user data at risk. | closed |
| T-21-06 | Spoofing | Image 404 broken image | mitigate | Conditional render `{MODAL_IMAGE_SRC && <img />}` ensures no `<img>` element when path is empty string. README documents verifying file exists before shipping. | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-21-01 | T-21-01 | sessionStorage manipulation has zero security impact — modal is marketing-only, no auth or data gating | Plan threat model | 2026-04-06 |
| AR-21-02 | T-21-02 | localStorage clear is intentionally benign — allows resubscription, no sensitive data exposure | Plan threat model | 2026-04-06 |
| AR-21-03 | T-21-03 | Beat count can be gamed via DevTools; modal is helpful not harmful — no security consequence | Plan threat model | 2026-04-06 |
| AR-21-04 | T-21-04 | MODAL_IMAGE_SRC is source-code-only, developer-controlled; external URL risk is negligible and documented | Plan threat model | 2026-04-06 |
| AR-21-05 | T-21-05 | Image size is developer choice; no user data at risk; README provides dimension guidance | Plan threat model | 2026-04-06 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-04-06 | 6 | 6 | 0 | gsd-secure-phase (auto — all Low/Low, threats_open: 0) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-04-06
