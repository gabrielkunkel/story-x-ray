import { useEffect, useRef, useState } from 'react'
import { markPWAInstalled } from '../utils/pwaInstall'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWAInstall() {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    function handleBeforeInstall(e: Event) {
      e.preventDefault()
      deferredPrompt.current = e as BeforeInstallPromptEvent
      setIsInstallable(true)
    }

    function handleAppInstalled() {
      deferredPrompt.current = null
      setIsInstallable(false)
      markPWAInstalled()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return { isInstallable }
}
