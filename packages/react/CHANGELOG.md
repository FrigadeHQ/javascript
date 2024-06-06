# @frigade/react

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
