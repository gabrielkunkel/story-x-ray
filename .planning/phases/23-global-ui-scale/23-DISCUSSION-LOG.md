# Phase 23: Global UI Scale - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the discussion.

**Date:** 2026-04-08
**Phase:** 23-global-ui-scale
**Mode:** discuss
**Areas discussed:** Scaling strategy, Sidebar width, Chart tick size, Board column min-width

## Gray Areas Presented

All 4 gray areas were presented to the user simultaneously as a combined question. The user opted to address all 4 at once via free-text response.

## Decisions Made

### Scaling strategy
| Area | Decision | Confidence |
|------|----------|-----------|
| Root font size | Bump to 17px | Confirmed |
| Typography conversion | Targeted rem conversion for things that should scale | Confirmed |
| Px retention | Borders, hairlines, chart strokes stay px | Confirmed |
| Scope | Targeted pass, not exhaustive cleanup | Confirmed |

### Sidebar width
| Area | Decision | Confidence |
|------|----------|-----------|
| Card editor width | Widen modestly beyond 320px (exact: Claude's discretion ~340–360px) | Confirmed |

### Chart tick size
| Area | Decision | Confidence |
|------|----------|-----------|
| Recharts axis tick fontSize | Bump from 10 to 11 | Confirmed |

### Board column min-width
| Area | Decision | Confidence |
|------|----------|-----------|
| minmax min-width | Increase modestly if cards feel cramped at 17px | Confirmed |

## Corrections Made

No corrections — user provided direct preferences, all accepted as-is.

## Key Quote

"I want the app to feel like a clean, intentional version of Chrome at ~110%, not like random bigger text pasted into the old layout."

"Use rem for things that should scale; keep px for things that should stay crisp."
