# @frigade/react

## 1.38.26

### Patch Changes

- b9741d8: Allow HTML in type: multiInputList in forms

## 1.38.25

### Patch Changes

- 26a82bf: Add missing class name on text in Announcement, Banner, EmbeddedTip

## 1.38.24

### Patch Changes

- 12c7255: Removes console.log that happens when linking guest ids

## 1.38.23

### Patch Changes

- 5064058: Fixes an issue where fixed tooltips would be vertically out of bounds

## 1.38.22

### Patch Changes

- 22d59ab: Fixes an issue where static tooltips adhere to overrides

## 1.38.21

### Patch Changes

- 71846b1: Adds isDegraded to useFlows as well as addtional reliability improvements

## 1.38.20

### Patch Changes

- 27f4ebe: Fixes an issue where non-optional dropdowns were still allowing users to continue

## 1.38.19

### Patch Changes

- c43f2c7: Fixes an issue where tours prevented the page from scrolling

## 1.38.18

### Patch Changes

- 06bcc1a: Fixes an issue where html tags could not display in classic checklists

## 1.38.17

### Patch Changes

- 8d5c76f: Allow <video /> tags in strings

## 1.38.16

### Patch Changes

- c93c094: Fix tsup compatibility for legacy React apps

## 1.38.15

### Patch Changes

- 19cfc50: Add ability for looping and hiding controls in videoUris

## 1.38.14

### Patch Changes

- 7f2cf93: Fix useClient issue affecting Next.js 14

## 1.38.13

### Patch Changes

- 994219d: Fixes an issue where checkboxes were shrinking in certain components. Adds onClick event to the wide progress bar component.

## 1.38.12

### Patch Changes

- 03fbb1c: Allow rendering HTML in buttons in Frigade components

## 1.38.11

### Patch Changes

- 42a60da: Re-enable impression tracking for checklists

## 1.38.10

### Patch Changes

- 2a1d369: Disable flow impressions per step in checklists

## 1.38.9

### Patch Changes

- 1c2e863: Removes redundant useEffect calls from condensed checklist

## 1.38.8

### Patch Changes

- 4749366: Fix issue with missing HTML tags in carousel checklist
- 058e11f: Fix HTML tags on carousel checklists

## 1.38.7

### Patch Changes

- 9162a79: Add missing CSS classes to condensed checklist

## 1.38.6

### Patch Changes

- a48684c: Adds missing event handlers and class names to the condensed checklist

## 1.38.5

### Patch Changes

- c1f583c: Version packages

## 1.38.4

### Patch Changes

- 1d3f721: Removed hard dependencies on react and react-dom

## 1.38.3

### Patch Changes

- 2857c8f: Fixes an issue where the UI can freeze up in read-only mode

## 1.38.2

### Patch Changes

- 60a05d2: Adds optimistic completion at the step level for flows

## 1.38.1

### Patch Changes

- a1cc691: - Adds back navigation option to announcements

## 1.38.0

### Minor Changes

- 8fd379b: Adds the ability to skip flows. This is similar to completing a flow, but is useful for labelling when a user exits a flow prematurely.

## 1.37.22

### Patch Changes

- 9fff348: Adds the ability to autoplay videos in all Frigade components

## 1.37.21

### Patch Changes

- b51009b: Extracts aliasing guest users to separate function
- c7b917a: Extracts user linking to explicit function

## 1.37.20

### Patch Changes

- c500844: Adds the option to link guest sessions with registered users

## 1.37.19

### Patch Changes

- 851c1a7: Fixes issue where inline styles don't apply to the support widget

## 1.37.18

### Patch Changes

- 4eb2bcf: Fixes an issue where turned off flows cause an index out of bound exception

## 1.37.17

### Patch Changes

- 13d927f: Fixes an issue where the classic checklist was missing class selectors

## 1.37.16

### Patch Changes

- eb09bd6: Fixes another edge case related to `showIfNotFound`

## 1.37.15

### Patch Changes

- c0d898c: Fixes an edge case related to the `showIfNotFound` prop

## 1.37.14

### Patch Changes

- 9c98aaf: Improved treeshaking in tsup config to reduce bundle size

## 1.37.13

### Patch Changes

- 2a6551e: Fix default styling on dismiss icons

## 1.37.12

### Patch Changes

- 22c4c18: Fix edgecase related to graceful degradation when API errors occur

## 1.37.11

### Patch Changes

- 67f9402: Allow HTML in LinkCollection step type

## 1.37.10

### Patch Changes

- 93a556e: Allow dismissing a tour by pressing Escape key

## 1.37.9

### Patch Changes

- d095fa0: Additionall accessibility features for screen readers

## 1.37.8

### Patch Changes

- 10daf57: Make entire accordion row clickable in condensed checklist

## 1.37.7

### Patch Changes

- de618ad: This change makes Frigade's Tooltips/Tours WCAG 2.1 AA compliant

## 1.37.6

### Patch Changes

- 8a93cb8: Add internal way for overriding flow yaml locally. This is a method only intended for the Frigade R&D team.

## 1.37.5

### Patch Changes

- fee3b6f: Remove redundant ErrorBoundary that in some cases can cause render loops when errors are thrown

## 1.37.4

### Patch Changes

- afa82d8: Allow class names to be passed in to FrigadeTour

## 1.37.3

### Patch Changes

- 220e009: Updated README with correct test suite

## 1.37.2

### Patch Changes

- cbbdf6d: Updated all SDKs to automatically include version number in headers

## 1.37.1

### Patch Changes

- a25491c: Updated Github URLs to new monorepo

## 1.37.0

### Minor Changes

- a8ac178: Empty commit to trigger build using changeset
