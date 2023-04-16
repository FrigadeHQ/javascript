import React, { FC, useContext, useEffect } from 'react'
import { useFlows } from '../api/flows'
import { ToolTipData, ToolTipProps, Tooltips } from '../Tooltips'
import { StepData } from '../types'
import { COMPLETED_FLOW } from '../api/common'
import { Portal } from 'react-portal'
import { useFlowOpens } from '../api/flow-opens'
import { FrigadeContext } from '../FrigadeProvider'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'
import { useTheme } from '../hooks/useTheme'
import { useUserFlowStates } from '../api/user-flow-states'
import { useFlowResponses } from '../api/flow-responses'

export const FrigadeTour: FC<ToolTipProps & { flowId: string; initialSelectedStep?: number }> = ({
  flowId,
  customVariables,
  appearance,
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
    getCurrentStepIndex,
    isStepBlocked,
    getFlowStatus,
    customVariables: existingCustomVariables,
  } = useFlows()
  const { isLoadingUserFlowStateData } = useUserFlowStates()
  const { primaryCTAClickSideEffects, secondaryCTAClickSideEffects } = useCTAClickSideEffects()
  const { hasOpenModals } = useFlowOpens()
  const selectedStep = getCurrentStepIndex(flowId)
  const { openFlowStates } = useContext(FrigadeContext)

  const { getFlowResponses } = useFlowResponses()

  const { mergeAppearanceWithDefault } = useTheme()

  appearance = mergeAppearanceWithDefault(appearance)

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

  if (isLoadingUserFlowStateData) {
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

  // Check if any other flow modals are open. If so hide this one
  if (hasOpenModals()) {
    return null
  }
  const steps: ToolTipData[] = getFlowSteps(flowId)

  // Hide tour flow if another flow is open
  if (Object.keys(openFlowStates).length > 0) {
    const otherFlowId = Object.keys(openFlowStates).find(
      (_flowID) => openFlowStates[_flowID] === true
    )
    if (otherFlowId !== undefined && otherFlowId !== flowId) {
      return <></>
    }
  }

  function markTooltipCompleted() {
    markStepCompleted(flowId, steps[selectedStep].id)

    if (selectedStep + 1 >= steps.length) {
      markFlowCompleted(flowId)
      return
    }
    // Double check next step is not blocked
    if (isStepBlocked(flowId, steps[selectedStep + 1].id)) {
      return
    }
    markStepStarted(flowId, steps[selectedStep + 1].id)
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
    return steps.map((step: StepData) => {
      return {
        ...step,
        handleSecondaryButtonClick: () => {
          // Default to skip behavior for secondary click but allow for override
          secondaryCTAClickSideEffects(step)
          if (step.skippable === true) {
            markStepCompleted(flowId, step.id, { skipped: true })
          }
          handleStepCompletionHandlers(step, 'secondary', selectedStep)
        },
        handlePrimaryButtonClick: () => {
          if (
            (!step.completionCriteria &&
              (step.autoMarkCompleted || step.autoMarkCompleted === undefined)) ||
            (step.completionCriteria && step.autoMarkCompleted === true)
          ) {
            markTooltipCompleted()
          }
          handleStepCompletionHandlers(step, 'primary', selectedStep)
          primaryCTAClickSideEffects(step)
        },
      }
    })
  }

  function onDismissCurrentTooltip() {
    if (onDismiss) {
      onDismiss()
    }
    markFlowCompleted(flowId)
  }

  const elem = document.querySelector(steps[selectedStep].selector)

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
