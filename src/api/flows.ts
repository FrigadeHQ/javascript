import { useContext, useEffect } from 'react'
import {
  ABORTED_FLOW,
  API_PREFIX,
  COMPLETED_FLOW,
  COMPLETED_STEP,
  NOT_STARTED_FLOW,
  NOT_STARTED_STEP,
  STARTED_FLOW,
  STARTED_STEP,
  StepActionType,
  useConfig,
} from './common'
import { FrigadeContext } from '../FrigadeProvider'
import { FlowResponse, useFlowResponses } from './flow-responses'
import useSWR from 'swr'
import { useUserFlowStates } from './user-flow-states'
import { StepData } from '../types'
import { getSubFlowFromCompletionCriteria } from '../shared/completion-util'

export interface Flow {
  id: number
  name: string
  description: string
  data: string
  createdAt: string
  modifiedAt: string
  slug: string
  type: FlowType
  triggerType: TriggerType
  targetingLogic?: string
}

export enum FlowType {
  CHECKLIST = 'CHECKLIST',
  FORM = 'FORM',
  TOUR = 'TOUR',
  SUPPORT = 'SUPPORT',
  CUSTOM = 'CUSTOM',
  BANNER = 'BANNER',
  EMBEDDED_TIP = 'EMBEDDED_TIP',
}

