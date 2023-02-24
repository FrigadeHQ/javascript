import React, { FC, useEffect } from 'react'
import { useFlows } from '../api/flows'
import { Tooltip, ToolTipProps } from '../Tooltip'

export const FrigadeTooltip: FC<
  ToolTipProps & { flowId: string; initialSelectedStep?: number }
> = ({ flowId, initialSelectedStep, customVariables, ...props }) => {
  const {
    getFlow,
    getFlowSteps,
    isLoading,
    targetingLogicShouldHideFlow,
    markStepCompleted,
    setCustomVariable,
  } = useFlows()

  useEffect(() => {
    if (!isLoading && customVariables) {
      Object.keys(customVariables).forEach((key) => {
        setCustomVariable(key, customVariables[key])
      })
    }
  }, [customVariables, isLoading])

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

  return (
    <Tooltip
      data={steps}
      elem={elem}
      onNext={handleOnNext}
      initialStep={initialSelectedStep}
      {...props}
    />
  )
}

export default FrigadeTooltip
