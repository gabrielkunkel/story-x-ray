# Story X-Ray

**See the shape of your story. Find what comes next.**

A local-first PWA that helps fiction writers construct, visualize, and refine stories using a 16-step architecture board. No account needed. Works offline. Installable on desktop and mobile.

---

## What it does

- **16-card board** across 4 act columns — each card maps to a structural step
- **Beat editor** — write what happens, add notes, expand the hint for guidance
- **4 emotional dimensions** — Connection, Pressure, Hope, Stability — scored 1–10
- **Target vs actual comparison** — see how your story's emotional shape differs from the ideal
- **Waveform graph** — 8-line chart (target + actual per dimension) across all 16 steps
- **Structural diagnostics** — rule-based warnings (flat zones, weak ruptures, false safety, unresolved endings)
- **Export** — download as JSON (reimportable) or Markdown
- **Import** — restore any exported story JSON
- **Example story** — load a pre-scored Romeo & Juliet to see the system in action
- **PWA** — installable from Chrome/Safari, works fully offline

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build      # TypeScript check + Vite production build
npm run preview    # Preview the production build locally
```

## Enable Beehiiv email capture

Set your publication ID in `src/config/beehiiv.ts`:

```ts
export const BEEHIIV_PUBLICATION_ID = 'pub_your-id-here'
```

Find it at app.beehiiv.com → Settings → Publication. Leave empty to run in dev mode (submissions logged to console only).

## Customize email modal

The email capture modal's marketing content is configured in  
`src/components/EmailCaptureModal.tsx` — look for the **Marketing config** comment block near the top of the file.

### Add a marketing image

1. Place your image in the `public/` directory (e.g. `public/marketing.png`)
2. Set the path in `EmailCaptureModal.tsx`:
   ```ts
   export const MODAL_IMAGE_SRC = '/marketing.png'
   ```
3. Leave `MODAL_IMAGE_SRC = ''` to hide the image

**Recommended dimensions:** 688 px wide (2x for retina), aspect ratio ~16:9 or ~3:1 (banner-style).

### Update headline and body copy

Edit the `COPY` record in the same config block. The `'act1'` entry controls the copy shown when the modal triggers after 4 beats are filled:

```ts
'act1': {
  headline: 'Your story is taking shape.',
  body: 'Get 5 example story maps, a beat gap checklist, and the structure rescue guide. Free.',
},
```

Other entries (`'export'`, `'diagnostics'`, `'examples'`, `'early-access'`) control copy for their respective trigger contexts.

---

## Tech stack

- React 19 + TypeScript
- Vite 8
- React Router 7
- Recharts
- vite-plugin-pwa (Workbox)
- localStorage — no backend, no auth

## Project structure

```
src/
  components/    UI components (BoardHeader, StoryCard, CardEditor, WaveformGraph, …)
  config/        App configuration (Beehiiv publication ID)
  data/          Static step definitions, example story
  pages/         StartPage, StorySetupPage, StoryWorkspacePage
  services/      localStorage read/write
  types/         TypeScript interfaces (Story, StoryStep, …)
  utils/         Pure functions (diagnostics, export, email capture)
.planning/       GSD roadmap, phase plans, state
```

---

## License

MIT
