import React, { createContext, FC, useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { DataFetcher, guestUserIdField, realUserIdField } from '../components/DataFetcher'
import { Flow } from '../api/flows'
import { FlowResponse } from '../api/flow-responses'
import { Appearance, DefaultAppearance } from '../types'
import { deepmerge } from '../shared/deepmerge'
import { appearanceToOverrides } from '../shared/appearanceToOverrides'

import { tokens } from '../shared/theme'

export interface IFrigadeContext {
  publicApiKey: string
  userId?: string | null
  setUserId: React.Dispatch<React.SetStateAction<string | null>>
  flows: Flow[]
  setFlows: React.Dispatch<React.SetStateAction<Flow[]>>
  failedFlowResponses: FlowResponse[]
  setFailedFlowResponses: React.Dispatch<React.SetStateAction<FlowResponse[]>>
  flowResponses?: FlowResponse[]
  setFlowResponses?: React.Dispatch<React.SetStateAction<FlowResponse[]>>
  children?: React.ReactNode
  userProperties?: { [key: string]: string | boolean | number | null }
  setUserProperties?: React.Dispatch<
    React.SetStateAction<{ [key: string]: string | boolean | number | null }>
  >
  openFlowStates: { [key: string]: boolean }
  setOpenFlowStates: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
  completedFlowsToKeepOpenDuringSession: string[]
  setCompletedFlowsToKeepOpenDuringSession: React.Dispatch<React.SetStateAction<string[]>>
  customVariables?: { [key: string]: string | boolean | number | null }
  setCustomVariables?: React.Dispatch<
    React.SetStateAction<{ [key: string]: string | boolean | number | null }>
  >
  isNewGuestUser: boolean
  setIsNewGuestUser: React.Dispatch<React.SetStateAction<boolean>>
  hasActiveFullPageFlow: boolean
  setHasActiveFullPageFlow: React.Dispatch<React.SetStateAction<boolean>>
  organizationId?: string
  setOrganizationId?: React.Dispatch<React.SetStateAction<string | null>>
  navigate: (url: string, target: string) => void
  defaultAppearance: Appearance
  shouldGracefullyDegrade: boolean
  setShouldGracefullyDegrade: React.Dispatch<React.SetStateAction<boolean>>
  apiUrl: string
  readonly: boolean
  debug: boolean
  flowDataOverrides?: { [key: string]: string }
}

export interface FrigadeProviderProps {
  publicApiKey: string
  /**
   * The user id of the user that is currently logged in.
   */
  userId?: string
  /**
   * The organization id of the organization that is currently logged in.
   */
  organizationId?: string
  config?: FrigadeConfig
  children?: React.ReactNode
}

const DEFAULT_API_URL = 'https://api.frigade.com'
export const FrigadeContext = createContext<IFrigadeContext>({
  publicApiKey: '',
  setUserId: () => {},
  flows: [],
  setFlows: () => {},
  failedFlowResponses: [],
  setFailedFlowResponses: () => {},
  flowResponses: [],
  setFlowResponses: () => {},
  userProperties: {},
  setUserProperties: () => {},
  openFlowStates: {},
  setOpenFlowStates: () => {},
  completedFlowsToKeepOpenDuringSession: [],
  setCompletedFlowsToKeepOpenDuringSession: () => {},
  customVariables: {},
  setCustomVariables: () => {},
  isNewGuestUser: false,
  setIsNewGuestUser: () => {},
  hasActiveFullPageFlow: false,
  setHasActiveFullPageFlow: () => {},
  organizationId: '',
  setOrganizationId: () => {},
  navigate: () => {},
  defaultAppearance: DefaultAppearance,
  shouldGracefullyDegrade: false,
  setShouldGracefullyDegrade: () => {},
  apiUrl: DEFAULT_API_URL,
  readonly: false,
  debug: false,
})

interface FrigadeConfig {
  /**
   * Override the default router used by Frigade.
   * This is useful if you are using a router and want to avoid doing a full page refresh on navigation.
   * @param url The url to navigate to.
   */
  navigate?: (url: string, target: string) => void
  /**
   * Default Appearance for all flows.
   */
  defaultAppearance?: Appearance
  /**
   * API url to use for all requests. Defaults to https://api.frigade.com
   */
  apiUrl?: string
  /**
   * When true, Frigade will be in read-only mode and state will not be updated. Default false.
   * Used mostly for demo purposes.
   */
  readonly?: boolean

  theme?: Record<string, any>
  /**
   * Flag to turn on debug mode which will log all events to the console. Default false.
   * Default false.
   */
  debug?: boolean

  /**
   * @ignore
   */
  __internal__?: { [key: string]: string }
}

function clearLocalStorage() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('frigade-')) {
      localStorage.removeItem(key)
    }
  })
}