export enum TriggerType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export function useFlows() {
  const { config } = useConfig()
  const {
    flows,
    setFlows,
    userId,
    publicApiKey,
    customVariables,
    setCustomVariables,
    hasActiveFullPageFlow,
    setHasActiveFullPageFlow,
    setFlowResponses,
  } = useContext(FrigadeContext)
  const emptyResponse = {
    data: [],
  }
  const { addResponse, getFlowResponses } = useFlowResponses()
  const fetcher = (url) =>
    fetch(url, config)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        console.error(`Error fetching ${url} (${response.status}): ${response.statusText}`)
        return emptyResponse
      })
      .catch((error) => {
        console.error(`Error fetching ${url}: ${error}`)
        return emptyResponse
      })
  const {
    userFlowStatesData,
    isLoadingUserFlowStateData,
    mutateUserFlowState,
    optimisticallyMarkFlowCompleted,
    optimisticallyMarkFlowStarted,
    optimisticallySetLastStepId,
    optimisticallyMarkFlowNotStarted,
  } = useUserFlowStates()
  const flowResponses = getFlowResponses()

  const {
    data: flowData,
    error,
    isLoading: isLoadingFlows,
  } = useSWR(publicApiKey ? `${API_PREFIX}flows` : null, fetcher, {
    keepPreviousData: true,
  })

  useEffect(() => {
    if (error) {
      console.error(error)
      return
    }
    if (flowData && flowData.data) {
      flowData.data = setFlows(flowData.data)
    }
  }, [flowData, error])

  function getFlow(slug: string): Flow {
    const flow = flows.find((f) => f.slug === slug)
    if (!flow && flows.length > 0 && !isLoadingUserFlowStateData && !isLoadingFlows) {
      console.error(`Flow with slug ${slug} not found`)
    }
    return flow
  }

  function getFlowSteps(flowId: string): StepData[] {
    if (!getFlow(flowId)) {
      return []
    }
    let flowData = getFlow(flowId).data
    if (!flowData) {
      return []
    }

    flowData = substituteVariables(flowData)

    const steps = JSON.parse(flowData)?.data ?? []

    return steps
      .map((step: StepData) => {
        const autoCalculatedProgress = getStepOptionalProgress(step)
        return {
          handleSecondaryButtonClick: () => {
            if (step.skippable === true) {
              markStepCompleted(flowId, step.id, { skipped: true })
            }
          },
          ...step,
          complete:
            getStepStatus(flowId, step.id) === COMPLETED_STEP || autoCalculatedProgress >= 1,
          blocked: isStepBlocked(flowId, step.id),
          hidden: isStepHidden(flowId, step.id),
          handlePrimaryButtonClick: () => {
            if (
              (!step.completionCriteria &&
                (step.autoMarkCompleted || step.autoMarkCompleted === undefined)) ||
              (step.completionCriteria && step.autoMarkCompleted === true)
            ) {
              markStepCompleted(flowId, step.id)
            }
          },
          progress: autoCalculatedProgress,
        }
      })
      .filter((step: StepData) => !(step.hidden === true))
  }

  function substituteVariables(flowData: string) {
    return flowData.replace(/\${(.*?)}/g, (_, variableName) => {
      return customVariables[variableName] !== undefined
        ? String(customVariables[variableName])
        : ''
    })
  }

  /**
   * Get high-level props for a flow such as title and subtitle
   * @param slug
   */
  function getFlowMetadata(slug: string): any {
    if (!getFlow(slug)) {
      return []
    }
    let flowData = getFlow(slug).data
    if (!flowData) {
      return []
    }

    flowData = substituteVariables(flowData)

    return JSON.parse(flowData) ?? {}
  }

  function setCustomVariable(key: string, value: string | number | boolean) {
    setCustomVariables((prev) => ({ ...prev, [key]: value }))
  }

  function updateCustomVariables(newCustomVariables?: {
    [key: string]: string | number | boolean
  }) {
    if (
      !isLoadingUserFlowStateData &&
      !isLoadingFlows &&
      newCustomVariables &&
      JSON.stringify(customVariables) !=
        JSON.stringify({ ...customVariables, ...newCustomVariables })
    ) {
      Object.keys(newCustomVariables).forEach((key) => {
        setCustomVariable(key, newCustomVariables[key])
      })
    }
  }

  function markStepStarted(flowSlug: string, stepId: string, data?: any) {
    optimisticallyMarkFlowStarted(flowSlug)
    optimisticallySetLastStepId(flowSlug, stepId)
    addResponse({
      foreignUserId: userId,
      flowSlug,
      stepId,
      actionType: STARTED_STEP,
      data: data ?? {},
      createdAt: new Date(),
      blocked: false,
      hidden: false,
    }).then(() => {
      mutateUserFlowState()
    })
  }

  function markStepCompleted(flowSlug: string, stepId: string, data?: any) {
    optimisticallyMarkFlowStarted(flowSlug)
    addResponse({
      foreignUserId: userId,
      flowSlug,
      stepId,
      actionType: COMPLETED_STEP,
      data: data ?? {},
      createdAt: new Date(),
      blocked: false,
      hidden: false,
    }).then(() => {
      mutateUserFlowState()
    })
  }

  function markFlowNotStarted(flowSlug: string, data?: any) {
    optimisticallyMarkFlowNotStarted(flowSlug)
    setFlowResponses([])
    addResponse({
      foreignUserId: userId,
      flowSlug,
      stepId: 'unknown',
      actionType: NOT_STARTED_FLOW,
      data: data ?? {},
      createdAt: new Date(),
      blocked: false,
      hidden: false,
    }).then(() => {
      mutateUserFlowState()
    })
  }

  function markFlowStarted(flowSlug: string, data?: any) {
    addResponse({
      foreignUserId: userId,
      flowSlug,
      stepId: 'unknown',
      actionType: STARTED_FLOW,
      data: data ?? {},
      createdAt: new Date(),
      blocked: false,
      hidden: false,
    }).then(() => {
      mutateUserFlowState()
    })
  }

  function markFlowCompleted(flowSlug: string, data?: any) {
    optimisticallyMarkFlowCompleted(flowSlug)
    addResponse({
      foreignUserId: userId,
      flowSlug,
      stepId: 'unknown',
      actionType: COMPLETED_FLOW,
      data: data ?? {},
      createdAt: new Date(),
      blocked: false,
      hidden: false,
    }).then(() => {
      mutateUserFlowState()
    })
  }

  function markFlowAborted(flowSlug: string, data?: any) {
    optimisticallyMarkFlowCompleted(flowSlug)
    addResponse({
      foreignUserId: userId,
      flowSlug,
      stepId: 'unknown',
      actionType: ABORTED_FLOW,
      data: data ?? {},
      createdAt: new Date(),
      blocked: false,
      hidden: false,
    }).then(() => {
      mutateUserFlowState()
    })
  }

  function getStepStatus(flowSlug: string, stepId: string): StepActionType | null {
    const maybeFlowResponse = getLastFlowResponseForStep(flowSlug, stepId)

    if (maybeFlowResponse === null) {
      return null
    }

    return (maybeFlowResponse ? maybeFlowResponse.actionType : NOT_STARTED_STEP) as StepActionType
  }

  function isStepBlocked(flowSlug: string, stepId: string): boolean {
    const maybeFlowResponse = getLastFlowResponseForStep(flowSlug, stepId)

    if (!maybeFlowResponse) {
      return false
    }

    return maybeFlowResponse.blocked
  }

  function isStepHidden(flowSlug: string, stepId: string): boolean {
    const maybeFlowResponse = getLastFlowResponseForStep(flowSlug, stepId)

    if (!maybeFlowResponse) {
      return false
    }

    return maybeFlowResponse.hidden
  }

  function getLastFlowResponseForStep(flowSlug: string, stepId: string): FlowResponse | null {
    if (isLoadingUserFlowStateData) {
      return null
    }
    if (flowResponses === null || flowResponses === undefined) {
      return null
    }

    const flowResponsesSorted = [...flowResponses].sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    return flowResponsesSorted.find((r) => r.stepId === stepId && r.flowSlug === flowSlug)
  }

  function getCurrentStep(flowSlug: string): StepData | null {
    if (isLoadingUserFlowStateData || !userFlowStatesData) {
      return null
    }
    if (getFlowStatus(flowSlug) === NOT_STARTED_FLOW) {
      return getFlowSteps(flowSlug)[0] ?? null
    }

    const lastStep = userFlowStatesData.find((f) => f.flowId === flowSlug)?.lastStepId
    if (lastStep) {
      return getFlowSteps(flowSlug).find((s) => s.id === lastStep)
    }
    return null
  }

  function getCurrentStepIndex(flowSlug: string): number {
    const currentStep = getCurrentStep(flowSlug)
    if (!currentStep) {
      return 0
    }
    const index = getFlowSteps(flowSlug).findIndex((s) => s.id === currentStep.id) ?? 0
    if (
      getStepStatus(flowSlug, currentStep.id) === COMPLETED_STEP &&
      index < getFlowSteps(flowSlug).length - 1
    ) {
      return index + 1
    }
    return index
  }

  function getStepOptionalProgress(step: StepData) {
    if (!step.completionCriteria) return undefined

    const stepSubFlowSlug = getSubFlowFromCompletionCriteria(step.completionCriteria)
    if (stepSubFlowSlug === null) return undefined

    const completed = getNumberOfStepsCompleted(stepSubFlowSlug)
    const total = getNumberOfSteps(stepSubFlowSlug)

    return total === 0 ? undefined : completed / total
  }

  function getFlowStatus(flowSlug: string) {
    const userFlowState = userFlowStatesData?.find((f) => f.flowId === flowSlug)
    if (!userFlowState) {
      return null
    }
    return userFlowState.flowState
  }

  function getNumberOfStepsCompleted(flowSlug: string): number {
    // Filter flowResponses for the flowSlug + id and return the length
    let flowResponsesFound = []
    if (flowResponses) {
      // Add all unique flowResponses by stepId to flowResponsesFound
      flowResponses.forEach((r) => {
        if (r.flowSlug === flowSlug && r.actionType === COMPLETED_STEP) {
          const found = flowResponsesFound.find(
            (fr) => fr.stepId === r.stepId && fr.flowSlug === r.flowSlug
          )
          if (!found) {
            flowResponsesFound.push(r)
          }
        }
      })
    }

    return (
      flowResponsesFound?.filter((r) => r.flowSlug === flowSlug && r.actionType === COMPLETED_STEP)
        .length ?? 0
    )
  }

  function getNumberOfSteps(flowSlug: string) {
    return getFlowSteps(flowSlug).length
  }

  function getFlowData(slug: string): object {
    return JSON.parse(flows.find((f) => f.slug === slug).data)
  }

  function targetingLogicShouldHideFlow(flow: Flow) {
    if (isLoadingUserFlowStateData) {
      return true
    }
    if (flow?.targetingLogic && userFlowStatesData) {
      // Iterate through matching userFlowState for the flow and if shouldTrigger is true, return false
      const matchingUserFlowState = userFlowStatesData.find((ufs) => ufs.flowId === flow.slug)
      if (matchingUserFlowState) {
        return matchingUserFlowState.shouldTrigger === false
      }
    }
    if (flow?.targetingLogic && userId && userId.startsWith('guest_')) {
      return true
    }

    return false
  }

  function isFlowAvailableToUser(flowId: string) {
    return !targetingLogicShouldHideFlow(getFlow(flowId))
  }

  return {
    getFlow,
    getFlowData,
    isLoading: isLoadingUserFlowStateData || isLoadingFlows,
    getStepStatus,
    getFlowSteps,
    getCurrentStepIndex,
    markStepStarted,
    markStepCompleted,
    markFlowNotStarted,
    markFlowStarted,
    markFlowCompleted,
    markFlowAborted,
    getFlowStatus,
    getNumberOfStepsCompleted,
    getNumberOfSteps,
    targetingLogicShouldHideFlow,
    setCustomVariable,
    updateCustomVariables,
    customVariables,
    getStepOptionalProgress,
    getFlowMetadata,
    isStepBlocked,
    isStepHidden,
    hasActiveFullPageFlow,
    setHasActiveFullPageFlow,
    isFlowAvailableToUser,
  }
}
