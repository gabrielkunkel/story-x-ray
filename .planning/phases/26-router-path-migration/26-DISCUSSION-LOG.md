# Phase 26: Router & Path Migration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-18
**Phase:** 26-router-path-migration
**Areas discussed:** Path audit scope

---

## Path audit scope

| Option | Description | Selected |
|--------|-------------|----------|
| Leave it — Vite handles it | Vite processes index.html and rewrites absolute paths using the configured base. PATH-01 says 'paths Vite would not rewrite' — this one it does. | ✓ |
| Change to relative path | Replace href="/favicon.svg" with href="./favicon.svg" or href="favicon.svg" for explicitness. | |

**User's choice:** Leave index.html paths as-is — Vite handles them during build  
**Notes:** Codebase scan confirmed zero root-absolute paths in .tsx/.ts/.css. Audit is verification only.

---

## Claude's Discretion

- Order of operations (router change vs path audit first)
- Optional inline comment on HashRouter explaining rationale

## Deferred Ideas

None.
