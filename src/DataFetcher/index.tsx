import React, { FC, useContext, useEffect } from 'react'
import { useFlows } from '../api/flows'
import { FrigadeContext } from '../FrigadeProvider'
import { useUser } from '../api/users'
import { v4 as uuidv4 } from 'uuid'
import { FlowResponse, PublicStepState, useFlowResponses } from '../api/flow-responses'

interface DataFetcherProps {}

const guestUserIdField = 'xFrigade_guestUserId'

export const DataFetcher: FC<DataFetcherProps> = ({}) => {
  const { getFlows } = useFlows()
  const { getUserFlowState, setFlowResponses, flowResponses } = useFlowResponses()
  const { userId, setUserId } = useUser()
  const { setFlows, setHasLoadedData } = useContext(FrigadeContext)

  async function prefetchFlows() {
    setHasLoadedData(false)
    const flows = await getFlows()
    if (flows && flows?.data) {
      // Prefetch flow responses for each flow in parallel
      let prefetchPromises = []
      flows.data.forEach((flow) => {
        prefetchPromises.push(prefetchFlowResponses(flow.slug, userId))
      })
      await Promise.all(prefetchPromises)
      setFlows(flows.data)
      setHasLoadedData(true)
    } else {
      console.error('Failed to prefetch flows')
    }
  }

  async function prefetchFlowResponses(flowSlug: string, userId: string) {
    const flowState = await getUserFlowState(flowSlug, userId)
    if (flowState && flowState.stepStates) {
      // Convert flowState.stepStates map to flowResponses
      const apiFlowResponses: FlowResponse[] = []
      for (const stepSlug in flowState.stepStates) {
        const stepState = flowState.stepStates[stepSlug] as PublicStepState
        apiFlowResponses.push({
          foreignUserId: userId,
          flowSlug,
          stepId: stepState.stepId,
          actionType: stepState.actionType,
          data: {},
          createdAt: new Date(),
        } as FlowResponse)
      }
      if (flowResponses.length > 0) {
        // Merge the new flow responses with the existing ones
        const newFlowResponses = flowResponses.concat(apiFlowResponses)
        setFlowResponses(newFlowResponses)
        return
      }
      setFlowResponses(apiFlowResponses)
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
