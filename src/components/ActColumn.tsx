import type { StoryStep } from '../types/story'
import StoryCard from './StoryCard'

interface Props {
  actLabel: string
  steps: StoryStep[]
  activeStepNumber: number | null
  onCardClick: (stepNumber: number) => void
}

export default function ActColumn({ actLabel, steps, activeStepNumber, onCardClick }: Props) {
  return (
    <div className="act-column">
      <div className="act-column__header">{actLabel}</div>
      <div className="act-column__cards">
        {steps.map(step => (
          <StoryCard
            key={step.stepNumber}
            step={step}
            isActive={activeStepNumber === step.stepNumber}
            onClick={() => onCardClick(step.stepNumber)}
          />
        ))}
      </div>
    </div>
  )
}
