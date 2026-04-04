import { STEP_HINTS } from '../data/steps'
import type { StoryStep } from '../types/story'

interface Props {
  step: StoryStep
  onBeatTextChange: (value: string) => void
  onNotesChange: (value: string) => void
}

export default function CardEditor({ step, onBeatTextChange, onNotesChange }: Props) {
  const hint = STEP_HINTS[step.stepNumber]

  return (
    <aside className="card-editor">
      <div className="card-editor__header">
        <span className="card-editor__step-num">Step {step.stepNumber}</span>
        <h2 className="card-editor__label">{step.label}</h2>
      </div>

      <div className="card-editor__purpose">{step.purpose}</div>

      {hint && (
        <details className="card-editor__hint">
          <summary>Writing hint</summary>
          <p>{hint}</p>
        </details>
      )}

      <div className="card-editor__fields">
        <div className="field">
          <label htmlFor="beat-text">Beat</label>
          <textarea
            id="beat-text"
            key={step.stepNumber}
            defaultValue={step.beatText}
            onChange={e => onBeatTextChange(e.target.value)}
            placeholder="What happens in this step of your story?"
            rows={6}
          />
        </div>

        <div className="field">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            key={step.stepNumber}
            defaultValue={step.notes}
            onChange={e => onNotesChange(e.target.value)}
            placeholder="Working notes, ideas, questions…"
            rows={3}
          />
        </div>
      </div>
    </aside>
  )
}
