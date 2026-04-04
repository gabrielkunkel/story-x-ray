# Story X-Ray — Project Context

## Mission
Build a local-first web app (PWA) that helps writers construct, visualize, and refine stories using a 16-step architecture board.

## Product Positioning
**Story construction first. Diagnostics second.**

The app helps writers:
- See the whole shape of their story
- Figure out what should happen next
- Discover missing structural beats
- Compare intended story movement with actual story movement
- Keep the story visible as a complete progression map

This is **not** an AI tool and **not** primarily a diagnostic tool. The board is the product. The waveform and diagnostics are a support layer.

## Primary Audience
Fiction writers, screenwriters, story thinkers, and creators who want a structured but flexible workspace to develop a story.

## Core Model: 16-Step Structure
Four acts with four steps each. Each step has recommended **target values** for four emotional dimensions, which writers compare against their **actual story values**.

### Dimensions
| Dimension | Meaning |
|---|---|
| **Connection** | How emotionally connected the protagonist feels to people, purpose, identity, or safety |
| **Pressure** | How much external or internal force is compressing the protagonist |
| **Hope** | How strongly the story suggests progress or success is possible |
| **Stability** | How durable, secure, or predictable the current world-state feels |

### 16 Steps
| # | Act | Label |
|---|---|---|
| 1 | I | Safe Baseline |
| 2 | I | Tension Emerges |
| 3 | I | False Safety |
| 4 | I | Rupture |
| 5 | IIA | Fragile Hope |
| 6 | IIA | Escalating Pressure |
| 7 | IIA | Temporary Union |
| 8 | IIA | Deeper Rupture |
| 9 | IIB | Recovery Attempt |
| 10 | IIB | Greater Threat |
| 11 | IIB | Final False Victory |
| 12 | IIB | Catastrophic Separation |
| 13 | III | Isolation / Truth |
| 14 | III | Final Confrontation |
| 15 | III | Earned Resolution |
| 16 | III | New Equilibrium |

### Target Scores (1–10)
| Step | Connection | Pressure | Hope | Stability |
|---|---|---|---|---|
| 1 | 9 | 2 | 8 | 9 |
| 2 | 7 | 5 | 7 | 6 |
| 3 | 8 | 3 | 8 | 7 |
| 4 | 2 | 9 | 3 | 2 |
| 5 | 5 | 6 | 6 | 4 |
| 6 | 4 | 8 | 5 | 3 |
| 7 | 8 | 4 | 8 | 6 |
| 8 | 3 | 9 | 4 | 2 |
| 9 | 4 | 7 | 5 | 3 |
| 10 | 3 | 9 | 4 | 2 |
| 11 | 7 | 5 | 8 | 5 |
| 12 | 1 | 10 | 2 | 1 |
| 13 | 2 | 9 | 3 | 2 |
| 14 | 4 | 10 | 4 | 2 |
| 15 | 8 | 4 | 9 | 7 |
| 16 | 9 | 1 | 8 | 9 |

## MVP Scope
**Include:**
- 16-card board across 4 act columns
- Card editor: beat text, notes
- Actual score inputs per card (connection, pressure, hope, stability)
- Target vs actual comparison + delta readout
- Waveform line chart
- Rule-based diagnostics
- JSON + Markdown export
- Load example story
- Email capture via Beehiiv (triggered, not gated)
- Local storage persistence
- PWA (installable, offline-capable)

**Exclude from MVP:**
- AI integrations
- Screenplay / Final Draft import
- Cloud sync
- Auth / accounts
- Collaboration
- Paywall
- Advanced 28-step mode
- Genre presets

## Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build**: Vite 8
- **Storage**: localStorage (file export/import later)
- **Charting**: Simple line chart (Recharts or Chart.js)
- **Delivery**: PWA first
- **Email**: Beehiiv (free tier, form embed or API)

## Lead Gen Strategy
Anonymous use is always allowed — no login required.

Email capture is triggered (not gated) after user experiences value:
- After completing Act I (all 4 cards have beat text)
- After first export
- After viewing diagnostics
- When requesting example stories
- When requesting 28-step early access

**Offer:** Free companion asset pack (5 example story maps, beat gap checklist, rescue guide, 28-step waitlist)

## Key Principles
1. Construction first, diagnostics second
2. Local-first and deterministic for MVP
3. The board is the main product; waveform is a support layer
4. Simple rule-based diagnostics are enough for V1
5. Use the 16-step system as the canonical language
6. No AI unless explicitly added later
