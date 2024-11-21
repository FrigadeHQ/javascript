import type { CollectionsRegistryCallback, Frigade } from '@frigade/js'
import { createContext, type Dispatch, type SetStateAction } from 'react'

import type { ProviderProps } from './Provider'

export interface ProviderContext extends Omit<ProviderProps, 'children' | 'theme'> {
  currentModal: string | null
  setCurrentModal: Dispatch<SetStateAction<string | null>>
  frigade?: Frigade
  hasInitialized: boolean
  registerComponent: (flowId: string, callback?: CollectionsRegistryCallback) => void
  unregisterComponent: (flowId: string) => void
  variables: Record<string, unknown>
}

export const FrigadeContext = createContext<ProviderContext>({
  apiKey: '',
  currentModal: null,
  setCurrentModal: () => {},
  navigate: () => {},
  hasInitialized: false,
  registerComponent: () => {},
  unregisterComponent: () => {},
  variables: {},
})
