import { FrigadeConfig, UserFlowState } from '../types'
import { Flow } from '../core/flow'
import { FlowStep } from '../core/flow-step'

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
}

export let frigadeGlobalState: Record<string, FrigadeGlobalState> = {}

export function getGlobalStateKey(internalConfig: FrigadeConfig): string {
  return `${internalConfig.__instanceId}-${internalConfig.apiKey}:${internalConfig.userId ?? ''}:${
    internalConfig.organizationId ?? ''
  }`
}
