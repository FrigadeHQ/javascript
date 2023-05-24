import { useContext, useState } from 'react'
import {
  ABORTED_FLOW,
  API_PREFIX,
  COMPLETED_FLOW,
  COMPLETED_STEP,
  NOT_STARTED_FLOW,
  NOT_STARTED_STEP,
  STARTED_FLOW,
  STARTED_STEP,
  useConfig,
  useGracefulFetch,
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
  const { userFlowStatesData, mutateUserFlowState } = useUserFlowStates()
  const { failedFlowResponses, setFailedFlowResponses, flowResponses, setFlowResponses } =
    useContext(FrigadeContext)
  const [successfulFlowResponsesStrings, setSuccessfulFlowResponsesStrings] = useState<Set<String>>(
    new Set()
  )
  const [successfulFlowResponses, setSuccessfulFlowResponses] = useState<Set<FlowResponse>>(
    new Set()
  )

  const gracefullyFetch = useGracefulFetch()

  function postFlowResponse(flowResponse: FlowResponse) {
    const flowResponseString = JSON.stringify(flowResponse)

    if (successfulFlowResponsesStrings.has(flowResponseString)) {
      return null
    }
    // For steps that are already in the same state, do not update the API.
    successfulFlowResponsesStrings.add(flowResponseString)
    setSuccessfulFlowResponsesStrings(successfulFlowResponsesStrings)
    successfulFlowResponses.add(flowResponse)
    setSuccessfulFlowResponses(successfulFlowResponses)
    // Only update flow responses if there is not already an entry for this step.
    // Check for flow id, step id, and action type, and date
    const existingFlowResponse = flowResponses?.find(
      (r) =>
        r.flowSlug === flowResponse.flowSlug &&
        r.stepId === flowResponse.stepId &&
        r.actionType === flowResponse.actionType &&
        r.createdAt === flowResponse.createdAt
    )
    if (!existingFlowResponse) {
      setFlowResponses((prev) => [...(prev ?? []), flowResponse])
    }

    return gracefullyFetch(`${API_PREFIX}flowResponses`, {
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
      await postFlowResponse(flowResponse)
    } else if (flowResponse.actionType === COMPLETED_FLOW) {
      await postFlowResponse(flowResponse)
    } else if (flowResponse.actionType === STARTED_STEP) {
      await postFlowResponse(flowResponse)
    } else if (flowResponse.actionType === COMPLETED_STEP) {
      await postFlowResponse(flowResponse)
    } else if (flowResponse.actionType === ABORTED_FLOW) {
      await postFlowResponse(flowResponse)
    } else if (flowResponse.actionType === NOT_STARTED_STEP) {
      await postFlowResponse(flowResponse)
    }
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
    setFlowResponses,
    getFlowResponses,
  }
}
