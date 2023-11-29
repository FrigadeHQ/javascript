import { createContext, Dispatch, SetStateAction, useState } from 'react'
import { Global, ThemeProvider } from '@emotion/react'

import { createThemeVariables, theme as themeTokens, themeVariables } from '../../shared/theme'

type NavigateHandler = (url: string, target?: string) => void

// TODO: type theme something like Partial<typeof themeTokens>, but allow any value for those keys
export interface ProviderProps {
  apiKey: string
  children?: React.ReactNode
  config?: ProviderConfig
  navigate?: NavigateHandler
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
  navigate: NavigateHandler
}

export const FrigadeContext = createContext<ProviderContext>({
  apiKey: '',
  config: {},
  modals: [],
  setModals: () => {},
  navigate: () => {},
})

export function Provider({ apiKey, children, config = {}, navigate, theme }: ProviderProps) {
  const themeOverrides = theme ? createThemeVariables(theme) : {}
  const [modals, setModals] = useState([])

  const navigateHandler =
    navigate ??
    ((url, target = '_self') => {
      window.open(url, target)
    })

  return (
    <FrigadeContext.Provider
      value={{ apiKey, config, modals, setModals, navigate: navigateHandler }}
    >
      <Global styles={{ ':root': { ...themeVariables, ...themeOverrides } }} />
      <ThemeProvider theme={themeTokens}>{children}</ThemeProvider>
    </FrigadeContext.Provider>
  )
}
