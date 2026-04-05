# Phase 4 — Waveform Graph
**Goal:** A live-updating line chart shows all 4 dimensions across 16 steps (target dashed, actual solid). Hovering a chart point highlights the corresponding card.

## Architecture

**Library:** Recharts 3.x (React 19 compatible, already installed)

**Data shape** fed to Recharts:
```ts
interface ChartPoint {
  step: number          // 1–16 (X axis)
  label: string         // e.g. "Safe Baseline"
  act: string           // 'I' | 'IIA' | 'IIB' | 'III'
  // actual: null when score is 0 (unset) → gap in line
  aC: number | null     // actual connection
  aP: number | null     // actual pressure
  aH: number | null     // actual hope
  aS: number | null     // actual stability
  // targets always present
  tC: number            // target connection
  tP: number            // target pressure
  tH: number            // target hope
  tS: number            // target stability
}
```

**Dimension colors:**
| Dimension | Color |
|---|---|
| connection | `#3b82f6` (blue) |
| pressure | `#ef4444` (red) |
| hope | `#22c55e` (green) |
| stability | `#f59e0b` (amber) |

Target lines: same color, `strokeDasharray="5 4"`, `strokeOpacity={0.45}`, no dot.
Actual lines: solid, `strokeWidth={2}`, active dot on hover.

**Hover → card highlight:** `LineChart.onMouseMove` fires with `activeLabel` (step number as string). Call `onStepHover(stepNum)` prop → parent sets `activeStepNumber`. On `onMouseLeave` call `onStepHover(null)`.

**Layout:** Graph sits in a collapsible panel below `workspace__body`, fixed height 200px. A toggle button in `BoardHeader` shows/hides it.

---

## Task 1 — WaveformGraph Component
**File:** `src/components/WaveformGraph.tsx` *(create)*

```tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { Story } from '../types/story'

const COLORS = {
  connection: '#3b82f6',
  pressure:   '#ef4444',
  hope:       '#22c55e',
  stability:  '#f59e0b',
}

interface ChartPoint {
  step: number
  label: string
  act: string
  aC: number | null
  aP: number | null
  aH: number | null
  aS: number | null
  tC: number
  tP: number
  tH: number
  tS: number
}

function buildChartData(story: Story): ChartPoint[] {
  return story.steps.map(s => ({
    step: s.stepNumber,
    label: s.label,
    act: s.act,
    aC: s.actualScores.connection > 0 ? s.actualScores.connection : null,
    aP: s.actualScores.pressure > 0   ? s.actualScores.pressure   : null,
    aH: s.actualScores.hope > 0       ? s.actualScores.hope       : null,
    aS: s.actualScores.stability > 0  ? s.actualScores.stability  : null,
    tC: s.targetScores.connection,
    tP: s.targetScores.pressure,
    tH: s.targetScores.hope,
    tS: s.targetScores.stability,
  }))
}

// Act boundary reference lines at steps 4→5, 8→9, 12→13
const ACT_BOUNDARIES = [4.5, 8.5, 12.5]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: number
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  // Only show actual scores (keys starting with 'a')
  const actuals = payload.filter(p => p.name.startsWith('a'))
  if (!actuals.length) return null
  return (
    <div className="waveform-tooltip">
      <div className="waveform-tooltip__step">Step {label}</div>
      {actuals.map(p => (
        <div key={p.name} className="waveform-tooltip__row" style={{ color: p.color }}>
          {p.name === 'aC' ? 'Connection' :
           p.name === 'aP' ? 'Pressure' :
           p.name === 'aH' ? 'Hope' : 'Stability'}: {p.value}
        </div>
      ))}
    </div>
  )
}

interface Props {
  story: Story
  activeStepNumber: number | null
  onStepHover: (stepNumber: number | null) => void
}

export default function WaveformGraph({ story, activeStepNumber, onStepHover }: Props) {
  const data = buildChartData(story)

  function handleMouseMove(e: { activeLabel?: string }) {
    if (e?.activeLabel) {
      onStepHover(Number(e.activeLabel))
    }
  }

  return (
    <div className="waveform-graph">
      <ResponsiveContainer width="100%" height={180}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, bottom: 4, left: 0 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => onStepHover(null)}
        >
          <XAxis
            dataKey="step"
            tick={{ fontSize: 10, fill: 'var(--text)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{ fontSize: 10, fill: 'var(--text)' }}
            tickLine={false}
            axisLine={false}
            width={20}
          />
          <Tooltip content={<CustomTooltip />} />

          {ACT_BOUNDARIES.map(x => (
            <ReferenceLine
              key={x}
              x={x}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
          ))}

          {/* Target lines — dashed, lower opacity */}
          <Line dataKey="tC" stroke={COLORS.connection} strokeDasharray="5 4" strokeOpacity={0.4} dot={false} strokeWidth={1.5} name="tC" connectNulls />
          <Line dataKey="tP" stroke={COLORS.pressure}   strokeDasharray="5 4" strokeOpacity={0.4} dot={false} strokeWidth={1.5} name="tP" connectNulls />
          <Line dataKey="tH" stroke={COLORS.hope}       strokeDasharray="5 4" strokeOpacity={0.4} dot={false} strokeWidth={1.5} name="tH" connectNulls />
          <Line dataKey="tS" stroke={COLORS.stability}  strokeDasharray="5 4" strokeOpacity={0.4} dot={false} strokeWidth={1.5} name="tS" connectNulls />

          {/* Actual lines — solid */}
          <Line dataKey="aC" stroke={COLORS.connection} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="aC" connectNulls={false} />
          <Line dataKey="aP" stroke={COLORS.pressure}   strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="aP" connectNulls={false} />
          <Line dataKey="aH" stroke={COLORS.hope}       strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="aH" connectNulls={false} />
          <Line dataKey="aS" stroke={COLORS.stability}  strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="aS" connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>

      <div className="waveform-legend">
        {Object.entries(COLORS).map(([dim, color]) => (
          <span key={dim} className="waveform-legend__item">
            <span className="waveform-legend__dot" style={{ background: color }} />
            {dim}
          </span>
        ))}
      </div>
    </div>
  )
}
```

