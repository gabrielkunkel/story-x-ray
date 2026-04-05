import type { Story, StoryStep } from '../types/story'
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

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

const DIMENSIONS = ['connection', 'pressure', 'hope', 'stability'] as const

const PDF_ACT_LABELS: Record<string, string> = {
  I: 'Act I', IIA: 'Act IIA', IIB: 'Act IIB', III: 'Act III',
}

function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : delta === 0 ? '—' : String(delta)
}

export function exportStoryAsPDF(story: Story, includeScores: boolean): void {
  const orientation = includeScores ? 'landscape' : 'portrait'
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14

  // --- Custom header (per D-10, D-11) ---
  let y = 20
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(story.title, margin, y)
  y += 7

  const exportDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const metaParts = [
    story.author || null,
    story.genre || null,
    `Exported ${exportDate}`,
  ].filter(Boolean) as string[]
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(metaParts.join('  ·  '), margin, y)
  y += 5

  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 5   // startY for table

  // --- Table data (per D-12, D-14, D-15) ---
  const scoreHeaders = includeScores
    ? ['Conn A', 'Conn T', 'Conn Δ', 'Pres A', 'Pres T', 'Pres Δ',
       'Hope A', 'Hope T', 'Hope Δ', 'Stab A', 'Stab T', 'Stab Δ']
    : []
  const head = [['Step', 'Label', 'Act', 'Beat Text', 'Notes', ...scoreHeaders]]

  const body = story.steps.map((step: StoryStep) => {
    const base = [
      String(step.stepNumber).padStart(2, '0'),
      step.label,
      PDF_ACT_LABELS[step.act],
      step.beatText,
      step.notes,
    ]
    if (!includeScores) return base
    const scoreCols: string[] = []
    for (const dim of DIMENSIONS) {
      const actual = step.actualScores[dim]
      const target = step.targetScores[dim]
      scoreCols.push(
        actual === 0 ? '—' : String(actual),
        String(target),
        formatDelta(actual - target),
      )
    }
    return [...base, ...scoreCols]
  })

  // --- autoTable call ---
  autoTable(doc, {
    startY: y,
    showHead: 'everyPage',
    theme: 'grid',
    styles: {
      fontSize: includeScores ? 7 : 9,
      cellPadding: includeScores ? 1.5 : 2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [80, 40, 120],
      textColor: 255,
      fontStyle: 'bold',
      ...(includeScores ? { fontSize: 6 } : {}),
    },
    head,
    body,
    columnStyles: includeScores
      ? {
          0: { cellWidth: 12 },
          1: { cellWidth: 28 },
          2: { cellWidth: 18 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5:  { cellWidth: 13, halign: 'center' },
          6:  { cellWidth: 13, halign: 'center' },
          7:  { cellWidth: 13, halign: 'center' },
          8:  { cellWidth: 13, halign: 'center' },
          9:  { cellWidth: 13, halign: 'center' },
          10: { cellWidth: 13, halign: 'center' },
          11: { cellWidth: 13, halign: 'center' },
          12: { cellWidth: 13, halign: 'center' },
          13: { cellWidth: 13, halign: 'center' },
          14: { cellWidth: 13, halign: 'center' },
          15: { cellWidth: 13, halign: 'center' },
          16: { cellWidth: 13, halign: 'center' },
        }
      : {
          0: { cellWidth: 12 },
          1: { cellWidth: 30 },
          2: { cellWidth: 18 },
          3: { cellWidth: 'auto' },
          4: { cellWidth: 50 },
        },
  })

  doc.save(`${sanitizeFilename(story.title)}.pdf`)
}
