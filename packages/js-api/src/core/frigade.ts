import {
  FlowStateDTO,
  FlowStates,
  FrigadeConfig,
  PropertyPayload,
  SessionDTO,
  StatefulFlow,
} from './types'
import {
  clearCache,
  cloneFlow,
  getContext,
  GUEST_PREFIX,
  isWeb,
  resetAllLocalStorage,
} from '../shared/utils'
import { Flow } from './flow'
import { frigadeGlobalState, getGlobalStateKey } from '../shared/state'
import { Fetchable } from '../shared/fetchable'
import {
  Rules,
  type EnrichedRule,
  type Rule,
  type RulesList,
  type RulesRegistryBatch,
} from './rules'

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
      await this.refreshStateFromAPI()
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
   * Gets the current configuration.
   */
  getConfig() {
    return this.config
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
    this.updateConfig({
      ...this.config,
      ...config,
    })

    if (!this.config.userId && this.config.generateGuestId === false) {
      return
    }

    this.initPromise = (async () => {
      if (!this.config.__readOnly) {
        if (this.config.userId?.startsWith(GUEST_PREFIX)) {
          // do nothing
        } else if (this.config.userId && this.config.groupId) {
          await this.session({
            userId: this.config.userId,
            groupId: this.config.groupId,
            userProperties: this.config.userProperties,
            groupProperties: this.config.groupProperties,
          })
        } else if (this.config.userId) {
          await this.session({
            userId: this.config.userId,
            userProperties: this.config.userProperties,
          })
        }
      }
      await this.refreshStateFromAPI()
    })()

    return this.initPromise
  }

  /**
   * Set the current user.
   * @param userId
   * @param properties
   */
  public async identify(userId: string, properties?: PropertyPayload): Promise<void> {
    await this.updateConfig({ ...this.config, userId })
    await this.initIfNeeded()
    await this.session({
      userId: this.config.userId,
      userProperties: properties,
    })
    await this.resync()
  }

  /**
   * Set the group for the current user.
   * @param groupId
   * @param properties
   */
  public async group(groupId?: string, properties?: PropertyPayload): Promise<void> {
    await this.initIfNeeded()
    this.updateConfig({ ...this.config, groupId })
    await this.session({
      userId: this.config.userId,
      groupId: this.config.groupId,
      groupProperties: properties,
    })
    await this.resync()
  }

  /**
   * Track an event for the current user (and group if set).
   * @param event
   * @param properties
   */
  public async track(event: string, properties?: PropertyPayload): Promise<void> {
    await this.initIfNeeded()
    if (!event) {
      console.error('Event name is required to track an event')
      return
    }
    if (this.config.userId && this.config.groupId) {
      await this.session({
        userId: this.config.userId,
        groupId: this.config.groupId,
        groupEvents: [
          {
            event,
            properties,
          },
        ],
        userEvents: [
          {
            event,
            properties,
          },
        ],
      })
    } else if (this.config.userId) {
      await this.session({
        userId: this.config.userId,
        userEvents: [
          {
            event,
            properties,
          },
        ],
      })
    }
    await this.resync()
  }

  /**
   * @ignore
   */
  private async session(sessionDTO: SessionDTO) {
    await this.fetch('/v1/public/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionDTO),
    })
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

  public async getCollection(collectionId: string) {
    await this.initIfNeeded()
    const collection = this.getGlobalState().collections.getRule(collectionId)

    if (collection == null) {
      return undefined
    }

    const enrichedFlows = await Promise.all(
      collection.flows.map(async (item) => ({
        ...item,
        flow: await this.getFlow(item.flowId),
      }))
    )

    collection.flows = enrichedFlows

    return collection as EnrichedRule
  }

  public async getCollections() {
    await this.initIfNeeded()
    const collections = this.getGlobalState().collections.getRules()

    if (collections == null) {
      return undefined
    }

    return collections
  }

  /**
   * Reload the current state of the flows by calling the Frigade API.
   * This will trigger all event handlers.
   * @param config optional config to use when reloading. If not passed, the current config will be used.
   */
  public async reload(config?: FrigadeConfig) {
    resetAllLocalStorage()
    clearCache()
    if (config) {
      await this.updateConfig(config)
      this.mockFlowStates(getGlobalStateKey(this.config))
    }
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
    await this.refreshStateFromAPI()
  }

  /**
   * Event handler that captures all changes that happen to the state of the Flows.
   * @param handler
   */
  public async onStateChange(handler: (flow: Flow, previousFlow?: Flow) => void) {
    await this.initIfNeeded()
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
  public async removeStateChangeHandler(handler: (flow: Flow, previousFlow?: Flow) => void) {
    await this.initIfNeeded()
    this.getGlobalState().onFlowStateChangeHandlers =
      this.getGlobalState().onFlowStateChangeHandlers.filter((h) => h !== handler)
  }

  /**
   * @ignore
   */
  private async initIfNeeded() {
    if (this.initPromise) {
      return this.initPromise
    } else {
      return this.init(this.config)
    }
  }

  /**
   * @ignore
   */
  private async refreshStateFromAPI(): Promise<void> {
    const globalStateKey = getGlobalStateKey(this.config)

    if (!frigadeGlobalState[globalStateKey]) {
      const that = this

      let validator = {
        set: function (target: any, key: any, value: any) {
          if (target[key]) {
            const previousState = target[key] as StatefulFlow
            const newState = value as StatefulFlow
            if (JSON.stringify(previousState) !== JSON.stringify(newState)) {
              that.triggerEventHandlers(newState, previousState)
            }
          }

          target[key] = value
          return true
        },
      }

      frigadeGlobalState[globalStateKey] = {
        refreshStateFromAPI: async () => {},
        collections: new Rules(new Map()),
        flowStates: new Proxy({}, validator),
        onFlowStateChangeHandlerWrappers: new Map(),
        onStepStateChangeHandlerWrappers: new Map(),
        onFlowStateChangeHandlers: [],
        previousFlows: new Map(),
        variables: {},
        config: this.config,
      }

      if (this.config.__readOnly && this.config.__flowStateOverrides) {
        this.mockFlowStates(globalStateKey)

        return
      }

      frigadeGlobalState[globalStateKey].refreshStateFromAPI = async (
        overrideFlowStateRaw?: FlowStates
      ) => {
        if (this.config.__readOnly) {
          return
        }

        const flowStateRaw: FlowStates = overrideFlowStateRaw
          ? overrideFlowStateRaw
          : await this.fetch('/v1/public/flowStates', {
              method: 'POST',
              body: JSON.stringify({
                userId: this.getGlobalState().config.userId,
                groupId: this.getGlobalState().config.groupId,
                context: getContext(),
              } as FlowStateDTO),
            })

        const rulesData: RulesList = new Map()

        flowStateRaw.collections?.computedOrder?.forEach(
          ({ allowedComponents, collectionId, collectionType, flowId, visible }) => {
            const currentRule: Rule = rulesData.get(collectionId) ?? {
              allowedComponents,
              collectionType,
              flows: [],
            }

            currentRule.flows.push({
              flowId,
              visible,
            })

            rulesData.set(collectionId, currentRule)
          }
        )

        frigadeGlobalState[globalStateKey].collections.ingestRulesData(rulesData)

        if (flowStateRaw && flowStateRaw.eligibleFlows) {
          flowStateRaw.eligibleFlows.forEach((statefulFlow) => {
            frigadeGlobalState[globalStateKey].flowStates[statefulFlow.flowSlug] = statefulFlow
            if (!this.flows.find((flow) => flow.id == statefulFlow.flowSlug)) {
              this.flows.push(
                new Flow({
                  config: this.config,
                  id: statefulFlow.flowSlug,
                })
              )
            } else {
              this.flows.forEach((flow) => {
                if (flow.id == statefulFlow.flowSlug) {
                  flow.resyncState(statefulFlow)
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

    await frigadeGlobalState[globalStateKey].refreshStateFromAPI()
  }

  /**
   * @ignore
   */
  private mockFlowStates(globalStateKey: string) {
    Object.keys(this.config.__flowStateOverrides).forEach((flowId) => {
      frigadeGlobalState[globalStateKey].flowStates[flowId] =
        this.config.__flowStateOverrides[flowId]

      if (!this.flows.find((flow) => flow.id == flowId)) {
        this.flows.push(
          new Flow({
            config: this.config,
            id: flowId,
          })
        )
      } else {
        this.flows.forEach((flow) => {
          if (flow.id == flowId) {
            flow.resyncState(this.config.__flowStateOverrides[flowId])
          }
        })
      }
    })
  }

  /**
   * @ignore
   */
  private async updateConfig(config: FrigadeConfig) {
    this.config = {
      ...this.config,
      ...config,
    }
    if (frigadeGlobalState[getGlobalStateKey(this.config)]) {
      this.getGlobalState().config = this.config
    }
  }

  /**
   * @ignore
   */
  private async triggerEventHandlers(newState: StatefulFlow, previousState?: StatefulFlow) {
    if (newState) {
      this.flows.forEach((flow) => {
        if (flow.id == previousState.flowSlug) {
          this.getGlobalState().onFlowStateChangeHandlers.forEach((handler) => {
            const lastFlow = this.getGlobalState().previousFlows.get(flow.id)
            flow.resyncState(newState)
            handler(flow, lastFlow)
            this.getGlobalState().previousFlows.set(flow.id, cloneFlow(flow))
          })
        }
      })
    }
  }

  /**
   * @ignore
   */
  async batchRegister(flowIds: RulesRegistryBatch) {
    const flowIdsWithWrappedCallbacks = flowIds.map(async ([flowId, callback]) => {
      const currentFlow = await this.getFlow(flowId)
      const wrappedCallback = (visible: boolean) => {
        const prevFlow = this.getGlobalState().previousFlows.get(flowId)

        if (prevFlow?.isVisible !== visible) {
          // TODO: Store these in a hash so we can grab this flow's handler and call it
          this.getGlobalState().onFlowStateChangeHandlers.forEach((handler) => {
            handler(currentFlow, prevFlow)
            this.getGlobalState().previousFlows.set(flowId, cloneFlow(currentFlow))
          })
        }

        callback?.(visible)
      }

      return [flowId, wrappedCallback] as RulesRegistryBatch[number]
    })

    Promise.all(flowIdsWithWrappedCallbacks).then((results) => {
      this.getGlobalState().collections.batchRegister(results)
    })
  }
}
