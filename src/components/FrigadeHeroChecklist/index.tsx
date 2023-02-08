import React, { CSSProperties, useState } from 'react'
import { Checklist, HeroChecklist, StepData } from '@frigade/react-onboarding-components'
import HeroChecklistProps from '@frigade/react-onboarding-components'
import { useFlows } from '../../api/flows'

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
}

export const FrigadeHeroChecklist: React.FC<FrigadeHeroChecklistProps> = ({
  flowId,
  title,
  subtitle,
  primaryColor,
  style,
  initialSelectedStep,
  className,
}) => {
  const {
    getFlow,
    getFlowSteps,
    markStepStarted,
    markStepCompleted,
    getStepStatus,
    getNumberOfStepsCompleted,
  } = useFlows()
  const [selectedStep, setSelectedStep] = useState(initialSelectedStep || 0)
  const [finishedInitialLoad, setFinishedInitialLoad] = useState(false)

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

  return (
    <HeroChecklist
      // Override CTA clicks on each step
      steps={steps.map((step) => {
        return {
          ...step,
          complete: getStepStatus(flowId, step.id) === 'COMPLETED_STEP',
          handleCTAClick: () => {
            if (step.autoMarkCompleted) {
              markStepCompleted(flowId, step.id)
              setSelectedStep(selectedStep + 1 >= steps.length ? selectedStep : selectedStep + 1)
            }
          },
        }
      })}
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
