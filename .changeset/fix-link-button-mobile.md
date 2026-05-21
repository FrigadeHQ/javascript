---
"@frigade/react": patch
---

Fix mobile popup-blocker swallowing primary/secondary button link clicks. When a step exposes `primaryButton.uri` (or the legacy `primaryButtonUri`) and the consumer hasn't overridden the `navigate` prop, the button now renders as a native `<a href target rel>` so the browser handles navigation directly. Previously the click triggered `window.open` after an awaited `step.complete`, which iOS Safari and Chrome Android silently block as a popup because the user-gesture context was lost. Buttons without a URI, and buttons under a custom `navigate` handler, are unchanged. Visual styling is identical.
