import type { Flow } from './flow'

export enum TriggerType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export enum FlowStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export type StepAction =
  | 'flow.back'
  | 'flow.complete'
  | 'flow.forward'
  | 'flow.restart'
  | 'flow.skip'
  | 'flow.start'
  | 'step.complete'
  | 'step.reset'
  | 'step.start'
  | false

export type PropertyPayload = Record<string, any>

export interface FlowStep extends StatefulStep {
  /**
   * Order of the step in the Flow.
   */
  order: number

  /**
   * Name of the step when shown in a list view.
   */
  stepName?: string

  /**
   * Title of the step.
   */
  title?: string

  /**
   * Subtitle of the step.
   */
  subtitle?: string

  /**
   * Config for the primary button in this step
   */
  primaryButton?: {
    /**
     * Primary button action. (defaults to step.complete)
     */
    action?: StepAction

    /**
     * Primary button URI target (defaults to _self).
     */
    target?: string

    /**
     * Primary button title. If omitted, the primary button will not be shown.
     */
    title?: string

    /**
     * Primary button URI.
     */
    uri?: string
  }

  /**
   * @deprecated Use primaryButton.title instead
   * @description Primary button title. If omitted, the primary button will not be shown.
   */
  primaryButtonTitle?: string

  /**
   * @deprecated Use primaryButton.uri instead
   * @description Primary button URI.
   */
  primaryButtonUri?: string

  /**
   * @deprecated Use primaryButton.target instead
   * @description Primary button URI target (defaults to _self).
   */
  primaryButtonUriTarget?: string

  /**
   * Config for the secondary button in this step
   */
  secondaryButton?: {
    /**
     * Secondary button action. (defaults to step.complete)
     */
    action?: StepAction

    /**
     * Secondary button URI target (defaults to _self).
     */
    target?: string

    /**
     * Secondary button title. If omitted, the secondary button will not be shown.
     */
    title?: string

    /**
     * Secondary button URI.
     */
    uri?: string
  }

  /**
   * @deprecated Use secondaryButton.title instead
   * @description Secondary button title. If omitted, the secondary button will not be shown.
   */
  secondaryButtonTitle?: string

  /**
   * @deprecated Use secondaryButton.uri instead
   * @description Secondary button URI.
   */
  secondaryButtonUri?: string

  /**
   * @deprecated Use secondaryButton.target instead
   * @description Secondary button URI target (defaults to _self)
   */
  secondaryButtonUriTarget?: string

  /**
   * Text on button if a back button is present.
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
   * @ignore
   */
  props?: any
  /**
   * Criteria that needs to be met for the step to complete.
   * Completion criteria uses Frigade's [Targeting Engine](https://docs.frigade.com/v2/platform/targeting) to determine if the step should be completed.
   */
  completionCriteria?: string

  /**
   * Criteria that needs to be met for the step to start.
   * Start criteria uses Frigade's [Targeting Engine](https://docs.frigade.com/v2/platform/targeting) to determine if the step should be started.
   */
  startCriteria?: string

  /**
   * Criteria that needs to be met for the step to be visible.
   * Visibility criteria uses Frigade's [Targeting Engine](https://docs.frigade.com/v2/platform/targeting) to determine if the step should be visible.
   */
  visibilityCriteria?: string

  /**
   * Progress if the step is tied to another Frigade Flow through completionCriteria.
   */
  progress?: number

  /**
   * Whether the step is dismissible (for instance, tooltips or other non-essential steps).
   */
  dismissible?: boolean

  /**
   * Any other additional props defined in the YAML config.
   */
  [x: string | number | symbol]: unknown

  /**
   * Marks the step started.
   */
  start: (properties?: PropertyPayload) => Promise<void>

  /**
   * Marks the step completed.
   * @param optimistic If true, the step will be marked as completed without waiting for the API and validation of any targeting rules.
   */
  complete: (properties?: PropertyPayload, optimistic?: boolean) => Promise<void>

  /**
   * Resets the step (useful for undoing a finished step).
   */
  reset: () => Promise<void>

  /**
   * Event handler called when this step's state changes.
   */
  onStateChange: (callback: (step: FlowStep, previousStep?: FlowStep) => void) => void

