import type { Frigade } from '@frigade/js'
import { createContext, type Dispatch, type SetStateAction } from 'react'

import type { ProviderProps } from './Provider'

export interface ProviderContext extends Omit<ProviderProps, 'children' | 'theme'> {
  modals: Set<string>
  setModals: Dispatch<SetStateAction<Set<string>>>
  currentModal: string | null
  frigade?: Frigade
}

export const FrigadeContext = createContext<ProviderContext>({
  apiKey: '',
  modals: new Set(),
  setModals: () => {},
  currentModal: null,
  navigate: () => {},
})
