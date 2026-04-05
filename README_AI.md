<project_context>
<project_name>Story Architecture Board</project_name>
<canonical_mode>16-step standard</canonical_mode>
<advanced_mode>28-step later</advanced_mode>
<primary_value>
Help writers construct and discover stories by keeping the whole story visible
and helping them figure out what should happen next.
</primary_value>
<positioning>
Story construction first. Diagnostics second.
</positioning>
<mvp_platform>PWA / local-first web app</mvp_platform>
<stack>React + TypeScript</stack>
<mvp_core>
16 story cards across 4 acts, with beat text, notes, actual scores,
target scores, waveform graph, simple diagnostics, and JSON/markdown export.
</mvp_core>
<dimensions>
connection, pressure, hope, stability
</dimensions>
<constraints>
No AI, no auth, no sync, no screenplay import, no Final Draft parsing,
no collaboration, no paywall in MVP.
</constraints>
</project_context>




<project>
  <name>Story Architecture Board</name>
  <type>MVP product instructions</type>
  <status>Active project</status>

  <mission>
    Build a simple, local-first application that helps writers construct, visualize, and refine stories using a 16-step architecture board.
  </mission>

<core_decision> <platform>Web app first</platform> <reason>
Start as a local-first web app / PWA rather than Electron.
This keeps the MVP simpler, faster to build, easier to share, and easier to test.
If a desktop wrapper is wanted later, the web app can be packaged into Electron or Tauri after validation. </reason>
</core_decision>

  <positioning>
    This product is not primarily an AI tool. (No AI should be included.)
    This product is not primarily a diagnostic tool. (That is part of what it does.)
    The primary value is a story construction and story discovery workspace.
    Diagnostics are a secondary layer.
  </positioning>

<product_truth>
The app helps writers:
- see the whole shape of their story
- figure out what should happen next
- discover missing structural beats
- compare intended story movement with actual story movement
- keep the story visible as a complete progression map
  </product_truth>

  <audience>
    Writers, screenwriters, story thinkers, and creators who want a structured but flexible way to develop a story.
  </audience>

  <mvp>
    <summary>
      The MVP is a 16-step story architecture board with optional waveform diagnostics.
    </summary>

```
<primary_mode>16-step standard mode</primary_mode>
<future_mode>28-step advanced mode</future_mode>

<main_workspace>
  A 4-column board, one column per act:
  - Act I
  - Act IIA
  - Act IIB
  - Act III

  Each act contains 4 cards.
  Total cards: 16.
</main_workspace>

<card_fields>
  Each story step card contains:
  - step number
  - label
  - purpose
  - beat text
  - notes
  - actual connection score
  - actual pressure score
  - actual hope score
  - actual stability score
  - target scores for comparison
</card_fields>

<secondary_features>
  - waveform graph
  - target vs actual comparison
  - delta / variance readout
  - rule-based warnings
  - JSON export
  - markdown export
  - local persistence
</secondary_features>
```

  </mvp>

<non_goals>
Do not build in the MVP:
- AI integrations
- screenplay imports
- Final Draft parsing
- cloud sync
- auth or accounts
- collaboration
- paywall
- genre presets
- advanced 28-step mode
- polished marketing site
  </non_goals>

<core_model> <overview>
The app uses a 16-step structure as the main story skeleton.
Each step has recommended target values for four dimensions.
The user enters the actual values for their story.
The app compares target vs actual. </overview>

```
<dimensions>
  <dimension name="connection">
    How emotionally connected the protagonist feels to people, purpose, identity, or safety.
  </dimension>
  <dimension name="pressure">
    How much external or internal force is compressing the protagonist.
  </dimension>
  <dimension name="hope">
    How strongly the story suggests progress or success is possible.
  </dimension>
  <dimension name="stability">
    How durable, secure, or predictable the current world-state feels.
  </dimension>
</dimensions>
```

</core_model>

<structure_16_step> <step number="1" act="I" label="Safe Baseline">Establish belonging, normality, emotional ground.</step> <step number="2" act="I" label="Tension Emerges">A disturbance destabilizes the emotional field.</step> <step number="3" act="I" label="False Safety">Temporary reassurance, renewed connection, partial relief.</step> <step number="4" act="I" label="Rupture">A harder break launches the real story.</step> <step number="5" act="IIA" label="Fragile Hope">A new plan, alliance, romance, or lead appears.</step> <step number="6" act="IIA" label="Escalating Pressure">Danger, suspicion, stakes, or emotional risk rise.</step> <step number="7" act="IIA" label="Temporary Union">A win, reunion, intimacy, or breakthrough.</step> <step number="8" act="IIA" label="Deeper Rupture">Betrayal, reversal, new threat, or truth exposure.</step> <step number="9" act="IIB" label="Recovery Attempt">The protagonist tries to repair the damage.</step> <step number="10" act="IIB" label="Greater Threat">The opposition intensifies; safety erodes.</step> <step number="11" act="IIB" label="Final False Victory">It seems like things might finally work.</step> <step number="12" act="IIB" label="Catastrophic Separation">The deepest break before the climax.</step> <step number="13" act="III" label="Isolation / Truth">The protagonist faces reality alone.</step> <step number="14" act="III" label="Final Confrontation">Irreversible action under maximum pressure.</step> <step number="15" act="III" label="Earned Resolution">Reunion, sacrifice, tragedy, or victory.</step> <step number="16" act="III" label="New Equilibrium">A transformed emotional world.</step>
</structure_16_step>

