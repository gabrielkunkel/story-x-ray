import type { Dimension, StoryStep } from '../types/story'
import { STEP_HINTS, STEP_EXAMPLES } from '../data/steps'
import ScoreInput from './ScoreInput'

const DIMENSIONS: Dimension[] = ['connection', 'pressure', 'hope', 'stability']

interface Props {
  step: StoryStep
  onBeatTextChange: (value: string) => void
  onNotesChange: (value: string) => void
  onScoreChange: (dimension: Dimension, value: number) => void
}

export default function CardEditor({ step, onBeatTextChange, onNotesChange, onScoreChange }: Props) {
  const hint = STEP_HINTS[step.stepNumber]
  const examples = STEP_EXAMPLES[step.stepNumber]

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

      {examples && examples.length > 0 && (
        <details className="card-editor__examples">
          <summary>Examples</summary>
          <div className="card-editor__examples-list">
            {examples.map((ex, i) => (
              <div
                key={i}
                className={`example-item${ex.isOriginal ? ' example-item--original' : ''}`}
              >
                <div className="example-item__source">
                  {ex.isOriginal && <span className="example-item__badge">Original</span>}
                  {!ex.isOriginal && ex.source}
                </div>
                <p className="example-item__text">{ex.text}</p>
              </div>
            ))}
          </div>
        </details>
      )}

      <div className="card-editor__scores">
        <div className="card-editor__scores-heading">Scores</div>
        {DIMENSIONS.map(dim => (
          <ScoreInput
            key={dim}
            dimension={dim}
            actual={step.actualScores[dim]}
            target={step.targetScores[dim]}
            onChange={val => onScoreChange(dim, val)}
          />
        ))}
      </div>

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
