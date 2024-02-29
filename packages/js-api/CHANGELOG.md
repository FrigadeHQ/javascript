# @frigade/js

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
