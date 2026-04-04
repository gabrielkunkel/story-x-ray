import type { StoryStep } from '../types/story'

export type DiagnosticRule = 'flat-zone' | 'weak-rupture' | 'false-safety' | 'unresolved-ending'

export interface Diagnostic {
  id: string
  rule: DiagnosticRule
  label: string
  message: string
  stepNumbers: number[]
  severity: 'warning'
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function runDiagnostics(steps: StoryStep[]): Diagnostic[] {
  const diagnostics: Diagnostic[] = []
  const byNumber = Object.fromEntries(steps.map(s => [s.stepNumber, s]))

  // Rule 1 — Flat Zone
  const dims = ['connection', 'pressure', 'hope', 'stability'] as const
  for (const dim of dims) {
    let runStart = -1
    let runLen = 1

    for (let i = 0; i < steps.length - 1; i++) {
      const cur = steps[i].actualScores[dim]
      const next = steps[i + 1].actualScores[dim]

      if (cur === 0 || next === 0) {
        // gap in scores — flush any open run
        if (runLen >= 3 && runStart !== -1) {
          const runSteps = steps.slice(runStart, runStart + runLen).map(s => s.stepNumber)
          diagnostics.push({
            id: `flat-zone-${dim}-${runSteps[0]}`,
            rule: 'flat-zone',
            label: 'Flat Zone',
            message: `${capitalize(dim)} barely changes across steps ${runSteps.join(', ')} — readers may feel no momentum.`,
            stepNumbers: runSteps,
            severity: 'warning',
          })
        }
        runStart = -1
        runLen = 1
        continue
      }

      if (Math.abs(next - cur) < 1.5) {
        if (runStart === -1) runStart = i
        runLen = i + 2 - runStart
      } else {
        if (runLen >= 3 && runStart !== -1) {
          const runSteps = steps.slice(runStart, runStart + runLen).map(s => s.stepNumber)
          diagnostics.push({
            id: `flat-zone-${dim}-${runSteps[0]}`,
            rule: 'flat-zone',
            label: 'Flat Zone',
            message: `${capitalize(dim)} barely changes across steps ${runSteps.join(', ')} — readers may feel no momentum.`,
            stepNumbers: runSteps,
            severity: 'warning',
          })
        }
        runStart = -1
        runLen = 1
      }
    }

    // flush trailing run
    if (runLen >= 3 && runStart !== -1) {
      const runSteps = steps.slice(runStart, runStart + runLen).map(s => s.stepNumber)
      diagnostics.push({
        id: `flat-zone-${dim}-${runSteps[0]}`,
        rule: 'flat-zone',
        label: 'Flat Zone',
        message: `${capitalize(dim)} barely changes across steps ${runSteps.join(', ')} — readers may feel no momentum.`,
        stepNumbers: runSteps,
        severity: 'warning',
      })
    }
  }

  // Rule 2 — Weak Rupture (steps 4, 8, 12)
  for (const n of [4, 8, 12]) {
    const step = byNumber[n]
    if (!step) continue
    const { pressure, stability } = step.actualScores
    if (pressure === 0 && stability === 0) continue
    if (pressure < 7 || stability > 4) {
      diagnostics.push({
        id: `weak-rupture-${n}`,
        rule: 'weak-rupture',
        label: 'Weak Rupture',
        message: `Step ${n} should feel explosive (pressure ≥ 7, stability ≤ 4).`,
        stepNumbers: [n],
        severity: 'warning',
      })
    }
  }

  // Rule 3 — False Safety (steps 3, 7, 11)
  for (const n of [3, 7, 11]) {
    const step = byNumber[n]
    const prior = byNumber[n - 1]
    if (!step || !prior) continue
    const sc = step.actualScores
    const pc = prior.actualScores
    if (sc.connection === 0 && sc.hope === 0) continue
    if (pc.connection === 0 && pc.hope === 0) continue
    if (sc.connection - pc.connection < 1.5 || sc.hope - pc.hope < 1.5) {
      diagnostics.push({
        id: `false-safety-${n}`,
        rule: 'false-safety',
        label: 'False Safety',
        message: `Step ${n} should feel like a meaningful breath — connection or hope should rise ≥ 1.5 from the prior step.`,
        stepNumbers: [n],
        severity: 'warning',
      })
    }
  }

  // Rule 4 — Unresolved Ending (step 16)
  const end = byNumber[16]
  if (end) {
    const { pressure, stability } = end.actualScores
    if (!(pressure === 0 && stability === 0)) {
      if (pressure > 4 || stability < 6) {
        diagnostics.push({
          id: 'unresolved-ending',
          rule: 'unresolved-ending',
          label: 'Unresolved Ending',
          message: `Step 16 should feel settled (pressure ≤ 4, stability ≥ 6) — the story hasn't fully resolved.`,
          stepNumbers: [16],
          severity: 'warning',
        })
      }
    }
  }

  return diagnostics
}
