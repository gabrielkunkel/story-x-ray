import type { Story } from '../types/story'

interface Props {
  story: Story
}

const DIMENSION_LABELS: Record<string, string> = {
  connection: 'Connection',
  pressure:   'Pressure',
  hope:       'Hope',
  stability:  'Stability',
}

const DIMENSIONS = ['connection', 'pressure', 'hope', 'stability'] as const

const ACT_LABELS: Record<string, string> = {
  I:   'Act I',
  IIA: 'Act IIA',
  IIB: 'Act IIB',
  III: 'Act III',
}

export default function PrintLayout({ story }: Props) {
  const exportDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const metaParts = [
    story.author || null,
    story.genre  || null,
    `Exported ${exportDate}`,
  ].filter(Boolean).join('  ·  ')

  return (
    <div className="print-layout">
      <div className="print-header">
        <h1 className="print-title">{story.title}</h1>
        {metaParts && <p className="print-meta">{metaParts}</p>}
        <hr className="print-hr" />
      </div>
      <div className="print-steps">
        {story.steps.map(step => {
          const delta = (dim: typeof DIMENSIONS[number]) =>
            step.actualScores[dim] - step.targetScores[dim]

          return (
            <div key={step.stepNumber} className="print-step">
              <div className="print-step__head">
                <span className="print-step__num">
                  {String(step.stepNumber).padStart(2, '0')}
                </span>
                <span className="print-step__act">{ACT_LABELS[step.act]}</span>
                <span className="print-step__label">{step.label}</span>
              </div>
              {step.beatText.trim() && (
                <p className="print-step__beat">{step.beatText.trim()}</p>
              )}
              {step.notes.trim() && (
                <p className="print-step__notes">{step.notes.trim()}</p>
              )}
              <table className="print-step__scores">
                <thead>
                  <tr>
                    <th>Dimension</th>
                    <th>Actual</th>
                    <th>Target</th>
                    <th>Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {DIMENSIONS.map(dim => (
                    <tr key={dim}>
                      <td>{DIMENSION_LABELS[dim]}</td>
                      <td>{step.actualScores[dim]}</td>
                      <td>{step.targetScores[dim]}</td>
                      <td className={
                        delta(dim) > 0 ? 'print-delta--above'
                        : delta(dim) < 0 ? 'print-delta--below'
                        : ''
                      }>
                        {delta(dim) > 0 ? `+${delta(dim)}` : delta(dim) === 0 ? '—' : delta(dim)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </div>
  )
}
