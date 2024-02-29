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
