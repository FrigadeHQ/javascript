import React, { createContext, FC, useEffect, useState } from 'react'
import { DataFetcher } from '../DataFetcher'
import { Flow } from '../api/flows'
import { FlowResponse } from '../api/flow-responses'

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
}

export interface FrigadeProviderProps {
  publicApiKey: string
  userId?: string
  organizationId?: string
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
})

export const FrigadeProvider: FC<FrigadeProviderProps> = ({
  publicApiKey,
  userId,
  organizationId,
  children,
}) => {
  const [userIdValue, setUserIdValue] = useState<string | null>(!userId ? null : userId)
  const [organizationIdValue, setOrganizationIdValue] = useState<string | null>(
    !organizationId ? null : organizationId
  )
  const [flows, setFlows] = useState<Flow[]>([])
  const [failedFlowResponses, setFailedFlowResponses] = useState<FlowResponse[]>([])
  const [flowResponses, setFlowResponses] = useState<FlowResponse[] | null>(null)
  const [userProperties, setUserProperties] = useState<{
    [key: string]: string | boolean | number | null
  }>({})
  const [openFlowStates, setOpenFlowStates] = useState<{ [key: string]: boolean }>({})
  const [customVariables, setCustomVariables] = useState<{
    [key: string]: string | boolean | number | null
  }>({})
  const [isNewGuestUser, setIsNewGuestUser] = useState(false)
  const [hasActiveFullPageFlow, setHasActiveFullPageFlow] = useState(false)

  useEffect(() => {
    if (userId !== null && userId !== undefined && userId !== userIdValue) {
      setUserIdValue(userId)
    }
  }, [userId])

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
      }}
    >
      {children}
      <DataFetcher />
    </FrigadeContext.Provider>
  )
}
