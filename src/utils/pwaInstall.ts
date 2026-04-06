const DISMISS_KEY = 'sxr:pwa:dismiss'
const INSTALLED_KEY = 'sxr:pwa:installed'

const COOLDOWNS_MS = [
  3 * 24 * 60 * 60 * 1000,   // 3 days — after 1st dismiss
  7 * 24 * 60 * 60 * 1000,   // 7 days — after 2nd dismiss
  30 * 24 * 60 * 60 * 1000,  // 30 days — after 3rd dismiss
]
const MAX_DISMISSALS = COOLDOWNS_MS.length  // 3 — after 3rd dismiss, suppress permanently

export function isChromeBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  const uad = (navigator as Navigator & {
    userAgentData?: { brands: Array<{ brand: string; version: string }> }
  }).userAgentData
  if (uad?.brands) {
    return uad.brands.some(b => b.brand === 'Google Chrome')
  }
  const ua = navigator.userAgent
  return /Chrome\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua)
}

export function isPWAInstalled(): boolean {
  return localStorage.getItem(INSTALLED_KEY) === 'true'
}

export function markPWAInstalled(): void {
  localStorage.setItem(INSTALLED_KEY, 'true')
}

export function shouldShowInstallCallout(): boolean {
  if (isPWAInstalled()) return false
  const raw = localStorage.getItem(DISMISS_KEY)
  if (!raw) return true
  const { count, timestamp } = JSON.parse(raw) as { count: number; timestamp: number }
  if (count >= MAX_DISMISSALS) return false
  const cooldown = COOLDOWNS_MS[count - 1] ?? 0
  return Date.now() - timestamp >= cooldown
}

export function recordInstallDismiss(): void {
  const raw = localStorage.getItem(DISMISS_KEY)
  const prev = raw
    ? (JSON.parse(raw) as { count: number; timestamp: number })
    : { count: 0, timestamp: 0 }
  localStorage.setItem(DISMISS_KEY, JSON.stringify({
    count: prev.count + 1,
    timestamp: Date.now(),
  }))
}
