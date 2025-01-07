# @frigade/react

## 2.6.8

### Patch Changes

- 2860866: Bug fixes for onDismiss, onOpenChange, and URL-based Collection targeting
- Updated dependencies [2860866]
  - @frigade/js@0.7.24

## 2.6.7

### Patch Changes

- 0a6c80d: Fixes an issue where `generateGuestId` if used with the `useFrigade()` could cause components not to load
- Updated dependencies [0a6c80d]
  - @frigade/js@0.7.23

## 2.6.6

### Patch Changes

- 991ebe2: Adds the ability to override the default scoring (options) on the `Survey.NPS` component

## 2.6.5

### Patch Changes

- 3808781: Fix issue with ESM import of use-sync-external-store.

## 2.6.4

### Patch Changes

- 3855645: Fixes an issue with React 17 related to useSyncExternalStore

## 2.6.3

### Patch Changes

- 51c62d6: Show error logs when hooks are used outside the context of the `Frigade.Provider`

## 2.6.2

### Patch Changes

- 32d72bc: Fixes an issue where `flow.restart()` followed by `flow.start()` could cause Dialog flows not to show up

## 2.6.1

### Patch Changes

- cce59b6: Fixes a series of inconsistencies in dismissible behaviors across components

## 2.6.0

### Minor Changes

- ae705d1: Refactored useModal. Modal collision detection should behave more consistently with SSR / caching.

## 2.5.29

### Patch Changes

- b59ede2: Fix Button active styles

## 2.5.28

### Patch Changes

- 25e7a98: Add video props to Announcement, Card, Collapsible

## 2.5.27

### Patch Changes

- 76343a0: Allow video HTML props to be passed into Tour

## 2.5.26

### Patch Changes

- e8de2d9: Adds a `try/catch` to localStorage getter/setter
- Updated dependencies [e8de2d9]
  - @frigade/js@0.7.22

## 2.5.25

### Patch Changes

- e9053ec: Partially de-flake Form tests
- 1eef79d: Fix dismissible prop in Tour

## 2.5.24

### Patch Changes

- 595957b: Fixes an issue where form state triggers on step change even if no fields are dirty

## 2.5.23

### Patch Changes

- 7d96719: Fixes a minor bug where multiple flow back and forth navigations can result in a 2 page form to finish prematurely
- Updated dependencies [7d96719]
  - @frigade/js@0.7.21

## 2.5.22

### Patch Changes

- 51b6444: Fixes an issue where variables are sometimes not applied when using useFlow() with the same Flow ID in a component
- Updated dependencies [51b6444]
  - @frigade/js@0.7.20

## 2.5.21

### Patch Changes

- 2982a19: Fixes an issue where variables are sometimes not applied when using useFlow() with the same Flow ID in a component
- Updated dependencies [2982a19]
  - @frigade/js@0.7.19

## 2.5.20

### Patch Changes

- 177f6bb: Fixes an edge cases where variables used in form fields do not update in some cases
- Updated dependencies [177f6bb]
  - @frigade/js@0.7.18

## 2.5.19

### Patch Changes

- 6c8748e: Contains a series of minor bug fixes related to tours and variables
- Updated dependencies [6c8748e]
  - @frigade/js@0.7.17

## 2.5.18

### Patch Changes

- 96a7862: Fixes an issue where checklists complete when finishing the last step
- Updated dependencies [96a7862]
  - @frigade/js@0.7.16

## 2.5.17

### Patch Changes

- e8d1067: Fixes an issue where visibilityCriteria is not respected with some flow actions
- ea45487: Adds support for props in form fields

## 2.5.16

### Patch Changes

- 740bcb0: Fixes a typescript issue related to the `css` prop
- Updated dependencies [740bcb0]
  - @frigade/js@0.7.15

## 2.5.15

### Patch Changes

- 67475cc: Fixes a build issue with core-js and Next.js

## 2.5.14

### Patch Changes

