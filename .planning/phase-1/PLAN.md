# Phase 1 — App Foundation
**Goal:** Working app shell with routing, data model, localStorage, and story setup flow.

## Prerequisites
Install two packages before writing any code:
```bash
npm install react-router-dom
npm install -D vite-plugin-pwa
```

---

## Task 1 — TypeScript Data Model
**File:** `src/types/story.ts` *(create)*

Define all interfaces the app will use. These must be stable — later phases build on top of them.

```ts
export type Dimension = 'connection' | 'pressure' | 'hope' | 'stability';

export interface DimensionScores {
  connection: number;
  pressure: number;
  hope: number;
  stability: number;
}

export interface StoryStep {
  stepNumber: number;           // 1–16
  act: 'I' | 'IIA' | 'IIB' | 'III';
  label: string;                // e.g. "Safe Baseline"
  purpose: string;              // one-sentence description
  beatText: string;             // user-authored beat content
  notes: string;                // user working notes
  actualScores: DimensionScores;
  targetScores: DimensionScores; // from static config, copied in at creation
}

export interface Story {
  id: string;                   // uuid v4 — use crypto.randomUUID()
  title: string;
  genre: string;                // optional, empty string if not set
  logline: string;              // optional, empty string if not set
  preset: '16-step';
  createdAt: string;            // ISO date string
  updatedAt: string;
  steps: StoryStep[];
}
```

**Acceptance:** File compiles with no TypeScript errors; all types exported.

---

## Task 2 — 16-Step Structure Config
**File:** `src/data/steps.ts` *(create)*

Static data: the 16 step definitions with labels, purposes, and canonical target scores. This is the source of truth for step structure and targets.

