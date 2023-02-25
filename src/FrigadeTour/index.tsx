import React, { FC, useEffect, useState } from 'react'
import { useFlows } from '../api/flows'
import { ToolTipProps, Tooltips } from '../Tooltips'
import { StepData } from '../types'
import { primaryCTAClickSideEffects, secondaryCTAClickSideEffects } from '../shared/cta-util'
import { COMPLETED_FLOW, COMPLETED_STEP } from '../api/common'

export const FrigadeTour: FC<ToolTipProps & { flowId: string; initialSelectedStep?: number }> = ({
  flowId,
  initialSelectedStep,
  customVariables,
  ...props
}) => {
  const {
    getFlow,
    getFlowSteps,
    isLoading,
    targetingLogicShouldHideFlow,
    markStepCompleted,
    setCustomVariable,
    getStepStatus,
    getNumberOfStepsCompleted,
    getFlowStatus,
    customVariables: existingCustomVariables,
  } = useFlows()
  const [finishedInitialLoad, setFinishedInitialLoad] = useState(false)
  const [selectedStep, setSelectedStep] = useState(initialSelectedStep || 0)

  useEffect(() => {
    if (
      !isLoading &&
      customVariables &&
      JSON.stringify(existingCustomVariables) !=
        JSON.stringify({ ...existingCustomVariables, ...customVariables })
    ) {
      Object.keys(customVariables).forEach((key) => {
        setCustomVariable(key, customVariables[key])
      })
    }
  }, [isLoading, customVariables, setCustomVariable, existingCustomVariables])

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

  if (getFlowStatus(flowId) == COMPLETED_FLOW) {
    return null
  }

  const steps = getFlowSteps(flowId)

  if (!finishedInitialLoad && initialSelectedStep === undefined) {
    const completedSteps = Math.min(getNumberOfStepsCompleted(flowId), steps.length - 1)
    setSelectedStep(completedSteps)
    setFinishedInitialLoad(true)
  }

  function goToNextStepIfPossible() {
    if (selectedStep + 1 >= steps.length) {
      return
    }

    setSelectedStep(selectedStep + 1)
  }

  function getSteps() {
    return steps.map((step: StepData) => {
      return {
        handleSecondaryButtonClick: () => {
          // Default to skip behavior for secondary click but allow for override
          secondaryCTAClickSideEffects(step)
          if (step.skippable === true) {
            markStepCompleted(flowId, step.id, { skipped: true })
          }
        },
        ...step,
        complete: getStepStatus(flowId, step.id) === COMPLETED_STEP,
        handlePrimaryButtonClick: () => {
          if (
            !step.completionCriteria &&
            (step.autoMarkCompleted || step.autoMarkCompleted === undefined)
          ) {
            markStepCompleted(flowId, step.id)
            goToNextStepIfPossible()
          }
          primaryCTAClickSideEffects(step)
        },
      }
    })
  }

  const elem = document.querySelector(steps[initialSelectedStep ?? 0].selector)

  return (
    <Tooltips
      data={getSteps()}
      elem={elem}
      setSelectedStep={setSelectedStep}
      selectedStep={selectedStep}
      {...props}
    />
  )
}

export default FrigadeTour