- 09f77bd: Adds missing typescript docs for some components and hooks
- Updated dependencies [09f77bd]
  - @frigade/js@0.7.14

## 2.5.13

### Patch Changes

- c8c6cc4: Fixes an edge case/race condition that can occur with forms that have branching
- Updated dependencies [c8c6cc4]
  - @frigade/js@0.7.13

## 2.5.12

### Patch Changes

- 459fa14: Fixes an edge case for collections with url-based targeting
- Updated dependencies [459fa14]
  - @frigade/js@0.7.12

## 2.5.11

### Patch Changes

- 8d7f97c: Fixes an issue where anchor hashes causes network calls with state updates to be cancelled
- Updated dependencies [8d7f97c]
  - @frigade/js@0.7.11

## 2.5.10

### Patch Changes

- a03e03a: Fixes a non-fatal typescript error on <Frigade.Tour />

## 2.5.9

### Patch Changes

- 6a93986: Fixes an edge case where modals can sometime flicker when doing fast browser navigation
- Updated dependencies [6a93986]
  - @frigade/js@0.7.10

## 2.5.8

### Patch Changes

- a786557: Fixes an issue where url targeting is not always working with some routers

## 2.5.7

### Patch Changes

- ce2444f: A few fixes for the Tour component

## 2.5.6

### Patch Changes

- 365a31e: Fixes an issue where setting the user id with a delay could cause `useFlow` to return `undefined`

## 2.5.5

### Patch Changes

- e079e76: Fixes an edge case where `onComplete()` would not be called in some cases

## 2.5.4

### Patch Changes

- 3da8c7b: Fixes a bug where collection cooloffs were not respected

## 2.5.3

### Patch Changes

- efb77dd: Adds the ability to pass global variables to Flows and Collections

## 2.5.2

### Patch Changes

- 175670a: Correctly merges CSS in the NPS Survey component
- 6f4f7bd: Add variables prop to Collection

## 2.5.1

### Patch Changes

- f7d3e16: Fixes an issue where lazy loaded dynamic variables are not updating in a form

## 2.5.0

### Minor Changes

- a680a56: Revamped Tour Component

## 2.4.30

### Patch Changes

- 1d95aa2: Fixes an issue where `visibilityCriteria` was not respected in the carousel checklist component
- Updated dependencies [1d95aa2]
  - @frigade/js@0.7.9

## 2.4.29

### Patch Changes

- 884f533: Fix undefined frigade instance in useFlow and useCollection

## 2.4.28

### Patch Changes

- 4ef2c5e: Includes version numbers in headers
- Updated dependencies [4ef2c5e]
  - @frigade/js@0.7.8

## 2.4.27

### Patch Changes

- a052316: Fixes an issue where variable names remained in components if set to undefined or blank
- Updated dependencies [a052316]
  - @frigade/js@0.7.7

## 2.4.26

### Patch Changes

- b6438e4: Adds the entire form context to flow completion event
- Updated dependencies [b6438e4]
  - @frigade/js@0.7.6

## 2.4.25

### Patch Changes

- 8b7caba: Fixes an issue where `<Form as={Dialog} />` would not show up in some cases

## 2.4.24

### Patch Changes

- c1e6edd: Fixes an issue where flow.reset() sometimes can cause a race condition which prevents the flow from resetting
- Updated dependencies [c1e6edd]
  - @frigade/js@0.7.5

## 2.4.23

### Patch Changes

- 1950e2e: Refactors the useModals hook to no longer depend on React context

## 2.4.22

### Patch Changes

- d7de8d1: Fixes another edge case related to modals not opening when combined with a tour

## 2.4.21

### Patch Changes

- d754be2: Fixes a series of issues related to modals and announcements

## 2.4.20

### Patch Changes

- 7bf94cf: Fixes an issue in Next.js server components where pages fail to render

## 2.4.19

### Patch Changes

- a0b64c3: Fixes an issue where modals can become non clickable

