import type { Flow } from './flow'

export interface FlowDataRaw {
  id: number
  name: string
  description: string
  data: string
  createdAt: string
  modifiedAt: string
  slug: string
  targetingLogic: string
  type: FlowType
  triggerType: TriggerType
  status: FlowStatus
  version: number
  active: boolean
}

export enum TriggerType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export enum FlowStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface FlowStep {
  /**
   * Unique identifier for the step.
   */
  id: string

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
   * Primary button title. If omitted, the primary button will not be shown.
   */
  primaryButtonTitle?: string

  /**
   * Primary button URI.
   */
  primaryButtonUri?: string

  /**
   * Primary button URI target (either _blank or _self).
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
   * Whether the step has been completed (equivalent to step status === COMPLETED_STEP).
   */
  isCompleted: boolean

  /**
   * Whether the step has been completed (equivalent to step status === COMPLETED_STEP).
   */
  isStarted: boolean

  /**
   * Whether the step is blocked (can't be accessed yet) based on `startCriteria`.
   */
  isBlocked: boolean

  /**
   * Whether the step is hidden (not shown in the list view) based on `visibilityCriteria`.
   */
  isHidden: boolean

  /**
   * Last state update.
   */
  lastActionAt?: Date

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
  start: (properties?: Record<string | number, any>) => Promise<void>

  /**
   * Marks the step completed.
   */
  complete: (properties?: Record<string | number, any>) => Promise<void>

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
   * @ignore Internal use only.
   * If enabled, Frigade will not send any data to the API. A user's state will be reset on page refresh.
   */
  __readOnly?: boolean

  /**
   * @ignore Internal use only.
   * Map of Flow ID to Flow Config for all flows in the app.
   * Configs will have to be provided in serialized JSON format rather than YAML.
   */
  __flowConfigOverrides?: Record<string, string>

  /**
   * @ignore Internal use only.
   */
  __instanceId?: string
}

export interface UserFlowState {
  flowId: string
  flowState: 'COMPLETED_FLOW' | 'STARTED_FLOW' | 'SKIPPED_FLOW' | 'NOT_STARTED_FLOW'
  lastStepId: string
  userId: string
  foreignUserId: string
  stepStates: Record<string, UserFlowStepState>
  shouldTrigger: boolean
}

export interface UserFlowStepState {
  stepId: string
  flowSlug: string
  actionType: 'NOT_STARTED_STEP' | 'STARTED_STEP' | 'COMPLETED_STEP'
  createdAt: string
  blocked: boolean
  hidden: boolean
  lastActionAt?: string
}

export interface InternalConfig {
  apiKey: string
  userId?: string
  organizationId?: string
  __instanceId?: string
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
