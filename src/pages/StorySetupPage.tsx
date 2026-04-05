import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveStory, setActiveStoryId } from '../services/storage'
import { createFreshSteps } from '../data/steps'
import type { Story } from '../types/story'

export default function StorySetupPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [logline, setLogline] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Story title is required.')
      return
    }
    const story: Story = {
      id: crypto.randomUUID(),
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      logline: logline.trim(),
      preset: '16-step',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: createFreshSteps(),
    }
    saveStory(story)
    setActiveStoryId(story.id)
    navigate(`/story/${story.id}`)
  }

  return (
    <main className="setup-page">
      <h1>New Story</h1>
      <form className="setup-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">
            Title <span aria-hidden="true">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => {
              setTitle(e.target.value)
              if (error) setError('')
            }}
            placeholder="What is your story called?"
            autoFocus
          />
          {error && <p className="field-error">{error}</p>}
        </div>

        <div className="field">
          <label htmlFor="author">
            Author <span className="optional">(optional)</span>
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Your name or pen name"
          />
        </div>

        <div className="field">
          <label htmlFor="genre">
            Genre <span className="optional">(optional)</span>
          </label>
          <input
            id="genre"
            type="text"
            value={genre}
            onChange={e => setGenre(e.target.value)}
            placeholder="e.g. thriller, romance, sci-fi"
          />
        </div>

        <div className="field">
          <label htmlFor="logline">
            Logline <span className="optional">(optional)</span>
          </label>
          <textarea
            id="logline"
            value={logline}
            onChange={e => setLogline(e.target.value)}
            placeholder="One or two sentences about what your story is really about."
            rows={3}
          />
        </div>

        <div className="setup-actions">
          <button type="button" className="btn-ghost" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create Story
          </button>
        </div>
      </form>
    </main>
  )
}
