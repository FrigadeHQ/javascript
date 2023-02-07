import React, { useContext } from 'react'
import { API_PREFIX, PaginatedResult, useConfig } from './common'
import { FrigadeContext } from '../FrigadeProvider'
import { useFlowResponses } from './flow-responses'

export interface Flow {
  id: number
  name: string
  description: string
  data: string
  createdAt: string
  modifiedAt: string
  slug: string
}

export function useFlows() {
  const { config } = useConfig()
  const { flows, hasLoadedData, setHasLoadedData } = useContext(FrigadeContext)
  const { userId } = useContext(FrigadeContext)
  const { addResponse, flowResponses } = useFlowResponses()

  function getFlows() {
    return fetch(`${API_PREFIX}flows`, config).then((r) => r.json())
  }

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
    // TODO: add server-side call to sync data.
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
    getFlows,
    getFlow,
    getFlowData,
    hasLoadedData,
    getStepStatus,
    getFlowSteps,
    markStepStarted,
    markStepCompleted,
    getFlowStatus,
    getNumberOfStepsCompleted,
    getNumberOfSteps,
  }
}