```ts
import type { StoryStep } from '../types/story';

// Base structure without user-authored fields
type StepDefinition = Omit<StoryStep, 'beatText' | 'notes' | 'actualScores'>;

export const STEP_DEFINITIONS: StepDefinition[] = [
  { stepNumber: 1,  act: 'I',   label: 'Safe Baseline',          purpose: 'Establish belonging, normality, emotional ground.',              targetScores: { connection: 9, pressure: 2, hope: 8, stability: 9 } },
  { stepNumber: 2,  act: 'I',   label: 'Tension Emerges',         purpose: 'A disturbance destabilizes the emotional field.',               targetScores: { connection: 7, pressure: 5, hope: 7, stability: 6 } },
  { stepNumber: 3,  act: 'I',   label: 'False Safety',            purpose: 'Temporary reassurance, renewed connection, partial relief.',     targetScores: { connection: 8, pressure: 3, hope: 8, stability: 7 } },
  { stepNumber: 4,  act: 'I',   label: 'Rupture',                 purpose: 'A harder break launches the real story.',                       targetScores: { connection: 2, pressure: 9, hope: 3, stability: 2 } },
  { stepNumber: 5,  act: 'IIA', label: 'Fragile Hope',            purpose: 'A new plan, alliance, romance, or lead appears.',               targetScores: { connection: 5, pressure: 6, hope: 6, stability: 4 } },
  { stepNumber: 6,  act: 'IIA', label: 'Escalating Pressure',     purpose: 'Danger, suspicion, stakes, or emotional risk rise.',            targetScores: { connection: 4, pressure: 8, hope: 5, stability: 3 } },
  { stepNumber: 7,  act: 'IIA', label: 'Temporary Union',         purpose: 'A win, reunion, intimacy, or breakthrough.',                    targetScores: { connection: 8, pressure: 4, hope: 8, stability: 6 } },
  { stepNumber: 8,  act: 'IIA', label: 'Deeper Rupture',          purpose: 'Betrayal, reversal, new threat, or truth exposure.',            targetScores: { connection: 3, pressure: 9, hope: 4, stability: 2 } },
  { stepNumber: 9,  act: 'IIB', label: 'Recovery Attempt',        purpose: 'The protagonist tries to repair the damage.',                   targetScores: { connection: 4, pressure: 7, hope: 5, stability: 3 } },
  { stepNumber: 10, act: 'IIB', label: 'Greater Threat',          purpose: 'The opposition intensifies; safety erodes.',                    targetScores: { connection: 3, pressure: 9, hope: 4, stability: 2 } },
  { stepNumber: 11, act: 'IIB', label: 'Final False Victory',     purpose: 'It seems like things might finally work.',                      targetScores: { connection: 7, pressure: 5, hope: 8, stability: 5 } },
  { stepNumber: 12, act: 'IIB', label: 'Catastrophic Separation', purpose: 'The deepest break before the climax.',                          targetScores: { connection: 1, pressure: 10, hope: 2, stability: 1 } },
  { stepNumber: 13, act: 'III', label: 'Isolation / Truth',       purpose: 'The protagonist faces reality alone.',                          targetScores: { connection: 2, pressure: 9, hope: 3, stability: 2 } },
  { stepNumber: 14, act: 'III', label: 'Final Confrontation',     purpose: 'Irreversible action under maximum pressure.',                   targetScores: { connection: 4, pressure: 10, hope: 4, stability: 2 } },
  { stepNumber: 15, act: 'III', label: 'Earned Resolution',       purpose: 'Reunion, sacrifice, tragedy, or victory.',                      targetScores: { connection: 8, pressure: 4, hope: 9, stability: 7 } },
  { stepNumber: 16, act: 'III', label: 'New Equilibrium',         purpose: 'A transformed emotional world.',                                targetScores: { connection: 9, pressure: 1, hope: 8, stability: 9 } },
];

// Hint text shown in card editor to guide writers
export const STEP_HINTS: Record<number, string> = {
  1:  'Show the protagonist in their everyday world — where they belong and feel safe.',
  2:  'Introduce the first sign that something is wrong or about to change.',
  3:  'Let things seem okay again — briefly. The calm before the storm.',
  4:  'The event that truly breaks the old world and forces the story forward.',
  5:  'A glimmer of possibility: a new ally, lead, plan, or relationship.',
  6:  'The stakes increase. Pressure builds. Things get harder or more dangerous.',
  7:  'A moment of connection, success, or temporary relief. Savor it — it won\'t last.',
  8:  'A betrayal, reveal, or reversal that undoes the progress from step 7.',
  9:  'The protagonist digs in and tries to fix what broke. Effort, not success.',
  10: 'The threat gets bigger, closer, or more personal. The situation worsens.',
  11: 'It looks like everything might work out — but it\'s too easy. Something is off.',
  12: 'The worst moment. Everything falls apart. The protagonist hits rock bottom.',
  13: 'Alone, stripped of pretense, the protagonist sees the truth clearly.',
  14: 'The defining choice. Maximum pressure, irreversible action.',
  15: 'The earned outcome — not necessarily happy, but meaningful and true.',
  16: 'The new normal. What has changed? What has the protagonist become?',
};

// Helper: create a fresh Story with all 16 steps initialized
export function createFreshSteps(): StoryStep[] {
  return STEP_DEFINITIONS.map(def => ({
    ...def,
    beatText: '',
    notes: '',
    actualScores: { connection: 0, pressure: 0, hope: 0, stability: 0 },
  }));
}
```

**Acceptance:** `createFreshSteps()` returns exactly 16 steps with correct act assignments and target scores.

---

## Task 3 — localStorage Service
**File:** `src/services/storage.ts` *(create)*

Thin wrapper around localStorage. All story I/O goes through here — no component should call `localStorage` directly.

```ts
import type { Story } from '../types/story';

const STORIES_KEY = 'story-xray:stories';
const ACTIVE_KEY  = 'story-xray:activeId';

export function loadAllStories(): Story[] {
  try {
    const raw = localStorage.getItem(STORIES_KEY);
    return raw ? (JSON.parse(raw) as Story[]) : [];
  } catch {
    return [];
  }
}

export function saveStory(story: Story): void {
  const stories = loadAllStories();
  const idx = stories.findIndex(s => s.id === story.id);
  const updated = { ...story, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    stories[idx] = updated;
  } else {
    stories.push(updated);
  }
  localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
}

export function loadStory(id: string): Story | null {
  return loadAllStories().find(s => s.id === id) ?? null;
}

export function deleteStory(id: string): void {
  const stories = loadAllStories().filter(s => s.id !== id);
  localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
}

export function getActiveStoryId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveStoryId(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}
```

**Acceptance:** Can create, read, update, and delete stories in localStorage. `loadAllStories()` returns `[]` on empty storage (not an error).

