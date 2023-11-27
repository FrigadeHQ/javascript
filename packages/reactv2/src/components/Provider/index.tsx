import { createContext, Dispatch, SetStateAction, useState } from 'react'
import { Global, ThemeProvider } from '@emotion/react'

import { createThemeVariables, theme as themeTokens, themeVariables } from '../../shared/theme'

// TODO: type theme something like Partial<typeof themeTokens>, but allow any value for those keys
export interface ProviderProps {
  apiKey: string
  children?: React.ReactNode
  config?: ProviderConfig
  theme?: Record<any, any>
}

interface ProviderConfig {
  apiUrl?: string
  userId?: string
}

interface ProviderContext {
  apiKey: string
  config: ProviderConfig
  modals: string[]
  setModals: Dispatch<SetStateAction<string[]>>
}

export const FrigadeContext = createContext<ProviderContext>({
  apiKey: '',
  config: {},
  modals: [],
  setModals: () => {},
})

export function Provider({ apiKey, children, config = {}, theme }: ProviderProps) {
  const themeOverrides = theme ? createThemeVariables(theme) : {}
  const [modals, setModals] = useState([])

  return (
    <FrigadeContext.Provider value={{ apiKey, config, modals, setModals }}>
      <Global styles={{ ':root': { ...themeVariables, ...themeOverrides } }} />
      <ThemeProvider theme={themeTokens}>{children}</ThemeProvider>
    </FrigadeContext.Provider>
  )
}
