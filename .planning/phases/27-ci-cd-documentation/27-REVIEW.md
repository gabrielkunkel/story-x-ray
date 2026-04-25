---
phase: 27-ci-cd-documentation
reviewed: 2026-04-24T00:00:00Z
depth: standard
files_reviewed: 2
files_reviewed_list:
  - .github/workflows/deploy.yml
  - README.md
findings:
  critical: 0
  warning: 2
  info: 3
  total: 5
status: issues_found
---

# Phase 27: Code Review Report

**Reviewed:** 2026-04-24
**Depth:** standard
**Files Reviewed:** 2
**Status:** issues_found

## Summary

Two files reviewed: the GitHub Actions deploy workflow and the project README. The workflow is structurally sound — permissions are correctly scoped at the workflow level, build/deploy job separation is appropriate, and all referenced npm scripts (`npm ci`, `npm run build:prod`) exist and resolve correctly in `package.json`. The README is thorough and accurate for the most part.

Two warnings were identified: a `concurrency` configuration that can interrupt active deployments, and a documentation inconsistency in the "Deploy workflow" section where `npm run build` is recommended as a verification step but does not exercise the production environment file. Three informational items cover action version pinning, committed `.env` files, and a redundant phrase.

## Warnings

### WR-01: `cancel-in-progress: true` can interrupt an active deployment mid-flight

**File:** `.github/workflows/deploy.yml:10`
**Issue:** The `concurrency` block sets `cancel-in-progress: true`. This cancels any running workflow when a new push arrives, including the `deploy` job after it has already uploaded the Pages artifact but before `actions/deploy-pages` has applied it. For a two-job pipeline (build then deploy) where the deploy job is a separate runner, a cancellation at the wrong moment can leave GitHub Pages in an indeterminate state until the next successful run completes.

**Fix:** Change `cancel-in-progress` to `false` (or remove it entirely, as `false` is the default). This queues subsequent pushes rather than cancelling an active deploy. The trade-off is a slightly longer feedback loop when pushing in quick succession, which is acceptable for a production Pages deployment.

```yaml
concurrency:
  group: pages
  cancel-in-progress: false
```

---

### WR-02: README "Deploy workflow" section recommends `npm run build` instead of `npm run build:prod`

**File:** `README.md:165`
**Issue:** The inline "Deploy workflow" checklist reads:

```
2. Run `npm run build` to verify no type errors
```

`npm run build` reads `.env` (`VITE_BASE_PATH=/`) while `npm run build:prod` reads `.env.gh-pages` (`VITE_BASE_PATH=/story-x-ray/`). A developer following this checklist will verify TypeScript correctness against the wrong base path. A misconfigured `.env.gh-pages` (e.g., wrong repo name) will only surface on the live deployment, not locally.

**Fix:** Replace the verification command with the production build command:

```markdown
2. Run `npm run build:prod` to verify no type errors against the production environment
```

---

## Info

### IN-01: GitHub Actions are pinned to mutable version tags, not SHA hashes

**File:** `.github/workflows/deploy.yml:21,23,35,48`
**Issue:** All four actions use mutable version tags (`@v4`, `@v3`). If any action's `v4` or `v3` tag is later reassigned to a different commit (intentional update or supply-chain compromise), the workflow will silently change behavior.

```yaml
uses: actions/checkout@v4
uses: actions/setup-node@v4
uses: actions/upload-pages-artifact@v3
uses: actions/deploy-pages@v4
```

**Fix:** For higher supply-chain assurance, pin each action to a specific commit SHA:

```yaml
uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2
```

For a personal/OSS project, this is optional — mutable tags for official `actions/` org actions are widely accepted practice. Flagging for awareness.

---

### IN-02: `.env` is committed intentionally — ensure `.env.example` stays the template of record

**File:** `README.md:50`
**Issue:** The README correctly documents that both `.env` and `.env.gh-pages` are committed because they contain no secrets. However, `.env` is conventionally gitignored, and contributors may instinctively add it to `.gitignore` or overwrite it. The `.env.example` file exists as a template but its relationship to the committed `.env` is not fully explained.

**Fix:** Consider adding a note clarifying that `.env` is intentionally tracked and should not be added to `.gitignore`:

```markdown
> Note: `.env` is intentionally committed to this repository. Do not add it to `.gitignore`.
```

---

### IN-03: Redundant phrasing in README line 77

**File:** `README.md:77`
**Issue:** The sentence "Use `npm run build` to verify the local build locally." contains the redundant phrase "local ... locally."

**Fix:**
```markdown
Use `npm run build` to verify a local build before deploying.
```

---

_Reviewed: 2026-04-24_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
