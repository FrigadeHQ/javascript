import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Global, ThemeProvider } from '@emotion/react'

import {
  createThemeVariables,
  theme as themeTokens,
  type Theme,
  themeVariables,
} from '../../shared/theme'
import { Frigade } from '@frigade/js'

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
  /**
   * @ignore Internal use only.
   * If enabled, Frigade will not send any data to the API. A user's state will be reset on page refresh.
   */
  __readOnly?: boolean

  /**
   * @ignore Internal use only.
   * Map of Flow ID to Flow Config for all flows in the app.
   * Configs will have to be provided in serialized JSON format rather than YAML.
   */
  __flowConfigOverrides?: Record<string, string>
}

interface ProviderContext extends Omit<ProviderProps, 'children' | 'theme'> {
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

export function Provider({ children, navigate, theme, ...props }: ProviderProps) {
  const themeOverrides = theme ? createThemeVariables(theme) : {}
  const [modals, setModals] = useState(new Set<string>())

  const frigade = useRef<Frigade>(
    new Frigade(props.apiKey, {
      apiKey: props.apiKey,
      apiUrl: props.apiUrl,
      userId: props.userId,
      groupId: props.groupId,
      __readOnly: props.__readOnly,
      __flowConfigOverrides: props.__flowConfigOverrides,
    })
  )

  const navigateHandler =
    navigate ??
    ((url, target = '_self') => {
      window.open(url, target)
    })

  useEffect(() => {
    return () => {
      frigade.current?.destroy()
    }
  }, [])

  const currentModal = modals.size > 0 ? modals.values().next().value : null

  return (
    <FrigadeContext.Provider
      value={{
        modals,
        setModals,
        currentModal,
        navigate: navigateHandler,
        ...props,
        frigade: frigade.current,
      }}
    >
      <Global styles={{ ':root': { ...themeVariables, ...themeOverrides } }} />
      <ThemeProvider theme={themeTokens}>{children}</ThemeProvider>
    </FrigadeContext.Provider>
  )
}
