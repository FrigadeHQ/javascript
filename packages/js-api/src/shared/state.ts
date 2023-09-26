import { InternalConfig, UserFlowState } from '../types'

export interface FrigadeGlobalState {
  refreshUserFlowStates: () => Promise<void>
  userFlowStates: Record<string, UserFlowState>
}

export let frigadeGlobalState: Record<string, FrigadeGlobalState> = {}

export function getGlobalStateKey(internalConfig: InternalConfig): string {
  return `${internalConfig.apiKey}:${internalConfig.userId ?? ''}:${
    internalConfig.organizationId ?? ''
  }`
}
