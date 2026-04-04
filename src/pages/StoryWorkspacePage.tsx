import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loadStory, saveStory } from '../services/storage'
import type { Story, Dimension } from '../types/story'
import { runDiagnostics } from '../utils/diagnostics'
import { exportStoryAsJSON, exportStoryAsMarkdown } from '../utils/export'
import BoardHeader from '../components/BoardHeader'
import ActColumn from '../components/ActColumn'
import CardEditor from '../components/CardEditor'
import WaveformGraph from '../components/WaveformGraph'
import DiagnosticsPanel from '../components/DiagnosticsPanel'

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
  const [showGraph, setShowGraph] = useState(true)
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  const updateAndSave = useCallback((updatedStory: Story) => {
    setStory(updatedStory)
    saveStory(updatedStory)
  }, [])

  const diagnostics = story ? runDiagnostics(story.steps) : []

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
    updateAndSave({
      ...story!,
      steps: story!.steps.map(s =>
        s.stepNumber === activeStepNumber ? { ...s, beatText: value } : s
      ),
    })
  }

  function handleNotesChange(value: string) {
    if (activeStepNumber === null) return
    updateAndSave({
      ...story!,
      steps: story!.steps.map(s =>
        s.stepNumber === activeStepNumber ? { ...s, notes: value } : s
      ),
    })
  }

  function handleScoreChange(dimension: Dimension, value: number) {
    if (activeStepNumber === null) return
    updateAndSave({
      ...story!,
      steps: story!.steps.map(s =>
        s.stepNumber === activeStepNumber
          ? { ...s, actualScores: { ...s.actualScores, [dimension]: value } }
          : s
      ),
    })
  }

  async function handleImportJSON(file: File) {
    setImportError(null)
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      if (!parsed.title || !Array.isArray(parsed.steps)) {
        setImportError('Invalid story file — missing required fields.')
        return
      }
      const importedStory: Story = { ...parsed, id: crypto.randomUUID() }
      saveStory(importedStory)
      navigate(`/story/${importedStory.id}`)
    } catch {
      setImportError('Could not read file. Make sure it is a valid Story X-Ray JSON export.')
    }
  }

  return (
    <div className="workspace">
      <BoardHeader
        title={story.title}
        showGraph={showGraph}
        onToggleGraph={() => setShowGraph(v => !v)}
        showDiagnostics={showDiagnostics}
        diagnosticCount={diagnostics.length}
        onToggleDiagnostics={() => setShowDiagnostics(v => !v)}
        onExportJSON={() => exportStoryAsJSON(story)}
        onExportMarkdown={() => exportStoryAsMarkdown(story)}
        onImportJSON={handleImportJSON}
      />

      {importError && (
        <p className="import-error">{importError}</p>
      )}

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
            onScoreChange={handleScoreChange}
          />
        )}
      </div>

      {showGraph && (
        <WaveformGraph
          story={story}
          activeStepNumber={activeStepNumber}
          onStepHover={setActiveStepNumber}
        />
      )}

      {showDiagnostics && (
        <DiagnosticsPanel
          diagnostics={diagnostics}
          onStepClick={setActiveStepNumber}
        />
      )}
    </div>
  )
}
