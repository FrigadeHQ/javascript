import React, {useContext} from 'react'
import {API_PREFIX, PaginatedResult, useConfig} from './common'
import {FrigadeContext} from '../FrigadeProvider'
import {useFlowResponses} from "./flow-responses";

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
  const {config} = useConfig()
  const {flows, hasLoadedData, setHasLoadedData} = useContext(FrigadeContext)
  const {userId} = useContext(FrigadeContext)
  const {addResponse, flowResponses} = useFlowResponses()

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
    const responsesForStep = flowResponses ? flowResponses.find((r) => r.stepId === stepId)?.actionType : null
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
    markStepCompleted
  }
}
