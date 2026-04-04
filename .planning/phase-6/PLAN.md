# Phase 6 — Export & Example Story: Plan

## Goal
Writers can export their story as JSON or Markdown, import a JSON file, and load a pre-filled example story from the start screen.

## UAT Criteria (from roadmap)
1. Exporting a story produces a valid downloadable file
2. Importing a JSON file restores the story correctly
3. Loading the example story fills all 16 cards with pre-written beats and scores

---

## Task 1 — Create export utilities (`src/utils/export.ts`)

```ts
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
```

---

## Task 2 — Create example story (`src/data/exampleStory.ts`)

Import `STEP_DEFINITIONS` from `./steps` and `saveStory`, `setActiveStoryId` from `../services/storage`.

Build `EXAMPLE_STEPS` as an array of 16 `StoryStep` objects — each with `beatText`, `notes: ''`, and `actualScores` close to target but slightly varied:

| Step | Beat text (short) | Connection | Pressure | Hope | Stability |
|------|-------------------|------------|----------|------|-----------|
| 1  | Romeo and the Montagues celebrate in Verona — a city of old friendships and family pride. | 9 | 2 | 8 | 9 |
| 2  | A street brawl between Montagues and Capulets erupts; the Prince threatens death for the next offender. | 7 | 5 | 6 | 5 |
| 3  | Romeo's father worries about his son's mysterious sadness; Benvolio promises to find the cause. | 8 | 3 | 8 | 7 |
| 4  | Romeo crashes the Capulet feast and falls instantly, helplessly in love with Juliet — a Capulet. | 2 | 8 | 3 | 2 |
| 5  | Romeo and Juliet confess their love in the balcony scene, whispering of marriage. | 6 | 5 | 7 | 4 |
| 6  | Friar Laurence agrees to marry them secretly, hoping to end the feud. | 4 | 7 | 5 | 3 |
| 7  | Romeo and Juliet are married in secret — briefly, completely, joyfully bound together. | 8 | 4 | 8 | 6 |
| 8  | Tybalt kills Mercutio; Romeo kills Tybalt in grief-fuelled rage. He is banished from Verona. | 3 | 9 | 3 | 2 |
| 9  | Juliet's grief turns to loyalty. Romeo hides with Friar Laurence, raging and desperate. | 4 | 7 | 5 | 3 |
| 10 | Juliet's parents arrange her immediate marriage to Paris; she has no way out. | 3 | 9 | 3 | 2 |
| 11 | Friar Laurence gives Juliet a sleeping potion — a plan that could reunite them. | 7 | 5 | 8 | 5 |
| 12 | Juliet drinks the potion. Romeo, misinformed of her death, rides for her tomb. | 1 | 10 | 2 | 1 |
| 13 | Romeo arrives at the tomb, alone, convinced Juliet is dead. He sees only grief. | 2 | 9 | 2 | 2 |
| 14 | Romeo kills Paris, drinks poison beside Juliet. Juliet wakes, finds Romeo dead, takes his dagger. | 4 | 10 | 3 | 1 |
| 15 | Both dead. The families discover them. The Prince condemns all who played a part. | 7 | 4 | 8 | 6 |
| 16 | Capulets and Montagues swear peace over the bodies of their children. Verona is changed. | 9 | 1 | 8 | 9 |

Export a `loadExampleStory` function:
```ts
export function loadExampleStory(): string {
  const id = crypto.randomUUID()
  const story: Story = {
    id,
    title: 'Romeo & Juliet (Example)',
    genre: 'Tragedy',
    logline: 'Two star-crossed lovers defy their feuding families — and pay the ultimate price.',
    preset: '16-step',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: EXAMPLE_STEPS(id),  // pass id or just build inline
  }
  saveStory(story)
  setActiveStoryId(id)
  return id
}
```

