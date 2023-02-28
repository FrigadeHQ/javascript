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
  error: any
} {
  const { config } = useConfig()
  const { publicApiKey, userId, flows, isNewGuestUser } = useContext(FrigadeContext)

  function arrayFetcher(urlArray: string[]) {
    const f = (url) =>
      fetch(url, config).then((response) => {
        return response.json()
      })
    return Promise.all(urlArray.map(f))
  }

  const {
    data: userFlowStatesData,
    isLoading: isLoadingUserFlowStateData,
    mutate: mutateUserFlowState,
    error,
  } = useSWR(
    publicApiKey && flows && userId && !isNewGuestUser
      ? flows.map(
          (flow) =>
            `${API_PREFIX}userFlowStates/${flow.slug}?foreignUserId=${encodeURIComponent(userId)}`
        )
      : [],
    arrayFetcher
  )

  return {
    userFlowStatesData,
    isLoadingUserFlowStateData,
    mutateUserFlowState,
    error,
  }
}
