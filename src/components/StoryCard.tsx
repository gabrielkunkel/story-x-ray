import type { StoryStep } from '../types/story'

interface Props {
  step: StoryStep
  isActive: boolean
  onClick: () => void
  showBeatPreview: boolean
  variant?: 'grid' | 'list'
}

export default function StoryCard({ step, isActive, onClick, showBeatPreview, variant = 'grid' }: Props) {
  const hasBeat = step.beatText.trim().length > 0

  return (
    <button
      className={`story-card${isActive ? ' story-card--active' : ''}${variant === 'list' ? ' story-card--list' : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Step ${step.stepNumber}: ${step.label}`}
    >
      <div className="story-card__main">
        <div className="story-card__top">
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
        </div>
      </div>
      {variant === 'list' && hasBeat && (
        <div className="story-card__beat-quote">{step.beatText.trim()}</div>
      )}
      {variant !== 'list' && showBeatPreview && hasBeat && (
        <div className="story-card__preview">
          {step.beatText.trim().length > 80
            ? step.beatText.trim().slice(0, 80) + '\u2026'
            : step.beatText.trim()}
        </div>
      )}
    </button>
  )
}
