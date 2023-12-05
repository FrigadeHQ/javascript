import { createContext, Dispatch, SetStateAction, useState } from 'react'
import { Global, ThemeProvider } from '@emotion/react'

import {
  createThemeVariables,
  theme as themeTokens,
  type Theme,
  themeVariables,
} from '../../shared/theme'
import { FrigadeConfig } from '@frigade/js'

type NavigateHandler = (url: string, target?: string) => void

// TODO: type theme something like Partial<typeof themeTokens>, but allow any value for those keys
export interface ProviderProps {
  apiKey: string
  apiUrl?: string
  children?: React.ReactNode
  navigate?: NavigateHandler
  theme?: Theme
  userId?: string
  groupId?: string
}

interface ProviderContext extends Omit<ProviderProps, 'children' | 'theme'> {
  modals: string[]
  setModals: Dispatch<SetStateAction<string[]>>
  getConfig: () => FrigadeConfig
}

export const FrigadeContext = createContext<ProviderContext>({
  apiKey: '',
  modals: [],
  setModals: () => {},
  navigate: () => {},
  getConfig: () => ({}),
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
    <FrigadeContext.Provider
      value={{
        modals,
        setModals,
        navigate: navigateHandler,
        ...props,
        getConfig: () =>
          ({
            apiKey: props.apiKey,
            apiUrl: props.apiUrl,
            userId: props.userId,
            groupId: props.groupId,
          } as FrigadeConfig),
      }}
    >
      <Global styles={{ ':root': { ...themeVariables, ...themeOverrides } }} />
      <ThemeProvider theme={themeTokens}>{children}</ThemeProvider>
    </FrigadeContext.Provider>
  )
}