**CSS:**
```css
/* ── Waveform Graph ───────────────────────────────────────── */

.waveform-graph {
  padding: 12px 16px 8px;
  border-top: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
}

.waveform-legend {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 4px;
}

.waveform-legend__item {
  display: flex;
  align-items: center;
  gap: 5px;
  font: 500 11px/1 var(--sans);
  color: var(--text);
  text-transform: capitalize;
}

.waveform-legend__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.waveform-tooltip {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  box-shadow: var(--shadow-sm);
}

.waveform-tooltip__step {
  font-weight: 700;
  color: var(--text-h);
  margin-bottom: 4px;
}

.waveform-tooltip__row {
  font: 500 11px/1.6 var(--mono);
}
```

**Acceptance:** Chart renders with 8 lines (4 dashed targets, 4 solid actuals). Actual lines have gaps where scores are 0. Act boundaries show as faint vertical dashes at steps 4.5, 8.5, 12.5. Tooltip shows step and actual scores on hover.

---

## Task 2 — BoardHeader: add graph toggle
**File:** `src/components/BoardHeader.tsx` *(edit)*

Add a `showGraph` / `onToggleGraph` prop to show a toggle button.

```tsx
import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  showGraph: boolean
  onToggleGraph: () => void
}

export default function BoardHeader({ title, showGraph, onToggleGraph }: Props) {
  const navigate = useNavigate()

  return (
    <header className="board-header">
      <button className="btn-ghost board-header__back" onClick={() => navigate('/')}>
        ←
      </button>
      <h1 className="board-header__title">{title}</h1>
      <button
        className={`btn-ghost board-header__graph-toggle${showGraph ? ' board-header__graph-toggle--active' : ''}`}
        onClick={onToggleGraph}
        title={showGraph ? 'Hide waveform' : 'Show waveform'}
      >
        ∿
      </button>
    </header>
  )
}
```

**Extra CSS:**
```css
.board-header__graph-toggle {
  margin-left: auto;
  font-size: 18px;
  padding: 4px 10px;
  flex-shrink: 0;
}

.board-header__graph-toggle--active {
  color: var(--accent);
}
```

**Acceptance:** Toggle button (∿) appears in header. Active state is purple. Clicking it calls `onToggleGraph`.

---

## Task 3 — StoryWorkspacePage: wire graph
**File:** `src/pages/StoryWorkspacePage.tsx` *(edit)*

Add `showGraph` state (default `true`), pass new props to `BoardHeader`, render `WaveformGraph` conditionally below `workspace__body`. The graph's `onStepHover` sets `activeStepNumber`.

**New state:**
```tsx
const [showGraph, setShowGraph] = useState(true)
```

**Updated BoardHeader call:**
```tsx
<BoardHeader
  title={story.title}
  showGraph={showGraph}
  onToggleGraph={() => setShowGraph(v => !v)}
/>
```

**WaveformGraph below workspace__body:**
```tsx
{showGraph && (
  <WaveformGraph
    story={story}
    activeStepNumber={activeStepNumber}
    onStepHover={setActiveStepNumber}
  />
)}
```

**Import to add:**
```tsx
import WaveformGraph from '../components/WaveformGraph'
```

**Acceptance:** Graph visible by default. Toggle button hides/shows it. Hovering a chart point highlights the matching card. Scoring a card updates the chart line instantly.

---

## Task 4 — CSS additions
**File:** `src/index.css` *(append)*

Append the CSS blocks from Tasks 1 and 2:
1. `/* ── Waveform Graph ── */`
2. `.board-header__graph-toggle` additions

---

## Commit Instructions
```
git add src/components/WaveformGraph.tsx src/components/BoardHeader.tsx \
        src/pages/StoryWorkspacePage.tsx src/index.css package.json package-lock.json
git commit -m "feat: Phase 4 — waveform graph with target/actual lines and card hover sync"
```

---

## UAT Checklist
- [ ] Graph visible on workspace by default (toggle on)
- [ ] 4 dashed lines (targets) and 4 solid lines (actuals) rendered
- [ ] Actual lines show gaps where scores are still 0 (unset)
- [ ] Hovering a point on the chart highlights the corresponding card on the board
- [ ] Setting a score on a card updates the chart immediately (live)
- [ ] Toggle button (∿) in header hides/shows the graph
- [ ] Act boundaries visible as faint vertical lines at steps 4/5, 8/9, 12/13
- [ ] Tooltip shows step number and actual scores for hovered point
- [ ] `tsc --noEmit` — 0 errors
