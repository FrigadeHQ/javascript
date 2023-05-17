import React, { createContext, FC, useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { DataFetcher } from '../components/DataFetcher'
import { Flow } from '../api/flows'
import { FlowResponse } from '../api/flow-responses'
import { Appearance, DefaultAppearance } from '../types'
import { ErrorBoundary } from 'react-error-boundary'

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
  customVariables?: { [key: string]: string | boolean | number | null }
  setCustomVariables?: React.Dispatch<
    React.SetStateAction<{ [key: string]: string | boolean | number | null }>
  >
  isNewGuestUser: boolean
  setIsNewGuestUser: React.Dispatch<React.SetStateAction<boolean>>
  hasActiveFullPageFlow: boolean
  setHasActiveFullPageFlow: React.Dispatch<React.SetStateAction<boolean>>
  organizationId?: string
  setOrganizationId?: React.Dispatch<React.SetStateAction<string>>
  navigate: (url: string, target: string) => void
  defaultAppearance: Appearance
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
}

export const FrigadeProvider: FC<FrigadeProviderProps> = ({
  publicApiKey,
  userId,
  organizationId,
  config,
  children,
}) => {
  const [userIdValue, setUserIdValue] = useState<string | null>(!userId ? null : userId)
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
  const [customVariables, setCustomVariables] = useState<{
    [key: string]: string | boolean | number | null
  }>({})
  const [isNewGuestUser, setIsNewGuestUser] = useState(false)
  const [hasActiveFullPageFlow, setHasActiveFullPageFlow] = useState(false)
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

  useEffect(() => {
    if (userId) {
      setUserIdValue(userId)
    }
  }, [userId])

  useEffect(() => {
    if (organizationId) {
      setOrganizationIdValue(organizationId)
    }
  }, [organizationId])

  useEffect(() => {
    if (!publicApiKey) {
      console.error('FrigadeProvider: publicApiKey is required')
    }
    if (
      publicApiKey &&
      (publicApiKey.length < 10 || publicApiKey.substring(0, 10) !== 'api_public')
    ) {
      console.error('FrigadeProvider: publicApiKey is invalid')
    }
  }, [publicApiKey])

  return (
    <ErrorBoundary fallback={<>{children}</>}>
      <FrigadeContext.Provider
        value={{
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
        }}
      >
        <ThemeProvider theme={appearance.theme}>
          {children}
          <DataFetcher />
        </ThemeProvider>
      </FrigadeContext.Provider>
    </ErrorBoundary>
  )
}
