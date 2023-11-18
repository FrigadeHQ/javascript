import { createContext } from 'react'
import { Global, ThemeProvider } from '@emotion/react'

import { createThemeVariables, theme as themeTokens, themeVariables } from '../../shared/theme'

export const FrigadeContext = createContext<{ apiKey: string; config: ProviderConfig }>({
  apiKey: '',
  config: {},
})

// TODO: type theme something like Partial<typeof themeContract>, but allow any value for those keys
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

export function Provider({ apiKey, children, config = {}, theme }: ProviderProps) {
  const themeOverrides = theme ? createThemeVariables(theme) : {}

  return (
    <FrigadeContext.Provider value={{ apiKey, config }}>
      <Global styles={{ ':root': { ...themeVariables, ...themeOverrides } }} />
      <ThemeProvider theme={themeTokens}>{children}</ThemeProvider>
    </FrigadeContext.Provider>
  )
}
