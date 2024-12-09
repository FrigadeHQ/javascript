import * as React from 'react'
import * as UseSyncExternalStoreShim from 'use-sync-external-store/shim/index.js'

// useSyncExternalStore doesn't exist in React 17, so shim it if necessary
const useSyncExternalStore =
  'useSyncExternalStore' in React
    ? React.useSyncExternalStore
    : UseSyncExternalStoreShim.useSyncExternalStore

export { useSyncExternalStore }
