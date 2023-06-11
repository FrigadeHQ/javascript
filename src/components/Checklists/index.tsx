import React from 'react'
import { Appearance, StepData } from '../../types'

export interface ChecklistProps {
  steps: StepData[]
  title: string
  subtitle: string
  onClose: () => void
  visible: boolean
  onCompleteStep?: (index: number, stepData: StepData) => void
  /**
   * @deprecated Use `appearance` instead
   */
  primaryColor?: string
  selectedStep?: number
  setSelectedStep?: (index: number) => void

  customStepTypes?: Record<string, (stepData: StepData, appearance: Appearance) => React.ReactNode>

  appearance?: Appearance
}
