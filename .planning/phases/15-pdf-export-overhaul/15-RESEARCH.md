# Phase 15: PDF Export Overhaul - Research

**Researched:** 2026-04-05
**Domain:** jsPDF + jspdf-autotable, React modal pattern, TypeScript integration
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** "Without Scores" exports portrait — 5 columns: Step, Label, Act, Beat Text, Notes
- **D-02:** "With Scores" exports landscape — 17 columns: Step, Label, Act, Beat Text, Notes, then per dimension (Connection, Pressure, Hope, Stability): Actual, Target, Delta
- **D-03:** Score columns grouped per dimension: Conn A | Conn T | Conn Δ | Pres A | Pres T | Pres Δ | Hope A | Hope T | Hope Δ | Stab A | Stab T | Stab Δ
- **D-04:** Delta displayed as +N / −N / — (matching existing PrintLayout pattern)
- **D-05:** Actual scores stored as 0 display as `—` (em dash) in the PDF, not `0`
- **D-06:** Target scores always show their numeric value (always set from static config)
- **D-07:** Clicking the existing "↓ PDF" button opens a small React modal with two choices: "Without Scores" and "With Scores"
- **D-08:** Modal should be a standalone component (`PdfExportModal`) so Phase 16's export dropdown can import and reuse it directly
- **D-09:** Modal closes after generating the PDF (no success message needed)
- **D-10:** PDF opens with a header (full-width, not a table row): story title on line 1, then author · genre · export date on line 2, with a horizontal rule separating header from table
- **D-11:** If author or genre are empty strings, omit them from the meta line (match PrintLayout logic)
- **D-12:** All 16 steps appear as rows — empty beatText and notes cells are left blank (not `—` or placeholder text)
- **D-13:** Column headers repeat on each page (jsPDF-AutoTable `showHead: 'everyPage'` default)
- **D-14:** Step column shows zero-padded number: `01`, `02`, ... `16`
- **D-15:** Act column shows full label: `Act I`, `Act IIA`, `Act IIB`, `Act III`
- **D-16:** Use `jspdf` + `jspdf-autotable` — install as production dependencies. Note: `@types/jspdf` is a stub (jsPDF 4.x bundles its own types — do NOT install it)
- **D-17:** PDF generation logic lives in `src/utils/export.ts` as a new `exportStoryAsPDF(story: Story, includeScores: boolean): void` function
- **D-18:** `handleExportPDF` in `StoryWorkspacePage.tsx` becomes `handleOpenPdfModal` — opens the modal instead of calling `window.print()`
- **D-19:** `PrintLayout` component and its CSS can be removed once the new PDF export is wired in

### Claude's Discretion
- Column widths within the autoTable (within the orientation constraints above)
- Font size and cell padding
- Whether to use `doc.save()` or Blob download — whatever is simpler with jsPDF

### Deferred Ideas (OUT OF SCOPE)
- PDF page size / margin customization
- CSV/spreadsheet export
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PDF2-01 | User can trigger PDF export with option to include or exclude scores | D-07 modal + D-17 exportStoryAsPDF(story, includeScores) |
| PDF2-02 | Generated PDF is a real downloadable file (not browser print dialog), produced by jsPDF + autoTable | doc.save() triggers native download — no Blob/anchor needed |
| PDF2-03 | PDF header shows story title, author, genre, and export date | doc.text() + doc.line() before autoTable with startY offset |
| PDF2-04 | PDF body is a table with 5 base columns: Step #, Label, Act, Beat Text, Notes | autoTable head/body with portrait orientation |
| PDF2-05 | "With Scores" adds 12 score columns (4 dimensions × Actual/Target/Delta) | autoTable landscape + 17-column columnStyles |
| PDF2-06 | All 16 steps appear; empty beatText and notes left blank | body built from story.steps with empty string for blanks |
| PDF2-07 | Table spans multiple pages with column headers repeated on each page | showHead: 'everyPage' (default behavior — no extra config needed) |
</phase_requirements>

---

## Summary

Phase 15 replaces `window.print()` with a real jsPDF + jspdf-autotable download. The library stack is settled: jsPDF 4.2.1 and jspdf-autotable 5.0.7 are the current versions. The v5 autotable API is a clean named export — `import { autoTable } from 'jspdf-autotable'` — that eliminates the old plugin-extension pattern and works natively with Vite/ESM without any configuration workarounds.

