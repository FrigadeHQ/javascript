import React, { useContext, useEffect } from 'react'
import { API_PREFIX, PaginatedResult, useConfig } from './common'
import { FrigadeContext } from '../FrigadeProvider'
import { useFlowResponses } from './flow-responses'
import useSWR from 'swr'

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
  const { flows, setFlows, isLoading, userId, publicApiKey } = useContext(FrigadeContext)
  const { addResponse, flowResponses } = useFlowResponses()
  const fetcher = (url) => fetch(url, config).then((r) => r.json())

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
    return getFlow(slug) ? JSON.parse(getFlow(slug).data).data : []
  }

  function markStepStarted(flowSlug: string, stepId: string, data?: any) {
    addResponse({
      foreignUserId: userId,
      flowSlug,
      stepId,
      actionType: 'STARTED_STEP',
      data: data ?? {},
      createdAt: new Date(),
    })
  }

  function markStepCompleted(flowSlug: string, stepId: string, data?: any) {
    addResponse({
      foreignUserId: userId,
      flowSlug,
      stepId,
      actionType: 'COMPLETED_STEP',
      data: data ?? {},
      createdAt: new Date(),
    })
  }

  function getStepStatus(flowSlug: string, stepId: string) {
    return flowResponses ? flowResponses.find((r) => r.stepId === stepId)?.actionType : null
  }

  function getFlowStatus(flowSlug: string) {
    if (getNumberOfStepsCompleted(flowSlug) === getNumberOfSteps(flowSlug)) {
      return 'COMPLETED_FLOW'
    }

    const startedFlow = flowResponses?.find((r) => r.flowSlug === flowSlug)
    if (startedFlow) {
      return 'STARTED_FLOW'
    }
    return null
  }

  function getNumberOfStepsCompleted(flowSlug: string): number {
    // Filter flowResponses for the flowSlug + id and return the length
    let flowResponsesFound = []
    if (flowResponses) {
      // Add all unique flowResponses by stepId to flowResponsesFound
      flowResponses.forEach((r) => {
        if (r.flowSlug === flowSlug && r.actionType === 'COMPLETED_STEP') {
          const found = flowResponsesFound.find((fr) => fr.stepId === r.stepId)
          if (!found) {
            flowResponsesFound.push(r)
          }
        }
      })
    }

    return (
      flowResponsesFound?.filter(
        (r) => r.flowSlug === flowSlug && r.actionType === 'COMPLETED_STEP'
      ).length ?? 0
    )
  }

  function getNumberOfSteps(flowSlug: string) {
    return getFlowSteps(flowSlug).length
  }

  function getFlowData(slug: string): Flow {
    return JSON.parse(flows.find((f) => f.slug === slug).data)
  }

  return {
    getFlow,
    getFlowData,
    isLoading,
    getStepStatus,
    getFlowSteps,
    markStepStarted,
    markStepCompleted,
    getFlowStatus,
    getNumberOfStepsCompleted,
    getNumberOfSteps,
  }
}
