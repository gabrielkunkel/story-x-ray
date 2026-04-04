import type { Dimension } from '../types/story'

const DIMENSION_LABELS: Record<Dimension, string> = {
  connection: 'Connection',
  pressure:   'Pressure',
  hope:       'Hope',
  stability:  'Stability',
}

interface Props {
  dimension: Dimension
  actual: number        // 0 = unset, 1–10 = scored
  target: number        // always 1–10 from static config
  onChange: (value: number) => void
}

export default function ScoreInput({ dimension, actual, target, onChange }: Props) {
  const isSet = actual > 0
  const delta = isSet ? actual - target : null

  let deltaClass = 'score-delta'
  if (delta !== null) {
    if (delta > 0) deltaClass += ' score-delta--above'
    else if (delta < 0) deltaClass += ' score-delta--below'
    else deltaClass += ' score-delta--exact'
  }

  return (
    <div className="score-input">
      <span className="score-input__label">{DIMENSION_LABELS[dimension]}</span>

      <div className="score-input__controls">
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={actual}
          onChange={e => onChange(Number(e.target.value))}
          className="score-input__slider"
          aria-label={`${DIMENSION_LABELS[dimension]} score`}
        />
        <span className="score-input__actual">
          {isSet ? actual : '—'}
        </span>
      </div>

      <div className="score-input__comparison">
        <span className="score-input__target" title="Target score">
          T: {target}
        </span>
        {delta !== null && (
          <span className={deltaClass}>
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </div>
    </div>
  )
}
