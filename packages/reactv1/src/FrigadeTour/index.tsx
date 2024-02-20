import React, { CSSProperties, FC, useContext, useEffect } from 'react'
import { useFlows } from '../api/flows'
import { ToolTipData, Tooltips } from '../components/Tooltips'
import { Appearance, DefaultFrigadeFlowProps, StepData } from '../types'
import { COMPLETED_FLOW, COMPLETED_STEP } from '../api/common'
import { Portal } from 'react-portal'
import { useFlowOpens } from '../api/flow-opens'
import { FrigadeContext } from '../FrigadeProvider'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'
import { useTheme } from '../hooks/useTheme'
import { useUserFlowStates } from '../api/user-flow-states'
import { ToolTipPosition } from '../components/Tooltips/Tooltips'

export interface FrigadeTourProps extends Omit<DefaultFrigadeFlowProps, 'flowId'> {
  /**
   * @ignore
   */
  steps?: ToolTipData[]
  onDismiss?: () => void
  onComplete?: () => void
  tooltipPosition?: ToolTipPosition
  /**
   * Whether to show the highlight (the small circle/ping) or not. Defaults to true.
   */
  showHighlight?: boolean
  /**
   * Whether to show more than one tooltip at a time. Defaults to false.
   */
  showTooltipsSimultaneously?: boolean
  /**
   * @ignore
   */
  buttonStyle?: CSSProperties
  /**
   * Offset to apply to all tooltips. If you only wish to apply an offset to a single tooltip you can use `props.offset` in the config.yml instead.
   */
  offset?: { x: number; y: number }
  visible?: boolean
  /**
   * @ignore
   */
  containerStyle?: CSSProperties
  customVariables?: { [key: string]: string | number | boolean }
  /**
   * @ignore
   */
  selectedStep?: number
  customStepTypes?: Record<
    string,
    (props: { stepData: StepData; primaryColor: string }) => React.ReactNode
  >
  appearance?: Appearance
  /**
   * Shows a close button in the top right corner of the tooltip. Depending on dismissBehavior, it will either end the entire flow or just the current step.
   */
  dismissible?: boolean
  primaryColor?: string
  /**
   * If true, the tooltip will only show the highlight and not the tooltip itself.
   * Clicking the highlight will reveal it.
   */
  showHighlightOnly?: boolean
  /**
   * If true, a step counter will show up in the tooltip.
   */
  showStepCount?: boolean
  /**
   * `skip-flow` (default): Completes the entire flow/tour when a single tooltip is dismissed.
   * `complete-step`: Completes the current step when a tooltip is dismissed. The user can continue in the tour.
   */
  dismissBehavior?: 'skip-flow' | 'complete-step'

  /**
   * @ignore
   */
  showFrigadeBranding?: boolean

  /**
   * If true, the tour will go to the next existing step/tip if the current selector element is not found on the page.
   * Be careful with this, as it can lead to unexpected behavior of tooltip ordering if the selector is slow to load on the page.
   * Defaults to false.
   */
  skipIfNotFound?: boolean
  /**
   * How to position the tooltips with CSS. Defaults to `absolute`.
   * @ignore
   */
  cssPosition?: 'fixed' | 'absolute' | 'static'
}

export const FrigadeTour: FC<
  FrigadeTourProps & { flowId: string; initialSelectedStep?: number }
