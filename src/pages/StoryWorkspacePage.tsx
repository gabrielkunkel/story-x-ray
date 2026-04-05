import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loadStory, saveStory } from '../services/storage'
import type { Story, Dimension } from '../types/story'
import { runDiagnostics } from '../utils/diagnostics'
import { exportStoryAsJSON, exportStoryAsMarkdown, exportStoryAsFountain } from '../utils/export'
import {
  hasSubmittedEmail,
  hasShownThisSession,
  markShownThisSession,
} from '../utils/emailCapture'
import BoardHeader from '../components/BoardHeader'
import ActColumn from '../components/ActColumn'
import StoryCard from '../components/StoryCard'
import CardEditor from '../components/CardEditor'
import WaveformGraph from '../components/WaveformGraph'
import DiagnosticsPanel from '../components/DiagnosticsPanel'
import EmailCaptureModal, { type CaptureContext } from '../components/EmailCaptureModal'
import StoryInfoModal from '../components/StoryInfoModal'
import PrintLayout from '../components/PrintLayout'

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const stored = localStorage.getItem('sx:viewMode')
    return stored === 'list' ? 'list' : 'grid'
  })
  const [showBeatPreview, setShowBeatPreview] = useState<boolean>(() => {
    return localStorage.getItem('sx:showBeatPreview') === 'true'
  })
  const [showGraph, setShowGraph] = useState(true)
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [captureContext, setCaptureContext] = useState<CaptureContext | null>(null)
  const [showStoryInfo, setShowStoryInfo] = useState(false)
  const act1CheckedRef = useRef(false)

  const updateAndSave = useCallback((updatedStory: Story) => {
    setStory(updatedStory)
    saveStory(updatedStory)
  }, [])

  const diagnostics = story ? runDiagnostics(story.steps) : []

  // Trigger 1 — Post-Act-I popup
  useEffect(() => {
    if (!story || act1CheckedRef.current) return
    if (hasSubmittedEmail() || hasShownThisSession('act1')) return
    const act1Steps = story.steps.filter(s => s.act === 'I')
    if (act1Steps.every(s => s.beatText.trim().length > 0)) {
      act1CheckedRef.current = true
      markShownThisSession('act1')
      setCaptureContext('act1')
    }
  }, [story])

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

  function handleToggleBeatPreview() {
    setShowBeatPreview(prev => {
      const next = !prev
      localStorage.setItem('sx:showBeatPreview', String(next))
      return next
    })
  }

  function handleToggleView() {
    setViewMode(prev => {
      const next = prev === 'grid' ? 'list' : 'grid'
      localStorage.setItem('sx:viewMode', next)
      return next
    })
  }

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

  // Trigger 2 — first export capture
  function handleExportJSON() {
    if (!hasSubmittedEmail() && !hasShownThisSession('export')) {
      markShownThisSession('export')
      setCaptureContext('export')
    }
    exportStoryAsJSON(story!)
  }

  function handleSaveStoryInfo(patch: Pick<Story, 'title' | 'author' | 'genre'>) {
    updateAndSave({ ...story!, ...patch })
  }

  function handleExportPDF() {
    window.print()
  }

  function handleExportFountain() {
    exportStoryAsFountain(story!)
  }

  function handleExportMarkdown() {
    if (!hasSubmittedEmail() && !hasShownThisSession('export')) {
      markShownThisSession('export')
      setCaptureContext('export')
    }
    exportStoryAsMarkdown(story!)
  }

  // Trigger 3 — diagnostics panel CTA
  const showDiagCaptureCTA = showDiagnostics
    && !hasSubmittedEmail()
    && !hasShownThisSession('diagnostics')

  function handleDiagCaptureClick() {
    markShownThisSession('diagnostics')
    setCaptureContext('diagnostics')
  }

  const hasAnyBeatText = story.steps.some(s => s.beatText.trim().length > 0)

  return (
    <div className="workspace">
      <BoardHeader
        title={story.title}
        showGraph={showGraph}
        onToggleGraph={() => setShowGraph(v => !v)}
        showDiagnostics={showDiagnostics}
        diagnosticCount={diagnostics.length}
        onToggleDiagnostics={() => setShowDiagnostics(v => !v)}
        onExportJSON={handleExportJSON}
        onExportMarkdown={handleExportMarkdown}
        onImportJSON={handleImportJSON}
        viewMode={viewMode}
        onToggleView={handleToggleView}
        showBeatPreview={showBeatPreview}
        onToggleBeatPreview={handleToggleBeatPreview}
        onEditStoryInfo={() => setShowStoryInfo(true)}
        onExportPDF={handleExportPDF}
        onExportFountain={handleExportFountain}
      />

      {importError && (
        <p className="import-error">{importError}</p>
      )}

      <div className="workspace__body">
        <div className="workspace__board">
          {!hasAnyBeatText && (
            <p className="board-empty-hint">Click any card to start writing your story.</p>
          )}
          {viewMode === 'list' ? (
            <div className="board-list">
              {ACT_ORDER.map(act => {
                const actSteps = story.steps.filter(s => s.act === act)
                return (
                  <div key={act} className="board-list__section">
                    <div className="board-list__act-label">{ACT_LABELS[act]}</div>
                    <div className="board-list__cards">
                      {actSteps.map(step => (
                        <StoryCard
                          key={step.stepNumber}
                          step={step}
                          isActive={activeStepNumber === step.stepNumber}
                          onClick={() =>
                            setActiveStepNumber(prev => prev === step.stepNumber ? null : step.stepNumber)
                          }
                          showBeatPreview={showBeatPreview}
                          variant="list"
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
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
                  showBeatPreview={showBeatPreview}
                />
              ))}
            </div>
          )}
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
          showCaptureCTA={showDiagCaptureCTA}
          onCaptureClick={handleDiagCaptureClick}
        />
      )}

      {captureContext && (
        <EmailCaptureModal
          context={captureContext}
          onClose={() => setCaptureContext(null)}
        />
      )}

      {showStoryInfo && (
        <StoryInfoModal
          story={story}
          onSave={handleSaveStoryInfo}
          onClose={() => setShowStoryInfo(false)}
        />
      )}

      <PrintLayout story={story} />
    </div>
  )
}