export const FrigadeProvider: FC<FrigadeProviderProps> = ({
  publicApiKey,
  userId,
  organizationId,
  config,
  children,
}) => {
  const guestId = typeof window !== 'undefined' ? localStorage.getItem(guestUserIdField) : null
  const [userIdValue, setUserIdValue] = useState<string | null>(!userId ? guestId : userId)
  const [organizationIdValue, setOrganizationIdValue] = useState<string | null>(
    !organizationId ? null : organizationId
  )
  const [flows, setFlows] = useState<Flow[]>([])
  const [failedFlowResponses, setFailedFlowResponses] = useState<FlowResponse[]>([])
  const [flowResponses, setFlowResponses] = useState<FlowResponse[]>([])
  const [userProperties, setUserProperties] = useState<{
    [key: string]: string | boolean | number | null
  }>({})
  const [openFlowStates, setOpenFlowStates] = useState<{ [key: string]: boolean }>({})
  const [completedFlowsToKeepOpenDuringSession, setCompletedFlowsToKeepOpenDuringSession] =
    useState<string[]>([])
  const [customVariables, setCustomVariables] = useState<{
    [key: string]: string | boolean | number | null
  }>({})
  const [isNewGuestUser, setIsNewGuestUser] = useState(false)
  const [hasActiveFullPageFlow, setHasActiveFullPageFlow] = useState(false)
  const [shouldGracefullyDegrade, setShouldGracefullyDegrade] = useState(
    !isValidApiKey(publicApiKey)
  )
  const internalNavigate = (url: string, target: string) => {
    if (target === '_blank') {
      window.open(url, '_blank')
      return
    }
    setTimeout(() => {
      window.location.href = url
    }, 50)
  }

  const appearance: Appearance = {
    theme: { ...DefaultAppearance.theme, ...(config?.defaultAppearance?.theme ?? {}) },
    styleOverrides: {
      ...DefaultAppearance.styleOverrides,
      ...(config?.defaultAppearance?.styleOverrides ?? {}),
    },
  }

  function isValidApiKey(apiKey: string): boolean {
    return Boolean(apiKey && apiKey.length > 10 && apiKey.substring(0, 10) === 'api_public')
  }

  useEffect(() => {
    if (userId) {
      setUserIdValue(userId)
    }
  }, [userId])

  useEffect(() => {
    if (userIdValue) {
      if (
        typeof window !== 'undefined' &&
        window.localStorage &&
        window.localStorage.getItem(realUserIdField)
      ) {
        if (window.localStorage.getItem(realUserIdField) !== userIdValue) {
          clearLocalStorage()
        }
      }
    }
  }, [userIdValue])

  useEffect(() => {
    if (organizationId) {
      setOrganizationIdValue(organizationId)
    }
  }, [organizationId])

  useEffect(() => {
    if (!isValidApiKey(publicApiKey)) {
      console.error(
        'Frigade SDK failed to initialize. API key provided is either missing or valid.'
      )
      setShouldGracefullyDegrade(true)
      return
    } else {
      setShouldGracefullyDegrade(false)
    }
  }, [publicApiKey, setShouldGracefullyDegrade])

  const contextParams = {
    publicApiKey,
    userId: userIdValue,
    setUserId: setUserIdValue,
    setFlows,
    flows: flows,
    failedFlowResponses,
    setFailedFlowResponses,
    flowResponses,
    setFlowResponses,
    userProperties,
    setUserProperties,
    openFlowStates,
    setOpenFlowStates,
    completedFlowsToKeepOpenDuringSession,
    setCompletedFlowsToKeepOpenDuringSession,
    customVariables,
    setCustomVariables,
    isNewGuestUser,
    setIsNewGuestUser,
    hasActiveFullPageFlow,
    setHasActiveFullPageFlow,
    organizationId: organizationIdValue,
    setOrganizationId: setOrganizationIdValue,
    navigate: config && config.navigate ? config.navigate : internalNavigate,
    defaultAppearance: appearance,
    shouldGracefullyDegrade,
    setShouldGracefullyDegrade,
    apiUrl: config && config.apiUrl ? config.apiUrl : DEFAULT_API_URL,
    readonly: config && config.readonly ? config.readonly : false,
    debug: config && config.debug ? config.debug : false,
    flowDataOverrides: config && config.__internal__ ? config.__internal__ : undefined,
  } as IFrigadeContext

  // Forward-port appearance.theme into theme tokens
  const { overrides } = appearanceToOverrides(appearance)

  if (shouldGracefullyDegrade) {
    return (
      <FrigadeContext.Provider value={contextParams}>
        <ThemeProvider
          theme={deepmerge(appearance.theme, tokens, overrides ?? {}, config?.theme ?? {})}
        >
          {children}
        </ThemeProvider>
      </FrigadeContext.Provider>
    )
  }

  return (
    <FrigadeContext.Provider value={contextParams}>
      {/* TEMP: Merge old appearance.theme vars in for backwards compatibility */}
      <ThemeProvider
        theme={deepmerge(appearance.theme, tokens, overrides ?? {}, config?.theme ?? {})}
      >
        {children}
        <DataFetcher />
      </ThemeProvider>
    </FrigadeContext.Provider>
  )
}
