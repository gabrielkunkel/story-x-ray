import type { Diagnostic } from '../utils/diagnostics'

interface Props {
  diagnostics: Diagnostic[]
  onStepClick: (stepNumber: number) => void
  showCaptureCTA: boolean
  onCaptureClick: () => void
}

export default function DiagnosticsPanel({ diagnostics, onStepClick, showCaptureCTA, onCaptureClick }: Props) {
  return (
    <div className="diagnostics-panel">
      {diagnostics.length === 0 ? (
        <p className="diagnostics-panel__empty">No structural warnings.</p>
      ) : (
        <ul className="diagnostics-panel__list">
          {diagnostics.map(d => (
            <li key={d.id} className="diagnostic-card">
              <div className="diagnostic-card__header">
                <span className="diagnostic-card__label">{d.label}</span>
              </div>
              <p className="diagnostic-card__message">{d.message}</p>
              <div className="diagnostic-card__steps">
                {d.stepNumbers.map(n => (
                  <button
                    key={n}
                    className="diagnostic-step-chip"
                    onClick={() => onStepClick(n)}
                  >
                    Step {n}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {showCaptureCTA && (
        <div className="diag-capture-cta">
          <p className="diag-capture-cta__text">Get the structure rescue guide + 5 example story maps — free.</p>
          <button className="btn-secondary diag-capture-cta__btn" onClick={onCaptureClick}>
            Get the pack
          </button>
        </div>
      )}
    </div>
  )
}
