import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadAllStories, deleteStory } from '../services/storage'
import { loadExampleStory } from '../data/exampleStory'
import EmailCaptureModal, { type CaptureContext } from '../components/EmailCaptureModal'
import { isEmailCaptureEnabled } from '../utils/emailCapture'

export default function StartPage() {
  const navigate = useNavigate()
  const [stories, setStories] = useState(() =>
    loadAllStories().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  )
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [captureContext, setCaptureContext] = useState<CaptureContext | null>(null)

  function handleLoadExample() {
    const id = loadExampleStory()
    navigate(`/story/${id}`)
  }

  function handleDeleteConfirm(id: string) {
    deleteStory(id)
    setStories(prev => prev.filter(s => s.id !== id))
    setConfirmDeleteId(null)
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
        <button className="btn-ghost" onClick={handleLoadExample}>
          Load Example
        </button>
      </div>

      {stories.length > 0 && (
        <div className="story-list">
          <p className="story-list__label">Your stories</p>
          <ul className="story-list__items">
            {stories.map(story => (
              <li key={story.id} className="story-list__item">
                <button
                  className="story-list__open"
                  onClick={() => navigate(`/story/${story.id}`)}
                >
                  <span className="story-list__title">{story.title || 'Untitled'}</span>
                  <span className="story-list__date">
                    {new Date(story.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </button>
                {confirmDeleteId === story.id ? (
                  <div className="story-list__confirm">
                    <button className="story-list__confirm-yes btn-ghost" onClick={() => handleDeleteConfirm(story.id)}>Delete</button>
                    <button className="story-list__confirm-no btn-ghost" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                  </div>
                ) : (
                  <button
                    className="story-list__delete btn-ghost"
                    onClick={() => setConfirmDeleteId(story.id)}
                    aria-label={`Delete ${story.title || 'Untitled'}`}
                    title="Delete story"
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isEmailCaptureEnabled() && (
        <div className="start-ctas">
          <button className="start-cta-link" onClick={() => setCaptureContext('examples')}>
            Get 5 example story maps →
          </button>
          <button className="start-cta-link" onClick={() => setCaptureContext('early-access')}>
            28-step early access →
          </button>
        </div>
      )}

      <p className="start-note">
        16-step story architecture · Local-first · No account needed
      </p>

      {captureContext && isEmailCaptureEnabled() && (
        <EmailCaptureModal
          context={captureContext}
          onClose={() => setCaptureContext(null)}
        />
      )}
    </main>
  )
}
