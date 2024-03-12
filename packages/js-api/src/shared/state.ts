import { FlowStep, FrigadeConfig, UserFlowState } from '../core/types'
import { Flow } from '../core/flow'

export interface FrigadeGlobalState {
  refreshUserFlowStates: () => Promise<void>
  userFlowStates: Record<string, UserFlowState>
  onFlowStateChangeHandlerWrappers: Map<
    (flow: Flow, previousFlow: Flow) => void,
    (flow: Flow, previousFlow: Flow) => void
  >
  onStepStateChangeHandlerWrappers: Map<
    (step: FlowStep, previousStep: FlowStep) => void,
    (flow: Flow, previousFlow: Flow) => void
  >
  onFlowStateChangeHandlers: ((flow: Flow, previousFlow: Flow) => void)[]
  previousFlows: Map<string, Flow>
  variables: Record<string, Record<string, any>>
}

export let frigadeGlobalState: Record<string, FrigadeGlobalState> = {}

export function getGlobalStateKey(internalConfig: FrigadeConfig): string {
  return `${internalConfig.__instanceId}-${internalConfig.apiKey}:${internalConfig.userId ?? ''}:${
    internalConfig.groupId ?? ''
  }`
}
