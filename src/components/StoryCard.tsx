import type { StoryStep } from '../types/story'

interface Props {
  step: StoryStep
  isActive: boolean
  onClick: () => void
}

export default function StoryCard({ step, isActive, onClick }: Props) {
  const hasBeat = step.beatText.trim().length > 0

  return (
    <button
      className={`story-card${isActive ? ' story-card--active' : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Step ${step.stepNumber}: ${step.label}`}
    >
      <div className="story-card__number">
        {String(step.stepNumber).padStart(2, '0')}
      </div>
      <div className="story-card__body">
        <div className="story-card__label">{step.label}</div>
        <div className="story-card__purpose">{step.purpose}</div>
      </div>
      {hasBeat && (
        <div className="story-card__filled" aria-label="Beat text added" />
      )}
    </button>
  )
}
