import {
  COMPLETED_FLOW,
  NOT_STARTED_FLOW,
  NOT_STARTED_STEP,
  SKIPPED_FLOW,
  STARTED_FLOW,
  useConfig,
} from './common'
import { useContext, useEffect, useState } from 'react'
import { FrigadeContext } from '../FrigadeProvider'
import useSWR from 'swr'
import { useFlowOpens } from './flow-opens'
import { FlowResponse } from './flow-responses'
import useSWRImmutable from 'swr/immutable'
import { deepmerge } from '../shared/deepmerge'
import { safeParse } from '../shared/parse'

export interface PublicUserFlowState {
  flowId: string
  flowState: 'COMPLETED_FLOW' | 'STARTED_FLOW' | 'NOT_STARTED_FLOW'
  lastStepId: string
  userId: string
  foreignUserId: string
  stepStates: object
  shouldTrigger: boolean
}

const UNKNOWN_STEP_ID = 'unknown'

export function useUserFlowStates(): {
  userFlowStatesData: PublicUserFlowState[]
  isLoadingUserFlowStateData: boolean
  mutateUserFlowState: () => any
  optimisticallyMarkFlowCompleted: (flowId: string) => void
  optimisticallyMarkFlowSkipped: (flowId: string) => void
  optimisticallyMarkFlowNotStarted: (flowId: string) => void
  optimisticallyMarkStepCompleted: (
    flowId: string,
    stepId: string,
    flowResponse: FlowResponse
  ) => void
  optimisticallyMarkStepNotStarted: (
    flowId: string,
    stepId: string,
    flowResponse: FlowResponse
  ) => void
  optimisticallyMarkStepStarted: (
    flowId: string,
    stepId: string,
    flowResponse: FlowResponse
  ) => void
  error: any
} {
  const { config, apiUrl } = useConfig()
  const { publicApiKey, userId, organizationId, flows, setShouldGracefullyDegrade, readonly } =
    useContext(FrigadeContext)
  const { resetOpenFlowState } = useFlowOpens()
  const [hasFinishedInitialLoad, setHasFinishedInitialLoad] = useState(false)
  const emptyResponse = {
    data: flows.map((flow) => ({
      flowId: flow.id,
      flowState: COMPLETED_FLOW,
      lastStepId: null,
      userId,
      foreignUserId: userId,
      stepStates: {},
      shouldTrigger: false,
    })),
  }
  const fetcher = (url) =>
    fetch(url, config)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Failed to fetch user flow states')
      })
      .catch((error) => {
        console.log(`Error fetching ${url}: ${error}. Will gracefully degrade and hide Frigade`)
        setShouldGracefullyDegrade(true)
        return emptyResponse
      })

  const key =
    publicApiKey && flows && userId
      ? `${apiUrl}userFlowStates?foreignUserId=${encodeURIComponent(userId)}${
          organizationId ? `&foreignUserGroupId=${encodeURIComponent(organizationId)}` : ''
        }`
      : null

  const {
    data,
    isLoading: isLoadingUserFlowStateData,
    mutate: mutateUserFlowState,
    error,
  } = readonly
    ? useSWRImmutable(key, fetcher)
    : useSWR(key, fetcher, {
        revalidateOnFocus: true,
        revalidateIfStale: true,
        keepPreviousData: true,
        revalidateOnMount: false,
        errorRetryInterval: 10000,
        errorRetryCount: 3,
        onError: () => {
          // In case of errors fetching the user flow states, hide all Frigade flow by setting shouldTrigger to false
          return emptyResponse
        },
        onLoadingSlow: () => {
          return emptyResponse
        },
      })
  const userFlowStatesData = data?.data

  useEffect(() => {
    if (!hasFinishedInitialLoad && !isLoadingUserFlowStateData && userFlowStatesData) {
      setHasFinishedInitialLoad(true)
    }
  }, [userFlowStatesData, hasFinishedInitialLoad, isLoadingUserFlowStateData])

  async function optimisticallyMarkFlowCompleted(flowId: string) {
    if (userFlowStatesData && !readonly) {
      const flowState = userFlowStatesData.find((state) => state.flowId === flowId)
      if (flowState && flowState.flowState !== COMPLETED_FLOW) {
        flowState.flowState = COMPLETED_FLOW
      }
      await mutateUserFlowState(Promise.resolve(deepmerge(data, { data: userFlowStatesData })), {
        optimisticData: deepmerge(data, { data: userFlowStatesData }),
        revalidate: false,
        rollbackOnError: false,
      })
    }
  }

  async function optimisticallyMarkFlowSkipped(flowId: string) {
    if (userFlowStatesData && !readonly) {
      const flowState = userFlowStatesData.find((state) => state.flowId === flowId)
      if (flowState && flowState.flowState !== SKIPPED_FLOW) {
        flowState.flowState = SKIPPED_FLOW
      }
      await mutateUserFlowState(Promise.resolve(deepmerge(data, { data: userFlowStatesData })), {
        optimisticData: deepmerge(data, { data: userFlowStatesData }),
        revalidate: false,
        rollbackOnError: false,
      })
    }
  }

  async function optimisticallyMarkStepCompleted(
    flowId: string,
    stepId: string,
    flowResponse: FlowResponse
  ) {
    if (userFlowStatesData) {
      const flowState = userFlowStatesData.find(
        (state) => state.flowId === flowId
      ) as PublicUserFlowState
      if (flowState) {
        const flow = flows.find((flow) => flow.slug === flowId)
        const data = safeParse<any>(flow?.data)
        const steps = data?.steps ?? data?.data ?? []
        const currentStepIndex = steps.findIndex((step) => step.id === stepId)
        const nextStep =
          steps && steps.length > currentStepIndex + 1 ? steps[currentStepIndex + 1] : null
        if (nextStep) {
          flowState.lastStepId = nextStep.id
        }
        flowState.stepStates[stepId] = flowResponse
        flowState.flowState = STARTED_FLOW
      }
      if (!readonly) {
        await mutateUserFlowState(Promise.resolve(deepmerge(data, { data: userFlowStatesData })), {
          optimisticData: deepmerge(data, { data: userFlowStatesData }),
          revalidate: false,
          rollbackOnError: false,
        })
      }
    }
  }

  async function optimisticallyMarkStepStarted(
    flowId: string,
    stepId: string,
    flowResponse: FlowResponse
  ) {
    if (userFlowStatesData) {
      const flowState = userFlowStatesData.find(
        (state) => state.flowId === flowId
      ) as PublicUserFlowState
      if (flowState) {
        flowState.lastStepId = stepId
        flowState.stepStates[stepId] = flowResponse
        flowState.flowState = STARTED_FLOW
      }
      if (!readonly) {
        await mutateUserFlowState(deepmerge(data, { data: userFlowStatesData }), {
          optimisticData: deepmerge(data, { data: userFlowStatesData }),
          revalidate: false,
          rollbackOnError: false,
        })
      }
    }
  }

  async function optimisticallyMarkFlowNotStarted(flowId: string) {
    if (userFlowStatesData) {
      const flowState = userFlowStatesData.find((state) => state.flowId === flowId)
      if (flowState && flowState.flowState !== NOT_STARTED_FLOW) {
        flowState.flowState = NOT_STARTED_FLOW
        flowState.lastStepId = UNKNOWN_STEP_ID
        // Update all sets to NOT_STARTED_STEP
        Object.keys(flowState.stepStates).forEach((stepId) => {
          flowState.stepStates[stepId].actionType = NOT_STARTED_STEP
          flowState.stepStates[stepId].createdAt = new Date().toISOString()
        })
        await mutateUserFlowState(deepmerge(data, { data: userFlowStatesData }), {
          optimisticData: deepmerge(data, { data: userFlowStatesData }),
          revalidate: false,
          rollbackOnError: false,
        })
        resetOpenFlowState(flowId)
      }
    }
  }

  async function optimisticallyMarkStepNotStarted(
    flowId: string,
    stepId: string,
    flowResponse: FlowResponse
  ) {
    if (userFlowStatesData) {
      const flowState = userFlowStatesData.find(
        (state) => state.flowId === flowId
      ) as PublicUserFlowState
      if (flowState) {
        flowState.stepStates[stepId] = flowResponse
      }
      await mutateUserFlowState(Promise.resolve(deepmerge(data, { data: userFlowStatesData })), {
        optimisticData: deepmerge(data, { data: userFlowStatesData }),
        revalidate: false,
        rollbackOnError: false,
      })
    }
  }

  return {
    userFlowStatesData,
    isLoadingUserFlowStateData: !hasFinishedInitialLoad,
    mutateUserFlowState,
    optimisticallyMarkFlowCompleted,
    optimisticallyMarkFlowSkipped,
    optimisticallyMarkFlowNotStarted,
    optimisticallyMarkStepCompleted,
    optimisticallyMarkStepNotStarted,
    optimisticallyMarkStepStarted,
    error,
  }
}