## 2.4.18

### Patch Changes

- 2e31c04: Ensure that form state error state is reset between steps
- 8747be5: Standardizes blue colors to surface and neutral

## 2.4.17

### Patch Changes

- 6c02433: Adds a null check on `useSyncExternalStore`

## 2.4.16

### Patch Changes

- bb2b75d: Improvements to useFlow and useCollection hooks, add overlay prop to Dialog
- Updated dependencies [bb2b75d]
  - @frigade/js@0.7.4

## 2.4.15

### Patch Changes

- 44947d5: Add style to list of allowed tags

## 2.4.14

### Patch Changes

- 2933324: Fix blurry images when altering object-fit and aspect-ratio

## 2.4.13

### Patch Changes

- 1f99976: Fixes an issue where images in announcements appear blurry/pixelated

## 2.4.12

### Patch Changes

- 6dc0d80: Adds support for `multiple: true` for the `select` Form field
- 75b42e6: Adds the ability to prefill forms

## 2.4.11

### Patch Changes

- 6541572: Adds support for the checkbox field type in forms

## 2.4.10

### Patch Changes

- c051ed8: Fixes an issue where variables are not dynamically updated when changed for the same component
- Updated dependencies [c051ed8]
  - @frigade/js@0.7.2

## 2.4.9

### Patch Changes

- 9057874: Fixes an issue where onPrimary and onSecondary does not work in carousel checklists
- 5731a4a: Fixes the default zIndex to be non zero

## 2.4.8

### Patch Changes

- 8983f7b: Fixes an issue where NPS surveys and Forms render incorrectly in the default collection

## 2.4.7

### Patch Changes

- 55d725b: Removes hero icons depenendency

## 2.4.6

### Patch Changes

- dd0950a: Add Select.Portal to SelectField

## 2.4.5

### Patch Changes

- 8655dc9: Prevent secondary buttons from being disabled in forms
- 49e565e: Adds a missing export for TextareaField

## 2.4.4

### Patch Changes

- fa4218e: Fixes an issue where variables are not applied to nested fields
- Updated dependencies [fa4218e]
  - @frigade/js@0.7.1

## 2.4.3

### Patch Changes

- 6df712a: Add sorting to Carousel

## 2.4.2

### Patch Changes

- 5fcbd2e: Adds missing class names to the Collapsible Checklist

## 2.4.1

### Patch Changes

- ce45f2d: CTA buttons are no longer disabled if a step is completed

## 2.4.0

### Minor Changes

- 80b08f1: Adds support for step.skip()

### Patch Changes

- Updated dependencies [80b08f1]
  - @frigade/js@0.7.0

## 2.3.3

### Patch Changes

- 60c9885: Adds missing exports for media as well as support for certain YouTube urls

## 2.3.2

### Patch Changes

- 6b169cc: Fixes an issue related to restarting flows causing temporary flickering of ineligible flows
- Updated dependencies [6b169cc]
  - @frigade/js@0.6.2

## 2.3.1

### Patch Changes

- 0058041: Fixes an edge case related to collection registration
- Updated dependencies [0058041]
  - @frigade/js@0.6.1

## 2.3.0

### Minor Changes

- ce63b9f: Introduces `flow.getCurrentStepOrder()` for getting the step index relative to the total number of steps available. This will trigger an explicit completion event when finishing the last step in a Flow

### Patch Changes

- d0ac424: Fixes an issue where flow.back() would send users to hidden steps
- Updated dependencies [ce63b9f]
- Updated dependencies [d0ac424]
  - @frigade/js@0.6.0

## 2.2.10

### Patch Changes

- 8fd7be6: Fixes a race condition where tours changing urls sometimes will get a stale state
- Updated dependencies [8fd7be6]
  - @frigade/js@0.5.9

## 2.2.9

### Patch Changes

- 78c413a: Fixes an edge case that could cause an infinite loop of API calls
- Updated dependencies [78c413a]
  - @frigade/js@0.5.8

