---
"@frigade/js": patch
"@frigade/react": patch
---

Fix branching forms with `visibilityCriteria`: after completing a step whose form data hides the optimistically-chosen next step, the client now sends `STARTED_STEP` for the actual current step from the refreshed state instead of the now-hidden one. Previously this caused the server's `currentStepId` to flip back to the hidden step and the form to re-render it. Preserves the `STARTED_STEP`-on-complete behavior introduced in `@frigade/js@0.9.7`.
