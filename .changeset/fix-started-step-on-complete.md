---
"@frigade/js": patch
---

Send STARTED_STEP event for the next step when completing/skipping a step. Previously, `complete()` and `skip()` optimistically marked the next step as started in local state but did not send the STARTED_STEP event to the API, which caused a subsequent `start()` call to no-op.