## 2.2.8

### Patch Changes

- c9190b0: Fixes an inconsistency in Flow navigation where currentStep does not match step.$state.started
- Updated dependencies [c9190b0]
  - @frigade/js@0.5.7

## 2.2.7

### Patch Changes

- 0add935: Fixes a race condition where steps in checklists could sometime appear unchecked even if being checked
- ba00163: Fixes an issue where collections throw an error when guest id generation is turned off
- Updated dependencies [0add935]
- Updated dependencies [ba00163]
  - @frigade/js@0.5.6

## 2.2.6

### Patch Changes

- 7e1c262: Added Carousel Component
- Updated dependencies [7e1c262]
  - @frigade/js@0.5.5

## 2.2.5

### Patch Changes

- d01bfc4: Fixes an issue where dialog still closes on escape with dismissible false

## 2.2.4

### Patch Changes

- 5b7823f: Fix bug where repeated requests had empty responses
- Updated dependencies [5b7823f]
  - @frigade/js@0.5.4

## 2.2.3

### Patch Changes

- b434ceb: Adds additional error resiliency for capturing navigation changes
- Updated dependencies [b434ceb]
  - @frigade/js@0.5.3

## 2.2.2

### Patch Changes

- 38420ac: Fixes a race condition where Frigade in some cases would throw an error on navigation change
- Updated dependencies [38420ac]
  - @frigade/js@0.5.2

## 2.2.1

### Patch Changes

- b15f30b: Ensures that current URL is passed to the API on navigation changes
- Updated dependencies [b15f30b]
  - @frigade/js@0.5.1

## 2.2.0

### Minor Changes

- f5c40a4: Implementation of Frigade Collections

### Patch Changes

- Updated dependencies [f5c40a4]
  - @frigade/js@0.5.0

## 2.1.30

### Patch Changes

- 86a4063: Adds url and user agent context to all remaining calls
- Updated dependencies [86a4063]
  - @frigade/js@0.4.22

## 2.1.29

### Patch Changes

- eeaa6e3: Fixes an issue where calling step.complete() makes redundant network calls
- Updated dependencies [eeaa6e3]
  - @frigade/js@0.4.21

## 2.1.28

### Patch Changes

- 2d419f6: Fixes an issue where onPrimary and onSecondary are not called for banners

## 2.1.27

### Patch Changes

- d00c2cf: Enables the option to delay setting a userId without generating a Guest ID
- Updated dependencies [d00c2cf]
  - @frigade/js@0.4.20

## 2.1.26

### Patch Changes

- 4673fee: Fixes an issue related to navigating back and forth in a Flow repeatedly
- Updated dependencies [4673fee]
  - @frigade/js@0.4.19

## 2.1.25

### Patch Changes

- 2de5a2e: Fixes an issue related to updating flow state after adding properties to a user
- Updated dependencies [2de5a2e]
  - @frigade/js@0.4.18

## 2.1.24

### Patch Changes

- 649ccde: Fixes for useGroup and Form

## 2.1.23

### Patch Changes

- 54dfe27: Fixes an issue where neutral colors were not displaying correctly

## 2.1.22

### Patch Changes

- 269edcf: Bump the latest @frigade/js
- Updated dependencies [269edcf]
  - @frigade/js@0.4.17

## 2.1.21

### Patch Changes

- 3f81a79: Fixes a series of issues related to customization of forms

## 2.1.20

### Patch Changes

- 2a6ce05: A series of fixes related to component tour styling as well as intermittent not-fatal React errors
- Updated dependencies [2a6ce05]
  - @frigade/js@0.4.16

## 2.1.19

### Patch Changes

- a4baf5b: Fixes an issue where hot reloading copy updates to Flows would need full refresh
- Updated dependencies [a4baf5b]
  - @frigade/js@0.4.15

## 2.1.18

### Patch Changes

