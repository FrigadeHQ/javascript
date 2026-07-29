---
'@frigade/js': patch
'@frigade/react': patch
---

When `generateGuestId` is `false` and no `userId` has been provided, the SDK no longer generates or persists a guest ID at all (previously one was still created and stored in localStorage), and `useFlow` now resolves with `isLoading: false` instead of staying in a loading state forever.
