import { FlowStates, FlowStep, FrigadeConfig, StatefulFlow } from '../core/types'
import { Flow } from '../core/flow'
import type { Collections } from '../core/collections'

export interface FrigadeGlobalState {
  refreshStateFromAPI: (overrideFlowStatesRaw?: FlowStates) => Promise<void>
  flowStates: Record<string, StatefulFlow>
  collections: Collections
  registeredCollectionIds: Set<string>
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
  lastFlowSyncDate: Map<string, Date>
  pendingRequests: Map<string, number>
  config: FrigadeConfig
  currentUrl: string
}

export let frigadeGlobalState: Record<string, FrigadeGlobalState> = {}

export function getGlobalStateKey(internalConfig: FrigadeConfig): string {
  return `${internalConfig.__instanceId}-${internalConfig.apiKey}`
}
