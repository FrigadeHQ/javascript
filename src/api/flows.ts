import { useContext, useEffect } from 'react'
import {
  API_PREFIX,
  COMPLETED_FLOW,
  COMPLETED_STEP,
  STARTED_FLOW,
  STARTED_STEP,
  StepActionType,
  useConfig,
} from './common'
import { FrigadeContext } from '../FrigadeProvider'
import { useFlowResponses } from './flow-responses'
import useSWR from 'swr'
import { useUserFlowStates } from './user-flow-states'

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
    isLoading,
    userId,
    publicApiKey,
    isLoadingUserState,
    flowResponses,
    customVariables,
    setCustomVariables,
  } = useContext(FrigadeContext)
  const { addResponse } = useFlowResponses()
  const fetcher = (url) => fetch(url, config).then((r) => r.json())
  const { userFlowStatesData, isLoadingUserFlowStateData } = useUserFlowStates()

  const { data: flowData } = useSWR(publicApiKey ? `${API_PREFIX}flows` : null, fetcher)

  useEffect(() => {
    if (flowData && flowData.data) {
      flowData.data = setFlows(flowData.data)
    }
  }, [flowData])

  function getFlow(slug: string): Flow {
    return flows.find((f) => f.slug === slug)
  }

  function getFlowSteps(slug: string): any[] {
    if (!getFlow(slug)) {
      return []
    }
    let flowData = getFlow(slug).data
    if (!flowData) {
      return []
    }
    // Replace all variables of format ${variableName} with the value of the variable from customVariables
    flowData = flowData.replace(/\${(.*?)}/g, (match, variableName) => {
      return customVariables[variableName] ? String(customVariables[variableName]) : match
    })

    return JSON.parse(flowData)?.data ?? []
  }

  function setCustomVariable(key: string, value: string | number | boolean) {
    setCustomVariables((prev) => ({ ...prev, [key]: value }))
  }

  function markStepStarted(flowSlug: string, stepId: string, data?: any) {
    addResponse({
      foreignUserId: userId,
      flowSlug,
      stepId,
      actionType: STARTED_STEP,
      data: data ?? {},
      createdAt: new Date(),
    })
  }

  function markStepCompleted(flowSlug: string, stepId: string, data?: any) {
    addResponse({
      foreignUserId: userId,
      flowSlug,
      stepId,
      actionType: COMPLETED_STEP,
      data: data ?? {},
      createdAt: new Date(),
    })
  }

  function getStepStatus(flowSlug: string, stepId: string): StepActionType | null {
    if (isLoadingUserState) {
      return null
    }
    if (flowResponses === null || flowResponses === undefined) {
      return null
    }

    const maybeFlowResponse = flowResponses.find((r) => r.stepId === stepId)
    // cast return value to StepActionType
    return (maybeFlowResponse ? maybeFlowResponse.actionType : 'NOT_STARTED_STEP') as StepActionType
  }

  function getFlowStatus(flowSlug: string) {
    if (getNumberOfStepsCompleted(flowSlug) === getNumberOfSteps(flowSlug)) {
      return COMPLETED_FLOW
    }

    const startedFlow = flowResponses?.find((r) => r.flowSlug === flowSlug)
    if (startedFlow) {
      return STARTED_FLOW
    }
    return null
  }

  function getNumberOfStepsCompleted(flowSlug: string): number {
    // Filter flowResponses for the flowSlug + id and return the length
    let flowResponsesFound = []
    if (flowResponses) {
      // Add all unique flowResponses by stepId to flowResponsesFound
      flowResponses.forEach((r) => {
        if (r.flowSlug === flowSlug && r.actionType === COMPLETED_STEP) {
          const found = flowResponsesFound.find((fr) => fr.stepId === r.stepId)
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

  function getFlowData(slug: string): Flow {
    return JSON.parse(flows.find((f) => f.slug === slug).data)
  }

  function targetingLogicShouldHideFlow(flow: Flow) {
    if (isLoadingUserFlowStateData) {
      return true
    }
    if (flow.targetingLogic && userFlowStatesData) {
      // Iterate through matcing userFlowState for the flow and if shouldTrigger is true, return false
      const matchingUserFlowState = userFlowStatesData.find((ufs) => ufs.flowId === flow.slug)
      if (matchingUserFlowState) {
        return matchingUserFlowState.shouldTrigger === false
      }
    }

    return false
  }

  return {
    getFlow,
    getFlowData,
    isLoading: isLoadingUserState || isLoading,
    getStepStatus,
    getFlowSteps,
    markStepStarted,
    markStepCompleted,
    getFlowStatus,
    getNumberOfStepsCompleted,
    getNumberOfSteps,
    targetingLogicShouldHideFlow,
    setCustomVariable,
    customVariables,
  }
}
