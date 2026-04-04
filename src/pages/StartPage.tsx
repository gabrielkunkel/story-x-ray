import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActiveStoryId } from '../services/storage'
import { loadExampleStory } from '../data/exampleStory'
import EmailCaptureModal, { type CaptureContext } from '../components/EmailCaptureModal'

export default function StartPage() {
  const navigate = useNavigate()
  const activeId = getActiveStoryId()
  const [captureContext, setCaptureContext] = useState<CaptureContext | null>(null)

  function handleLoadExample() {
    const id = loadExampleStory()
    navigate(`/story/${id}`)
  }

  return (
    <main className="start-page">
      <h1>Story X-Ray</h1>
      <p className="tagline">
        See the shape of your story. Find what comes next.
      </p>

      <div className="start-actions">
        <button className="btn-primary" onClick={() => navigate('/setup')}>
          New Story
        </button>
        {activeId && (
          <button className="btn-secondary" onClick={() => navigate(`/story/${activeId}`)}>
            Continue Story
          </button>
        )}
        <button className="btn-ghost" onClick={handleLoadExample}>
          Load Example
        </button>
      </div>

      <div className="start-ctas">
        <button className="start-cta-link" onClick={() => setCaptureContext('examples')}>
          Get 5 example story maps →
        </button>
        <button className="start-cta-link" onClick={() => setCaptureContext('early-access')}>
          28-step early access →
        </button>
      </div>

      <p className="start-note">
        16-step story architecture · Local-first · No account needed
      </p>

      {captureContext && (
        <EmailCaptureModal
          context={captureContext}
          onClose={() => setCaptureContext(null)}
        />
      )}
    </main>
  )
}
