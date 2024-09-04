# @frigade/js

## 0.7.9

### Patch Changes

- 1d95aa2: Fixes an issue where `visibilityCriteria` was not respected in the carousel checklist component

## 0.7.8

### Patch Changes

- 4ef2c5e: Includes version numbers in headers

## 0.7.7

### Patch Changes

- a052316: Fixes an issue where variable names remained in components if set to undefined or blank

## 0.7.6

### Patch Changes

- b6438e4: Adds the entire form context to flow completion event

## 0.7.5

### Patch Changes

- c1e6edd: Fixes an issue where flow.reset() sometimes can cause a race condition which prevents the flow from resetting

## 0.7.4

### Patch Changes

- bb2b75d: Improvements to useFlow and useCollection hooks, add overlay prop to Dialog

## 0.7.3

### Patch Changes

- 60ea96c: Move error calls to console.warn

## 0.7.2

### Patch Changes

- c051ed8: Fixes an issue where variables are not dynamically updated when changed for the same component

## 0.7.1

### Patch Changes

- fa4218e: Fixes an issue where variables are not applied to nested fields

## 0.7.0

### Minor Changes

- 80b08f1: Adds support for step.skip()

## 0.6.2

### Patch Changes

- 6b169cc: Fixes an issue related to restarting flows causing temporary flickering of ineligible flows

## 0.6.1

### Patch Changes

- 0058041: Fixes an edge case related to collection registration

## 0.6.0

### Minor Changes

- ce63b9f: Introduces `flow.getCurrentStepOrder()` for getting the step index relative to the total number of steps available. This will trigger an explicit completion event when finishing the last step in a Flow

### Patch Changes

- d0ac424: Fixes an issue where flow.back() would send users to hidden steps

## 0.5.10

### Patch Changes

- ea44c6b: Fixes an issue with Node JS 18 where frigade.identify() calls fail

## 0.5.9

### Patch Changes

- 8fd7be6: Fixes a race condition where tours changing urls sometimes will get a stale state

## 0.5.8

### Patch Changes

- 78c413a: Fixes an edge case that could cause an infinite loop of API calls

## 0.5.7

### Patch Changes

- c9190b0: Fixes an inconsistency in Flow navigation where currentStep does not match step.$state.started

## 0.5.6

### Patch Changes

- 0add935: Fixes a race condition where steps in checklists could sometime appear unchecked even if being checked
- ba00163: Fixes an issue where collections throw an error when guest id generation is turned off

## 0.5.5

### Patch Changes

- 7e1c262: Added Carousel Component

## 0.5.4

### Patch Changes

- 5b7823f: Fix bug where repeated requests had empty responses

## 0.5.3

### Patch Changes

- b434ceb: Adds additional error resiliency for capturing navigation changes

## 0.5.2

### Patch Changes

- 38420ac: Fixes a race condition where Frigade in some cases would throw an error on navigation change

## 0.5.1

### Patch Changes

- b15f30b: Ensures that current URL is passed to the API on navigation changes

## 0.5.0

### Minor Changes

- f5c40a4: Implementation of Frigade Collections

## 0.4.22

### Patch Changes

- 86a4063: Adds url and user agent context to all remaining calls

## 0.4.21

### Patch Changes

- eeaa6e3: Fixes an issue where calling step.complete() makes redundant network calls

## 0.4.20

### Patch Changes

- d00c2cf: Enables the option to delay setting a userId without generating a Guest ID

## 0.4.19

### Patch Changes

- 4673fee: Fixes an issue related to navigating back and forth in a Flow repeatedly

## 0.4.18

### Patch Changes

- 2de5a2e: Fixes an issue related to updating flow state after adding properties to a user

## 0.4.17

### Patch Changes

- 269edcf: Bump the latest @frigade/js

## 0.4.16

### Patch Changes

- 2a6ce05: A series of fixes related to component tour styling as well as intermittent not-fatal React errors

## 0.4.15

### Patch Changes

- a4baf5b: Fixes an issue where hot reloading copy updates to Flows would need full refresh

## 0.4.14

### Patch Changes

- 976eb45: Fixes an issue where mocked flow configurations would not live update

## 0.4.13

### Patch Changes

- 314b2bf: Updates the list of allowed html tags and Flow mocking capabilities

## 0.4.12

### Patch Changes

- 0ce2e77: Makes forms submit data without optimistic writes

## 0.4.11

### Patch Changes

- dc2611d: Fixes an issue where reverse proxy urls did not support paths

## 0.4.10

### Patch Changes

- 838ef17: Fixes an issue where rules were not always honored for Flows in the same DOM tree

## 0.4.9

### Patch Changes

- ebbdbdc: Fixes an issue where flows with group-based audiences failed to show

## 0.4.8

### Patch Changes

- 22bf78a: Improvements to Rules parsing

## 0.4.7

### Patch Changes

- 3f0ef68: Bumps to the latest version of @frigade/js

## 0.4.6

### Patch Changes

- fe35351: Fixes an issue where flow.restart() did not reset the index to 0

## 0.4.5

### Patch Changes

- 36bf434: Fixes an issue related to indexing of tours

## 0.4.4

### Patch Changes

- 8fc0942: Fixes an issue where form data could be double serialized

## 0.4.3

### Patch Changes

- aebda3a: Fixes an issue where enums were undefined at runtime

## 0.4.2

### Patch Changes

- 45d510d: Moves rule graph execution to the provider level

## 0.4.1

### Patch Changes

- e18dfde: Fixes a race condition that in some cases could cause flickering in flows

## 0.4.0

### Minor Changes