---

## Task 4 — Routing Setup
**File:** `src/App.tsx` *(replace entirely)*

Wire up React Router. Three routes for Phase 1:
- `/` → `<StartPage>`
- `/setup` → `<StorySetupPage>`
- `/story/:id` → `<StoryWorkspacePage>` (placeholder)

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StartPage from './pages/StartPage'
import StorySetupPage from './pages/StorySetupPage'
import StoryWorkspacePage from './pages/StoryWorkspacePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/setup" element={<StorySetupPage />} />
        <Route path="/story/:id" element={<StoryWorkspacePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

Delete `src/App.css` — it contains only template styles. Reset `src/index.css` to keep only the base resets and CSS custom properties, removing all template-specific rules (`.hero`, `.counter`, `#next-steps`, `#docs`, `#social`, `#spacer`, `.ticks`).

**Acceptance:** App renders without errors. Navigating to `/` shows StartPage, `/setup` shows StorySetupPage.

---

## Task 5 — Start Page
**File:** `src/pages/StartPage.tsx` *(create)*

The first screen a writer sees. Simple, focused.

```tsx
import { useNavigate } from 'react-router-dom'
import { getActiveStoryId } from '../services/storage'

export default function StartPage() {
  const navigate = useNavigate()

  function handleNewStory() {
    navigate('/setup')
  }

  function handleLoadExample() {
    // Placeholder for Phase 6 — show a toast/note for now
    alert('Example stories coming soon!')
  }

  const activeId = getActiveStoryId()

  return (
    <main className="start-page">
      <h1>Story X-Ray</h1>
      <p className="tagline">
        See the shape of your story. Find what comes next.
      </p>

      <div className="start-actions">
        <button className="btn-primary" onClick={handleNewStory}>
          New Story
        </button>
        {activeId && (
          <button className="btn-secondary" onClick={() => navigate(`/story/${activeId}`)}>
            Continue Story
          </button>
        )}
        <button className="btn-ghost" onClick={handleLoadExample}>
          Load Example
        </button>
      </div>

      <p className="start-note">
        16-step story architecture · Local-first · No account needed
      </p>
    </main>
  )
}
```

Add minimal styles in `src/index.css` for `.start-page`, `.start-actions`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.tagline`, `.start-note`.

**Acceptance:** Page renders with correct buttons. "New Story" navigates to `/setup`. "Continue Story" only appears if there is a saved story in localStorage.

---

## Task 6 — Story Setup Page
**File:** `src/pages/StorySetupPage.tsx` *(create)*

Form to create a new story. Validates title, creates the Story object, saves it, redirects to workspace.

```tsx
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveStory, setActiveStoryId } from '../services/storage'
import { createFreshSteps } from '../data/steps'
import type { Story } from '../types/story'

export default function StorySetupPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [logline, setLogline] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Story title is required.')
      return
    }
    const story: Story = {
      id: crypto.randomUUID(),
      title: title.trim(),
      genre: genre.trim(),
      logline: logline.trim(),
      preset: '16-step',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: createFreshSteps(),
    }
    saveStory(story)
    setActiveStoryId(story.id)
    navigate(`/story/${story.id}`)
  }

  return (
    <main className="setup-page">
      <h1>New Story</h1>
      <form className="setup-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Title <span aria-hidden="true">*</span></label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What is your story called?"
            autoFocus
          />
          {error && <p className="field-error">{error}</p>}
        </div>

        <div className="field">
          <label htmlFor="genre">Genre <span className="optional">(optional)</span></label>
          <input
            id="genre"
            type="text"
            value={genre}
            onChange={e => setGenre(e.target.value)}
            placeholder="e.g. thriller, romance, sci-fi"
          />
        </div>

        <div className="field">
          <label htmlFor="logline">Logline <span className="optional">(optional)</span></label>
          <textarea
            id="logline"
            value={logline}
            onChange={e => setLogline(e.target.value)}
            placeholder="One or two sentences about what your story is really about."
            rows={3}
          />
        </div>

        <div className="setup-actions">
          <button type="button" className="btn-ghost" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create Story
          </button>
        </div>
      </form>
    </main>
  )
}
```

Add styles for `.setup-page`, `.setup-form`, `.field`, `.field-error`, `.optional`, `.setup-actions`.

**Acceptance:** Submitting with an empty title shows an error. Submitting with a valid title creates a story in localStorage and navigates to `/story/:id`.

---

## Task 7 — Story Workspace Placeholder
**File:** `src/pages/StoryWorkspacePage.tsx` *(create)*

Minimal placeholder so the route doesn't error. Phase 2 fills this out.

```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { loadStory } from '../services/storage'