  /**
   * Removes the given callback from the list of event handlers.
   */
  removeStateChangeHandler: (callback: (step: FlowStep, previousStep?: FlowStep) => void) => void

  /**
   * Reference to this step's parent Flow
   */
  flow: Flow
}

export interface FrigadeConfig {
  /**
   * Frigade API key. You can find your API key in the Frigade Dashboard under "Developer".
   */
  apiKey?: string
  /**
   * API url to use for all requests. Defaults to https://api.frigade.com
   */
  apiUrl?: string

  /**
   * User ID to use for all requests. If not provided, a Guest ID will be generated.
   */
  userId?: string

  /**
   * Group ID (organization) to use for all requests.
   */
  groupId?: string

  /**
   * Optional user properties to send to the API.
   */
  userProperties?: PropertyPayload

  /**
   * Optional group properties to send to the API.
   */
  groupProperties?: PropertyPayload

  /**
   * Whether to generate a Guest ID and session if no userId is not provided on initialization.
   * If set to false, Frigade will not initialize until a userId is provided via `frigade.identify()`.
   *
   * Defaults to true.
   */
  generateGuestId?: boolean

  /**
   * @ignore Internal use only.
   * If enabled, Frigade will not send any data to the API. A user's state will be reset on page refresh.
   */
  __readOnly?: boolean

  /**
   * @ignore Internal use only.
   * Map of Flow ID to Flow State for all flows in the app that should be mocked.
   */
  __flowStateOverrides?: Record<string, StatefulFlow>

  /**
   * @ignore Internal use only.
   */
  __instanceId?: string
}

export interface StatefulStep {
  id: string
  $state: {
    completed: boolean
    started: boolean
    visible: boolean
    blocked: boolean
    lastActionAt?: Date
  }
  // allow any other properties
  [key: string]: any
}

export interface StatefulFlow {
  flowSlug: string
  flowName: string
  flowType: FlowType
  data: {
    steps: StatefulStep[]
    // allow any other properties
    [key: string]: any
  }
  $state: {
    currentStepId: string
    currentStepIndex: number
    completed: boolean
    started: boolean
    skipped: boolean
    visible: boolean
    lastActionAt?: Date
  }
}

export enum CollectionType {
  CUSTOM = 'CUSTOM',
  DEFAULT = 'DEFAULT',
}

export interface ComputedCollection {
  collectionId: string
  flowId: string
  visible: boolean
  allowedComponents: []
  collectionType: CollectionType
}

export interface CollectionMetadata {
  computedOrder: ComputedCollection[]
}

export interface FlowStates {
  eligibleFlows: StatefulFlow[]
  ineligibleFlows: string[]
  collections?: CollectionMetadata
}

export enum FlowType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  CHECKLIST = 'CHECKLIST',
  FORM = 'FORM',
  TOUR = 'TOUR',
  SUPPORT = 'SUPPORT',
  CUSTOM = 'CUSTOM',
  BANNER = 'BANNER',
  EMBEDDED_TIP = 'EMBEDDED_TIP',
  NPS_SURVEY = 'NPS_SURVEY',
  SURVEY = 'SURVEY',
  CARD = 'CARD',
}

export type FlowActionType =
  | 'STARTED_STEP'
  | 'COMPLETED_STEP'
  | 'NOT_STARTED_STEP'
  | 'STARTED_FLOW'
  | 'COMPLETED_FLOW'
  | 'SKIPPED_FLOW'
  | 'NOT_STARTED_FLOW'

export interface FlowStateDTO {
  userId: string
  groupId?: string
  flowSlug?: string
  stepId?: string
  data?: any
  actionType?: FlowActionType
  createdAt?: Date
  context?: FlowStateContext
}

export interface FlowStateContext {
  url?: string
  userAgent?: string
}

export interface TrackingEvent {
  event: string
  properties?: PropertyPayload
}

export interface SessionDTO {
  userId: string
  groupId?: string
  userProperties?: PropertyPayload
  userEvents?: TrackingEvent[]
  groupProperties?: PropertyPayload
  groupEvents?: TrackingEvent[]
  linkGuestId?: string
}
