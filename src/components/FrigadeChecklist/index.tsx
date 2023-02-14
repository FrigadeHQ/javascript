import React, { CSSProperties, useEffect, useState } from 'react'
import { HeroChecklist, StepData, ModalChecklist } from '@frigade/react-onboarding-components'
import HeroChecklistProps from '@frigade/react-onboarding-components'
import { useFlows } from '../../api/flows'
import { useFlowResponses } from '../../api/flow-responses'

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
}) => {
  const {
    getFlow,
    getFlowSteps,
    markStepCompleted,
    getStepStatus,
    getNumberOfStepsCompleted,
    isLoading,
  } = useFlows()

  const { flowResponses } = useFlowResponses()

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
        ...step,
        complete: getStepStatus(flowId, step.id) === 'COMPLETED_STEP',
        handleCTAClick: () => {
          if (step.autoMarkCompleted || step.autoMarkCompleted === undefined) {
            markStepCompleted(flowId, step.id)
            setSelectedStep(selectedStep + 1 >= steps.length ? selectedStep : selectedStep + 1)
          }
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
        style={style}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
        className={className}
        visible={showModal}
        onClose={() => setShowModal(false)}
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
