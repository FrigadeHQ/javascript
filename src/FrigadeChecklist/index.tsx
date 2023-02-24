import React, { CSSProperties, useState } from 'react'

import { useFlows } from '../api/flows'
import { HeroChecklist, HeroChecklistProps } from '../Checklists/HeroChecklist'
import { StepData } from '../types'
import { ModalChecklist } from '../Checklists/ModalChecklist'
import { COMPLETED_STEP } from '../api/common'
import { primaryCTAClickSideEffects, secondaryCTAClickSideEffects } from '../shared/cta-util'
import { useFlowOpens } from '../api/flow-opens'

export interface FrigadeHeroChecklistProps extends HeroChecklistProps {
  flowId: string
  title?: string
  subtitle?: string
  primaryColor?: string

  onCompleteStep?: (index: number, stepData: StepData) => void
  style?: CSSProperties
  // Optional props
  initialSelectedStep?: number

  className?: string
  type?: 'inline' | 'modal'

  onDismiss?: () => void
}

export const FrigadeChecklist: React.FC<FrigadeHeroChecklistProps> = ({
  flowId,
  title,
  subtitle,
  primaryColor,
  style,
  initialSelectedStep,
  className,
  type,
  onDismiss,
}) => {
  const {
    getFlow,
    getFlowSteps,
    markStepCompleted,
    getStepStatus,
    getNumberOfStepsCompleted,
    isLoading,
    targetingLogicShouldHideFlow,
  } = useFlows()
  const { getOpenFlowState, setOpenFlowState } = useFlowOpens()
  const [selectedStep, setSelectedStep] = useState(initialSelectedStep || 0)
  const [finishedInitialLoad, setFinishedInitialLoad] = useState(false)
  const showModal = getOpenFlowState(flowId)

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

  function getSteps() {
    return steps.map((step: StepData) => {
      return {
        handleSecondaryCTAClick: () => {
          // Default to skip behavior for secondary click but allow for override
          setSelectedStep(selectedStep + 1 >= steps.length ? selectedStep : selectedStep + 1)
          secondaryCTAClickSideEffects(step)
        },
        ...step,
        complete: getStepStatus(flowId, step.id) === COMPLETED_STEP,
        handleCTAClick: () => {
          if (
            !step.completionCriteria &&
            (step.autoMarkCompleted || step.autoMarkCompleted === undefined)
          ) {
            markStepCompleted(flowId, step.id)
            setSelectedStep(selectedStep + 1 >= steps.length ? selectedStep : selectedStep + 1)
          }
          primaryCTAClickSideEffects(step)
        },
      }
    })
  }

  if (type === 'modal') {
    return (
      <ModalChecklist
        steps={getSteps()}
        title={title}
        subtitle={subtitle}
        primaryColor={primaryColor}
        visible={showModal}
        onClose={() => {
          setOpenFlowState(flowId, false)
          if (onDismiss) {
            onDismiss()
          }
        }}
        autoExpandNextStep={true}
      />
    )
  }

  return (
    <HeroChecklist
      steps={getSteps()}
      title={title}
      subtitle={subtitle}
      primaryColor={primaryColor}
      style={style}
      selectedStep={selectedStep}
      setSelectedStep={setSelectedStep}
      className={className}
    />
  )
}
