import { BEEHIIV_PUBLICATION_ID } from '../config/beehiiv'

const SUBMITTED_KEY = 'sxr:cap:submitted'

export function hasSubmittedEmail(): boolean {
  return localStorage.getItem(SUBMITTED_KEY) === 'true'
}

export function markEmailSubmitted(): void {
  localStorage.setItem(SUBMITTED_KEY, 'true')
}

export function hasShownThisSession(trigger: string): boolean {
  return sessionStorage.getItem(`sxr:cap:${trigger}`) === 'true'
}

export function markShownThisSession(trigger: string): void {
  sessionStorage.setItem(`sxr:cap:${trigger}`, 'true')
}

export async function submitEmail(email: string): Promise<{ ok: boolean; error?: string }> {
  if (!BEEHIIV_PUBLICATION_ID) {
    console.log('[EmailCapture] Dev mode — would subscribe:', email)
    markEmailSubmitted()
    return { ok: true }
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
        }),
      }
    )
    if (!res.ok) {
      return { ok: false, error: 'Subscription failed. Please try again.' }
    }
    markEmailSubmitted()
    return { ok: true }
  } catch {
    return { ok: false, error: 'Network error. Please try again.' }
  }
}
