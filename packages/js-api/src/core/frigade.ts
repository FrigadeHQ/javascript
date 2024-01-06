import { FrigadeConfig, UserFlowState } from '../types'
import { clearCache, cloneFlow, isWeb, resetAllLocalStorage } from '../shared/utils'
import { Flow } from './flow'
import { FlowDataRaw } from './types'
import { frigadeGlobalState, getGlobalStateKey } from '../shared/state'
import { Fetchable } from '../shared/Fetchable'

export class Frigade extends Fetchable {
  private flows: Flow[] = []
  private initPromise: Promise<void>
  private hasFailed = false

  private visibilityChangeHandler = async () => {
    if (document.visibilityState === 'visible') {
      await this.refreshFlows()
      await this.refreshUserFlowStates()
    }
  }

  constructor(apiKey: string, config?: FrigadeConfig) {
    super({
      apiKey,
      ...config,
    })
    this.init(this.config)
    if (isWeb()) {
      document.addEventListener('visibilitychange', this.visibilityChangeHandler)
    }
  }

  destroy() {
    if (isWeb()) {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler)
      // Remove all other event listeners
      const globalStateKey = getGlobalStateKey(this.config)
      if (frigadeGlobalState[globalStateKey]) {
        frigadeGlobalState[globalStateKey].onFlowStateChangeHandlers = []
      }
    }
  }

  private async init(config: FrigadeConfig): Promise<void> {
    this.config = {
      ...this.config,
      ...config,
    }

    this.initPromise = (async () => {
      await this.refreshUserFlowStates()
      await this.refreshFlows()
    })()

    return this.initPromise
  }

  public async identify(userId: string, properties?: Record<string, any>): Promise<void> {
    this.config = { userId }
    await this.initIfNeeded()
    await this.fetch('/users', {
      method: 'POST',
      body: JSON.stringify({
        foreignId: this.config.userId,
        properties,
      }),
    })
    await this.refreshUserFlowStates()
  }

  public async group(organizationId: string, properties?: Record<string, any>): Promise<void> {
    await this.initIfNeeded()
    this.config.groupId = organizationId
    await this.fetch('/userGroups', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.config.userId,
        foreignUserGroupId: this.config.groupId,
        properties,
      }),
    })
    await this.refreshUserFlowStates()
  }

  public async track(event: string, properties?: Record<string, any>): Promise<void> {
    await this.initIfNeeded()
    await this.fetch('/track', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.config.userId,
        foreignUserGroupId: this.config.groupId,
        event,
        properties,
      }),
    })
  }

  public async getFlow(flowId: string) {
    await this.initIfNeeded()

    return this.flows.find((flow) => flow.id == flowId)
  }

  public async getFlows() {
    await this.initIfNeeded()
    return this.flows
  }

  /**
   * Reload the current state of the flows by calling the Frigade API.
   * This will trigger all event handlers.
   */
  public async reload() {
    resetAllLocalStorage()
    clearCache()
    await this.refreshUserFlowStates()
    await this.refreshFlows()
    this.initPromise = null
    await this.init(this.config)
    // Trigger all event handlers
    this.flows.forEach((flow) => {
      this.getGlobalState().onFlowStateChangeHandlers.forEach((handler) => {
        const lastFlow = this.getGlobalState().previousFlows.get(flow.id)
        handler(flow, lastFlow)
        this.getGlobalState().previousFlows.set(flow.id, cloneFlow(flow))
      })
    })
  }

  public onStateChange(handler: (flow: Flow, previousFlow?: Flow) => void) {
    this.getGlobalState().onFlowStateChangeHandlers.push(handler)
  }

  /**
   * Returns true of Frigade has failed to call the API.
   */
  hasFailedToLoad() {
    return this.hasFailed
  }

  public removeStateChangeHandler(handler: (flow: Flow, previousFlow?: Flow) => void) {
    this.getGlobalState().onFlowStateChangeHandlers =
      this.getGlobalState().onFlowStateChangeHandlers.filter((h) => h !== handler)
  }

  private async initIfNeeded() {
    if (this.initPromise !== null) {
      return this.initPromise
    } else {
      return this.init(this.config)
    }
  }

  private async refreshUserFlowStates(): Promise<void> {
    const globalStateKey = getGlobalStateKey(this.config)

    if (!frigadeGlobalState[globalStateKey]) {
      const that = this

      let validator = {
        set: function (target: any, key: any, value: any) {
          if (
            target[key] &&
            target[key].flowState &&
            (JSON.stringify(target[key].flowState) !== JSON.stringify(value.flowState) ||
              JSON.stringify(target[key].stepStates) !== JSON.stringify(value.stepStates) ||
              JSON.stringify(target[key].shouldTrigger) !== JSON.stringify(value.shouldTrigger))
          ) {
            that.triggerEventHandlers(target[key])
          }

          target[key] = value
          return true
        },
      }

      frigadeGlobalState[globalStateKey] = {
        refreshUserFlowStates: async () => {},
        userFlowStates: new Proxy({}, validator),
        onFlowStateChangeHandlerWrappers: new Map(),
        onStepStateChangeHandlerWrappers: new Map(),
        onFlowStateChangeHandlers: [],
        previousFlows: new Map(),
      }
      frigadeGlobalState[globalStateKey].refreshUserFlowStates = async () => {
        const userFlowStatesRaw = await this.fetch(
          `/userFlowStates?foreignUserId=${encodeURIComponent(this.config.userId)}${
            this.config.groupId
              ? `&foreignUserGroupId=${encodeURIComponent(this.config.groupId)}`
              : ''
          }`
        )
        if (userFlowStatesRaw && userFlowStatesRaw.data) {
          let userFlowStates = userFlowStatesRaw.data as UserFlowState[]
          userFlowStates.forEach((userFlowState) => {
            frigadeGlobalState[globalStateKey].userFlowStates[userFlowState.flowId] = userFlowState
          })
          this.hasFailed = false
        } else {
          this.hasFailed = true
        }
      }
    }

    await frigadeGlobalState[globalStateKey].refreshUserFlowStates()
  }

  private async refreshFlows() {
    this.flows = []
    const flowDataRaw = await this.fetch('/flows')
    if (flowDataRaw && flowDataRaw.data) {
      let flowDatas = flowDataRaw.data as FlowDataRaw[]
      flowDatas.forEach((flowData) => {
        this.flows.push(new Flow(this.config, flowData))
        this.getGlobalState().previousFlows.set(
          flowData.slug,
          cloneFlow(this.flows[this.flows.length - 1])
        )
      })
    } else {
      this.hasFailed = true
    }
  }

  private async triggerEventHandlers(previousUserFlowState: UserFlowState) {
    if (previousUserFlowState) {
      this.flows.forEach((flow) => {
        if (flow.id == previousUserFlowState.flowId) {
          this.getGlobalState().onFlowStateChangeHandlers.forEach((handler) => {
            const lastFlow = this.getGlobalState().previousFlows.get(flow.id)
            handler(flow, lastFlow)
            this.getGlobalState().previousFlows.set(flow.id, cloneFlow(flow))
          })
        }
      })
    }
  }
}
