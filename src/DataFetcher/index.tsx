import React, { FC, useContext, useEffect, useState } from 'react'
import { useFlows } from '../api/flows'
import { FrigadeContext } from '../FrigadeProvider'
import { useUser } from '../api/users'
import { v4 as uuidv4 } from 'uuid'
import {
  FlowResponse,
  PublicStepState,
  PublicUserFlowState,
  useFlowResponses,
} from '../api/flow-responses'

interface DataFetcherProps {}

const guestUserIdField = 'xFrigade_guestUserId'

export const DataFetcher: FC<DataFetcherProps> = ({}) => {
  const { getFlows } = useFlows()
  const { getUserFlowState, setFlowResponses, flowResponses } = useFlowResponses()
  const { userId, setUserId } = useUser()
  const { setFlows, setHasLoadedData } = useContext(FrigadeContext)
  const [internalFlowResponses, setInternalFlowResponses] = useState<FlowResponse[]>([])

  async function prefetchFlows() {
    setHasLoadedData(false)
    const flows = await getFlows()
    if (flows && flows?.data) {
      // Prefetch flow responses for each flow in parallel
      let prefetchPromises = []
      flows.data.forEach((flow) => {
        prefetchPromises.push(getUserFlowState(flow.slug, userId))
      })
      const flowStates = await Promise.all(prefetchPromises)
      for (let i = 0; i < flowStates.length; i++) {
        if (flowStates[i]) {
          syncFlowStates(flowStates[i])
        }
      }
      setFlows(flows.data)
      setHasLoadedData(true)
    } else {
      console.error('Failed to prefetch flows')
    }
  }

  function syncFlowStates(flowState: PublicUserFlowState) {
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
      setFlowResponses((responses) => [...responses, ...apiFlowResponses])
    }
  }

  function generateGuestUserId() {
    // If userId is null, generate a guest user id using uuid
    if (userId === null) {
      // Call local storage to see if we already have a guest user id
      const guestUserId = localStorage.getItem(guestUserIdField)
      if (guestUserId) {
        setUserId(guestUserId)
        return
      }
      // If we don't have a guest user id, generate one and save it to local storage
      const newGuestUserId = 'guest_' + uuidv4()
      localStorage.setItem(guestUserIdField, newGuestUserId)
      setUserId(newGuestUserId)
    }
  }

  useEffect(() => {}, [flowResponses])

  useEffect(() => {
    generateGuestUserId()
  }, [])

  useEffect(() => {
    if (userId !== null) {
      prefetchFlows()
    }
  }, [userId])
  return <></>
}
