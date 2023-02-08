import React, { createContext, FC, useState } from 'react'
import { DataFetcher } from '../DataFetcher'
import { Flow } from '../api/flows'
import { FlowResponse } from '../api/flow-responses'

export interface IFrigadeContext {
  publicApiKey: string
  userId?: string
  setUserId: (userId?: string) => void
  flows: Flow[]
  setFlows: (flows: Flow[]) => void
  failedFlowResponses: FlowResponse[]
  setFailedFlowResponses: (flowResponses: FlowResponse[]) => void
  flowResponses?: FlowResponse[]
  setFlowResponses?: React.Dispatch<React.SetStateAction<FlowResponse[]>>
  children?: React.ReactNode
  isLoading: boolean
  setIsLoading: (hasLoadedData: boolean) => void
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
})

export const FrigadeProvider: FC<FrigadeProviderProps> = ({ publicApiKey, userId, children }) => {
  const [userIdValue, setUserIdValue] = useState<string | null>(
    userId === undefined ? null : userId
  )
  const [flows, setFlows] = useState<Flow[]>([])
  const [failedFlowResponses, setFailedFlowResponses] = useState<FlowResponse[]>([])
  const [flowResponses, setFlowResponses] = useState<FlowResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
        flowResponses,
        setFlowResponses,
      }}
    >
      {children}
      <DataFetcher />
    </FrigadeContext.Provider>
  )
}