The two-mode approach (portrait 5-col / landscape 17-col) maps cleanly to jsPDF's orientation parameter at construction time. The custom text header above the table is done with `doc.text()` calls followed by `doc.line()` for the rule, then `autoTable(..., { startY })` to push the table below. Column headers repeating per page is the default behavior of `showHead: 'everyPage'` — no extra work.

The biggest implementation risk is column width allocation for the 17-column landscape mode: A4 landscape is 297mm wide with typical 14mm side margins leaving ~269mm, split across 17 columns. Beat Text and Notes need the most space; the 12 score columns (numeric, narrow) can each be ~12–14mm. This requires explicit `columnStyles` entries — `cellWidth` per column index.

**Primary recommendation:** Install `jspdf` and `jspdf-autotable` as prod deps (no `@types/jspdf` — it is a stub). Use the `autoTable(doc, options)` function-form import. Write custom header via `doc.text()` + `doc.setLineWidth()` + `doc.line()`, then call `autoTable` with `startY` set to just below the rule. Call `doc.save(filename)` to trigger the native browser download.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| jspdf | 4.2.1 | PDF document creation | De facto standard for client-side PDF generation; bundles TypeScript types |
| jspdf-autotable | 5.0.7 | Multi-page table plugin for jsPDF | The only maintained jsPDF table plugin; v5 is pure ESM, Vite-compatible |

[VERIFIED: npm registry — `npm view jspdf version` → 4.2.1, published 2026-03-17; `npm view jspdf-autotable version` → 5.0.7, published 2026-01-04]

### Do NOT Install

| Package | Reason |
|---------|--------|
| `@types/jspdf` | Stub only — jsPDF 4.x ships `types/index.d.ts` bundled. Installing `@types/jspdf` adds nothing and may conflict. [VERIFIED: npm registry — package description reads "This is a stub types definition. jspdf provides its own type definitions"] |

### Installation

```bash
npm install jspdf jspdf-autotable
```

---

## Architecture Patterns

### Recommended File Structure Changes

```
src/
├── components/
│   ├── PdfExportModal.tsx    # NEW — two-choice modal (Phase 16 reuses this)
│   └── PrintLayout.tsx       # DELETE after wiring is confirmed working
├── utils/
│   └── export.ts             # ADD exportStoryAsPDF() alongside existing functions
└── pages/
    └── StoryWorkspacePage.tsx # MODIFY handleExportPDF → handleOpenPdfModal
```

### Pattern 1: jspdf-autotable v5 Named Import (Vite/ESM)

**What:** Use the named-export function form. The old `doc.autoTable()` method form and `applyPlugin()` are removed in v5.

**When to use:** Always — this is the only supported API in v5.

```typescript
// Source: [VERIFIED: github.com/simonbengtsson/jsPDF-AutoTable/issues/997]
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
autoTable(doc, { head: [headers], body: rows, startY: 35 })
doc.save('story.pdf')
```

### Pattern 2: Custom Text Header Before autoTable

**What:** Use `doc.text()`, `doc.setFontSize()`, and `doc.line()` before calling `autoTable`. Set `startY` to push the table below the header content.

**When to use:** Any time content must appear above the table (not as a table row).

```typescript
// Source: [VERIFIED: jsPDF API docs — artskydj.github.io/jsPDF/docs/jsPDF.html]
// Source: [CITED: github.com/simonbengtsson/jsPDF-AutoTable/issues/291]
const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' })

const margin = 14
let y = 20

// Title line
doc.setFontSize(16)
doc.setFont('helvetica', 'bold')
doc.text(story.title, margin, y)
y += 7

// Meta line: author · genre · date (omit empty fields, matching PrintLayout.tsx logic)
const exportDate = new Date().toLocaleDateString(undefined, {
  year: 'numeric', month: 'long', day: 'numeric',
})
const metaParts = [story.author || null, story.genre || null, `Exported ${exportDate}`].filter(Boolean)
const metaLine = metaParts.join('  ·  ')

doc.setFontSize(10)
doc.setFont('helvetica', 'normal')
doc.text(metaLine, margin, y)
y += 5

// Horizontal rule
doc.setLineWidth(0.3)
const pageWidth = doc.internal.pageSize.getWidth()
doc.line(margin, y, pageWidth - margin, y)
y += 5   // gap below rule → this becomes startY

autoTable(doc, {
  startY: y,
  // ... rest of options
})

doc.save(`${sanitizeFilename(story.title)}.pdf`)
```

