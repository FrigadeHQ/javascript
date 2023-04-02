import React, { FC, useContext, useEffect, useState } from 'react'
import { useFlows } from '../api/flows'
import { ToolTipProps, Tooltips } from '../Tooltips'
import { mergeAppearanceWithDefault, StepData } from '../types'
import { COMPLETED_FLOW, COMPLETED_STEP, NOT_STARTED_FLOW, STARTED_FLOW } from '../api/common'
import { Portal } from 'react-portal'
import { useFlowOpens } from '../api/flow-opens'
import { FrigadeContext } from '../FrigadeProvider'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import { useFlowResponses } from '../api/flow-responses'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'

export const FrigadeTour: FC<ToolTipProps & { flowId: string; initialSelectedStep?: number }> = ({
  flowId,
  initialSelectedStep,
  customVariables,
  appearance,
  primaryColor,
  onStepCompletion,
  onButtonClick,
  showTooltipsSimultaneously = false,
  onDismiss,
  dismissible,
  ...props
}) => {
  const {
    getFlow,
    getFlowSteps,
    isLoading,
    targetingLogicShouldHideFlow,
    markStepCompleted,
    markStepStarted,
    markFlowCompleted,
    setCustomVariable,
    getStepStatus,
    getCurrentStepIndex,
    isStepBlocked,
    isStepHidden,
    getFlowStatus,
    customVariables: existingCustomVariables,
  } = useFlows()
  const { primaryCTAClickSideEffects, secondaryCTAClickSideEffects } = useCTAClickSideEffects()

  const { getFlowResponses } = useFlowResponses()

  const { hasOpenModals } = useFlowOpens()

  const { openFlowStates } = useContext(FrigadeContext)

  const [finishedInitialLoad, setFinishedInitialLoad] = useState(false)
  const [selectedStep, setSelectedStep] = useState(initialSelectedStep || 0)
  appearance = mergeAppearanceWithDefault(appearance)
  if (primaryColor) {
    appearance.theme.colorPrimary = primaryColor
  }
  const currentFlowStatus = getFlowStatus(flowId)
  const currentStep = getCurrentStepIndex(flowId)

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

  useEffect(() => {
    if (currentFlowStatus === NOT_STARTED_FLOW) {
      setSelectedStep(0)
    }
  }, [currentFlowStatus])

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (currentFlowStatus !== STARTED_FLOW) {
      return
    }
    if (!getFlowResponses()) {
      return
    }

    if (!finishedInitialLoad && initialSelectedStep === undefined) {
      setSelectedStep(getCurrentStepIndex(flowId))
      setFinishedInitialLoad(true)
    }
  }, [finishedInitialLoad, initialSelectedStep, getCurrentStepIndex, flowId, isLoading])

  useEffect(() => {
    if (currentFlowStatus !== STARTED_FLOW) {
      return
    }
    if (currentStep && currentStep > selectedStep) {
      setSelectedStep(currentStep)
    }
  }, [selectedStep, currentStep])

  if (isLoading && !finishedInitialLoad) {
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

  if (
    getStepStatus(flowId, selectedStep) == COMPLETED_STEP &&
    selectedStep == getFlowSteps(flowId).length - 1
  ) {
    return null
  }

  // Check if any other flow modals are open. If so hide this one
  if (hasOpenModals()) {
    return null
  }
  const steps = getFlowSteps(flowId)

  // Hide tour flow if another flow is open
  if (Object.keys(openFlowStates).length > 0) {
    const otherFlowId = Object.keys(openFlowStates).find(
      (_flowID) => openFlowStates[_flowID] === true
    )
    if (otherFlowId !== undefined && otherFlowId !== flowId) {
      return <></>
    }
  }

  function goToNextStepIfPossible() {
    if (selectedStep + 1 >= steps.length) {
      markFlowCompleted(flowId)
      setSelectedStep(0)
      return
    }
    // Double check next step is not blocked
    if (isStepBlocked(flowId, steps[selectedStep + 1].id)) {
      return
    }
    markStepStarted(flowId, steps[selectedStep + 1].id)
    setSelectedStep(selectedStep + 1)
  }

  function handleStepCompletionHandlers(step: StepData, cta: 'primary' | 'secondary', idx: number) {
    const maybeNextStep = selectedStep + 1 < steps.length ? steps[selectedStep + 1] : null
    if (onButtonClick) {
      onButtonClick(step, selectedStep, cta, maybeNextStep)
    }
    if (onStepCompletion) {
      onStepCompletion(step, idx, maybeNextStep)
    }
  }

  function getSteps() {
    return steps
      .map((step: StepData) => {
        return {
          handleSecondaryButtonClick: () => {
            // Default to skip behavior for secondary click but allow for override
            secondaryCTAClickSideEffects(step)
            if (step.skippable === true) {
              markStepCompleted(flowId, step.id, { skipped: true })
            }
            handleStepCompletionHandlers(step, 'secondary', selectedStep)
          },
          ...step,
          complete: getStepStatus(flowId, step.id) === COMPLETED_STEP,
          blocked: isStepBlocked(flowId, step.id),
          hidden: isStepHidden(flowId, step.id),
          handlePrimaryButtonClick: () => {
            if (
              (!step.completionCriteria &&
                (step.autoMarkCompleted || step.autoMarkCompleted === undefined)) ||
              (step.completionCriteria && step.autoMarkCompleted === true)
            ) {
              markStepCompleted(flowId, step.id)
              goToNextStepIfPossible()
            }
            handleStepCompletionHandlers(step, 'primary', selectedStep)
            primaryCTAClickSideEffects(step)
          },
        }
      })
      .filter((step: StepData) => !(step.hidden === true))
  }

  function onDismissCurrentTooltip() {
    if (onDismiss) {
      onDismiss()
    }
    markFlowCompleted(flowId)
  }

  const elem = document.querySelector(steps[initialSelectedStep ?? 0].selector)

  return (
    <Portal>
      <RenderInlineStyles appearance={appearance} />
      {showTooltipsSimultaneously ? (
        steps.map((step: StepData, idx: number) => (
          <Tooltips
            key={step.id}
            appearance={appearance}
            steps={getSteps()}
            elem={elem}
            setSelectedStep={setSelectedStep}
            selectedStep={idx}
            showTooltipsSimultaneously={showTooltipsSimultaneously}
            dismissible={dismissible}
            onDismiss={onDismissCurrentTooltip}
            {...props}
          />
        ))
      ) : (
        <Tooltips
          appearance={appearance}
          steps={getSteps()}
          elem={elem}
          setSelectedStep={setSelectedStep}
          selectedStep={selectedStep}
          showTooltipsSimultaneously={showTooltipsSimultaneously}
          dismissible={dismissible}
          onDismiss={onDismissCurrentTooltip}
          {...props}
        />
      )}
    </Portal>
  )
}

export default FrigadeTour
