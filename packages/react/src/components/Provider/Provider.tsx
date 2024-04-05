import { Frigade } from '@frigade/js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Global, ThemeProvider } from '@emotion/react'

import {
  createThemeVariables,
  theme as themeTokens,
  type Theme,
  themeVariables,
} from '../../shared/theme'

import { FrigadeContext } from './FrigadeContext'

export type NavigateHandler = (url: string, target?: string) => void
export type RegisteredComponents = Map<string, Record<string, object>>

// TODO: type theme something like Partial<typeof themeTokens>, but allow any value for those keys
export interface ProviderProps {
  /**
   * Your public API key from the Frigade dashboard. Do not ever use your private API key here.
   */
  apiKey: string
  /**
   * The URL prefix of the API to use. By default, Frigade will use the production API: https://api.frigade.com/v1/public
   */
  apiUrl?: string
  children?: React.ReactNode
  /**
   * A function to handle navigation. By default, Frigade will use `window.open` if not provided.
   * https://docs.frigade.com/v2/sdk/navigation
   */
  navigate?: NavigateHandler
  /**
   * The global theme to use across components. See docs on styling: https://docs.frigade.com/v2/sdk/styling/theming
   */
  theme?: Theme
  /**
   * The user ID of the user who is interacting with Frigade. If not provided, Frigade will generate a random guest ID and persist it in local storage.
   */
  userId?: string
  /**
   * The group ID to use for this context (optional).
   */
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

export function Provider({ children, navigate, theme, ...props }: ProviderProps) {
  const themeOverrides = theme ? createThemeVariables(theme) : {}
  const [modals, setModals] = useState(new Set<string>())
  const registeredComponents = useRef<RegisteredComponents>(new Map())
  const intervalRef = useRef<NodeJS.Timeout>()
  const [hasInitialized, setHasInitialized] = useState(false)

  const frigade = useMemo<Frigade>(() => {
    return new Frigade(props.apiKey, {
      apiKey: props.apiKey,
      apiUrl: props.apiUrl,
      userId: props.userId,
      groupId: props.groupId,
      __readOnly: props.__readOnly,
      __flowConfigOverrides: props.__flowConfigOverrides,
    })
  }, [props.userId, props.groupId, props.apiKey])

  function batchRegistration() {
    console.log('Batch register: ', registeredComponents.current)

    for (const [flowId, options] of registeredComponents.current) {
      frigade.getFlow(flowId).then((flow) => flow.register(options.callback))
    }

    setHasInitialized(true)
  }

  function registerComponent(flowId: string, callback: (visible: boolean) => void) {
    console.log('registerComponent: ', flowId)

    if (intervalRef.current) {
      clearTimeout(intervalRef.current)
    }

    if (hasInitialized) {
      console.log('hasInitialized: true, skipping registration')
      return
    }

    if (!registeredComponents.current.has(flowId)) {
      console.log('registeredComponents.set: ', flowId)
      registeredComponents.current.set(flowId, {
        callback: callback ?? (() => {}),
      })
    }

    if (intervalRef.current) {
      clearTimeout(intervalRef.current)
    }

    intervalRef.current = setTimeout(() => batchRegistration(), 0)
  }

  const navigateHandler =
    navigate ??
    ((url, target = '_self') => {
      window.open(url, target)
    })

  useEffect(() => {
    return () => {
      frigade.destroy()
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
        frigade: frigade,
        registerComponent,
        hasInitialized,
      }}
    >
      <Global styles={{ ':root': { ...themeVariables, ...themeOverrides } }} />
      <ThemeProvider theme={themeTokens}>{children}</ThemeProvider>
    </FrigadeContext.Provider>
  )
}