### Pattern 3: Portrait 5-Column Table (Without Scores)

**What:** A4 portrait (210mm wide, ~14mm margins → ~182mm usable). Beat Text and Notes get most space; Step/Label/Act are fixed-narrow.

```typescript
// Source: [ASSUMED] — column math based on A4 portrait dimensions, pattern from jspdf-autotable docs
autoTable(doc, {
  startY: headerBottomY,
  showHead: 'everyPage',
  theme: 'grid',
  styles: { fontSize: 9, cellPadding: 2, overflow: 'linebreak' },
  headStyles: { fillColor: [80, 40, 120], textColor: 255, fontStyle: 'bold' },
  head: [['Step', 'Label', 'Act', 'Beat Text', 'Notes']],
  body: rows,
  columnStyles: {
    0: { cellWidth: 12 },   // Step — "01"–"16"
    1: { cellWidth: 30 },   // Label — e.g. "Safe Baseline"
    2: { cellWidth: 18 },   // Act — "Act IIA"
    3: { cellWidth: 'auto' },  // Beat Text — largest share
    4: { cellWidth: 50 },   // Notes — fixed reasonable width
  },
})
```

**Note on cellWidth 'auto':** When one column is `'auto'` and others are fixed, autoTable fills the remainder with the auto column. Beat Text benefits from this for long content. [CITED: github.com/simonbengtsson/jsPDF-AutoTable issues #273, #577]

### Pattern 4: Landscape 17-Column Table (With Scores)

**What:** A4 landscape (297mm wide, 14mm margins → ~269mm usable). 12 score columns are numeric/narrow; beat text and notes must share the remaining space.

```typescript
// Source: [ASSUMED] — column math derived from A4 landscape dimensions
// Score columns: 12 cols × 13mm each = 156mm
// Fixed: Step(12) + Label(28) + Act(18) = 58mm
// Remaining for BeatText+Notes: 269 - 156 - 58 = 55mm (split ~30/25)

const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

autoTable(doc, {
  startY: headerBottomY,
  showHead: 'everyPage',
  theme: 'grid',
  styles: { fontSize: 7, cellPadding: 1.5, overflow: 'linebreak' },
  headStyles: { fillColor: [80, 40, 120], textColor: 255, fontStyle: 'bold', fontSize: 6 },
  head: [[
    'Step', 'Label', 'Act', 'Beat Text', 'Notes',
    'Conn A', 'Conn T', 'Conn Δ',
    'Pres A', 'Pres T', 'Pres Δ',
    'Hope A', 'Hope T', 'Hope Δ',
    'Stab A', 'Stab T', 'Stab Δ',
  ]],
  body: rows,
  columnStyles: {
    0: { cellWidth: 12 },   // Step
    1: { cellWidth: 28 },   // Label
    2: { cellWidth: 18 },   // Act
    3: { cellWidth: 30 },   // Beat Text
    4: { cellWidth: 25 },   // Notes
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
  },
})
```

**Caution:** Column widths in Pattern 4 are approximate — the planner should treat them as a starting point to be verified by running the export and inspecting the PDF. Adjust cellWidth values if content clips. [ASSUMED]

### Pattern 5: Row Data Builder

**What:** Build the body array from `story.steps`, applying the D-04/D-05 display rules.

```typescript
// Source: delta pattern from src/components/PrintLayout.tsx line 81
const DIMENSIONS = ['connection', 'pressure', 'hope', 'stability'] as const
const ACT_LABELS: Record<string, string> = {
  I: 'Act I', IIA: 'Act IIA', IIB: 'Act IIB', III: 'Act III',
}

function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : delta === 0 ? '—' : String(delta)
}

function buildRows(steps: StoryStep[], includeScores: boolean): string[][] {
  return steps.map(step => {
    const num = String(step.stepNumber).padStart(2, '0')
    const base = [
      num,
      step.label,
      ACT_LABELS[step.act],
      step.beatText,   // D-12: empty string left blank — no substitution
      step.notes,      // D-12: empty string left blank
    ]
    if (!includeScores) return base

    const scoreCols: string[] = []
    for (const dim of DIMENSIONS) {
      const actual = step.actualScores[dim]
      const target = step.targetScores[dim]
      const delta = actual - target
      scoreCols.push(
        actual === 0 ? '—' : String(actual),  // D-05: 0 → em dash
        String(target),                        // D-06: always numeric
        formatDelta(delta),                    // D-04: +N / −N / —
      )
    }
    return [...base, ...scoreCols]
  })
}
```

### Pattern 6: PdfExportModal Component Structure

**What:** A minimal two-button modal matching the existing `StoryInfoModal` / `EmailCaptureModal` overlay pattern in this codebase.

```tsx
// Source: mirrors pattern in src/components/StoryInfoModal.tsx
interface Props {
  onChoose: (includeScores: boolean) => void
  onClose: () => void
}

export default function PdfExportModal({ onChoose, onClose }: Props) {
  return (
    <div
      className="capture-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="pdf-export-modal" role="dialog" aria-modal="true" aria-label="Export PDF">
        <h2 className="pdf-export-modal__heading">Export PDF</h2>
        <div className="pdf-export-modal__actions">
          <button className="btn-primary" onClick={() => onChoose(false)}>
            Without Scores
          </button>
          <button className="btn-ghost" onClick={() => onChoose(true)}>
            With Scores
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Pattern 7: StoryWorkspacePage Integration

**What:** Replace `handleExportPDF` with modal state and handler; close modal after PDF generation.

```tsx
// Source: mirrors existing modal state pattern (showStoryInfo, captureContext)
const [showPdfModal, setShowPdfModal] = useState(false)

function handleOpenPdfModal() {
  setShowPdfModal(true)
}

function handlePdfChoice(includeScores: boolean) {
  if (!hasSubmittedEmail() && !hasShownThisSession('export')) {
    markShownThisSession('export')
    setCaptureContext('export')
  }
  exportStoryAsPDF(story!, includeScores)
  setShowPdfModal(false)
}
```

### Anti-Patterns to Avoid

- **Using `doc.autoTable()`:** Removed in jspdf-autotable v5. Always use `autoTable(doc, options)`. [VERIFIED: github.com/simonbengtsson/jsPDF-AutoTable/issues/997]
- **Installing `@types/jspdf`:** jsPDF 4.x ships its own types. Adding `@types/jspdf` is a no-op stub and wastes a dep slot. [VERIFIED: npm registry]
- **Using `applyPlugin()`:** Removed in v5. No longer needed for the function-form API. [VERIFIED: github.com/simonbengtsson/jsPDF-AutoTable/issues/997]
- **Blob/anchor download for PDF:** Other exports use `URL.createObjectURL` + anchor because they're building blobs from strings. jsPDF's `doc.save(filename)` triggers the download directly — no Blob/anchor construction needed. [CITED: jspdf-autotable README]
- **Leaving `PrintLayout` in JSX after wiring:** PrintLayout is wrapped in a `<div className="print-layout">` that shows on screen too (just hidden via `@media print` CSS). Once jsPDF export works, remove both the import and the `<PrintLayout story={story} />` JSX in StoryWorkspacePage.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Multi-page PDF generation | Custom canvas-to-PDF pipeline | jsPDF 4.2.1 | Page break calculation, font embedding, cross-browser download — 100+ edge cases |
| PDF table with repeating headers | Manual header-per-page logic | jspdf-autotable 5.0.7 | Page break detection, cell overflow, column width math all handled |
| PDF text measurement / wrapping | Custom string truncation | autoTable `overflow: 'linebreak'` + `cellWidth` | Font metrics vary — jsPDF measures internally |
| TypeScript types for jsPDF | Custom type declarations | Bundled in jsPDF 4.x | Already ships `types/index.d.ts` |

**Key insight:** Multi-page PDF generation with correct table pagination is genuinely complex. The two libraries together handle everything — page dimensions, margins, font metrics, cell overflow, and header repetition — in 2 npm packages installed in 5 seconds.

---

## Common Pitfalls

### Pitfall 1: v5 Named Import vs. Default Import

**What goes wrong:** `import autoTable from 'jspdf-autotable'` (default) may work in some bundler configs but is not the v5 canonical form. `doc.autoTable()` throws at runtime because the method is no longer added to the prototype.

**Why it happens:** The README still shows both forms; older blog posts use default import.

**How to avoid:** Always use `import { autoTable } from 'jspdf-autotable'` (named) and `autoTable(doc, options)` (function call).

**Warning signs:** TypeScript error "Property 'autoTable' does not exist on type 'jsPDF'" — means someone used `doc.autoTable()`.

### Pitfall 2: Column Width Overflow in Landscape 17-Column Mode

**What goes wrong:** If column widths sum to more than the printable width, autoTable clips or wraps unpredictably. Content may render off-page.

**Why it happens:** A4 landscape printable width at 14mm margins is ~269mm. 17 columns with default `cellWidth: 'auto'` distribute evenly (~15.8mm each) — too wide for score columns to be readable, and Beat Text column collapses.

**How to avoid:** Use the `columnStyles` approach in Pattern 4 with explicit `cellWidth` per column. Verify total: sum of all `cellWidth` values must be <= printable width. Run the export once and inspect.

**Warning signs:** Score column headers wrap to two lines, or table width changes between pages (autotable issue #1057).

### Pitfall 3: `startY` Required to Clear Custom Header

**What goes wrong:** If `startY` is not set (or set too low), the autoTable renders on top of the custom text header drawn above it.

**Why it happens:** autoTable defaults to a small top margin, not accounting for any content already drawn on the page.

**How to avoid:** Track `y` as you draw header text lines, then pass `startY: y` to `autoTable`. The code in Pattern 2 shows the accumulation pattern.

**Warning signs:** Table header row overlaps the story title in the output PDF.

### Pitfall 4: `@media print` CSS Still Affecting PrintLayout

**What goes wrong:** If `PrintLayout` is removed from JSX but its `@media print` CSS remains, the print stylesheet is harmless. But if it is left in JSX, `window.print()` (if accidentally triggered) will render the old layout AND the new PDF flow confuses users.

**Why it happens:** D-19 says "can be removed" but there's a dependency: the CSS may be in a global file still referenced.

**How to avoid:** When removing `PrintLayout.tsx`, also audit and remove the `@media print` CSS block (likely in `src/index.css` or a dedicated `PrintLayout.css`). D-19 says "component and its CSS" — both must go.

**Warning signs:** Browser print still shows the old table layout.

### Pitfall 5: Email Capture Trigger Missing

**What goes wrong:** The PDF export handler doesn't call `markShownThisSession('export')` — the email capture modal never fires on the user's first PDF export.

**Why it happens:** `handleExportPDF` today just calls `window.print()` with no email capture logic. The new handler must explicitly include the Trigger 2 check (same as `handleExportJSON` and `handleExportMarkdown`).

**How to avoid:** Pattern 7 shows the required guard. The email capture trigger belongs in `handlePdfChoice` in StoryWorkspacePage, not inside `exportStoryAsPDF` in export.ts (keep export.ts side-effect-free).

---

## Code Examples

### Complete exportStoryAsPDF Skeleton (Reference)

```typescript
// Source: synthesized from jspdf docs + jspdf-autotable v5 API + existing export.ts patterns
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import type { Story, StoryStep } from '../types/story'

const DIMENSIONS = ['connection', 'pressure', 'hope', 'stability'] as const
const ACT_LABELS: Record<string, string> = {
  I: 'Act I', IIA: 'Act IIA', IIB: 'Act IIB', III: 'Act III',
}

function sanitizeFilename(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'story'
}

function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : delta === 0 ? '—' : String(delta)
}

