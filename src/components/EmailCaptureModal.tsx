import { useState } from 'react'
import { submitEmail, markShownThisSession } from '../utils/emailCapture'
import { emailModalConfig } from '../config/emailModal'

// ── Modal content ────────────────────────────────────────────────────────
// Edit src/config/emailModal.ts to change copy, image, bullets, and CTA text.
// See README.md "Customize email modal" for instructions.
// ─────────────────────────────────────────────────────────────────────────

export type { CaptureContext } from '../config/emailModal'
import type { CaptureContext } from '../config/emailModal'

interface Props {
  context: CaptureContext
  onClose: () => void
}

export default function EmailCaptureModal({ context, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const { imageSrc, ctaText, footer } = emailModalConfig.global
  const { headline, subtitle, bullets } = emailModalConfig.contexts[context]

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

        {imageSrc && (
          <img
            className="capture-modal__image"
            src={imageSrc}
            alt=""
            aria-hidden="true"
          />
        )}

        <p className="capture-modal__headline">{headline}</p>
        <p className="capture-modal__body">{subtitle}</p>

        {bullets.length > 0 && (
          <ul className="capture-modal__bullets">
            {bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        )}

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
              {status === 'loading' ? 'Sending…' : ctaText}
            </button>
            {status === 'error' && (
              <p className="capture-modal__error">{errorMsg}</p>
            )}
          </form>
        )}

        {footer && (
          <p className="capture-modal__footer">{footer}</p>
        )}

        <p className="capture-modal__skip" onClick={handleDismiss}>
          No thanks
        </p>
      </div>
    </div>
  )
}
