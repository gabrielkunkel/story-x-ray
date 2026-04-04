import { useParams, useNavigate } from 'react-router-dom'
import { loadStory } from '../services/storage'

export default function StoryWorkspacePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const story = id ? loadStory(id) : null

  if (!story) {
    return (
      <main className="workspace-placeholder">
        <p>Story not found.</p>
        <button className="btn-ghost" onClick={() => navigate('/')}>
          Back to start
        </button>
      </main>
    )
  }

  return (
    <main className="workspace-placeholder">
      <h1>{story.title}</h1>
      {story.genre && <p className="story-meta">Genre: {story.genre}</p>}
      {story.logline && <p className="story-meta">{story.logline}</p>}
      <p className="coming-soon">Board coming in Phase 2.</p>
      <button className="btn-ghost" onClick={() => navigate('/')}>
        ← Back
      </button>
    </main>
  )
}
