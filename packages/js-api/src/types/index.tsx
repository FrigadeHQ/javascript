export interface FrigadeConfig {
  apiKey?: string
  /**
   * API url to use for all requests. Defaults to https://api.frigade.com
   */
  apiUrl?: string

  /**
   * User ID to use for all requests
   */
  userId?: string

  /**
   * Group ID (organization) to use for all requests
   */
  groupId?: string
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
}

export interface InternalConfig {
  apiKey: string
  userId?: string
  organizationId?: string
  __instanceId?: string
}
