import React, { CSSProperties } from 'react'

export type CheckListPosition = 'top-left' | 'top-center' | 'top-right'

interface StepProp {
  text: string
  complete: boolean
}

export interface ChecklistProps {
  title: string
  subtitle: string
  steps: StepProp[]
  onDismiss?: () => void
  displayProgress?: boolean
  displayMode?: 'Inline' | 'Modal'
  position?: CheckListPosition
  positionOffset?: number | string
  style?: CSSProperties
  primaryColor?: string
}