export function exportStoryAsPDF(story: Story, includeScores: boolean): void {
  const orientation = includeScores ? 'landscape' : 'portrait'
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14

  // --- Custom header ---
  let y = 20
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(story.title, margin, y)
  y += 7

  const exportDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const metaParts = [story.author || null, story.genre || null, `Exported ${exportDate}`].filter(Boolean)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text((metaParts as string[]).join('  ·  '), margin, y)
  y += 5

  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 5   // startY for table

  // --- Table data ---
  const scoreHeaders = includeScores
    ? (['Conn A', 'Conn T', 'Conn Δ', 'Pres A', 'Pres T', 'Pres Δ', 'Hope A', 'Hope T', 'Hope Δ', 'Stab A', 'Stab T', 'Stab Δ'])
    : []
  const head = [['Step', 'Label', 'Act', 'Beat Text', 'Notes', ...scoreHeaders]]

  const body = story.steps.map((step: StoryStep) => {
    const base = [
      String(step.stepNumber).padStart(2, '0'),
      step.label,
      ACT_LABELS[step.act],
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
    styles: { fontSize: includeScores ? 7 : 9, cellPadding: includeScores ? 1.5 : 2, overflow: 'linebreak' },
    headStyles: { fillColor: [80, 40, 120], textColor: 255, fontStyle: 'bold' },
    head,
    body,
    columnStyles: includeScores
      ? {
          0: { cellWidth: 12 }, 1: { cellWidth: 28 }, 2: { cellWidth: 18 },
          3: { cellWidth: 30 }, 4: { cellWidth: 25 },
          5: { cellWidth: 13, halign: 'center' }, 6: { cellWidth: 13, halign: 'center' },
          7: { cellWidth: 13, halign: 'center' }, 8: { cellWidth: 13, halign: 'center' },
          9: { cellWidth: 13, halign: 'center' }, 10: { cellWidth: 13, halign: 'center' },
          11: { cellWidth: 13, halign: 'center' }, 12: { cellWidth: 13, halign: 'center' },
          13: { cellWidth: 13, halign: 'center' }, 14: { cellWidth: 13, halign: 'center' },
          15: { cellWidth: 13, halign: 'center' }, 16: { cellWidth: 13, halign: 'center' },
        }
      : {
          0: { cellWidth: 12 }, 1: { cellWidth: 30 }, 2: { cellWidth: 18 },
          3: { cellWidth: 'auto' }, 4: { cellWidth: 50 },
        },
  })

  doc.save(`${sanitizeFilename(story.title)}.pdf`)
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `doc.autoTable({})` (plugin on instance) | `autoTable(doc, {})` (named function) | jspdf-autotable v5 (2024) | v4 pattern breaks at runtime; must use function form |
| `import autoTable from 'jspdf-autotable'` (default) | `import { autoTable } from 'jspdf-autotable'` (named) | v5 | ESM named export resolves Vite tree-shaking correctly |
| `applyPlugin(jsPDF)` | Not needed | v5 | Plugin auto-registration removed |
| `doc.lastAutoTable.finalY` | Return value from `autoTable()`: `const t = autoTable(...); t.finalY` | v5 | Cleaner — no need to cast doc as any |
| `@types/jspdf` separate install | Bundled in jsPDF 4.x package | jsPDF 4.x | `@types/jspdf` is a stub; skip it |

**Deprecated/outdated:**

- `doc.autoTable()`: Removed in jspdf-autotable v5 — do not use
- `applyPlugin()`: Removed in v5 — do not use
- `@types/jspdf`: Stub, no value — do not install

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Portrait columnStyles widths (Step:12, Label:30, Act:18, Notes:50, BeatText:auto) fit A4 portrait at 14mm margins | Pattern 3, Code Examples | Column content clips or wraps badly — planner should add a "verify PDF output" task |
| A2 | Landscape columnStyles widths (12 score cols × 13mm = 156mm + 113mm for 5 base cols = 269mm total) fit A4 landscape at 14mm margins | Pattern 4, Code Examples | Same as A1 — must be verified by running the export |
| A3 | `fillColor: [80, 40, 120]` (purple) matches the project's brand color | Pattern 3/4 | Minor cosmetic issue — planner should note this is at Claude's discretion |
| A4 | `doc.internal.pageSize.getWidth()` is the correct API for getting page width in jsPDF 4.x | Pattern 2 | Horizontal rule may not span full width — easy to fix at runtime |

---

## Open Questions

1. **PrintLayout CSS location**
   - What we know: `PrintLayout.tsx` is the component to remove (D-19)
   - What's unclear: Whether `@media print` styles are in a dedicated `PrintLayout.css`, `src/index.css`, or inline
   - Recommendation: The plan should include a grep task for `@media print` and `print-layout` CSS class removal

2. **Purple brand color exact value**
   - What we know: headStyles fillColor is at Claude's discretion; the app uses purple
   - What's unclear: The exact hex/RGB of the project's purple brand color
   - Recommendation: Grep for CSS variables or existing purple usage in the codebase at plan time; `[80, 40, 120]` is a reasonable default

---

## Environment Availability

All dependencies for this phase are npm packages — no external services, CLIs, or runtimes beyond Node/npm.

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | npm install | ✓ | (existing project runs) | — |
| jspdf | exportStoryAsPDF | ✗ (not installed) | 4.2.1 on npm | — |
| jspdf-autotable | exportStoryAsPDF | ✗ (not installed) | 5.0.7 on npm | — |

**Missing dependencies with no fallback:**
- `jspdf` and `jspdf-autotable` must be installed as Wave 0 step: `npm install jspdf jspdf-autotable`

---

## Validation Architecture

No automated test framework is configured in this project (no `vitest.config.*`, `jest.config.*`, `pytest.ini`, or test directories detected). Validation for this phase is functional/manual.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Notes |
|--------|----------|-----------|-------|
| PDF2-01 | PDF export modal opens on button click | Manual | Click "↓ PDF" → modal appears |
| PDF2-02 | .pdf file downloads (no print dialog) | Manual | Browser downloads file, no dialog |
| PDF2-03 | Header shows title, author, genre, date | Manual | Open PDF, inspect first page top |
| PDF2-04 | 5-column portrait table | Manual | Count columns, verify orientation |
| PDF2-05 | 17-column landscape table with scores | Manual | Select "With Scores", count columns |
| PDF2-06 | 16 rows, blank cells for empty content | Manual | Check row count; no "—" in blank text cells |
| PDF2-07 | Headers repeat on page 2+ | Manual | Add content to many steps, export, flip to page 2 |

### Wave 0 Gaps

- [ ] `npm install jspdf jspdf-autotable` — packages not yet in node_modules

*(No test file gaps — no automated test infrastructure exists in project)*

---

## Security Domain

This phase involves client-side PDF generation only. No server calls, no authentication, no user data transmission — all data is already in the browser's localStorage. Security domain is not applicable to this phase.

---

## Sources

### Primary (HIGH confidence)
- npm registry — `npm view jspdf version` → 4.2.1 (published 2026-03-17)
- npm registry — `npm view jspdf-autotable version` → 5.0.7 (published 2026-01-04)
- npm registry — `npm view jspdf types` → bundled; `npm view @types/jspdf deprecated` → stub
- npm registry — `npm view jspdf-autotable peerDependencies` → `{ jspdf: '^2 || ^3 || ^4' }` — confirms v4.2.1 compatibility
- github.com/simonbengtsson/jsPDF-AutoTable/issues/997 — v5 named export API, breaking changes
- jsdocs.io/package/jspdf-autotable — UserOptions interface, autoTable function signature

### Secondary (MEDIUM confidence)
- github.com/simonbengtsson/jsPDF-AutoTable README — import patterns, column widths, showHead, startY
- artskydj.github.io/jsPDF/docs/jsPDF.html — doc.text(), doc.line(), doc.setFontSize(), doc.setFont() API
- Existing `src/components/PrintLayout.tsx` — delta display pattern (verified by reading source)
- Existing `src/components/StoryInfoModal.tsx` — modal overlay pattern (verified by reading source)

### Tertiary (LOW confidence / ASSUMED)
- Column width values in Pattern 3 and Pattern 4 — derived from A4 dimensions, not tested against actual jsPDF output
- `doc.internal.pageSize.getWidth()` API — known from training data, not verified against jsPDF 4.2.1 docs

---

## Metadata

**Confidence breakdown:**
- Library versions and API: HIGH — verified via npm registry and GitHub
- Import pattern (named export): HIGH — verified via github.com/simonbengtsson/jsPDF-AutoTable/issues/997
- doc.text() / doc.line() header pattern: MEDIUM — verified via jsPDF docs, but exact coordinates are ASSUMED
- Column widths: LOW (ASSUMED) — math is correct but real output must be checked
- Modal component pattern: HIGH — codebase already has StoryInfoModal to mirror
- Integration wiring: HIGH — existing StoryWorkspacePage handlers are well-understood from source read

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (stable libraries — 30-day estimate)