- 812a8ed: Reduces the amount of network calls to Frigade by 75%

## 0.3.1

### Patch Changes

- aeb5868: Updated documentation on deprecated types

## 0.3.0

### Minor Changes

- 2b75a17: Introduces a new API that reduces the API calls to Frigade by more than 50%

### Patch Changes

- 7d674dd: Added step actions to flow config

## 0.2.40

### Patch Changes

- 9529084: Improvements to onDismiss handling, new color palette

## 0.2.39

### Patch Changes

- c94f6ec: Allows specififying apiUrls in new formats

## 0.2.38

### Patch Changes

- f82c401: Allows overriding createdAt for events

## 0.2.37

### Patch Changes

- dac5925: Fixes an edge case where customer variables could get flushed

## 0.2.36

### Patch Changes

- 10ce215: Fixes an issue where babel returned import errors

## 0.2.35

### Patch Changes

- 64dfb7a: Allows for variables to be replaced async

## 0.2.34

### Patch Changes

- f8629a1: Adds keep-alive to requests

## 0.2.33

### Patch Changes

- 4e3a1a3: Fixes an issue where React Native tries to access localStorage

## 0.2.32

### Patch Changes

- 8b3f6cf: Adds optimistic writes to skips

## 0.2.31

### Patch Changes

- e934134: Name specific exports to avoid nextjs errors

## 0.2.30

### Patch Changes

- ffa18ec: Adds a missing null check to event handlers

## 0.2.29

### Patch Changes

- 4bba3c2: Fixes an issue where some exports are missing

## 0.2.28

### Patch Changes

- 3cff936: Fixes a race condition that could occur when initializing Frigade

## 0.2.27

### Patch Changes

- e2eb482: Adds a missing FlowType for Announcement

## 0.2.26

### Patch Changes

- c76fd7f: Exports a series of convenient types

## 0.2.25

### Patch Changes

- 68037f6: Fixes an issue where event handlers are not called on tab change

## 0.2.24

### Patch Changes

- 0f3db7f: Sends the current user id to the API when initiated

## 0.2.23

### Patch Changes

- be25d4e: Fixes an issue where flow state was not reset after tracking events

## 0.2.22

### Patch Changes

- ee29dfb: Fixes an issue where frigade.track used the wrong endpoint

## 0.2.21

### Patch Changes

- e493231: Updated typescript documentation

## 0.2.20

### Patch Changes

- db6bc6b: Fixes an issue where restarting a flow would not properly call event handlers

## 0.2.19

### Patch Changes

- 44466a5: Fixes an issue where 201 and 204s were causing redundant console logs

## 0.2.18

### Patch Changes

- 0e6122e: Correctly renames organization to group

## 0.2.17

### Patch Changes

- 28b089a: Adds a new function isReady() to easily check if the SDK has initialized before using its methods
- 9bc837c: Fixes an issue where flows with targeting logic failed to call event handlers

## 0.2.16

### Patch Changes

- dd3fb1a: Adds the ability to set the SDK to read-only mode as well as overrding config.yml

## 0.2.15

### Patch Changes

- 2445860: Add destructor method to destroy class and remove event handlers
- f2411a5: Additional guard rails against network failures

## 0.2.14

### Patch Changes

- 3817322: Fixes an issue where optimistic writes were waiting for server response

## 0.2.13

### Patch Changes

- d145387: Optimistic writes on flow.forward() and flow.back()

## 0.2.12

### Patch Changes

- b4b0a9d: Introduce flow.back() and flow.forward() and fix url encoding issues

## 0.2.11

### Patch Changes

- 0c9335a: Add step.reset() function

## 0.2.10

### Patch Changes

- c20a86d: Add group id to flow response calls

## 0.2.9

### Patch Changes

- cb027a4: Remove deduping of userflowstates calls

## 0.2.8

### Patch Changes

- 32d2028: Ensure event handlers are called when calling frigade.reload()

## 0.2.7

### Patch Changes

- 294015b: Add null check for userflow state refreshes

## 0.2.6

### Patch Changes

- 27804c3: Adds a missing null check

## 0.2.5

### Patch Changes

- 1333384: Adds additional logging

## 0.2.4

### Patch Changes

- ee55fdf: Fixes the local storage prefix to not conflict with the React SDK

## 0.2.3

### Patch Changes

- 2730204: Fixes a race condition caused by the deduplicator

## 0.2.2

### Patch Changes

- c4df5e2: Support visibilityCriteria from config.yml on steps
- b31207a: Support visibilityCriteria from config.yml on steps

## 0.2.1

### Patch Changes

- 53b68ac: Automatically refresh flows on focus and dedupe identical calls

## 0.2.0

### Minor Changes

- f53a5e5: Refactor event handlers to support global/flow/step specific changes

## 0.1.4

### Patch Changes

- ab77eb8: Add event handlers to documentation.

## 0.1.3

### Patch Changes

- daa92e8: Fix issues related to optimistic network calls

## 0.1.2

### Patch Changes

- d5aacff: Optimistic writes for step completions

## 0.1.1

### Patch Changes

- 5d94863: Catch js release up with latest changes

## 0.1.0

### Minor Changes

- b3e82fa: Update API to be more intuitive when accessing steps

## 0.0.6

### Patch Changes

- 220e009: Updated README with correct test suite

## 0.0.5

### Patch Changes

- cbbdf6d: Updated all SDKs to automatically include version number in headers

## 0.0.4

### Patch Changes

- a25491c: Updated Github URLs to new monorepo

## 0.0.3

### Patch Changes

- 28288fa: Empty commit to test new build system
