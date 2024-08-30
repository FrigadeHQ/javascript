import {
  CollectionsRegistryBatch,
  type CollectionsRegistryCallback,
  type Flow,
  Frigade,
  FrigadeConfig,
  PropertyPayload,
  StatefulFlow,
} from '@frigade/js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Global, ThemeProvider } from '@emotion/react'

import { DefaultCollection } from '@/components/Provider/DefaultCollection'

import {
  createThemeVariables,
  theme as themeTokens,
  type Theme,
  themeVariables,
} from '@/shared/theme'

import { FrigadeContext } from './FrigadeContext'
import { ImagePreloader } from '@/components/Provider/ImagePreloader'
import { SDK_VERSION } from '@/version'

export type NavigateHandler = (url: string, target?: string) => void
export type RegisteredComponents = Map<
  string,
  {
    callback?: CollectionsRegistryCallback
  }
>

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
   * Global CSS properties to attach to the :root element.
   * @see https://emotion.sh/docs/css-prop#object-styles
   */
  css?: Record<string, unknown>

  /**
   * By default, Frigade.Provider will render a built-in Collection to allow no-code deploys of Announcements and other floating Components. Set this to `false` if you want to manually control the rendering of the default Collection.
   */
  defaultCollection?: boolean

  /**
   * Whether to generate a Guest ID and session if no userId is provided at render time.
   * If set to false, Frigade will not initialize or render any Flows until a userId is provided.
   * Defaults to true.
   */
  generateGuestId?: boolean

  /**
   * Whether to sync state with Frigade on URL or focus change. Defaults to true.
   */
  syncOnWindowUpdates?: boolean

  /**
   * The group ID to use for this context (optional).
   */
  groupId?: string

  /**
   * Optional group properties to attach to the groupId on initialization.
   */
  groupProperties?: PropertyPayload

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
   * Optional user properties to attach to the userId on initialization.
   */
  userProperties?: PropertyPayload

  /**
   * Whether to preload images in Flows. Defaults to true.
   */
  preloadImages?: boolean

  /**
   * @ignore Internal use only.
   * If enabled, Frigade will not send any data to the API. A user's state will be reset on page refresh.
   */
  __readOnly?: boolean

  /**
   * @ignore Internal use only.
   * Map of Flow ID to Flow State for all flows in the app that should be mocked.
   */
  __flowStateOverrides?: Record<string, StatefulFlow>
}

export function Provider({
  children,
  css = {},
  defaultCollection = true,
  navigate,
  theme,
  ...props
}: ProviderProps) {
  const themeOverrides = theme ? createThemeVariables(theme) : {}
  const registeredComponents = useRef<RegisteredComponents>(new Map())
  const intervalRef = useRef<NodeJS.Timeout>()
  const [hasInitialized, setHasInitialized] = useState(false)

  const frigade = useMemo<Frigade>(() => {
    setHasInitialized(false)
    intervalRef.current = undefined

    return new Frigade(props.apiKey, {
      apiKey: props.apiKey,
      apiUrl: props.apiUrl,
      userId: props.userId,
      groupId: props.groupId,
      userProperties: props.userProperties,
      groupProperties: props.groupProperties,
      generateGuestId: props.generateGuestId,
      syncOnWindowUpdates: props.syncOnWindowUpdates,
      __readOnly: props.__readOnly,
      __flowStateOverrides: props.__flowStateOverrides,
      __platformVersion: SDK_VERSION,
      __platformName: 'React',
    } as FrigadeConfig)
  }, [props.userId, props.groupId, props.apiKey])

  useEffect(() => {
    if (props.__flowStateOverrides) {
      const config = frigade.getConfig()
      config.__flowStateOverrides = props.__flowStateOverrides
      frigade.reload(config)
    }
  }, [props.__flowStateOverrides])

  function batchRegistration() {
    const batchedFlowIds = [...registeredComponents.current.entries()].map(([flowId, options]) => [
      flowId,
      options.callback,
    ]) as CollectionsRegistryBatch

    frigade.batchRegister(batchedFlowIds)

    setHasInitialized(true)
  }

  function registerComponent(flowId: string, callback?: CollectionsRegistryCallback) {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current)
    }

    if (hasInitialized) {
      if (!registeredComponents.current.has(flowId)) {
        frigade.getFlow(flowId).then((flow: Flow) => flow.register(callback))

        registeredComponents.current.set(flowId, {
          callback: callback,
        })
      } else {
        // If component is already registered, fire its callback to let the downstream consumer know its current state
        frigade.getFlow(flowId).then((flow: Flow) => callback(flow.isVisible))
      }

      return
    }

    if (!registeredComponents.current.has(flowId)) {
      registeredComponents.current.set(flowId, {
        callback,
      })
    }

    if (intervalRef.current) {
      clearTimeout(intervalRef.current)
    }

    intervalRef.current = setTimeout(() => batchRegistration(), 0)
  }

  function unregisterComponent(flowId: string) {
    if (registeredComponents.current.has(flowId)) {
      frigade.getFlow(flowId).then((flow: Flow) => {
        registeredComponents.current.delete(flowId)
        flow?.unregister()
      })
    }
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

  return (
    <FrigadeContext.Provider
      value={{
        navigate: navigateHandler,
        ...props,
        frigade: frigade,
        registerComponent,
        unregisterComponent,
        hasInitialized,
      }}
    >
      <Global styles={{ ':root': { ...themeVariables, ...themeOverrides, ...css } }} />
      <ThemeProvider theme={themeTokens}>
        {defaultCollection && <DefaultCollection />}
        {children}
      </ThemeProvider>
      {props.preloadImages !== false && <ImagePreloader />}
    </FrigadeContext.Provider>
  )
}