> = ({
  flowId,
  customVariables,
  appearance,
  onStepCompletion,
  onButtonClick,
  showTooltipsSimultaneously = false,
  onDismiss,
  dismissible,
  tooltipPosition = 'auto',
  showHighlightOnly = false,
  dismissBehavior = 'skip-flow',
  onComplete,
  skipIfNotFound = false,
  cssPosition = 'absolute',
  className,
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
    markFlowSkipped,
    updateCustomVariables,
    getCurrentStepIndex,
    getStepStatus,
    isStepBlocked,
    getFlowStatus,
    getNumberOfStepsCompleted,
  } = useFlows()
  const { isLoadingUserFlowStateData } = useUserFlowStates()
  const { primaryCTAClickSideEffects, secondaryCTAClickSideEffects } = useCTAClickSideEffects()
  const { hasOpenModals } = useFlowOpens()
  const selectedStep = getCurrentStepIndex(flowId)
  const { openFlowStates } = useContext(FrigadeContext)

  const { mergeAppearanceWithDefault } = useTheme()

  appearance = mergeAppearanceWithDefault(appearance)

  useEffect(() => {
    updateCustomVariables(customVariables)
  }, [customVariables, isLoading])

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

  async function markTooltipCompleted(stepData: StepData) {
    await markStepCompleted(flowId, stepData.id)

    // Check if all steps are now completed
    if (
      steps
        .map((step: StepData) => getStepStatus(flowId, step.id))
        .every((status) => status === COMPLETED_STEP)
    ) {
      await markFlowCompleted(flowId)
      return
    }
    if (!showHighlightOnly && selectedStep + 1 < steps.length && !showTooltipsSimultaneously) {
      // Double check next step is not blocked
      if (isStepBlocked(flowId, steps[selectedStep + 1].id)) {
        return
      }
    }
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
        handleSecondaryButtonClick: async () => {
          // Default to skip behavior for secondary click but allow for override
          secondaryCTAClickSideEffects(step)
          if (step.skippable === true) {
            await markStepCompleted(flowId, step.id, { skipped: true })
          }
          handleStepCompletionHandlers(step, 'secondary', selectedStep)
        },
        handlePrimaryButtonClick: async () => {
          if (
            (!step.completionCriteria &&
              (step.autoMarkCompleted || step.autoMarkCompleted === undefined)) ||
            (step.completionCriteria && step.autoMarkCompleted === true)
          ) {
            await markTooltipCompleted(step)
          }
          handleStepCompletionHandlers(step, 'primary', selectedStep)
          primaryCTAClickSideEffects(step)
        },
      }
    })
  }

  async function onDismissTooltip(stepData: StepData) {
    if (onDismiss) {
      onDismiss()
    }
    if (dismissBehavior === 'skip-flow') {
      await markFlowSkipped(flowId)
    } else {
      await markStepCompleted(flowId, stepData.id)
    }
  }

  function handleComplete() {
    if (onComplete) {
      onComplete()
    }
  }

  async function handleViewTooltip(index: number) {
    await markStepStarted(flowId, steps[index].id)
  }

  const isCurrentSelectorMissing = !Boolean(document.querySelector(steps[selectedStep].selector))

  function renderMultipleToolTips() {
    const firstVisibleIndex = steps.findIndex((step, idx) => {
      return Boolean(document.querySelector(step.selector)) && idx >= selectedStep
    })

    return steps.map((step: StepData, idx: number) => {
      if (showTooltipsSimultaneously) {
        return (
          <Tooltips
            key={step.id}
            appearance={appearance}
            steps={getSteps()}
            selectedStep={idx}
            showTooltipsSimultaneously={showTooltipsSimultaneously}
            dismissible={dismissible}
            onDismiss={() => onDismissTooltip(step)}
            tooltipPosition={tooltipPosition}
            showHighlightOnly={showHighlightOnly}
            completedStepsCount={getNumberOfStepsCompleted(flowId)}
            onComplete={handleComplete}
            cssPosition={cssPosition}
            onViewTooltip={handleViewTooltip}
            className={className}
            {...props}
          />
        )
      }

      if (skipIfNotFound && isCurrentSelectorMissing && idx === firstVisibleIndex) {
        return (
          <Tooltips
            key={step.id}
            appearance={appearance}
            steps={getSteps()}
            selectedStep={idx}
            showTooltipsSimultaneously={showTooltipsSimultaneously}
            dismissible={dismissible}
            onDismiss={() => onDismissTooltip(step)}
            tooltipPosition={tooltipPosition}
            showHighlightOnly={showHighlightOnly}
            completedStepsCount={getNumberOfStepsCompleted(flowId)}
            onComplete={handleComplete}
            cssPosition={cssPosition}
            onViewTooltip={handleViewTooltip}
            className={className}
            {...props}
          />
        )
      }

      if (idx != selectedStep) {
        return null
      }

      return (
        <Tooltips
          key={step.id}
          appearance={appearance}
          steps={getSteps()}
          selectedStep={idx}
          showTooltipsSimultaneously={showTooltipsSimultaneously}
          dismissible={dismissible}
          onDismiss={() => onDismissTooltip(step)}
          tooltipPosition={tooltipPosition}
          showHighlightOnly={showHighlightOnly}
          completedStepsCount={getNumberOfStepsCompleted(flowId)}
          onComplete={handleComplete}
          cssPosition={cssPosition}
          onViewTooltip={handleViewTooltip}
          className={className}
          {...props}
        />
      )
    })
  }

  function getTooltips() {
    return (
      <>
        <RenderInlineStyles appearance={appearance} />
        {renderMultipleToolTips()}
      </>
    )
  }

  if (cssPosition === 'static') {
    return getTooltips()
  }

  return <Portal>{getTooltips()}</Portal>
}

export default FrigadeTour
