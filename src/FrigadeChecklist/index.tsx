import React, { CSSProperties, useEffect, useState } from 'react'

import { useFlows } from '../api/flows'
import { HeroChecklist, HeroChecklistProps } from '../Checklists/HeroChecklist'
import { StepData } from '../types'
import { ModalChecklist } from '../Checklists/ModalChecklist'
import { COMPLETED_STEP } from '../api/common'
import { primaryCTAClickSideEffects, secondaryCTAClickSideEffects } from '../shared/cta-util'
import { useFlowOpens } from '../api/flow-opens'
import { ChecklistWithGuide } from '../Checklists/ChecklistWithGuilde'

export interface FrigadeChecklistProps extends HeroChecklistProps {
  flowId: string
  title?: string
  subtitle?: string
  primaryColor?: string
  secondaryColor?: string

  onCompleteStep?: (index: number, stepData: StepData) => void
  style?: CSSProperties
  // Optional props
  initialSelectedStep?: number

  className?: string
  type?: 'inline' | 'modal' | 'withGuide'

  visible?: boolean

  onDismiss?: () => void

  customVariables?: { [key: string]: string | number | boolean }
  /**
   * Handler for step completion. Return true if your app performs and action (e.g. open other modal or page transition).
   * This will dismiss any Frigade modals.
   * @param step
   * @param index
   */
  onStepCompletion?: (step: StepData, index: number) => boolean


  /**
   *  Optionl Props specifically for ChecklistWithGuide
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
  } = useFlows()
  const { getOpenFlowState, setOpenFlowState } = useFlowOpens()
  const [selectedStep, setSelectedStep] = useState(initialSelectedStep || 0)
  const [finishedInitialLoad, setFinishedInitialLoad] = useState(false)
  const showModal = visible === undefined ? getOpenFlowState(flowId) : visible

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

  const steps = getFlowSteps(flowId)
  if (!steps) {
    return null
  }

  if (!finishedInitialLoad && initialSelectedStep === undefined) {
    const completedSteps = Math.min(getNumberOfStepsCompleted(flowId), steps.length - 1)
    setSelectedStep(completedSteps)
    setFinishedInitialLoad(true)
  }

  function goToNextStepIfPossible() {
    if (selectedStep + 1 >= steps.length) {
      // If modal, close it
      if (type === 'modal') {
        setOpenFlowState(flowId, false)
      }
      return
    }

    setSelectedStep(selectedStep + 1)
  }

  function handleStepCompletionHandlers(step: StepData) {
    if (onStepCompletion) {
      const completion = onStepCompletion(step, selectedStep)
      if (completion === true && type === 'modal') {
        setOpenFlowState(flowId, false)
      }
    }
  }

  function getSteps() {
    return steps.map((step: StepData) => {
      return {
        handleSecondaryButtonClick: () => {
          // Default to skip behavior for secondary click but allow for override
          goToNextStepIfPossible()
          secondaryCTAClickSideEffects(step)
          if (step.skippable === true) {
            markStepCompleted(flowId, step.id, { skipped: true })
            handleStepCompletionHandlers(step)
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
            handleStepCompletionHandlers(step)
            goToNextStepIfPossible()
          }
          if (step.primaryButtonUri && step.primaryButtonUri.trim() == '#' && type === 'modal') {
            setOpenFlowState(flowId, false)
          }
          primaryCTAClickSideEffects(step)
        },
      }
    })
  }

  const commonProps = {
    steps: getSteps(),
    title,
    subtitle,
    primaryColor,
  }

  if (type === 'modal') {
    return (
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
        {...commonProps}
      />
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
      <ChecklistWithGuide
        visible={showModal}
        stepsTitle={'your quick start guide'}
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
        {...commonProps}
      />
    )
  }

  return (
    <HeroChecklist
      style={style}
      selectedStep={selectedStep}
      setSelectedStep={setSelectedStep}
      className={className}
      {...commonProps}
    />
  )
}
