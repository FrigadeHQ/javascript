import { createContext, Dispatch, SetStateAction, useState } from 'react'
import { Global, ThemeProvider } from '@emotion/react'

import {
  createThemeVariables,
  theme as themeTokens,
  type Theme,
  themeVariables,
} from '../../shared/theme'

type NavigateHandler = (url: string, target?: string) => void

// TODO: type theme something like Partial<typeof themeTokens>, but allow any value for those keys
export interface ProviderProps {
  apiKey: string
  apiUrl?: string
  children?: React.ReactNode
  navigate?: NavigateHandler
  theme?: Theme
  userId?: string
}

interface ProviderContext extends Omit<ProviderProps, 'children' | 'theme'> {
  modals: string[]
  setModals: Dispatch<SetStateAction<string[]>>
}

export const FrigadeContext = createContext<ProviderContext>({
  apiKey: '',
  modals: [],
  setModals: () => {},
  navigate: () => {},
})

export function Provider({ children, navigate, theme, ...props }: ProviderProps) {
  const themeOverrides = theme ? createThemeVariables(theme) : {}
  const [modals, setModals] = useState([])

  const navigateHandler =
    navigate ??
    ((url, target = '_self') => {
      window.open(url, target)
    })

  return (
    <FrigadeContext.Provider value={{ modals, setModals, navigate: navigateHandler, ...props }}>
      <Global styles={{ ':root': { ...themeVariables, ...themeOverrides } }} />
      <ThemeProvider theme={themeTokens}>{children}</ThemeProvider>
    </FrigadeContext.Provider>
  )
}
