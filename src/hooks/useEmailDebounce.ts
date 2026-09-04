import { useRef, useEffect, useCallback } from 'react'
import type { Story } from '../types/story'
import { hasShownThisSession, markShownThisSession, hasSubmittedEmail, isEmailCaptureEnabled } from '../utils/emailCapture'

export function useEmailDebounce(
  story: Story | null,
  activeStepNumber: number | null,
  setCaptureContext: (ctx: 'act1') => void
): {
  resetDebounceTimer: () => void
  handleBeatTextBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void
} {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const qualifyingStepRef = useRef<number | null>(null)

  const resetDebounceTimer = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    if (!isEmailCaptureEnabled()) return
    if (hasShownThisSession('act1') || hasSubmittedEmail()) return
    if (qualifyingStepRef.current === null) return

    debounceTimerRef.current = setTimeout(() => {
      if (!hasShownThisSession('act1') && !hasSubmittedEmail()) {
        markShownThisSession('act1')
        setCaptureContext('act1')
      }
    }, 10_000)
  }, [setCaptureContext])

  // Threshold detection — detects qualifying step (replaces old Trigger 1)
  useEffect(() => {
    if (!story) return
    if (!isEmailCaptureEnabled()) return
    if (hasShownThisSession('act1') || hasSubmittedEmail()) return
    if (qualifyingStepRef.current !== null) return  // already captured

    const filledBeats = story.steps.filter(s => s.beatText.trim().length > 0).length
    if (filledBeats >= 4 && activeStepNumber !== null) {
      qualifyingStepRef.current = activeStepNumber
      resetDebounceTimer()
    }
  }, [story, activeStepNumber, resetDebounceTimer])

  // Card navigation reset (D-05, D-07)
  useEffect(() => {
    if (qualifyingStepRef.current !== null) {
      resetDebounceTimer()
    }
  }, [activeStepNumber, resetDebounceTimer])

  // Unmount cleanup — prevents stale closure firing after story navigation
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [])

  const handleBeatTextBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (!isEmailCaptureEnabled()) return
    if (hasShownThisSession('act1') || hasSubmittedEmail()) return
    if (qualifyingStepRef.current === null) return
    if (activeStepNumber !== qualifyingStepRef.current) return  // not the qualifying field (D-01)

    const boardEl = document.querySelector('.workspace__board')
    const target = e.relatedTarget as Node | null
    const isInAppNavigation = boardEl !== null && target !== null && boardEl.contains(target)

    if (!isInAppNavigation) {
      // Blur was to outside the board — fire immediately (D-02)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      markShownThisSession('act1')
      setCaptureContext('act1')
    }
    // If isInAppNavigation: card-to-card navigation — do nothing, timer continues
  }, [activeStepNumber, setCaptureContext])

  return { resetDebounceTimer, handleBeatTextBlur }
}