export default function StoryWorkspacePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const story = id ? loadStory(id) : null

  if (!story) {
    return (
      <main className="workspace-placeholder">
        <p>Story not found.</p>
        <button className="btn-ghost" onClick={() => navigate('/')}>Back to start</button>
      </main>
    )
  }

  return (
    <main className="workspace-placeholder">
      <h1>{story.title}</h1>
      {story.genre && <p className="story-meta">Genre: {story.genre}</p>}
      {story.logline && <p className="story-meta">{story.logline}</p>}
      <p className="coming-soon">Board coming in Phase 2.</p>
      <button className="btn-ghost" onClick={() => navigate('/')}>← Back</button>
    </main>
  )
}
```

**Acceptance:** Navigating to `/story/:id` shows the story title if the story exists, or a "not found" message otherwise.

---

## Task 8 — PWA Manifest & Plugin
**File:** `vite.config.ts` *(edit)*

Add `vite-plugin-pwa` with a minimal manifest. Icons will be placeholders for now — use the existing `public/` assets or simple colored squares. Full PWA icon polish is Phase 8.

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Story X-Ray',
        short_name: 'StoryXRay',
        description: 'See the shape of your story. Find what comes next.',
        theme_color: '#aa3bff',
        background_color: '#16171d',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
```

Create `public/icons/` and add two placeholder PNG icons (192×192 and 512×512) — can be simple purple squares for now. Use any tool available (ImageMagick, a script, or manually copied assets).

**Acceptance:** `vite build` completes without errors. `manifest.webmanifest` is present in the build output. Dev server still starts normally.

---

## Task 9 — CSS Cleanup
**File:** `src/index.css` *(edit)*

Remove all template-specific styles. Keep only:
- `:root` CSS custom properties (colors, fonts)
- `body { margin: 0 }`
- `#root` layout (but change `text-align: center` to `text-align: left` — the board is left-aligned content)
- Base `h1`, `h2`, `p` resets
- Dark mode `@media (prefers-color-scheme: dark)`

Add new utility classes that multiple pages share:
```css
.btn-primary { ... }  /* filled purple button */
.btn-secondary { ... } /* outlined button */
.btn-ghost { ... }   /* text-only button */
```

Delete `src/App.css` entirely (it's all template-specific).

**Acceptance:** No visual regressions. All three button variants render correctly in light and dark mode.

---

## Commit Instructions
After all tasks pass UAT, make a single atomic commit:

```
git add src/types/story.ts src/data/steps.ts src/services/storage.ts \
        src/App.tsx src/main.tsx src/index.css \
        src/pages/StartPage.tsx src/pages/StorySetupPage.tsx \
        src/pages/StoryWorkspacePage.tsx \
        vite.config.ts public/icons/
git rm src/App.css
git commit -m "feat: Phase 1 — app foundation, data model, routing, localStorage, PWA manifest"
```

---

## UAT Checklist
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes without TypeScript errors
- [ ] Visiting `/` shows Start Page with "New Story" button
- [ ] Clicking "New Story" navigates to `/setup`
- [ ] Submitting setup form with empty title shows validation error
- [ ] Submitting with a valid title creates a story and redirects to `/story/:id`
- [ ] Refreshing `/story/:id` still shows the story (localStorage persistence)
- [ ] "Continue Story" appears on start page after creating a story
- [ ] `vite build` outputs `manifest.webmanifest` in `dist/`
- [ ] No TypeScript compilation errors (`tsc --noEmit`)

---

## Threat Model (minimal for this phase)
- **localStorage key collision:** Keys are namespaced (`story-xray:*`) — low risk
- **JSON parse failure:** `loadAllStories()` catches and returns `[]` — handled
- **crypto.randomUUID availability:** Available in all modern browsers and Vite's dev server (HTTPS context not required for localhost) — acceptable