Actually, build steps inline — no need for a factory. Just `EXAMPLE_STEPS` as a plain array (steps don't need the story id).

```ts
export function loadExampleStory(): string {
  const id = crypto.randomUUID()
  const story: Story = {
    id,
    title: 'Romeo & Juliet (Example)',
    genre: 'Tragedy',
    logline: 'Two star-crossed lovers defy their feuding families — and pay the ultimate price.',
    preset: '16-step',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: EXAMPLE_STEPS,
  }
  saveStory(story)
  setActiveStoryId(id)
  return id
}
```

---

## Task 3 — Update BoardHeader (`src/components/BoardHeader.tsx`)

Add props:
```ts
onExportJSON: () => void
onExportMarkdown: () => void
onImportJSON: (file: File) => void
```

Add a hidden `<input type="file" accept=".json">` ref inside the component. Clicking the "Import" button programmatically clicks it.

```tsx
const fileInputRef = useRef<HTMLInputElement>(null)
```

Add three buttons to the header (before the existing ∿ button):
```tsx
<button className="btn-ghost board-header__action" onClick={onExportJSON} title="Export as JSON">↓ JSON</button>
<button className="btn-ghost board-header__action" onClick={onExportMarkdown} title="Export as Markdown">↓ MD</button>
<button className="btn-ghost board-header__action" onClick={() => fileInputRef.current?.click()} title="Import JSON">↑</button>
<input
  ref={fileInputRef}
  type="file"
  accept=".json"
  style={{ display: 'none' }}
  onChange={e => {
    const file = e.target.files?.[0]
    if (file) onImportJSON(file)
    e.target.value = ''
  }}
/>
```

Add CSS for `.board-header__action`:
```css
.board-header__action {
  font-size: 12px;
  padding: 4px 10px;
  flex-shrink: 0;
}
```

---

## Task 4 — Wire import/export in StoryWorkspacePage (`src/pages/StoryWorkspacePage.tsx`)

Add imports:
```ts
import { exportStoryAsJSON, exportStoryAsMarkdown } from '../utils/export'
import { useNavigate } from 'react-router-dom'  // already imported
import { saveStory } from '../services/storage'  // already imported
```

Add `importError` state:
```ts
const [importError, setImportError] = useState<string | null>(null)
```

Add `handleImportJSON`:
```ts
async function handleImportJSON(file: File) {
  try {
    const text = await file.text()
    const parsed = JSON.parse(text)
    if (!parsed.id || !parsed.title || !Array.isArray(parsed.steps)) {
      setImportError('Invalid story file — missing required fields.')
      return
    }
    const importedStory = { ...parsed, id: crypto.randomUUID() }
    saveStory(importedStory)
    navigate(`/story/${importedStory.id}`)
  } catch {
    setImportError('Could not read file. Make sure it is a valid Story X-Ray JSON export.')
  }
}
```

Pass to `BoardHeader`:
```tsx
<BoardHeader
  ...existing props...
  onExportJSON={() => exportStoryAsJSON(story)}
  onExportMarkdown={() => exportStoryAsMarkdown(story)}
  onImportJSON={handleImportJSON}
/>
```

Show import error below the header if set:
```tsx
{importError && (
  <p className="import-error">{importError}</p>
)}
```

---

## Task 5 — Wire "Load Example" in StartPage (`src/pages/StartPage.tsx`)

Replace the `alert` stub:
```ts
import { loadExampleStory } from '../data/exampleStory'
```

```ts
function handleLoadExample() {
  const id = loadExampleStory()
  navigate(`/story/${id}`)
}
```

---

## Task 6 — Add CSS to `src/index.css`

```css
.board-header__action {
  font-size: 12px;
  padding: 4px 10px;
  flex-shrink: 0;
}

.import-error {
  font-size: 13px;
  color: #e53e3e;
  padding: 6px 16px;
  background: rgba(229, 62, 62, 0.06);
  border-bottom: 1px solid rgba(229, 62, 62, 0.2);
  margin: 0;
}
```

---

## Verification Checklist

- [ ] Clicking `↓ JSON` downloads a `.json` file with full story data
- [ ] Clicking `↓ MD` downloads a `.md` file with human-readable beats and scores
- [ ] Importing the exported `.json` creates a new story and navigates to it
- [ ] Importing a malformed JSON file shows an inline error message
- [ ] Clicking "Load Example" on StartPage loads Romeo & Juliet story and navigates to board
- [ ] Example story has beat text on all 16 cards
- [ ] Example story has non-zero scores on all 16 cards
- [ ] `vite build` passes
