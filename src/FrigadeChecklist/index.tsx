import React, { CSSProperties, useEffect, useState } from 'react'

import { useFlows } from '../api/flows'
import { HeroChecklist, HeroChecklistProps } from '../Checklists/HeroChecklist'
import { mergeAppearanceWithDefault, StepData } from '../types'
import { COMPLETED_FLOW, COMPLETED_STEP } from '../api/common'
import { useFlowOpens } from '../api/flow-opens'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import { ModalChecklist } from '../Checklists/ModalChecklist'
import { ChecklistWithGuide } from '../Checklists/ChecklistWithGuide'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'

/**
 * Frigade Checklists
 * inline: Renders as an on-page element
 * modal: Display above other content with a shadowed background
 * withGuide: A modal checklist with a Guide included beneath the modal content
 *
 */
export type FrigadeChecklistType = 'inline' | 'modal' | 'withGuide'

export interface FrigadeChecklistProps extends HeroChecklistProps {
  flowId: string
  title?: string
  subtitle?: string
  /**
   * @deprecated Use `appearance` instead
   */
  primaryColor?: string
  /**
   * @deprecated Use `appearance` instead
   */
  secondaryColor?: string

  onCompleteStep?: (index: number, stepData: StepData) => void
  style?: CSSProperties
  // Optional props
  initialSelectedStep?: number

  className?: string
  type?: FrigadeChecklistType

  visible?: boolean

  onDismiss?: () => void

  customVariables?: { [key: string]: string | number | boolean }

  /**
   *  Optional Props specifically for ChecklistWithGuide
   *
   */
  guideFlowId?: string
  guideTitle?: string
}

