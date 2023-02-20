import React, { FC } from 'react'
import { useFlows } from '../api/flows'
import { Tooltip } from '../Tooltip'
import { ToolTipProps } from '../Tooltip/Tooltip'

export const FrigadeTooltip: FC<
  ToolTipProps & { flowId: string; initialSelectedStep?: number }
> = ({ flowId, initialSelectedStep, ...props }) => {
  const { getFlow, getFlowSteps, isLoading, targetingLogicShouldHideFlow, markStepCompleted } = useFlows()

  if (isLoading) {
    return null
  }

  const flow = getFlow(flowId)
  if (!flow) {
    return null
  }

  if (targetingLogicShouldHideFlow(flow)) {
    return null
  }

  const handleOnNext = (id) => {
    markStepCompleted(flowId, id)
  }

  const steps = getFlowSteps(flowId)
  const elem = document.querySelector(steps[initialSelectedStep ?? 0].selector)

  return <Tooltip data={steps} elem={elem} onNext={handleOnNext} initialStep={initialSelectedStep} {...props} />
}

export default FrigadeTooltip
