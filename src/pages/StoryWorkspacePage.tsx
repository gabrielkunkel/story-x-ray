import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loadStory, saveStory } from '../services/storage'
import type { Story } from '../types/story'
import BoardHeader from '../components/BoardHeader'
import ActColumn from '../components/ActColumn'
import CardEditor from '../components/CardEditor'

const ACT_LABELS: Record<string, string> = {
  I:   'Act I',
  IIA: 'Act IIA',
  IIB: 'Act IIB',
  III: 'Act III',
}
const ACT_ORDER = ['I', 'IIA', 'IIB', 'III'] as const

export default function StoryWorkspacePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [story, setStory] = useState<Story | null>(() =>
    id ? loadStory(id) : null
  )
  const [activeStepNumber, setActiveStepNumber] = useState<number | null>(null)

  const updateAndSave = useCallback((updatedStory: Story) => {
    setStory(updatedStory)
    saveStory(updatedStory)
  }, [])

  if (!story) {
    return (
      <main className="workspace-error">
        <p>Story not found.</p>
        <button className="btn-ghost" onClick={() => navigate('/')}>
          Back to start
        </button>
      </main>
    )
  }

  const activeStep = activeStepNumber !== null
    ? story.steps.find(s => s.stepNumber === activeStepNumber) ?? null
    : null

  function handleBeatTextChange(value: string) {
    if (activeStepNumber === null) return
    const updatedStory: Story = {
      ...story!,
      steps: story!.steps.map(s =>
        s.stepNumber === activeStepNumber ? { ...s, beatText: value } : s
      ),
    }
    updateAndSave(updatedStory)
  }

  function handleNotesChange(value: string) {
    if (activeStepNumber === null) return
    const updatedStory: Story = {
      ...story!,
      steps: story!.steps.map(s =>
        s.stepNumber === activeStepNumber ? { ...s, notes: value } : s
      ),
    }
    updateAndSave(updatedStory)
  }

  return (
    <div className="workspace">
      <BoardHeader title={story.title} />

      <div className="workspace__body">
        <div className="workspace__board">
          <div className="board-grid">
            {ACT_ORDER.map(act => (
              <ActColumn
                key={act}
                actLabel={ACT_LABELS[act]}
                steps={story.steps.filter(s => s.act === act)}
                activeStepNumber={activeStepNumber}
                onCardClick={stepNum =>
                  setActiveStepNumber(prev => prev === stepNum ? null : stepNum)
                }
              />
            ))}
          </div>
        </div>

        {activeStep && (
          <CardEditor
            step={activeStep}
            onBeatTextChange={handleBeatTextChange}
            onNotesChange={handleNotesChange}
          />
        )}
      </div>
    </div>
  )
}
