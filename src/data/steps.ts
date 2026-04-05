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

// Fiction examples shown in card editor to ground writers in structural patterns
export interface StepExample {
  source: string       // Work name, e.g. "Harry Potter (Philosopher's Stone)" or "[Original]"
  isOriginal?: boolean // true for invented scenarios
  text: string         // 2–3 sentences illustrating why this moment fits the beat
}

export const STEP_EXAMPLES: Record<number, StepExample[]> = {
  1: [
    {
      source: 'Harry Potter (Philosopher\'s Stone)',
      text: 'Harry lives under the stairs, surrounded by the Dursleys\' comfortable mundanity. He belongs nowhere, yet the Dursley household is all he knows — a stable, if unkind, normal. The world has not yet broken for him; it merely hums with a low wrongness.',
    },
    {
      source: 'Pride & Prejudice',
      text: 'The Bennet household is alive with domestic routine: daughters to marry off, nerves to indulge, neighbours to gossip about. Longbourn is not paradise, but it is known — a world of small social certainties. Nothing has ruptured yet.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'A middle school librarian shelves books on a Tuesday afternoon, her cart squeaking down the same aisle it always does. Her daughter calls from college to say she\'s fine. Everything is exactly as it should be.',
    },
  ],
  2: [
    {
      source: 'Star Wars (A New Hope)',
      text: 'The Imperial Star Destroyer overwhelms the Rebel ship in the opening frames — a crack of violence splitting open ordinary space. For Luke on Tatooine, the disturbance is quieter: two droids fall from the sky and one of them is carrying a secret. Something has arrived that does not belong.',
    },
    {
      source: 'The Godfather',
      text: 'At Connie\'s wedding, Michael arrives in his Army uniform, still outside the family business. But Sollozzo\'s interest in the Corleones is sharpening off-screen. The festivity is real, yet underneath it a tension is beginning to coil — someone wants something the Corleones may not be able to refuse.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'The librarian finds a book returned with pages torn out — not vandalized, but carefully removed. The card pocket holds a note in a child\'s handwriting: "I needed to keep this part." The routine has developed a small, strange fault line.',
    },
  ],
  3: [
    {
      source: 'Harry Potter (Philosopher\'s Stone)',
      text: 'After a Hogwarts letter arrives, Uncle Vernon spirits the family away to a remote island hut. The move feels decisive — surely they\'ve escaped whatever was coming. Harry almost believes it too. The threat seems contained, the world briefly stable again.',
    },
    {
      source: 'Pride & Prejudice',
      text: 'After Bingley\'s ball raises hopes for Jane, Mrs Bennet is certain a match is all but settled. The household relaxes into pleased anticipation. The sense of reprieve is genuine, even if the reader can see how fragile the foundation is.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'The librarian\'s principal assures her the missing pages are just a prank. She writes it off, re-shelves the book with a new copy of the missing section, and goes home. Everything feels resolved — perhaps it was nothing.',
    },
  ],
  4: [
    {
      source: 'Harry Potter (Philosopher\'s Stone)',
      text: 'The letters begin arriving by the hundreds — down the chimney, through every gap. The Dursleys\' suppression fails completely, and Hagrid arrives to deliver the truth in person. The rupture is not a single blow but an unstoppable tide; the old world literally cannot hold back what is coming.',
    },
    {
      source: 'The Godfather',
      text: 'Sollozzo\'s men shoot Vito Corleone in the street. In one afternoon, the Godfather is incapacitated, the family\'s protection evaporates, and Michael\'s civilian life becomes untenable. The shooting is the real story\'s starting gun — everything before it was prelude.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'The librarian arrives Monday to find her entire fiction section has been methodically rearranged overnight — not vandalized, reorganized, by a logic she cannot decode. The principal\'s door is locked. The security footage is blank. The world she managed is no longer the world she is in.',
    },
  ],
  5: [
    {
      source: 'Star Wars (A New Hope)',
      text: 'Ben Kenobi tells Luke about the Force and offers to teach him. An escape route, a mentor, a lightsaber, a purpose — each arrives like a breath of oxygen into a sealed room. The mission to deliver R2-D2 gives the chaos a shape Luke can act on.',
    },
    {
      source: 'Pride & Prejudice',
      text: 'Elizabeth meets Wickham, who is charming, attentive, and apparently wronged by Darcy. He represents possibility — a man she can like without reservation. His arrival opens a door she didn\'t know she was looking for.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'A student named Theo slips the librarian a hand-drawn map of the school with certain shelves marked in red. He whispers that others have noticed the rearrangements too, and that they\'ve been tracking them. For the first time, she is not alone in the strangeness.',
    },
  ],
  6: [
    {
      source: 'Star Wars (A New Hope)',
      text: 'The Millennium Falcon is captured by the Death Star\'s tractor beam. Obi-Wan moves through shadow to disable it while Luke and Han blunder into rescuing Leia. Every action compounds the risk — there is no safe move left, only the next necessary one.',
    },
    {
      source: 'The Godfather',
      text: 'Michael visits his father in the hospital and finds him unguarded — a trap. He stalls for time by inventing the presence of bodyguards outside. The pressure is no longer theoretical; it is a phone call away from becoming a second assassination. Michael\'s civilian life is over in all but name.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'The rearrangements accelerate. A student reports that a chapter of her history textbook now describes an event that never happened. The principal stops returning calls. Theo\'s map no longer matches the school as it currently exists. Something is rewriting the institution from within.',
    },
  ],
  7: [
    {
      source: 'Harry Potter (Philosopher\'s Stone)',
      text: 'Harry discovers he is gifted at Quidditch, wins the house championship, and makes real friends for the first time in his life. Hogwarts feels like home — genuinely, not provisionally. For a stretch of weeks, the threat seems distant and the belonging feels earned.',
    },
    {
      source: 'Pride & Prejudice',
      text: 'The Netherfield ball. Jane dances with Bingley, the families mingle, and Elizabeth has every reason to hope the match will come. The evening carries real warmth. The reader feels it too, which is exactly what makes the reversal land.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'Theo\'s group maps the full extent of the alterations and presents them to the librarian in a clear, evidence-backed document. For one afternoon, the strangeness is contained in a binder and the group feels unified and purposeful. They believe, briefly, that understanding equals control.',
    },
  ],
  8: [
    {
      source: 'Harry Potter (Philosopher\'s Stone)',
      text: 'Harry discovers that Quirrell, not Snape, has been the threat all along — and that Voldemort has been living on the back of his head. The trusted world of Hogwarts contains the danger within it. The betrayal is structural: he was never as safe as he thought.',
    },
    {
      source: 'The Godfather',
      text: 'Sonny is ambushed and killed at the tollbooth. The war the family thought they were managing turns lethal in an instant. Michael, still in exile, learns that the family\'s strength was an illusion the enemy had been waiting to puncture.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'Theo disappears. The binder is gone. The librarian finds Theo\'s locker emptied, his enrollment record showing he transferred three months ago — before any of this started. She cannot prove he was ever real, and the group won\'t meet her eye.',
    },
  ],
  9: [
    {
      source: 'Star Wars (The Empire Strikes Back)',
      text: 'After the disaster on Hoth, Luke goes to Dagobah to train while Han and Leia flee through the galaxy. Each is trying to recover capacity after the Empire\'s blow. The effort is real and costly — training is not triumph, and fleeing is not safety.',
    },
    {
      source: 'The Godfather',
      text: 'Michael returns from Sicily to take control of the family. He is methodical: restructuring operations, making peace gestures, beginning to think like the Don he will become. The damage from Sonny\'s death drives him forward, but victory is not yet visible.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'The librarian starts documenting every anomaly herself — photographs, timestamps, witnesses. She files a formal complaint with the school board and contacts a journalist. She is working harder than she ever has. None of it is yielding results yet, but she has not stopped.',
    },
  ],
  10: [
    {
      source: 'Star Wars (The Empire Strikes Back)',
      text: 'Vader pursues the Millennium Falcon relentlessly. Han and Leia\'s asteroid-field escape is brilliant, but Vader simply waits — he has hired bounty hunters. The opposition is not just powerful; it is patient. Every clever move the heroes make is answered.',
    },
    {
      source: 'Pride & Prejudice',
      text: 'Lydia\'s elopement with Wickham arrives like a detonation. In one act of folly, every Bennet daughter\'s marriage prospects are jeopardized. The threat is now intimate and familial — no longer an external obstacle but a wound from within the household.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'The journalist publishes nothing. The school board votes to place the librarian on administrative leave pending a "review of conduct." The alterations in the library continue. The institution she was trying to protect is now the instrument being used against her.',
    },
  ],
  11: [
    {
      source: 'Star Wars (Return of the Jedi)',
      text: 'The Rebels destroy the shield generator on Endor and the fleet moves in — the plan is working, the Death Star is exposed. Every element has clicked into place. The victory feels earned and complete, which is precisely the moment the Emperor reveals it was all a trap.',
    },
    {
      source: 'Harry Potter (Philosopher\'s Stone)',
      text: 'Harry, Ron, and Hermione solve the final obstacle and Harry presses forward alone, certain that Snape is waiting on the other side and that they have out-thought him. The confidence is real. The error is invisible until the door opens.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'The review clears the librarian of misconduct. She is reinstated, photographed shaking the principal\'s hand, and the board commends her dedication to students. Walking back through the library doors, she notices the shelves have been rearranged again — differently this time, and the patterns spell something.',
    },
  ],
  12: [
    {
      source: 'Star Wars (The Empire Strikes Back)',
      text: 'Han is frozen in carbonite and taken by Boba Fett. Luke\'s hand is severed. Vader is his father. The Rebel fleet is scattered. Each loss is distinct and devastating, and they arrive in quick succession — the story strips its protagonist down to almost nothing.',
    },
    {
      source: 'The Godfather',
      text: 'The Corleone family is at its most isolated: Vito gravely ill, Sonny dead, Michael still in exile, the other families aligned against them. The Corleone name means less than it ever has. The catastrophe is total — there is nothing left to lose.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'The librarian\'s documentation is subpoenaed by the school district\'s lawyers and sealed. Her apartment is broken into; the physical backups are gone. Her daughter stops calling. She sits in the emptied library after hours, alone, surrounded by shelves she no longer believes she understands.',
    },
  ],
  13: [
    {
      source: 'Star Wars (The Empire Strikes Back)',
      text: 'Alone in the cave on Dagobah, Luke faces the vision of Vader — and finds his own face inside the mask. On Bespin, stripped of his friends and his hand, he hangs above the abyss and hears a truth he cannot yet absorb. The isolation forces a confrontation with what he has been avoiding.',
    },
    {
      source: 'Pride & Prejudice',
      text: 'Elizabeth re-reads Darcy\'s letter and, alone with it, realizes she has been wrong about Wickham, wrong about Darcy, and wrong about herself. The isolation strips the social noise away. She sees her own vanity clearly for the first time, and the recognition is painful and clarifying.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'Alone in her car in the school parking lot at 2 a.m., the librarian reads through everything from the beginning — and sees that the pattern in the rearrangements has been pointing at a single student\'s name all along. A student no one else remembers. A student whose records don\'t exist. A student she taught.',
    },
  ],
  14: [
    {
      source: 'Star Wars (Return of the Jedi)',
      text: 'Luke surrenders himself to Vader and is brought before the Emperor. He refuses to fight. He refuses to yield. He stands in the throne room under maximum pressure and makes the choice that defines him — not a fight, but a refusal. The confrontation is irreversible.',
    },
    {
      source: 'The Godfather',
      text: 'Michael orchestrates the baptism massacre. While standing as godfather to his nephew, he sanctions the simultaneous killing of all rival family heads. The action is cold, irreversible, and complete. After this moment, Michael cannot pretend he is anything other than what he has become.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'The librarian walks into the school board meeting unannounced, sets her documentation on the table, and names the student. She does not know what will happen. She knows she cannot not say it. The room goes very still.',
    },
  ],
  15: [
    {
      source: 'Star Wars (Return of the Jedi)',
      text: 'Vader kills the Emperor to save Luke — and dies. The Death Star is destroyed. The sacrifice is real: the victory costs Anakin his life. The resolution is earned precisely because something irreplaceable was spent to achieve it.',
    },
    {
      source: 'Pride & Prejudice',
      text: 'Darcy\'s second proposal and Elizabeth\'s acceptance close the arc — not as the original wish-fulfillment she imagined at the start, but as something she has grown into. The happiness is genuine because both characters are different people than they were. Transformation is the price of the resolution.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'The student is found — not in the school, but in the archive room where withdrawn student records are stored, surrounded by books he has been slowly, painstakingly, correcting. The librarian sits with him until morning. She does not call the principal. Some things are more important than procedure.',
    },
  ],
  16: [
    {
      source: 'Harry Potter (Philosopher\'s Stone)',
      text: 'Harry returns to the Dursleys\' for the summer, but the boy who left and the boy who returns are not the same. He knows who he is now. The ordinary world is unchanged; only his relationship to it has shifted — and that shift is everything.',
    },
    {
      source: 'The Godfather',
      text: 'The film\'s final image: Kay watches the door close as Michael\'s men kiss his hand. She sees what he has become. He has achieved complete power and lost something that cannot be named — and the new equilibrium holds both facts at once, without resolving them.',
    },
    {
      source: '[Original]',
      isOriginal: true,
      text: 'The librarian opens the library on a Monday morning. The shelves are in their correct order. Theo\'s records have been quietly restored. She doesn\'t know what was real. She shelves the returned books and makes coffee, and the cart still squeaks down the same aisle — but she listens to it differently now.',
    },
  ],
}
