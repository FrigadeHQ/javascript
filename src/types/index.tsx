import React, { CSSProperties } from 'react'

export interface StepData {
  /**
   * Unique identifier for the step.
   */
  id: string
  /**
   * Name of the step when shown in a list view
   */
  stepName?: string
  /**
   * Title of the step
   */
  title?: string
  /**
   * Subtitle of the step
   */
  subtitle?: string
  /**
   * Primary button title. If omitted, the primary button will not be shown.
   */
  primaryButtonTitle?: string
  /**
   * Primary button URI.
   */
  primaryButtonUri?: string
  /**
   * Primary button URI target (either _blank or _self)
   */
  primaryButtonUriTarget?: string
  /**
   * Secondary button title. If omitted, the secondary button will not be shown.
   */
  secondaryButtonTitle?: string
  /**
   * Secondary button URI.
   */
  secondaryButtonUri?: string
  /**
   * Secondary button URI target (either _blank or _self)
   */
  secondaryButtonUriTarget?: string
  /**
   * Text on button if a back button is present
   */
  backButtonTitle?: string
  /**
   * If true, the step will be marked as completed when the secondary button is clicked.
   */
  skippable?: boolean
  /**
   * @deprecated use primaryButtonUri instead
   */
  url?: string
  /**
   * @deprecated use primaryButtonUriTarget instead
   */
  urlTarget?: string
  type?: string
  /**
   * Video url to be shown for components supporting video.
   */
  videoUri?: string
  /**
   * Image url to be shown for components supporting image.
   */
  imageUri?: string | null
  /**
   * Automatically mark the step as completed when the primary button is clicked. Default is false.
   */
  autoMarkCompleted?: boolean
  /**
   * Whether the step is completed.
   */
  complete: boolean
  /**
   * Whether the step is currently active/the flow is currently on this step. Can only be true for on step at a time.
   */
  currentlyActive: boolean
  /**
   * Whether the step is blocked (can't be accessed yet)
   */
  blocked?: boolean
  /**
   * Whether the step is hidden (not shown in the list view)
   */
  hidden?: boolean
  StepContent?: React.ReactNode
  /**
   * Handler for when the primary button is clicked.
   */
  handlePrimaryButtonClick?: () => void
  /**
   * Handler for when the secondary button is clicked.
   */
  handleSecondaryButtonClick?: () => void
  ctaActionType?: 'complete'
  imageStyle?: CSSProperties
  props?: any
  /**
   * Criteria that needs to be met for the step to complete
   */
  completionCriteria?: string
  /**
   * Criteria that needs to be met for the step to start
   */
  startCriteria?: string
  progress?: number
  /**
   * Whether the step is dismissible (for instance, tooltips or other non-essential steps)
   */
  dismissible?: boolean
  /**
   * Whether to show a highlight in the page where the step is shown. Typically used in tooltips for creating small pings.
   */
  showHighlight?: boolean
}

export interface DefaultFrigadeFlowProps {
  flowId: string
  style?: CSSProperties
  className?: string
  /**
   * The appearance of the flow. See https://docs.frigade.com/sdk/styling
   */
  appearance?: Appearance
  /**
   * Dynamic variables to use in config.yml. See https://docs.frigade.com/flows/dynamic-variables
   */
  customVariables?: { [key: string]: string | number | boolean }
  hideOnFlowCompletion?: boolean
  /**
   * Handler for when a step is completed.
   * @param step
   * @param index
   * @param nextStep
   * @param allFormData All form data collected so far (only applicable to FrigadeForms)
   * @param stepSpecificFormData Form data collected for the finished step (only applicable to FrigadeForms)
   */
  onStepCompletion?: (
    step: StepData,
    index: number,
    nextStep?: StepData,
    allFormData?: any,
    stepSpecificFormData?: any
  ) => boolean
  /**
   * Handler for when a primary or secondary CTA is clicked (regardless if step is completed or not).
   * Return true if your app performs an action (e.g. open other modal or page transition).
   * @param step
   * @param index
   * @param cta
   */
  onButtonClick?: (
    step: StepData,
    index?: number,
    cta?: 'primary' | 'secondary' | 'link',
    nextStep?: StepData
  ) => boolean

  onDismiss?: () => void
  onComplete?: () => void
}

export interface Appearance {
  /**
   * Overrides of individual components and classes.
   * This map can either be className(s) or CSSProperties.
   */
  styleOverrides?: {
    [key: string]: CSSProperties | string
  }
  /**
   * The base theme to use with Frigade components.
   */
  theme?: BaseTheme
}

export interface BaseTheme {
  /**
   * The base theme color used on CTAs and other primary elements.
   */
  colorPrimary?: string
  /**
   * Secondary color, used for CTAs and other secondary elements.
   */
  colorSecondary?: string

  colorBackground?: string
  colorBackgroundSecondary?: string
  colorText?: string
  colorTextOnPrimaryBackground?: string
  colorTextSecondary?: string
  colorTextDisabled?: string
  colorTextError?: string
  colorTextSuccess?: string
  colorBorder?: string
  fontSize?: string | number
  fontSmoothing?: string
  fontWeight?: string | number
  borderRadius?: number
  modalContainer?: CSSProperties
}

export const DefaultAppearance: Appearance = {
  theme: {
    colorPrimary: '#0171F8',
    colorSecondary: '#2E343D',
    colorText: '#0F1114',
    colorBackground: '#ffffff',
    colorBackgroundSecondary: '#d2d2d2',
    colorTextOnPrimaryBackground: '#ffffff',
    colorTextSecondary: '#2E343D',
    colorTextDisabled: '#5A6472',
    colorBorder: '#E5E5E5',
    colorTextError: '#c00000',
    colorTextSuccess: '#00D149',
    borderRadius: 10,
  },
}
