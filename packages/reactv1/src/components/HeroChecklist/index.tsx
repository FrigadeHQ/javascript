import React, { CSSProperties } from 'react'
import { FrigadeChecklist } from '../../FrigadeChecklist'
import { HeroChecklistProps } from '../Checklists/HeroChecklist'
import { StepData } from '../../types'

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
