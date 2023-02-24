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
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isLoadingUserState: boolean
  setIsLoadingUserState: React.Dispatch<React.SetStateAction<boolean>>
  userProperties?: { [key: string]: string | boolean | number | null }
  setUserProperties?: React.Dispatch<
    React.SetStateAction<{ [key: string]: string | boolean | number | null }>
  >
  openFlowStates: { [key: string]: boolean }
  setOpenFlowStates: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
}

export interface FrigadeProviderProps {
  publicApiKey: string
  userId?: string
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
  isLoading: false,
  setIsLoading: () => {},
  isLoadingUserState: false,
  setIsLoadingUserState: () => {},
  userProperties: {},
  setUserProperties: () => {},
  openFlowStates: {},
  setOpenFlowStates: () => {},
})

export const FrigadeProvider: FC<FrigadeProviderProps> = ({ publicApiKey, userId, children }) => {
  const [userIdValue, setUserIdValue] = useState<string | null>(!userId ? null : userId)
  const [flows, setFlows] = useState<Flow[]>([])
  const [failedFlowResponses, setFailedFlowResponses] = useState<FlowResponse[]>([])
  const [flowResponses, setFlowResponses] = useState<FlowResponse[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingUserState, setIsLoadingUserState] = useState(true)
  const [userProperties, setUserProperties] = useState<{
    [key: string]: string | boolean | number | null
  }>({})
  const [openFlowStates, setOpenFlowStates] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (userId !== null && userId !== undefined && userId !== userIdValue) {
      setUserIdValue(userId)
    }
  }, [userId])

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
        isLoading: isLoading,
        setIsLoading: setIsLoading,
        isLoadingUserState,
        setIsLoadingUserState,
        flowResponses,
        setFlowResponses,
        userProperties,
        setUserProperties,
        openFlowStates,
        setOpenFlowStates,
      }}
    >
      {children}
      <DataFetcher />
    </FrigadeContext.Provider>
  )
}
