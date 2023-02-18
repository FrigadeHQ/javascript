import React, { FC, useContext, useEffect, useState } from 'react'
import { Flow, FlowType, TriggerType } from '../api/flows'
import { FrigadeContext } from '../FrigadeProvider'
import { useUser } from '../api/users'
import { v4 as uuidv4 } from 'uuid'
import { FlowResponse, PublicStepState, useFlowResponses } from '../api/flow-responses'
import { FrigadeChecklist } from '../FrigadeChecklist'
import { PublicUserFlowState, useUserFlowStates } from '../api/user-flow-states'

interface DataFetcherProps {}

const guestUserIdField = 'xFrigade_guestUserId'
const realUserIdField = 'xFrigade_userId'

const GUEST_PREFIX = 'guest_'
export const DataFetcher: FC<DataFetcherProps> = ({}) => {
  const { setFlowResponses } = useFlowResponses()
  const { userFlowStatesData, isLoadingUserFlowStateData } = useUserFlowStates()
  const { userId, setUserId } = useUser()
  const [lastUserId, setLastUserId] = useState<string | null>(null)
  const { flows, userProperties, setIsLoading, setIsLoadingUserState } = useContext(FrigadeContext)
  const [automaticFlowIdsToTrigger, setAutomaticFlowIdsToTrigger] = useState<Flow[]>([])

  useEffect(() => {
    if (isLoadingUserFlowStateData) {
      setIsLoadingUserState(true)
      setIsLoading(true)
    } else {
      if (userFlowStatesData) {
        for (let i = 0; i < userFlowStatesData.length; i++) {
          syncFlowStates(userFlowStatesData[i])
        }
      }
      setIsLoading(false)
      setIsLoadingUserState(false)
    }
  }, [isLoadingUserFlowStateData, userFlowStatesData])

  function triggerFlow(flowId: string) {
    const flow = flows.find((flow) => flow.slug === flowId)
    if (flow && flow.triggerType === TriggerType.AUTOMATIC) {
      // We only trigger one at a time
      setAutomaticFlowIdsToTrigger([flow])
    }
  }

  function syncFlowStates(flowState: PublicUserFlowState) {
    if (!flowState) {
      setFlowResponses((responses) => [...(responses ?? []), ...[]])
      return
    }

    if (flowState && flowState.stepStates && Object.keys(flowState.stepStates).length !== 0) {
      // Convert flowState.stepStates map to flowResponses
      const apiFlowResponses: FlowResponse[] = []
      for (const stepSlug in flowState.stepStates) {
        const stepState = flowState.stepStates[stepSlug] as PublicStepState
        apiFlowResponses.push({
          foreignUserId: flowState.foreignUserId,
          flowSlug: flowState.flowId,
          stepId: stepState.stepId,
          actionType: stepState.actionType,
          data: {},
          createdAt: new Date(),
        } as FlowResponse)
      }
      // merge internal flow responses with api flow responses
      setFlowResponses((responses) => [...(responses ?? []), ...apiFlowResponses])
    }
    if (flowState && flowState.shouldTrigger) {
      // If the flow should be triggered, trigger it
      triggerFlow(flowState.flowId)
    }
  }

  function generateGuestUserId() {
    // If userId is null, generate a guest user id using uuid
    if (!userId) {
      // Check if a real user id exists in local storage
      const realUserId = localStorage.getItem(realUserIdField)
      if (realUserId) {
        setUserId(realUserId)
        return
      }

      // Call local storage to see if we already have a guest user id
      const guestUserId = localStorage.getItem(guestUserIdField)
      if (guestUserId) {
        setUserId(guestUserId)
        return
      }
      // If we don't have a guest user id, generate one and save it to local storage
      const newGuestUserId = GUEST_PREFIX + uuidv4()
      localStorage.setItem(guestUserIdField, newGuestUserId)
      setUserId((userId) => (userId ? userId : newGuestUserId))
    }
  }

  useEffect(() => {
    if (userId !== lastUserId) {
      // Reset responses
      setFlowResponses(null)
    }

    setLastUserId(userId)
    // if user id isn't null and doesn't begin with GUEST_PREFIX , save it to local storage
    if (userId && !userId.startsWith(GUEST_PREFIX)) {
      localStorage.setItem(realUserIdField, userId)
    }

    generateGuestUserId()
  }, [userId, flows, userProperties])

  function AutomaticFlowIdsToTrigger() {
    return (
      <>
        {automaticFlowIdsToTrigger.map((flow) =>
          flow.type === FlowType.CHECKLIST ? (
            <FrigadeChecklist flowId={flow.slug} type={'modal'} />
          ) : null
        )}
      </>
    )
  }

  return (
    <>
      <AutomaticFlowIdsToTrigger />
    </>
  )
}
