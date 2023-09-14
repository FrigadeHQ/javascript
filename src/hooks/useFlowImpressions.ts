import { useEffect, useState } from 'react'
import { NOT_STARTED_FLOW } from '../api/common'
import { useFlows } from '../api/flows'

export function useFlowImpressions(flowId: string) {
  const [hasMarkedFlowStarted, setHasMarkedFlowStarted] = useState(false)
  const { markStepStarted, isLoading, getFlowStatus, getFlowSteps, getCurrentStepIndex } =
    useFlows()
  const steps = getFlowSteps(flowId)

  async function markFlowStartedIfNeeded() {
    if (!hasMarkedFlowStarted && !isLoading && getFlowStatus(flowId) === NOT_STARTED_FLOW) {
      setHasMarkedFlowStarted(true)
      await markStepStarted(flowId, steps[getCurrentStepIndex(flowId)].id)
    }
  }

  useEffect(() => {
    markFlowStartedIfNeeded()
  }, [isLoading, flowId])

  return {}
}
