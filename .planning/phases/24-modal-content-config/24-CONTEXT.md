# Phase 24: Modal Content Config - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Extract all email modal copy out of `EmailCaptureModal.tsx` into a standalone `src/config/emailModal.ts` config file. A developer must be able to change every visible word, image, and CTA by editing only the config file and redeploying. The modal component handles layout, timing, dismissal, and submission — nothing else.

Requirements in scope: MODAL-01, MODAL-02, MODAL-03, MODAL-04, MODAL-05.

</domain>

<decisions>
## Implementation Decisions

### Config file structure
- **D-01:** `src/config/emailModal.ts` exports a single typed config object (not default export — named export `emailModalConfig` for clarity).
- **D-02:** Fields split into **global** (same across all contexts) and **per-context** (vary by trigger):
  - Global: `imageSrc: string`, `ctaText: string`, `footer?: string`
  - Per-context (keyed by `CaptureContext`): `headline: string`, `subtitle: string`, `bullets: string[]`
- **D-03:** The existing `MODAL_IMAGE_SRC` constant and `COPY` record in `EmailCaptureModal.tsx` both migrate to this config file. No hardcoded copy remains in the component.

### Rich content format (MODAL-03)
- **D-04:** Bullets are `string[]` — a plain array of strings rendered as `<ul><li>` items. No HTML strings, no markdown parser. Safe by default, no `dangerouslySetInnerHTML`.
- **D-05:** `subtitle` is a plain string rendered as `<p>`. Rich formatting is achieved through structured fields (bullets), not embedded HTML.
- **D-06:** `footer` (optional) is a plain string. If empty or absent, the footer element is not rendered.

### Modal UI layout
- **D-07:** The modal renders fields in this order: image (if `imageSrc`), headline, subtitle, bullets (if non-empty), form, footer (if present). This extends the current layout without breaking it.
- **D-08:** The existing `body` field in `COPY` maps to `subtitle` in the new config. The field is renamed for alignment with ROADMAP language.
- **D-09:** CTA button text comes from `ctaText` (global). Currently "Send me the pack" — this value moves to the config file as-is.

### Claude's Discretion
- TypeScript interface naming inside the config file (`ModalContextCopy`, `EmailModalConfig`, etc.)
- Whether to co-locate the `CaptureContext` type in the config file or keep it exported from `EmailCaptureModal.tsx`
- Exact bullet rendering styling (CSS class names, spacing)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §v1.6 Requirements → Email Modal — MODAL-01 through MODAL-05 (full acceptance criteria)

### Existing copy and component
- `src/components/EmailCaptureModal.tsx` — entire file; contains the `COPY` record, `MODAL_IMAGE_SRC`, `CaptureContext` type, and current modal render logic. All copy moves out of here.

### No external specs
No external design docs — requirements fully captured in decisions above and REQUIREMENTS.md.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CaptureContext` type (`'act1' | 'export' | 'diagnostics' | 'examples' | 'early-access'`) — already exported from `EmailCaptureModal.tsx`; planner decides whether to move it to the config file or leave it in place
- `MODAL_IMAGE_SRC` constant (line 11) — moves to config as `imageSrc`
- `COPY` record (lines 13–34) — moves to config as per-context entries with `headline`, `subtitle`, `bullets`

### Established Patterns
- Config files don't exist yet in `src/config/` — this is the first; the pattern should be clean and simple (no barrel files needed for one file)
- TypeScript is used throughout; the config file must be `.ts` with explicit types, not `.js`

### Integration Points
- `EmailCaptureModal.tsx` imports `COPY` and `MODAL_IMAGE_SRC` locally — after Phase 24, it imports from `src/config/emailModal.ts` instead
- `CaptureContext` type is used by `EmailCaptureModal` and its callers — if moved to config file, callers may need import path updates
- README.md (root) — MODAL-05 requires a "Customize email modal" section documenting fields, rich text usage, and deploy workflow

</code_context>

<specifics>
## Specific Ideas

- The comment block at the top of `EmailCaptureModal.tsx` (lines 6–10) already says "Edit these constants to change the email capture modal content." That instruction moves to README.md in Phase 24, with a pointer comment left in the component directing developers to the config file.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 24-modal-content-config*
*Context gathered: 2026-04-08*
