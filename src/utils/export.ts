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
