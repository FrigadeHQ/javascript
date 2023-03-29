import { API_PREFIX, useConfig } from './common'
import { useContext } from 'react'
import { FrigadeContext } from '../FrigadeProvider'
import useSWR from 'swr'

export interface PublicUserFlowState {
  flowId: string
  flowState: 'COMPLETED_FLOW' | 'STARTED_FLOW' | 'NOT_STARTED_FLOW'
  lastStepId: string
  userId: string
  foreignUserId: string
  stepStates: object
  shouldTrigger: boolean
}

export function useUserFlowStates(): {
  userFlowStatesData: PublicUserFlowState[]
  isLoadingUserFlowStateData: boolean
  mutateUserFlowState: () => any
  optimisticallyMarkFlowCompleted: (flowId: string) => void
  error: any
} {
  const { config } = useConfig()
  const { publicApiKey, userId, flows, isNewGuestUser } = useContext(FrigadeContext)
  const fetcher = (url) => fetch(url, config).then((r) => r.json())
  const {
    data,
    isLoading: isLoadingUserFlowStateData,
    mutate: mutateUserFlowState,
    error,
  } = useSWR(
    publicApiKey && flows && userId
      ? `${API_PREFIX}userFlowStates?foreignUserId=${encodeURIComponent(userId)}`
      : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  )

  const userFlowStatesData = data?.data

  function optimisticallyMarkFlowCompleted(flowId: string) {
    if (userFlowStatesData) {
      const flowState = userFlowStatesData.find((state) => state.flowId === flowId)
      if (flowState) {
        flowState.flowState = 'COMPLETED_FLOW'
      }
    }
  }

  return {
    userFlowStatesData,
    isLoadingUserFlowStateData,
    mutateUserFlowState,
    optimisticallyMarkFlowCompleted,
    error,
  }
}
