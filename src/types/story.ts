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
  author: string;               // optional, empty string if not set
  genre: string;                // optional, empty string if not set
  logline: string;              // optional, empty string if not set
  preset: '16-step';
  createdAt: string;            // ISO date string
  updatedAt: string;
  steps: StoryStep[];
}
