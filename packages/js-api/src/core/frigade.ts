import { FrigadeConfig, UserFlowState } from '../types'
import { clearCache, cloneFlow, isWeb, resetAllLocalStorage } from '../shared/utils'
import { Flow } from './flow'
import { FlowDataRaw, FlowStatus, FlowType, TriggerType } from './types'
import { frigadeGlobalState, getGlobalStateKey } from '../shared/state'
import { Fetchable } from '../shared/Fetchable'

export class Frigade extends Fetchable {
  /**
   * @ignore
   */
  private flows: Flow[] = []
  /**
   * @ignore
   */
  private initPromise: Promise<void>
  /**
   * @ignore
   */
  private hasFailed = false

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
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

  /**
   * Set the current user.
   * @param userId
   * @param properties
   */
  public async identify(userId: string, properties?: Record<string, any>): Promise<void> {
    this.config = { ...this.config, userId }
    await this.initIfNeeded()
    await this.fetch('/users', {
      method: 'POST',
      body: JSON.stringify({
        foreignId: this.config.userId,
        properties,
      }),
    })
    await this.resync()
  }

  /**
   * Set the group for the current user.
   * @param groupId
   * @param properties
   */
  public async group(groupId: string, properties?: Record<string, any>): Promise<void> {
    await this.initIfNeeded()
    this.config.groupId = groupId
    await this.fetch('/userGroups', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.config.userId,
        foreignUserGroupId: this.config.groupId,
        properties,
      }),
    })
    await this.resync()
  }

  /**
   * Track an event for the current user (and group if set).
   * @param event
   * @param properties
   */
  public async track(event: string, properties?: Record<string, any>): Promise<void> {
    await this.initIfNeeded()
    if (!event) {
      console.error('Event name is required to track an event')
      return
    }
    if (this.config.userId && this.config.groupId) {
      await this.fetch('/userGroups', {
        method: 'POST',
        body: JSON.stringify({
          foreignUserId: this.config.userId,
          foreignUserGroupId: this.config.groupId,
          events: [
            {
              event,
              properties,
            },
          ],
        }),
      })
    } else if (this.config.userId) {
      await this.fetch('/users', {
        method: 'POST',
        body: JSON.stringify({
          foreignId: this.config.userId,
          events: [
            {
              event,
              properties,
            },
          ],
        }),
      })
    }
    await this.resync()
  }

  /**
   * @ignore
   */
  public isReady(): boolean {
    return Boolean(this.config.__instanceId && this.config.apiKey && this.initPromise)
  }

  /**
   * Get a Flow by its ID.
   * @param flowId
   */
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

  private async resync() {
    this.initPromise = null
    await this.init(this.config)
    this.flows.forEach((flow) => {
      this.getGlobalState().onFlowStateChangeHandlers.forEach((handler) => {
        const lastFlow = this.getGlobalState().previousFlows.get(flow.id)
        handler(flow, lastFlow)
        this.getGlobalState().previousFlows.set(flow.id, cloneFlow(flow))
      })
    })
  }

  /**
   * Event handler that captures all changes that happen to the state of the Flows.
   * @param handler
   */
  public onStateChange(handler: (flow: Flow, previousFlow?: Flow) => void) {
    this.getGlobalState().onFlowStateChangeHandlers.push(handler)
  }

  /**
   * Returns true if the JS SDK failed to connect to the Frigade API.
   */
  hasFailedToLoad() {
    return this.hasFailed
  }

  /**
   * Removes the given handler from the list of event handlers.
   * @param handler
   */
  public removeStateChangeHandler(handler: (flow: Flow, previousFlow?: Flow) => void) {
    this.getGlobalState().onFlowStateChangeHandlers =
      this.getGlobalState().onFlowStateChangeHandlers.filter((h) => h !== handler)
  }

  /**
   * @ignore
   */
  private async initIfNeeded() {
    if (this.initPromise !== null) {
      return this.initPromise
    } else {
      return this.init(this.config)
    }
  }

  /**
   * @ignore
   */
  private async refreshUserFlowStates(): Promise<void> {
    const globalStateKey = getGlobalStateKey(this.config)

    if (!frigadeGlobalState[globalStateKey]) {
      const that = this

      let validator = {
        set: function (target: any, key: any, value: any) {
          if (
            target[key] &&
            target[key].flowState &&
            (JSON.stringify(target[key].flowState) !== JSON.stringify(value?.flowState) ||
              JSON.stringify(target[key].stepStates) !== JSON.stringify(value?.stepStates) ||
              JSON.stringify(target[key].shouldTrigger) !== JSON.stringify(value?.shouldTrigger))
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

      if (this.config.__readOnly && this.config.__flowConfigOverrides) {
        this.mockUserFlowStates(globalStateKey)

        return
      }

      frigadeGlobalState[globalStateKey].refreshUserFlowStates = async () => {
        if (this.config.__readOnly) {
          return
        }

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
            let shouldReload = false
            const before = frigadeGlobalState[globalStateKey].userFlowStates[userFlowState.flowId]

            // Special case: for flows that show up based on targeting logic/rules, we need to check if the flow should be triggered
            if (before && before.shouldTrigger == false && userFlowState.shouldTrigger == true) {
              shouldReload = true
            }
            frigadeGlobalState[globalStateKey].userFlowStates[userFlowState.flowId] = userFlowState
            if (shouldReload) {
              this.flows.forEach((flow) => {
                if (flow.id == userFlowState.flowId) {
                  flow.reload()
                  this.triggerEventHandlers(
                    frigadeGlobalState[globalStateKey].userFlowStates[flow.id]
                  )
                }
              })
            }
          })
          this.hasFailed = false
        } else {
          this.hasFailed = true
        }
      }
    }

    await frigadeGlobalState[globalStateKey].refreshUserFlowStates()
  }

  /**
   * @ignore
   */
  private async refreshFlows() {
    this.flows = []

    if (this.config.__flowConfigOverrides) {
      this.mockFlowConfigs()
      return
    }

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

  /**
   * @ignore
   */
  private mockFlowConfigs() {
    Object.keys(this.config.__flowConfigOverrides).forEach((flowId) => {
      this.flows.push(
        new Flow(this.config, {
          id: -1,
          name: '',
          description: '',
          data: this.config.__flowConfigOverrides[flowId],
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          slug: flowId,
          targetingLogic: '',
          type: FlowType.CHECKLIST,
          triggerType: TriggerType.MANUAL,
          status: FlowStatus.ACTIVE,
          version: 1,
          active: true,
        })
      )
    })
  }

  /**
   * @ignore
   */
  private mockUserFlowStates(globalStateKey: string) {
    Object.keys(this.config.__flowConfigOverrides).forEach((flowId) => {
      const parsed = JSON.parse(this.config.__flowConfigOverrides[flowId])
      frigadeGlobalState[globalStateKey].userFlowStates[flowId] = {
        flowId,
        flowState: 'NOT_STARTED_FLOW',
        lastStepId: null,
        userId: this.config.userId,
        foreignUserId: this.config.userId,
        stepStates:
          parsed?.steps?.reduce((acc, step) => {
            acc[step.id] = {
              stepId: step.id,
              flowSlug: flowId,
              actionType: 'NOT_STARTED_STEP',
              createdAt: new Date().toISOString(),
              blocked: false,
              hidden: false,
            }
            return acc
          }, {}) ?? {},
        shouldTrigger: false,
      }
    })
  }

  /**
   * @ignore
   */
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
