import React, { CSSProperties, useState } from 'react'
import { Checklist, HeroChecklist, StepData } from '@frigade/react-onboarding-components'
import HeroChecklistProps from '@frigade/react-onboarding-components'
import { useFlows } from '../../api/flows'
import { FrigadeChecklist } from '../FrigadeChecklist'

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

export const FrigadeHeroChecklist: React.FC<FrigadeHeroChecklistProps> = (props) => {
  return <FrigadeChecklist type="inline" {...props} />
}