<targets_16_step> <row step="1" connection="9" pressure="2" hope="8" stability="9" /> <row step="2" connection="7" pressure="5" hope="7" stability="6" /> <row step="3" connection="8" pressure="3" hope="8" stability="7" /> <row step="4" connection="2" pressure="9" hope="3" stability="2" /> <row step="5" connection="5" pressure="6" hope="6" stability="4" /> <row step="6" connection="4" pressure="8" hope="5" stability="3" /> <row step="7" connection="8" pressure="4" hope="8" stability="6" /> <row step="8" connection="3" pressure="9" hope="4" stability="2" /> <row step="9" connection="4" pressure="7" hope="5" stability="3" /> <row step="10" connection="3" pressure="9" hope="4" stability="2" /> <row step="11" connection="7" pressure="5" hope="8" stability="5" /> <row step="12" connection="1" pressure="10" hope="2" stability="1" /> <row step="13" connection="2" pressure="9" hope="3" stability="2" /> <row step="14" connection="4" pressure="10" hope="4" stability="2" /> <row step="15" connection="8" pressure="4" hope="9" stability="7" /> <row step="16" connection="9" pressure="1" hope="8" stability="9" />
</targets_16_step>

<key_product_principles> <principle>Construction first, diagnostics second.</principle> <principle>Local-first and deterministic for MVP.</principle> <principle>Writers should be able to start with a premise and fill in the 16 cards.</principle> <principle>The board is the main product. The waveform is a support layer.</principle> <principle>Simple rule-based diagnostics are enough for V1.</principle> <principle>Use the 16-step system as the canonical language of the product.</principle>
</key_product_principles>

<ui_overview> <screen name="start">
- Start New 16-Step Story
- Load Example Story </screen>

```
<screen name="story_setup">
  - Story title
  - Genre optional
  - Logline optional
  - Preset: 16-step standard
</screen>

<screen name="main_workspace">
  - left or top: 4 act columns with 16 cards
  - center: selected card editor
  - right: target vs actual and diagnostics
  - bottom or top: waveform graph
</screen>

<screen name="export">
  - export JSON
  - export markdown
  - copy table
</screen>
```

</ui_overview>

  <diagnostics>
    <rule>Flag flat zones when several consecutive steps barely change.</rule>
    <rule>Flag weak ruptures when pressure does not rise enough or stability does not collapse enough.</rule>
    <rule>Flag false safety when relief does not actually feel safer than the prior state.</rule>
    <rule>Flag unresolved endings when final equilibrium still carries too much pressure and too little stability.</rule>
  </diagnostics>

<data_shape>
Each saved story should contain:
- title
- preset
- steps[]
- target scores
- actual scores
- beat text
- notes
  </data_shape>

<likely_tech_direction> <frontend>React + TypeScript</frontend> <storage>Local storage first; file export/import later</storage> <charting>Simple line chart for waveform</charting> <delivery>PWA first; desktop wrapper later only if needed</delivery>
</likely_tech_direction>

<why_pwa_first>
A PWA is better than Electron for the MVP because:
- less complexity
- faster build time
- easier sharing with writers
- easier testing and iteration
- no real need for desktop-only capabilities yet

```
Electron can still be added later if desktop packaging becomes useful.
```

</why_pwa_first>

<assistant_guidance>
When helping on this project in future chats:
- assume the 16-step structure is the current canonical version
- prioritize MVP simplicity and speed
- avoid adding AI unless explicitly requested later
- keep features local-first and deterministic
- prefer product decisions that make the board easier to use and easier to explain
- treat the waveform and diagnostics as support for story construction, not the main event
- keep advice aligned with React + TypeScript + PWA unless there is a strong reason to change
  </assistant_guidance>

<current_status>
So far, the project has:
- a clear 16-step canonical structure
- target values for connection, pressure, hope, and stability
- a 28-step advanced concept for later
- a product positioning decision: story construction first
- an MVP definition centered on a 16-card board
- a likely tech direction: local-first PWA using React + TypeScript
  </current_status> </project>

<quick_reference>
<canonical_mode>16-step standard mode</canonical_mode>
<advanced_mode>28-step advanced mode, later</advanced_mode>
<primary_value>Help writers discover what should happen next and keep the whole story visible.</primary_value>
<mvp_stack>React + TypeScript + PWA + local storage</mvp_stack>
<mvp_core>16 cards, 4 acts, 4 sliders, graph, simple diagnostics, export</mvp_core>
</quick_reference>

<lead_generation_mvp>
<purpose>
The free Story Architecture Board is a lead magnet designed to grow an owned audience of writers.
The MVP must include lightweight email capture without gating initial product use.
</purpose>

<email_platform>
Use Beehiiv as the default email capture and newsletter platform.
Prioritize the free tier for MVP.
</email_platform>

<capture_strategy>
Do not require login before using the board.
Allow immediate anonymous use.

    Trigger email capture only after the user experiences value:
    - after completing Act I
    - after exporting
    - after viewing diagnostics
    - when requesting example story maps
    - when requesting advanced 28-step early access
</capture_strategy>

<primary_offer>
Offer a high-value free companion asset in exchange for email:
- 5 example story maps
- beat gap checklist
- “what happens next?” rescue guide
- advanced 28-step waitlist
</primary_offer>

<ui_requirements>
Include reusable CTA components:
- inline email capture card
- export-to-email modal
- sticky footer upgrade CTA
- post-Act-I milestone popup
</ui_requirements>

<future_funnel>
The email list nurtures users toward:
- premium story evolution app
- advanced diagnostics
- paid writer workflows
- screenplay evolution tools
- AI-assisted story refinement later
</future_funnel>
</lead_generation_mvp>


