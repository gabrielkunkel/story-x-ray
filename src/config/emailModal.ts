/**
 * Email capture modal content configuration.
 *
 * Edit this file to change every visible word, image, and CTA in the email
 * capture modal. After editing, rebuild and redeploy — no component changes needed.
 *
 * See README.md "Customize email modal" for full field documentation.
 */

export type CaptureContext = 'act1' | 'export' | 'diagnostics' | 'examples' | 'early-access'

export interface ModalContextCopy {
  headline: string
  subtitle: string
  bullets: string[]
}

export interface EmailModalConfig {
  /** Global fields — same across all trigger contexts */
  global: {
    /** Path to marketing image in public/. Empty string = no image. */
    imageSrc: string
    /** CTA button label on the email submit form. */
    ctaText: string
    /** Optional footer line below the form. Omit or set to '' to hide. */
    footer?: string
  }
  /** Per-context copy — keyed by CaptureContext */
  contexts: Record<CaptureContext, ModalContextCopy>
}

export const emailModalConfig: EmailModalConfig = {
  global: {
    imageSrc: '',          // e.g. '/marketing.png' — empty string = no image
    ctaText: 'Send me the pack',
    footer: '',            // e.g. 'No spam. Unsubscribe any time.' — empty = hidden
  },
  contexts: {
    'act1': {
      headline: 'Your story is taking shape.',
      subtitle: 'Get 5 example story maps, a beat gap checklist, and the structure rescue guide. Free.',
      bullets: [],
    },
    'export': {
      headline: 'Your story map is ready.',
      subtitle: 'Get 5 example story maps, a beat gap checklist, and the structure rescue guide. Free.',
      bullets: [],
    },
    'diagnostics': {
      headline: 'Story diagnostics unlocked.',
      subtitle: 'Get 5 example story maps, a beat gap checklist, and the structure rescue guide. Free.',
      bullets: [],
    },
    'examples': {
      headline: 'Get 5 example story maps.',
      subtitle: 'Plus a beat gap checklist, structure rescue guide, and early access to the 28-step mode.',
      bullets: [],
    },
    'early-access': {
      headline: '28-step mode is coming.',
      subtitle: 'Get on the waitlist and receive 5 example story maps + the structure rescue guide.',
      bullets: [],
    },
  },
}
