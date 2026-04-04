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
  7:  "A moment of connection, success, or temporary relief. Savor it — it won't last.",
  8:  'A betrayal, reveal, or reversal that undoes the progress from step 7.',
  9:  'The protagonist digs in and tries to fix what broke. Effort, not success.',
  10: 'The threat gets bigger, closer, or more personal. The situation worsens.',
  11: "It looks like everything might work out — but it's too easy. Something is off.",
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
