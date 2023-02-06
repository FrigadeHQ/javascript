import React from 'react'
import { Checklist, HeroChecklist } from '@frigade/react-onboarding-components'
import HeroChecklistProps from '@frigade/react-onboarding-components'
import { useFlows } from '../../api/flows'

export interface FrigadeHeroChecklistProps extends HeroChecklistProps {
  flowId: string
}

export const FrigadeHeroChecklist: React.FC<FrigadeHeroChecklistProps> = ({ flowId, ...props }) => {
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
