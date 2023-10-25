import { createContext } from 'react'

import { useThemeOverrides } from '../../hooks/useThemeOverrides'

export const FrigadeContext = createContext({})

// TODO: type theme something like Partial<typeof themeContract>, but allow any value for those keys
interface ProviderProps {
  children?: React.ReactNode
  theme?: Record<any, any>
}

export function Provider({ children, theme }: ProviderProps) {
  useThemeOverrides(theme)

  return <FrigadeContext.Provider value={{}}>{children}</FrigadeContext.Provider>
}
