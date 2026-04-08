# Phase 22: Email Trigger Debounce - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the discussion.

**Date:** 2026-04-08
**Phase:** 22-email-trigger-debounce
**Mode:** discuss
**Areas discussed:** Blur trigger scope, Notes field behavior, Card navigation

## Gray Areas Presented

| Area | Question | Decision |
|------|----------|----------|
| Blur trigger scope | Does ANY beat blur fire the modal, or only the qualifying field? | Only the specific field that pushed the count to 4 |
| Notes field behavior | Does typing in Notes reset the 10s debounce timer? | Yes — notes = continued engagement, resets timer |
| Card navigation | Does clicking another story card fire the modal or reset the timer? | Continued engagement — resets timer, does not fire immediately |

## User's Intent (verbatim summary)

> "The modal should appear only at a genuinely elegant pause: after meaningful progress has been made, after the user is no longer actively typing, after a real idle moment, not just normal navigation inside the workflow."

The blur trigger (EMAIL-03) is intended for the case where the user fills the 4th beat and then leaves the app entirely — not as a mechanism that can fire from normal in-app card navigation.

## Corrections / Clarifications

- Terminology clarified: "blur" = field losing focus (interaction event), not CSS blur.
- Notes typing explicitly included in "continued engagement" — not just beat text.
- Card navigation explicitly excluded from immediate-fire trigger.

## No Deferred Scope

No new capabilities were discussed. EMAIL-F01 (configurable timeout) was already in REQUIREMENTS.md as a future item — confirmed out of scope here.
