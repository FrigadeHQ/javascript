import { createContext } from 'react'

import { useThemeOverrides } from '../../hooks/useThemeOverrides'

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
}

export function Provider({ apiKey, children, config = {}, theme }: ProviderProps) {
  useThemeOverrides(theme)

  return <FrigadeContext.Provider value={{ apiKey, config }}>{children}</FrigadeContext.Provider>
}
