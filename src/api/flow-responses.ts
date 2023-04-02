import { useContext, useState } from 'react'
import {
  API_PREFIX,
  COMPLETED_FLOW,
  COMPLETED_STEP,
  NOT_STARTED_FLOW,
  STARTED_FLOW,
  STARTED_STEP,
  useConfig,
} from './common'
import { FrigadeContext } from '../FrigadeProvider'
import { useUserFlowStates } from './user-flow-states'

export interface FlowResponse {
  foreignUserId: string
  flowSlug: string
  stepId: string
  actionType: string
  data: object
  createdAt: Date
  blocked: boolean
  hidden: boolean
}

export interface PublicStepState {
  stepId: string
  actionType: 'COMPLETED_STEP' | 'STARTED_STEP' | 'NOT_STARTED_STEP'
  blocked: boolean
  hidden: boolean
}

export function useFlowResponses() {
  const { config } = useConfig()
  const { userId, setUserId, organizationId } = useContext(FrigadeContext)
  const { userFlowStatesData } = useUserFlowStates()
  const { failedFlowResponses, setFailedFlowResponses, flowResponses, setFlowResponses } =
    useContext(FrigadeContext)
  const [successfulFlowResponsesStrings, setSuccessfulFlowResponsesStrings] = useState<Set<String>>(
    new Set()
  )
  const [successfulFlowResponses, setSuccessfulFlowResponses] = useState<Set<FlowResponse>>(
    new Set()
  )

  const [flowResponseMap, setFlowResponseMap] = useState<Map<string, Map<string, FlowResponse>>>(
    new Map()
  )

  const [currentStep, setCurrentStep] = useState<string>('')

  function postFlowResponse(flowResponse: FlowResponse) {
    const flowResponseString = JSON.stringify(flowResponse)

    if (successfulFlowResponsesStrings.has(flowResponseString)) {
      return
    }
    successfulFlowResponsesStrings.add(flowResponseString)
    setSuccessfulFlowResponsesStrings(successfulFlowResponsesStrings)
    successfulFlowResponses.add(flowResponse)
    setSuccessfulFlowResponses(successfulFlowResponses)
    setFlowResponses([...(flowResponses ?? []), flowResponse])

    return fetch(`${API_PREFIX}flowResponses`, {
      ...config,
      method: 'POST',
      body: flowResponseString,
    }).then((r) => {
      if (r.status !== 200 && r.status !== 201) {
        console.log(
          'Failed to send flow response for step ' +
            flowResponse.stepId +
            '. Will retry again later.'
        )
        setFailedFlowResponses([...failedFlowResponses, flowResponse])
      }
    })
  }

  async function addResponse(flowResponse: FlowResponse) {
    if (!flowResponse.foreignUserId) {
      return
    }
    if (flowResponse.actionType === STARTED_FLOW || flowResponse.actionType === NOT_STARTED_FLOW) {
      recordResponse(flowResponse)
      await sendDataToBackend() // Send previous step data to backend
    } else if (flowResponse.actionType === COMPLETED_FLOW) {
      recordResponse(flowResponse)
      await sendDataToBackend() // Send previous step data to backend
    } else if (flowResponse.actionType === STARTED_STEP) {
      setCurrentStep(flowResponse.stepId)
      recordResponse(flowResponse)
    } else if (flowResponse.actionType === COMPLETED_STEP) {
      await sendDataToBackend() // Send previous step data to backend
      setFlowResponseMap(new Map()) // Clear existing data
      recordResponse(flowResponse)
      await sendDataToBackend() // Send completed step data to backend
    }
  }

  async function sendDataToBackend() {
    for (const [stepId, responses] of flowResponseMap.entries()) {
      const pendingResponses = flowResponseMap.get(stepId)
      if (pendingResponses) {
        for (const [actionType, flowResponse] of pendingResponses) {
          let flowResponseToSend = flowResponse
          if (organizationId) {
            flowResponseToSend.foreignUserGroupId = organizationId
          }
          await postFlowResponse(flowResponseToSend)
        }
      }
      flowResponseMap.delete(stepId)
      setFlowResponseMap(flowResponseMap)
    }
  }

  function recordResponse(flowResponse: FlowResponse) {
    const stepId = flowResponse.stepId
    const actionType = flowResponse.actionType
    const stepMap = flowResponseMap.get(stepId) || new Map()
    stepMap.set(actionType, flowResponse)
    flowResponseMap.set(stepId, stepMap)
  }

  async function markFlowStarted(userId: string, flowSlug: string) {
    const flowResponse = {
      foreignUserId: userId,
      flowSlug: flowSlug,
      stepId: 'startFlow',
      actionType: STARTED_FLOW,
      data: {},
      createdAt: new Date(),
      blocked: false,
      hidden: false,
    }
    await addResponse(flowResponse)
    return flowResponse
  }

  async function markFlowCompleted(userId: string, flowSlug: string) {
    const flowResponse = {
      foreignUserId: userId,
      flowSlug: flowSlug,
      stepId: 'endFlow',
      actionType: COMPLETED_FLOW,
      data: { flowResponses: Array.from(successfulFlowResponses) },
      createdAt: new Date(),
      blocked: false,
      hidden: false,
    }
    await addResponse(flowResponse)
    return flowResponse
  }

  function getFlowResponses() {
    const apiFlowResponses: FlowResponse[] = []

    userFlowStatesData?.forEach((flowState) => {
      if (flowState && flowState.stepStates && Object.keys(flowState.stepStates).length !== 0) {
        // Convert flowState.stepStates map to flowResponses

        for (const stepSlug in flowState.stepStates) {
          const stepState = flowState.stepStates[stepSlug] as PublicStepState
          apiFlowResponses.push({
            foreignUserId: flowState.foreignUserId,
            flowSlug: flowState.flowId,
            stepId: stepState.stepId,
            actionType: stepState.actionType,
            data: {},
            createdAt: new Date(),
            blocked: stepState.blocked,
            hidden: stepState.hidden,
          } as FlowResponse)
        }
      }
    })

    return [...apiFlowResponses, ...flowResponses]
  }

  return {
    addResponse,
    markFlowStarted,
    markFlowCompleted,
    setFlowResponses,
    getFlowResponses,
  }
}
