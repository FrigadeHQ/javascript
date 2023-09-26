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

  /**
   * Map of custom step types that the checklist supports. To use a custom steps in your checklist, see [Component Customization](/component/customization#customizing-frigade-components)
   */
  customStepTypes?: Record<
    string,
    ((stepData: StepData, appearance: Appearance) => React.ReactNode) | React.ReactNode
  >

  appearance?: Appearance
}
