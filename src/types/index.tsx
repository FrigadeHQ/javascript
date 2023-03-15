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
  blocked?: boolean
  StepContent?: React.ReactNode
  handlePrimaryButtonClick?: () => void
  handleSecondaryButtonClick?: () => void
  ctaActionType?: 'complete'
  imageStyle?: CSSProperties
  props?: any
  completionCriteria?: string
  startCriteria?: string
  progress?: number
  dismissible?: boolean
}

export interface DefaultFrigadeFlowProps {
  flowId: string
  style?: CSSProperties
  className?: string
  appearance?: Appearance
  customVariables?: { [key: string]: string | number | boolean }
  hideOnFlowCompletion?: boolean
  /**
   * Handler for when a step is completed.
   * Return true if your app performs an action (e.g. open other modal or page transition).
   * This will dismiss any Frigade modals.
   * @param step
   * @param index
   */
  onStepCompletion?: (step: StepData, index: number, nextStep?: StepData) => boolean
  /**
   * Handler for when a primary or secondary CTA is clicked (regardless if step is completed or not).
   * Return true if your app performs an action (e.g. open other modal or page transition).
   * @param step
   * @param index
   * @param cta
   */
  onButtonClick?: (
    step: StepData,
    index: number,
    cta: 'primary' | 'secondary',
    nextStep?: StepData
  ) => boolean
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
  colorBackgroundSecondary?: string
  colorText?: string
  colorTextOnPrimaryBackground?: string
  colorTextSecondary?: string
  colorBorder?: string
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
    colorBackgroundSecondary: '#ffffff66',
    colorTextOnPrimaryBackground: '#ffffff',
    colorTextSecondary: '#000000',
    colorBorder: '#E6E6E6',
    borderRadius: 8,
  },
}

export function mergeAppearanceWithDefault(appearance?: Appearance): Appearance {
  const _appearance = JSON.parse(JSON.stringify(DefaultAppearance))

  if (!appearance) {
    return _appearance
  }

  return {
    styleOverrides: Object.assign(
      _appearance.styleOverrides ?? {},
      appearance.styleOverrides ?? {}
    ),
    theme: Object.assign(_appearance.theme, appearance.theme ?? {}),
  }
}
