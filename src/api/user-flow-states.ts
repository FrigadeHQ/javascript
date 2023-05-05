import { API_PREFIX, COMPLETED_FLOW, NOT_STARTED_FLOW, STARTED_FLOW, useConfig } from './common'
import { useContext, useEffect, useState } from 'react'
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
  optimisticallyMarkFlowStarted: (flowId: string) => void
  optimisticallySetLastStepId: (flowId: string, stepId: string) => void
  optimisticallyMarkFlowNotStarted: (flowId: string) => void
  error: any
} {
  const { config } = useConfig()
  const { publicApiKey, userId, flows, isNewGuestUser } = useContext(FrigadeContext)
  const [hasFinishedInitialLoad, setHasFinishedInitialLoad] = useState(false)
  const emptyResponse = {
    data: [],
  }
  const fetcher = (url) =>
    fetch(url, config).then((response) => {
      if (response.ok) {
        return response.json()
      }
      console.error(`Error fetching ${url} (${response.status}): ${response.statusText}`)
      return emptyResponse
    })

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

  useEffect(() => {
    if (!hasFinishedInitialLoad && !isLoadingUserFlowStateData && userFlowStatesData) {
      setHasFinishedInitialLoad(true)
    }
  }, [userFlowStatesData, hasFinishedInitialLoad, isLoadingUserFlowStateData])

  function optimisticallyMarkFlowCompleted(flowId: string) {
    if (userFlowStatesData) {
      const flowState = userFlowStatesData.find((state) => state.flowId === flowId)
      if (flowState && flowState.flowState !== COMPLETED_FLOW) {
        flowState.flowState = COMPLETED_FLOW
      }
    }
  }

  function optimisticallyMarkFlowStarted(flowId: string) {
    if (userFlowStatesData) {
      const flowState = userFlowStatesData.find((state) => state.flowId === flowId)
      if (flowState && flowState.flowState !== STARTED_FLOW) {
        flowState.flowState = STARTED_FLOW
      }
    }
  }

  function optimisticallyMarkFlowNotStarted(flowId: string) {
    if (userFlowStatesData) {
      const flowState = userFlowStatesData.find((state) => state.flowId === flowId)
      if (flowState && flowState.flowState !== NOT_STARTED_FLOW) {
        flowState.flowState = NOT_STARTED_FLOW
      }
    }
  }

  function optimisticallySetLastStepId(flowId: string, stepId: string) {
    if (userFlowStatesData) {
      const flowState = userFlowStatesData.find((state) => state.flowId === flowId)
      if (flowState && flowState.lastStepId !== stepId) {
        flowState.lastStepId = stepId
      }
    }
  }

  return {
    userFlowStatesData,
    isLoadingUserFlowStateData: !hasFinishedInitialLoad,
    mutateUserFlowState,
    optimisticallyMarkFlowCompleted,
    optimisticallyMarkFlowStarted,
    optimisticallySetLastStepId,
    optimisticallyMarkFlowNotStarted,
    error,
  }
}
