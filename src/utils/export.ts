import type { Story } from '../types/story'

function sanitizeFilename(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'story'
}

export function exportStoryAsJSON(story: Story): void {
  const json = JSON.stringify(story, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${sanitizeFilename(story.title)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportStoryAsMarkdown(story: Story): void {
  const lines: string[] = []
  lines.push(`# ${story.title}`)
  if (story.genre) lines.push(`**Genre:** ${story.genre}`)
  if (story.logline) lines.push(`**Logline:** ${story.logline}`)
  lines.push('')

  for (const step of story.steps) {
    lines.push(`## Step ${step.stepNumber} — ${step.label} (Act ${step.act})`)
    lines.push(`*${step.purpose}*`)
    lines.push('')
    if (step.beatText) {
      lines.push(`**Beat:** ${step.beatText}`)
    }
    if (step.notes) {
      lines.push(`**Notes:** ${step.notes}`)
    }
    const a = step.actualScores
    const t = step.targetScores
    lines.push(
      `**Scores** — Connection: ${a.connection || '—'} (target ${t.connection}) | ` +
      `Pressure: ${a.pressure || '—'} (target ${t.pressure}) | ` +
      `Hope: ${a.hope || '—'} (target ${t.hope}) | ` +
      `Stability: ${a.stability || '—'} (target ${t.stability})`
    )
    lines.push('')
  }

  const md = lines.join('\n')
  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${sanitizeFilename(story.title)}.md`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportStoryAsFountain(story: Story): void {
  const ACT_ORDER = ['I', 'IIA', 'IIB', 'III'] as const
  const ACT_LABELS: Record<string, string> = {
    I: 'Act I', IIA: 'Act IIA', IIB: 'Act IIB', III: 'Act III',
  }

  const lines: string[] = []

  // Title page
  lines.push(`Title: ${story.title}`)
  if (story.author) lines.push(`Author: ${story.author}`)
  lines.push(`Draft Date: ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`)
  lines.push('')
  lines.push('===')
  lines.push('')

  // Steps grouped by act — omit steps with no beat text
  for (const act of ACT_ORDER) {
    const actSteps = story.steps.filter(s => s.act === act && s.beatText.trim())
    if (actSteps.length === 0) continue

    lines.push(`# ${ACT_LABELS[act]}`)
    lines.push('')

    for (const step of actSteps) {
      const num = String(step.stepNumber).padStart(2, '0')
      lines.push(`## Step ${num}: ${step.label}`)
      lines.push('')
      lines.push(step.beatText.trim())
      lines.push('')
    }
  }

  const fountain = lines.join('\n')
  const blob = new Blob([fountain], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${sanitizeFilename(story.title)}.fountain`
  a.click()
  URL.revokeObjectURL(url)
}
