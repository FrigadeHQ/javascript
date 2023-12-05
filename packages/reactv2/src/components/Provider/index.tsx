import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react'
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
  setUserId: Dispatch<SetStateAction<string>>
  setGroupId: Dispatch<SetStateAction<string>>
  getConfig: () => FrigadeConfig
}

export const FrigadeContext = createContext<ProviderContext>({
  apiKey: '',
  modals: [],
  setModals: () => {},
  navigate: () => {},
  setUserId: () => {},
  setGroupId: () => {},
  getConfig: () => ({}),
})

export function Provider({ children, navigate, theme, ...props }: ProviderProps) {
  const themeOverrides = theme ? createThemeVariables(theme) : {}
  const [userIdValue, setUserIdValue] = useState(props.userId)
  const [groupIdValue, setGroupIdValue] = useState(props.groupId)
  const [modals, setModals] = useState([])

  const navigateHandler =
    navigate ??
    ((url, target = '_self') => {
      window.open(url, target)
    })

  useEffect(() => {
    setUserIdValue(props.userId)
  }, [props.userId])

  useEffect(() => {
    setGroupIdValue(props.groupId)
  }, [props.groupId])

  return (
    <FrigadeContext.Provider
      value={{
        modals,
        setModals,
        navigate: navigateHandler,
        ...props,
        userId: userIdValue,
        setUserId: setUserIdValue,
        groupId: groupIdValue,
        setGroupId: setGroupIdValue,
        getConfig: () =>
          ({
            apiKey: props.apiKey,
            apiUrl: props.apiUrl,
            userId: userIdValue,
            groupId: groupIdValue,
          } as FrigadeConfig),
      }}
    >
      <Global styles={{ ':root': { ...themeVariables, ...themeOverrides } }} />
      <ThemeProvider theme={themeTokens}>{children}</ThemeProvider>
    </FrigadeContext.Provider>
  )
}
