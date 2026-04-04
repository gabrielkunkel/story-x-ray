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

// Act boundary reference lines between steps
const ACT_BOUNDARIES = [4.5, 8.5, 12.5]

interface TooltipEntry {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: number
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const actuals = payload.filter(p => p.name.startsWith('a') && p.value != null)
  if (!actuals.length) return null
  const nameMap: Record<string, string> = {
    aC: 'Connection',
    aP: 'Pressure',
    aH: 'Hope',
    aS: 'Stability',
  }
  return (
    <div className="waveform-tooltip">
      <div className="waveform-tooltip__step">Step {label}</div>
      {actuals.map(p => (
        <div key={p.name} className="waveform-tooltip__row" style={{ color: p.color }}>
          {nameMap[p.name] ?? p.name}: {p.value}
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

export default function WaveformGraph({ story, onStepHover }: Props) {
  const data = buildChartData(story)

  function handleMouseMove(e: { activeLabel?: string | number }) {
    if (e?.activeLabel != null) {
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

          {/* Actual lines — solid, gap where unset */}
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
