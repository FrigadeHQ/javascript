import { FrigadeConfig, UserFlowState } from '../types'

export interface FrigadeGlobalState {
  refreshUserFlowStates: () => Promise<void>
  userFlowStates: Record<string, UserFlowState>
}

export let frigadeGlobalState: Record<string, FrigadeGlobalState> = {}

export function getGlobalStateKey(internalConfig: FrigadeConfig): string {
  return `${internalConfig.__instanceId}-${internalConfig.apiKey}:${internalConfig.userId ?? ''}:${
    internalConfig.organizationId ?? ''
  }`
}
