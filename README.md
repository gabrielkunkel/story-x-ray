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

## Environment files

The app uses Vite's `loadEnv` to control the asset base path at build time.

| File | Purpose |
|------|---------|
| `.env` | Local development. Sets `VITE_BASE_PATH=/` (root). Used by `npm run dev` and `npm run build`. |
| `.env.gh-pages` | GitHub Pages build. Sets `VITE_BASE_PATH=/story-x-ray/`. Used by `npm run build:prod`. |
| `.env.example` | Documentation template. Copy to `.env` and adjust for your environment. |

Both `.env` and `.env.gh-pages` are committed to the repository — they contain no secrets, only the base path value.

To deploy to a different GitHub Pages URL (e.g. `/my-fork/`), edit `.env.gh-pages`:

```
VITE_BASE_PATH=/my-fork/
```

## Deploying to GitHub Pages

A GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys the app on every push to `main`.

### Enable GitHub Pages (one-time setup)

1. Go to your repository on GitHub
2. Navigate to **Settings → Pages**
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
4. Push any commit to `main` — the workflow runs automatically

### Build commands

```bash
npm run build:prod   # GitHub Pages build — reads .env.gh-pages (VITE_BASE_PATH=/story-x-ray/)
npm run build        # Local production build — reads .env (VITE_BASE_PATH=/)
npm run preview      # Preview a local build at localhost:4173
```

Use `npm run build:prod` for deployment. Use `npm run build` to verify the local build locally.

## Routing

This app uses React Router's **HashRouter**. All routes are prefixed with `#` in the URL:

```
https://username.github.io/story-x-ray/#/
https://username.github.io/story-x-ray/#/setup
https://username.github.io/story-x-ray/#/story/abc123
```

HashRouter keeps all navigation client-side, which means static hosts (including GitHub Pages) serve a single `index.html` without needing server-side route configuration. Direct URL access and page refresh work correctly.

If you see routes without `#/` (e.g. `/setup` 404ing on refresh), check that `src/App.tsx` uses `HashRouter` from `react-router-dom`.

## Enable Beehiiv email capture

Set your publication ID in `src/config/beehiiv.ts`:

```ts
export const BEEHIIV_PUBLICATION_ID = 'pub_your-id-here'
```

Find it at app.beehiiv.com → Settings → Publication. Leave empty to run in dev mode (submissions logged to console only).

## Customize email modal

The email capture modal's content is configured in `src/config/emailModal.ts`.  
Edit that file and redeploy — no component changes needed.

### Fields

#### Global (same across all trigger contexts)

| Field | Type | Description |
|-------|------|-------------|
| `imageSrc` | `string` | Path to marketing image in `public/`. Empty string = no image. |
| `ctaText` | `string` | Label on the email submit button. |
| `footer` | `string?` | Optional line below the form (e.g. "No spam."). Empty or absent = hidden. |

#### Per-context (keyed by `CaptureContext`)

Each context key (`act1`, `export`, `diagnostics`, `examples`, `early-access`) has:

| Field | Type | Description |
|-------|------|-------------|
| `headline` | `string` | Bold title shown at the top of the modal. |
| `subtitle` | `string` | Body paragraph below the headline. |
| `bullets` | `string[]` | Optional bullet list rendered as `<ul><li>` items. Empty array = hidden. |

### Add a marketing image

1. Place your image in `public/` (e.g. `public/marketing.png`)
2. Set `imageSrc` in `src/config/emailModal.ts`:
   ```ts
   global: {
     imageSrc: '/marketing.png',
     ...
   }
   ```
3. Leave `imageSrc: ''` to hide the image

**Recommended dimensions:** 688 px wide (2x for retina), aspect ratio ~16:9 or ~3:1 (banner-style).

### Add bullets

Set the `bullets` array for any context:

```ts
'act1': {
  headline: 'Your story is taking shape.',
  subtitle: 'Free resources to help you finish.',
  bullets: [
    '5 example story maps',
    'Beat gap checklist',
    'Structure rescue guide',
  ],
},
```

### Rich content

Structured fields (`bullets`) are the supported rich-content mechanism. Plain strings in `headline`, `subtitle`, and `footer` are rendered as text — no HTML or markdown parsing. To emphasize content, use bullets rather than inline markup.

### Deploy workflow

1. Edit `src/config/emailModal.ts`
2. Run `npm run build` to verify no type errors
3. Deploy the updated build

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
