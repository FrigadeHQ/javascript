import { CSSProperties } from 'react'

export interface StepData {
  id: string
  stepName?: string
  title?: string
  subtitle?: string
  primaryButtonTitle?: string
  secondaryButtonTitle?: string
  url?: string
  urlTarget?: string
  type?: string
  videoUri?: string
  imageUri?: string
  autoMarkCompleted?: boolean
  complete: boolean
  StepContent?: React.ReactNode
  handleCTAClick?: () => void
  ctaActionType?: 'complete'
  imageStyle?: CSSProperties
}
