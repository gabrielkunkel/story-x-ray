import { useNavigate } from 'react-router-dom'
import { getActiveStoryId } from '../services/storage'

export default function StartPage() {
  const navigate = useNavigate()
  const activeId = getActiveStoryId()

  function handleLoadExample() {
    alert('Example stories coming soon!')
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

      <p className="start-note">
        16-step story architecture · Local-first · No account needed
      </p>
    </main>
  )
}
