import type { CollectionsRegistryCallback, Frigade } from '@frigade/js'
import { createContext } from 'react'

import type { ProviderProps } from './Provider'

export interface ProviderContext extends Omit<ProviderProps, 'children' | 'theme'> {
  frigade?: Frigade
  hasInitialized: boolean
  registerComponent: (flowId: string, callback?: CollectionsRegistryCallback) => void
  unregisterComponent: (flowId: string) => void
}

export const FrigadeContext = createContext<ProviderContext>({
  apiKey: '',
  navigate: () => {},
  hasInitialized: false,
  registerComponent: () => {},
  unregisterComponent: () => {},
})
