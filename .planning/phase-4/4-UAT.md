# Phase 4 UAT — Waveform Graph
**Date:** 2026-04-04
**Status:** Automated checks PASS · Manual browser checks pending

---

## Automated Checks

| Check | Result |
|---|---|
| `tsc --noEmit` | PASS — 0 errors |
| `npm run build` | PASS |
| Recharts: ResponsiveContainer, LineChart, ReferenceLine imported | PASS |
| 8 Line elements (4 target + 4 actual) | PASS |
| Target lines use strokeDasharray | PASS |
| Act boundaries at 4.5, 8.5, 12.5 | PASS |
| onMouseMove handler present | PASS |
| onMouseLeave handler present | PASS |
| Unset scores map to null (gap in line) | PASS |
| connectNulls={false} on all 4 actual lines | PASS |
| CustomTooltip component | PASS |
| Legend rendered | PASS |
| BoardHeader: showGraph + onToggleGraph props | PASS |
| BoardHeader: graph-toggle button | PASS |
| WorkspacePage: showGraph state | PASS |
| WorkspacePage: WaveformGraph imported | PASS |
| WorkspacePage: WaveformGraph rendered | PASS |
| WorkspacePage: onStepHover={setActiveStepNumber} | PASS |
| WorkspacePage: conditional render on showGraph | PASS |

---

## Manual Browser Checks (run `npm run dev`)

| # | Test | Expected | Status |
|---|---|---|---|
| 1 | Open workspace | Waveform graph visible below the board by default | ⬜ |
| 2 | Graph shows 8 lines | 4 dashed (lighter) target lines + 4 solid actual lines | ⬜ |
| 3 | No scores set yet | Actual lines absent or minimal (all zeros = null = gaps) | ⬜ |
| 4 | Set a score on step 1 | Actual line appears at step 1 on chart immediately | ⬜ |
| 5 | Hover chart point | Corresponding card highlights on the board | ⬜ |
| 6 | Hover shows tooltip | Tooltip shows step number + scored dimension values | ⬜ |
| 7 | Mouse leaves chart | Card highlight clears | ⬜ |
| 8 | Click toggle (∿) | Graph hides; button goes non-purple | ⬜ |
| 9 | Click toggle again | Graph reappears | ⬜ |
| 10 | Faint vertical lines | Act boundaries visible at steps 4/5, 8/9, 12/13 | ⬜ |
| 11 | Legend visible | 4 colored dots labeled connection, pressure, hope, stability | ⬜ |
| 12 | Dark mode | Graph renders correctly in dark theme | ⬜ |

---

## Issues Found
_(none — pending browser verification)_
