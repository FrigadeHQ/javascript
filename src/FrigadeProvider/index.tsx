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
  children?: React.ReactNode
  hasLoadedData: boolean
  setHasLoadedData: (hasLoadedData: boolean) => void
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
  hasLoadedData: false,
  setHasLoadedData: () => {},
})

export const FrigadeProvider: FC<FrigadeProviderProps> = ({ publicApiKey, userId, children }) => {
  const [userIdValue, setUserIdValue] = useState<string | null>(
    userId === undefined ? null : userId
  )
  const [flows, setFlows] = useState<Flow[]>([])
  const [failedFlowResponses, setFailedFlowResponses] = useState<FlowResponse[]>([])
  const [hasLoadedData, setHasLoadedData] = useState(false)

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
        hasLoadedData,
        setHasLoadedData,
      }}
    >
      {children}
      <DataFetcher />
    </FrigadeContext.Provider>
  )
}
