export interface FlowStep {
  /**
   * Unique identifier for the step.
   */
  id: string
  /**
   * Order of the step in the flow.
   */
  order: number
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
   * Whether the step has been completed (equivalent to step status === COMPLETED_STEP)
   */
  isCompleted: boolean
  /**
   * Whether the step has been completed (equivalent to step status === COMPLETED_STEP)
   */
  isStarted: boolean
  /**
   * Whether the step is blocked (can't be accessed yet) based on `startCriteria`
   */
  isBlocked: boolean
  /**
   * Whether the step is hidden (not shown in the list view) based on `visibilityCriteria`
   */
  isHidden: boolean

  props?: any
  /**
   * Criteria that needs to be met for the step to complete
   */
  completionCriteria?: string
  /**
   * Criteria that needs to be met for the step to start
   */
  startCriteria?: string
  /**
   * Progress if the step is tied to another Frigade Flow through completionCriteria
   */
  progress?: number
  /**
   * Whether the step is dismissible (for instance, tooltips or other non-essential steps)
   */
  dismissible?: boolean

  /**
   * Any other additional props defined in config.yml
   */
  [x: string | number | symbol]: unknown

  /**
   * Function that marks the step started
   */
  start: (properties?: Record<string | number, any>) => Promise<void>
  /**
   * Function that marks the step completed
   */
  complete: (properties?: Record<string | number, any>) => Promise<void>

  /**
   * Event handler for this given step's state changes
   */
  onStepStateChange: (callback: (step: FlowStep, previousStep?: FlowStep) => void) => void

  /**
   * Removes the given callback from the list of event handlers
   */
  removeOnStepStateChangeHandler: (
    callback: (step: FlowStep, previousStep?: FlowStep) => void
  ) => void
}
