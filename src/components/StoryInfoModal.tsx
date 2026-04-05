import { useState, type FormEvent } from 'react'
import type { Story } from '../types/story'

interface Props {
  story: Story
  onSave: (patch: Pick<Story, 'title' | 'author' | 'genre'>) => void
  onClose: () => void
}

export default function StoryInfoModal({ story, onSave, onClose }: Props) {
  const [title, setTitle] = useState(story.title)
  const [author, setAuthor] = useState(story.author)
  const [genre, setGenre] = useState(story.genre)
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    onSave({ title: title.trim(), author: author.trim(), genre: genre.trim() })
    onClose()
  }

  return (
    <div
      className="capture-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="story-info-modal" role="dialog" aria-modal="true" aria-label="Edit story info">
        <h2 className="story-info-modal__heading">Story Info</h2>
        <form className="story-info-modal__form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="si-title">Title <span aria-hidden="true">*</span></label>
            <input
              id="si-title"
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); if (error) setError('') }}
              autoFocus
            />
            {error && <p className="field-error">{error}</p>}
          </div>
          <div className="field">
            <label htmlFor="si-author">
              Author <span className="optional">(optional)</span>
            </label>
            <input
              id="si-author"
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="Your name or pen name"
            />
          </div>
          <div className="field">
            <label htmlFor="si-genre">
              Genre <span className="optional">(optional)</span>
            </label>
            <input
              id="si-genre"
              type="text"
              value={genre}
              onChange={e => setGenre(e.target.value)}
              placeholder="e.g. thriller, romance, sci-fi"
            />
          </div>
          <div className="story-info-modal__actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
