---
'@frigade/js': patch
---

Skip all Frigade API requests when `generateGuestId` is set to `false` and no `userId` has been provided. Previously the SDK would still send a `flowStates` request with an auto-generated guest ID on initialization, page navigation, and tab focus.