- 976eb45: Fixes an issue where mocked flow configurations would not live update
- Updated dependencies [976eb45]
  - @frigade/js@0.4.14

## 2.1.17

### Patch Changes

- 314b2bf: Updates the list of allowed html tags and Flow mocking capabilities
- ddda17d: Unregister Flow on unmount
- Updated dependencies [314b2bf]
  - @frigade/js@0.4.13

## 2.1.16

### Patch Changes

- a8c72be: Fixes an issue where components that remounted after first mounting were not visible

## 2.1.15

### Patch Changes

- 0ce2e77: Makes forms submit data without optimistic writes
- Updated dependencies [0ce2e77]
  - @frigade/js@0.4.12

## 2.1.14

### Patch Changes

- dc2611d: Fixes an issue where reverse proxy urls did not support paths
- Updated dependencies [dc2611d]
  - @frigade/js@0.4.11

## 2.1.13

### Patch Changes

- 0b328f2: Fix HSL colors in Safari

## 2.1.12

### Patch Changes

- 838ef17: Fixes an issue where rules were not always honored for Flows in the same DOM tree
- Updated dependencies [838ef17]
  - @frigade/js@0.4.10

## 2.1.11

### Patch Changes

- ebbdbdc: Fixes an issue where flows with group-based audiences failed to show
- Updated dependencies [ebbdbdc]
  - @frigade/js@0.4.9

## 2.1.10

### Patch Changes

- 22bf78a: Improvements to Rules parsing
- Updated dependencies [22bf78a]
  - @frigade/js@0.4.8

## 2.1.9

### Patch Changes

- 3f0ef68: Bumps to the latest version of @frigade/js
- Updated dependencies [3f0ef68]
  - @frigade/js@0.4.7

## 2.1.8

### Patch Changes

- 36bf434: Fixes an issue related to indexing of tours
- Updated dependencies [36bf434]
  - @frigade/js@0.4.5

## 2.1.7

### Patch Changes

- 779e355: Bumps to the latest version of @frigade/js

## 2.1.6

### Patch Changes

- 45d510d: Moves rule graph execution to the provider level
- Updated dependencies [45d510d]
  - @frigade/js@0.4.2

## 2.1.5

### Patch Changes

- b39eafb: Bumps to the latest version of @frigade/js

## 2.1.4

### Patch Changes

- Updated dependencies [812a8ed]
  - @frigade/js@0.4.0

## 2.1.3

### Patch Changes

- 434827e: Updates the behavior for forms to not submit forms onSecondary CTA click

## 2.1.2

### Patch Changes

- dd0b0d3: Bumps frigade/js to the latest version and fixes an issue related to forceMounting forms

## 2.1.1

### Patch Changes

- fbb030b: Bump to the latest version of @emotion/react"
- c8b5b01: Fixes a bug where children is not optional in Frigade.Announcement

## 2.1.0

### Minor Changes

- 7d674dd: Added step actions to flow config

### Patch Changes

- Updated dependencies [2b75a17]
- Updated dependencies [7d674dd]
  - @frigade/js@0.3.0

## 2.0.36

### Patch Changes

- 9529084: Improvements to onDismiss handling, new color palette
- Updated dependencies [9529084]
  - @frigade/js@0.2.40

## 2.0.35

### Patch Changes

- b2dc6df: Make default spacing on error messages to spec
- Updated dependencies [c94f6ec]
  - @frigade/js@0.2.39

## 2.0.34

### Patch Changes

- b3c20ca: Fixes the default label styling on forms to be to design spec

## 2.0.33

### Patch Changes

- 34210f1: Fixes a z-index issue for announcements

## 2.0.32

### Patch Changes

- cc1d50f: Bumps to the latest version of @frigade/js

## 2.0.31

### Patch Changes

- ec0425f: Edge case where NPS Survey gets dismissed on outside click

## 2.0.30

### Patch Changes

- 02c25b9: Updates the look and feel of the NPS Survey component

