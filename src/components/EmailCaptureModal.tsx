import { useState } from 'react'
import { submitEmail, markShownThisSession } from '../utils/emailCapture'

export type CaptureContext = 'act1' | 'export' | 'diagnostics' | 'examples' | 'early-access'

// ── Marketing config ─────────────────────────────────────────────────────
// Edit these constants to change the email capture modal content.
// To add a marketing image, place the file in public/ and set the path below.
// See README.md "Customize email modal" for full instructions.
// ──────────────────────────────────────────────────────────────────────────
export const MODAL_IMAGE_SRC = ''  // e.g. '/marketing.png' — empty string = no image

const COPY: Record<CaptureContext, { headline: string; body: string }> = {
  'act1': {
    headline: 'Your story is taking shape.',
    body: 'Get 5 example story maps, a beat gap checklist, and the structure rescue guide. Free.',
  },
  'export': {
    headline: 'Your story map is ready.',
    body: 'Get 5 example story maps, a beat gap checklist, and the structure rescue guide. Free.',
  },
  'diagnostics': {
    headline: 'Story diagnostics unlocked.',
    body: 'Get 5 example story maps, a beat gap checklist, and the structure rescue guide. Free.',
  },
  'examples': {
    headline: 'Get 5 example story maps.',
    body: 'Plus a beat gap checklist, structure rescue guide, and early access to the 28-step mode.',
  },
  'early-access': {
    headline: '28-step mode is coming.',
    body: 'Get on the waitlist and receive 5 example story maps + the structure rescue guide.',
  },
}
// ── End marketing config ─────────────────────────────────────────────────

interface Props {
  context: CaptureContext
  onClose: () => void
}

export default function EmailCaptureModal({ context, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const { headline, body } = COPY[context]

  function handleDismiss() {
    markShownThisSession(context)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setErrorMsg('')
    const result = await submitEmail(email.trim())
    if (result.ok) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMsg(result.error ?? 'Something went wrong.')
    }
  }

  return (
    <div className="capture-overlay" onClick={handleDismiss}>
      <div className="capture-modal" onClick={e => e.stopPropagation()}>
        <button className="capture-modal__close btn-ghost" onClick={handleDismiss} title="Dismiss">
          ×
        </button>

        {MODAL_IMAGE_SRC && (
          <img
            className="capture-modal__image"
            src={MODAL_IMAGE_SRC}
            alt=""
            aria-hidden="true"
          />
        )}

        <p className="capture-modal__headline">{headline}</p>
        <p className="capture-modal__body">{body}</p>

        {status === 'success' ? (
          <div className="capture-modal__success">
            <p>You're in. Check your inbox.</p>
            <button className="btn-ghost" onClick={handleDismiss}>Close</button>
          </div>
        ) : (
          <form className="capture-modal__form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={status === 'loading' || !email.trim()}
            >
              {status === 'loading' ? 'Sending…' : 'Send me the pack'}
            </button>
            {status === 'error' && (
              <p className="capture-modal__error">{errorMsg}</p>
            )}
          </form>
        )}

        <p className="capture-modal__skip" onClick={handleDismiss}>
          No thanks
        </p>
      </div>
    </div>
  )
}
