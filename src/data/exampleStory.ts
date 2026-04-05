import type { Story, StoryStep } from '../types/story'
import { STEP_DEFINITIONS } from './steps'
import { saveStory, setActiveStoryId } from '../services/storage'

const BEAT_TEXT: Record<number, string> = {
  1:  'Romeo and the Montagues celebrate in Verona — a city of old friendships and family pride.',
  2:  'A street brawl between Montagues and Capulets erupts; the Prince threatens death for the next offender.',
  3:  "Romeo's father worries about his son's mysterious sadness; Benvolio promises to find the cause.",
  4:  'Romeo crashes the Capulet feast and falls instantly, helplessly in love with Juliet — a Capulet.',
  5:  'Romeo and Juliet confess their love in the balcony scene, whispering of marriage.',
  6:  'Friar Laurence agrees to marry them secretly, hoping to end the feud.',
  7:  'Romeo and Juliet are married in secret — briefly, completely, joyfully bound together.',
  8:  "Tybalt kills Mercutio; Romeo kills Tybalt in grief-fuelled rage. He is banished from Verona.",
  9:  "Juliet's grief turns to loyalty. Romeo hides with Friar Laurence, raging and desperate.",
  10: "Juliet's parents arrange her immediate marriage to Paris; she has no way out.",
  11: 'Friar Laurence gives Juliet a sleeping potion — a plan that could reunite them.',
  12: 'Juliet drinks the potion. Romeo, misinformed of her death, rides for her tomb.',
  13: 'Romeo arrives at the tomb, alone, convinced Juliet is dead. He sees only grief.',
  14: 'Romeo kills Paris, drinks poison beside Juliet. Juliet wakes, finds Romeo dead, takes his dagger.',
  15: 'Both dead. The families discover them. The Prince condemns all who played a part.',
  16: 'Capulets and Montagues swear peace over the bodies of their children. Verona is changed.',
}

const ACTUAL_SCORES: Record<number, { connection: number; pressure: number; hope: number; stability: number }> = {
  1:  { connection: 9, pressure: 2, hope: 8, stability: 9 },
  2:  { connection: 7, pressure: 5, hope: 6, stability: 5 },
  3:  { connection: 8, pressure: 3, hope: 8, stability: 7 },
  4:  { connection: 2, pressure: 8, hope: 3, stability: 2 },
  5:  { connection: 6, pressure: 5, hope: 7, stability: 4 },
  6:  { connection: 4, pressure: 7, hope: 5, stability: 3 },
  7:  { connection: 8, pressure: 4, hope: 8, stability: 6 },
  8:  { connection: 3, pressure: 9, hope: 3, stability: 2 },
  9:  { connection: 4, pressure: 7, hope: 5, stability: 3 },
  10: { connection: 3, pressure: 9, hope: 3, stability: 2 },
  11: { connection: 7, pressure: 5, hope: 8, stability: 5 },
  12: { connection: 1, pressure: 10, hope: 2, stability: 1 },
  13: { connection: 2, pressure: 9, hope: 2, stability: 2 },
  14: { connection: 4, pressure: 10, hope: 3, stability: 1 },
  15: { connection: 7, pressure: 4, hope: 8, stability: 6 },
  16: { connection: 9, pressure: 1, hope: 8, stability: 9 },
}

const EXAMPLE_STEPS: StoryStep[] = STEP_DEFINITIONS.map(def => ({
  ...def,
  beatText: BEAT_TEXT[def.stepNumber] ?? '',
  notes: '',
  actualScores: ACTUAL_SCORES[def.stepNumber] ?? { connection: 0, pressure: 0, hope: 0, stability: 0 },
}))

export function loadExampleStory(): string {
  const id = crypto.randomUUID()
  const story: Story = {
    id,
    title: 'Romeo & Juliet (Example)',
    author: 'William Shakespeare',
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