## 2.0.29

### Patch Changes

- f66bb0c: Fixes an issue where individual step `props` were not passed from the YAML to the component

## 2.0.28

### Patch Changes

- 09e0b0d: Fixes an issue where Tour components failed to render correctly

## 2.0.27

### Patch Changes

- c7aa234: Fixes a babel import issue due to ??

## 2.0.26

### Patch Changes

- cffe7c8: Fixes an NPE related to variables

## 2.0.25

### Patch Changes

- f7cd1fa: Remove 'Continue' from Cards when passing empty button

## 2.0.24

### Patch Changes

- 8fec445: Fixes an issue where variables could not be set async. Also fixes an issue where spotlight areas are not clickable

## 2.0.23

### Patch Changes

- 321107d: Fixes an issue where navigation handlers waited for network calls

## 2.0.22

### Patch Changes

- f80cd62: Fixes an issue where hot reloading Frigade caused errors in the console

## 2.0.21

### Patch Changes

- 82c8173: Refactors the modal interface of NPS Surveys and other dialogs

## 2.0.20

### Patch Changes

- 8d4c154: Bump to the latest version of @frigade/js

## 2.0.19

### Patch Changes

- 919581e: Removes redundant radix props that freezes up the page when using NPS Survey

## 2.0.18

### Patch Changes

- 66c087b: Fixes the default styling of the NPS Component when positioning in corners

## 2.0.17

### Patch Changes

- a4d4190: Fixes the Survey.NPS to not be a full screen modal

## 2.0.16

### Patch Changes

- 15465da: Adds the NPS Survey component
- 8454f44: Adds class name selectors on progress dots

## 2.0.15

### Patch Changes

- c37111c: Bumps to the latest version of @frigade/js

## 2.0.14

### Patch Changes

- 8f1cf96: Bumps to the latest version of @frigade/js

## 2.0.13

### Patch Changes

- 8c266d1: Adds missing class names to banner
- 084a20a: Bumps to the latest version of @frigade/js

## 2.0.12

### Patch Changes

- f960f0e: Bumps @frigade/js to the latest version

## 2.0.11

### Patch Changes

- 100c2a9: Bumps to the latest version of @frigade/js

## 2.0.10

### Patch Changes

- f60a42a: Bumps @frigade/js to the latest version and adds better typescript docs

## 2.0.9

### Patch Changes

- 088e2a6: Fixes a series of bugs related to tours and checklists

## 2.0.8

### Patch Changes

- 5dd033e: Bumps @frigade/js to the latest version

## 2.0.7

### Patch Changes

- bba7576: Changes the default behavior of checklists to not auto open the next item
- Updated dependencies [68037f6]
  - @frigade/js@0.2.25

## 2.0.6

### Patch Changes

- 3373d2e: Bumps to the latest version of Frigade JS

## 2.0.5

### Patch Changes

- 7cedb33: Fixes an issue where steps in checklists are not started when changing index

## 2.0.4

### Patch Changes

- 4017abf: Fixes an issue where Flows were flows do not auto advance based on backend tracking events and props

## 2.0.3

### Patch Changes

- 14af95c: Fixes an issue where useUser and useGroup track() function was causing 404s

## 2.0.2

### Patch Changes

- 8a509b1: Fixed TS complaints about FlowProps, fixed default Card border styles

## 2.0.1

### Patch Changes

- 25ee0b2: Fixes an issue with tours freezing up the page until actions are taken. Adds additional exports for theming

## 2.0.0

### Major Changes

- 5a62581: Introduces @frigade/react 2.0.0 🚀
  This is a BREAKING CHANGE. Do not upgrade to this version until you have successfully migrated to 2.0.0 new API and design system.

  Read on for more: https://docs.frigade.com

### Patch Changes

- 1c44a70: Fixess the right package privacy for npm
- 2ece802: Introduces @frigade/react 2.0.0. Read on for more: https://docs.frigade.com
