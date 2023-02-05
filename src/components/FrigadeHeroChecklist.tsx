import React from 'react'
import { Checklist, HeroChecklistProps, HeroChecklist } from '@frigade/react-onboarding-components'
import { useFlows } from '../api/flows'

interface FrigadeHeroChecklistProps {
  flowId: string
}

// Create FC with FrigadeHeroChecklistProps & CheckListProps
export const FrigadeHeroChecklist: React.FC<FrigadeHeroChecklistProps & HeroChecklistProps> = ({
  flowId,
  ...props
}) => {
  const { getFlow, getFlowSteps, markStepStarted, markStepCompleted, getStepStatus } = useFlows()

  const flow = getFlow(flowId)
  if (!flow) {
    return null
  }

  const steps = getFlowSteps(flowId)
  if (!steps) {
    return null
  }

  return (
    <HeroChecklist
      // Override CTA clicks on each step
      steps={steps.map((step) => {
        return {
          ...step,
          complete: getStepStatus(flowId, step.id) === 'COMPLETED_STEP',
          handleCTAClick: () => {
            markStepCompleted(flowId, step.id)
          },
        }
      })}
      {...props}
    />
  )
}
