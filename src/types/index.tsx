import React, { CSSProperties } from 'react'

export interface StepData {
  id: string
  stepName?: string
  title?: string
  subtitle?: string
  primaryButtonTitle?: string
  primaryButtonUri?: string
  primaryButtonUriTarget?: string
  secondaryButtonTitle?: string
  secondaryButtonUri?: string
  secondaryButtonUriTarget?: string
  skippable?: boolean
  url?: string
  urlTarget?: string
  type?: string
  videoUri?: string
  imageUri?: string | null
  autoMarkCompleted?: boolean
  complete: boolean
  StepContent?: React.ReactNode
  handlePrimaryButtonClick?: () => void
  handleSecondaryButtonClick?: () => void
  ctaActionType?: 'complete'
  imageStyle?: CSSProperties
  props?: any
  completionCriteria?: string
  progress?: number
}

export interface DefaultFrigadeFlowProps {
  flowId: string
  style?: CSSProperties
  className?: string
  appearance?: Appearance
  customVariables?: { [key: string]: string | number | boolean }
  hideOnFlowCompletion?: boolean
}

export interface Appearance {
  /**
   * Overrides of individual components and classes.
   * This map can either be className(s) or CSSProperties.
   */
  styleOverrides?: {
    [key: string]: CSSProperties | string
  }
  theme?: BaseTheme
}

export interface BaseTheme {
  colorPrimary?: string
  colorSecondary?: string
  colorBackground?: string
  colorText?: string
  colorTextOnPrimaryBackground?: string
  colorTextSecondary?: string
  fontSize?: string | number
  fontSmoothing?: string
  fontWeight?: string | number
  borderRadius?: number
}

export const DefaultAppearance: Appearance = {
  theme: {
    colorPrimary: '#000000',
    colorText: '#000000',
    colorBackground: '#ffffff',
    colorTextOnPrimaryBackground: '#ffffff',
    colorTextSecondary: '#000000',
    borderRadius: 8,
  },
}

export function mergeAppearanceWithDefault(appearance?: Appearance): Appearance {
  if (!appearance) {
    return DefaultAppearance
  }
  return {
    styleOverrides: Object.assign(
      DefaultAppearance.styleOverrides ?? {},
      appearance.styleOverrides ?? {}
    ),
    theme: Object.assign(DefaultAppearance.theme, appearance.theme ?? {}),
  }
}
