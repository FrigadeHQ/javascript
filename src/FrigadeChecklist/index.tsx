import React, { CSSProperties, useState } from 'react'

import { useFlows } from '../api/flows'
import { HeroChecklist, HeroChecklistProps } from '../Checklists/HeroChecklist'
import { StepData } from '../types'
import { ModalChecklist } from '../Checklists/ModalChecklist'
import { COMPLETED_STEP } from '../api/common'

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

  const [selectedStep, setSelectedStep] = useState(initialSelectedStep || 0)
  const [finishedInitialLoad, setFinishedInitialLoad] = useState(false)
  const [showModal, setShowModal] = useState(true)

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
    return steps.map((step) => {
      return {
        handleSecondaryCTAClick: () => {
          // Default to skip behavior for secondary click but allow for override
          setSelectedStep(selectedStep + 1 >= steps.length ? selectedStep : selectedStep + 1)
        },
        ...step,
        complete: getStepStatus(flowId, step.id) === COMPLETED_STEP,
        handleCTAClick: () => {
          if (step.autoMarkCompleted || step.autoMarkCompleted === undefined) {
            markStepCompleted(flowId, step.id)
            setSelectedStep(selectedStep + 1 >= steps.length ? selectedStep : selectedStep + 1)
          }
        },
      }
    })
  }

  const commonProps = {
    steps: getSteps(),
    title,
    subtitle,
    primaryColor
  }

  if (type === 'modal') {
    return (
      <ModalChecklist
        visible={showModal}
        onClose={() => {
          setShowModal(false)
          if (onDismiss) {
            onDismiss()
          }
        }}
        autoExpandNextStep={true}
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