export const FrigadeChecklist: React.FC<FrigadeChecklistProps> = ({
  flowId,
  title,
  subtitle,
  primaryColor,
  secondaryColor,
  style,
  initialSelectedStep,
  className,
  type,
  onDismiss,
  visible,
  customVariables,
  onStepCompletion,
  onButtonClick,
  appearance,
  hideOnFlowCompletion,
  setVisible,
  ...guideProps
}) => {
  const {
    getFlow,
    getFlowSteps,
    markStepCompleted,
    getStepStatus,
    getNumberOfStepsCompleted,
    isLoading,
    targetingLogicShouldHideFlow,
    setCustomVariable,
    customVariables: existingCustomVariables,
    getStepOptionalProgress,
    getFlowMetadata,
    isStepBlocked,
    isStepHidden,
    getFlowStatus,
    hasActiveFullPageFlow,
    setHasActiveFullPageFlow,
  } = useFlows()
  const { primaryCTAClickSideEffects, secondaryCTAClickSideEffects } = useCTAClickSideEffects()
  const { getOpenFlowState, setOpenFlowState } = useFlowOpens()
  const [selectedStep, setSelectedStep] = useState(initialSelectedStep || 0)
  const [finishedInitialLoad, setFinishedInitialLoad] = useState(false)
  const showModal = visible === undefined ? getOpenFlowState(flowId) : visible
  const isModal = type === 'modal' || type === 'withGuide'
  appearance = mergeAppearanceWithDefault(appearance)

  // TODO: Remove once primary and secondary colors are deprecated + removed
  if (primaryColor) {
    appearance.theme.colorPrimary = primaryColor
  }
  if (secondaryColor) {
    appearance.theme.colorSecondary = secondaryColor
  }

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
    if (visible !== undefined) {
      if (isModal && visible === true) {
        setHasActiveFullPageFlow(true)
      } else if (isModal && visible === false) {
        setHasActiveFullPageFlow(false)
      }
    }
  }, [visible, setVisible, hasActiveFullPageFlow])

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

  const steps = getFlowSteps(flowId)
  if (!steps) {
    return null
  }

  if (hideOnFlowCompletion === true && getFlowStatus(flowId) === COMPLETED_FLOW) {
    return null
  }

  const metaData = getFlowMetadata(flowId)
  if (metaData?.title) {
    title = metaData.title
  }
  if (metaData?.subtitle) {
    subtitle = metaData.subtitle
  }

  if (
    !finishedInitialLoad &&
    initialSelectedStep === undefined &&
    getNumberOfStepsCompleted(flowId) > 0
  ) {
    const completedSteps = Math.min(getNumberOfStepsCompleted(flowId), steps.length - 1)
    setSelectedStep(completedSteps)
    setFinishedInitialLoad(true)
  }

  function goToNextStepIfPossible() {
    if (selectedStep + 1 >= steps.length) {
      // If modal, close it
      if (isModal) {
        setOpenFlowState(flowId, false)
      }
      return
    }
    // Double check next step is not blocked
    if (isStepBlocked(flowId, steps[selectedStep + 1].id)) {
      return
    }

    setSelectedStep(selectedStep + 1)
  }

  function handleStepCompletionHandlers(
    step: StepData,
    cta: 'primary' | 'secondary' | 'link',
    idx: number
  ) {
    const maybeNextStep = selectedStep + 1 < steps.length ? steps[selectedStep + 1] : null
    if (onButtonClick) {
      const completion = onButtonClick(step, selectedStep, cta, maybeNextStep)
      if (completion === true && isModal) {
        setOpenFlowState(flowId, false)
      }
    }
    if (onStepCompletion) {
      onStepCompletion(step, idx, maybeNextStep)
    }
    if (!onStepCompletion && !onButtonClick) {
      if (isModal) {
        setOpenFlowState(flowId, false)
      }
    }
  }

  function getSteps() {
    return steps.map((step: StepData, idx: number) => {
      return {
        handleSecondaryButtonClick: () => {
          // Default to skip behavior for secondary click but allow for override
          goToNextStepIfPossible()
          secondaryCTAClickSideEffects(step)
          if (step.skippable === true) {
            markStepCompleted(flowId, step.id, { skipped: true })
          }
          handleStepCompletionHandlers(step, 'secondary', idx)
        },
        ...step,
        handlePrimaryButtonClick: () => {
          if (
            (!step.completionCriteria &&
              (step.autoMarkCompleted || step.autoMarkCompleted === undefined)) ||
            (step.completionCriteria && step.autoMarkCompleted === true)
          ) {
            markStepCompleted(flowId, step.id)
            goToNextStepIfPossible()
          }
          handleStepCompletionHandlers(step, 'primary', idx)
          primaryCTAClickSideEffects(step)
          // If step is done, try to go to next step
          if (getStepStatus(flowId, step.id) === COMPLETED_STEP) {
            goToNextStepIfPossible()
          }
        },
      }
    })
  }

  function CommonDom() {
    const imagePreload = steps.map((step: StepData, idx: number) => {
      if (step.imageUri) {
        return <img src={step.imageUri} key={idx} style={{ display: 'none' }} />
      }
      return null
    })

    return (
      <>
        <RenderInlineStyles appearance={appearance} />
        {imagePreload}
      </>
    )
  }

  const commonProps = {
    steps: getSteps(),
    title,
    subtitle,
    primaryColor,
    appearance,
  }

  if (type === 'modal') {
    return (
      <>
        <CommonDom />
        <ModalChecklist
          visible={showModal}
          onClose={() => {
            setOpenFlowState(flowId, false)
            if (onDismiss) {
              onDismiss()
            }
          }}
          selectedStep={selectedStep}
          setSelectedStep={setSelectedStep}
          autoExpandNextStep={true}
          appearance={appearance}
          {...commonProps}
        />
      </>
    )
  }
  if (type === 'withGuide') {
    const guideFlowId = guideProps.guideFlowId
    let guideFlowSteps
    if (guideFlowId) {
      const guideFlow = getFlow(guideFlowId)
      if (guideFlow) {
        guideFlowSteps = getFlowSteps(guideFlowId)
      }
    }

    return (
      <>
        <CommonDom />
        <ChecklistWithGuide
          visible={showModal}
          stepsTitle={metaData.stepsTitle ? metaData.stepsTitle : 'Your quick start guide'}
          onClose={() => {
            setOpenFlowState(flowId, false)
            if (onDismiss) {
              onDismiss()
            }
          }}
          secondaryColor={secondaryColor}
          selectedStep={selectedStep}
          setSelectedStep={setSelectedStep}
          guideData={guideFlowSteps}
          guideTitle={guideProps.guideTitle ?? 'Guide'}
          appearance={appearance}
          title={title}
          subtitle={subtitle}
          onGuideButtonClick={(step) => {
            handleStepCompletionHandlers(step, 'link', 0)
          }}
          {...commonProps}
        />
      </>
    )
  }

  return (
    <>
      <CommonDom />
      <HeroChecklist
        style={style}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
        className={className}
        apperaance={appearance}
        {...commonProps}
      />
    </>
  )
}
