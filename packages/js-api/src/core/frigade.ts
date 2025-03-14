import {
  DEFAULT_REFRESH_INTERVAL_IN_MS,
  FlowChangeEvent,
  FlowChangeEventHandler,
  FlowStateDTO,
  FlowStates,
  FlowStep,
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
  type Collection,
  Collections,
  type CollectionsList,
  type CollectionsRegistryBatch,
  type EnrichedCollection,
} from './collections'

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
  private lastSessionDTO?: SessionDTO
  /**
   * @ignore
   */
  private eventHandlers: Map<FlowChangeEvent, FlowChangeEventHandler[]> = new Map()
  /**
   * @ignore
   */
  private refreshTimeout: ReturnType<typeof setTimeout> | null = null
  /**
   * @ignore
   */
  private queuedRefresh: boolean = false

  /**
   * @ignore
   */
  private visibilityChangeHandler = () => {
    if (document.visibilityState === 'visible') {
      this.queueRefreshStateFromAPI()
    }
  }

  /**
   * @ignore
   */
  private queueRefreshStateFromAPI() {
    this.queuedRefresh = true
    if (this.refreshTimeout) {
      return
    }

    this.refreshTimeout = setTimeout(async () => {
      if (this.queuedRefresh) {
        this.getGlobalState().currentUrl = window.location.href
        await this.refreshStateFromAPI()
        this.queuedRefresh = false
      }
      this.refreshTimeout = null
    }, this.getGlobalState().config.__refreshIntervalInMS ?? DEFAULT_REFRESH_INTERVAL_IN_MS)
  }

  constructor(apiKey: string, config?: FrigadeConfig) {
    super({
      apiKey,
      ...config,
    })
    this.init(this.config).then(() => {
      if (isWeb() && this.config.syncOnWindowUpdates !== false) {
        document.addEventListener('visibilitychange', this.visibilityChangeHandler)
        // @ts-ignore
        if (window.navigation) {
          // @ts-ignore
          window.navigation.addEventListener('navigate', async (event) => {
            try {
              if (this.getGlobalState().currentUrl === event.destination.url) {
                return
              }
              // if the new base url is the same but with a hashtag, don't refresh the state as the page has not changed.
              if (
                event.destination.url &&
                this.getGlobalState().currentUrl &&
                event.destination.url.split('#')[0] ===
                  this.getGlobalState().currentUrl.split('#')[0]
              ) {
                return
              }
              this.queueRefreshStateFromAPI()
            } catch (e) {}
          })
        }
      }
    })
  }

  /**
   * Gets the current configuration.
   * See  [FrigadeConfig](https://github.com/FrigadeHQ/javascript/blob/main/packages/js-api/src/core/types.ts#L240) for a list of available options.
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

    if (!this.config.userId) {
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
    if (userId !== this.config.userId) {
      await this.updateConfig({ ...this.config, userId })
      await this.reload()
    }

    await this.initIfNeeded()
    const isNewSession = await this.session({
      userId: this.config.userId,
      userProperties: properties,
    })
    if (isNewSession) {
      await this.resync()
    }
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
    const lastSessionDTO = this.lastSessionDTO

    if (lastSessionDTO && JSON.stringify(lastSessionDTO) === JSON.stringify(sessionDTO)) {
      return false
    }

    await this.fetch('/v1/public/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionDTO),
    })

    this.lastSessionDTO = sessionDTO

    return true
  }

  /**
   * @ignore
   */
  public isReady(): boolean {
    return Boolean(
      this.config.__instanceId &&
        this.config.apiKey &&
        this.initPromise &&
        frigadeGlobalState[getGlobalStateKey(this.config)]
    )
  }

  /**
   * Get a Flow by its ID.
   * @param flowId
   */
  public async getFlow(flowId: string) {
    if (
      this.getConfig().generateGuestId === false &&
      this.getConfig().userId &&
      this.getConfig().userId.startsWith(GUEST_PREFIX)
    ) {
      return undefined
    }
    await this.initIfNeeded()

    return this.getFlowSync(flowId)
  }

  /**
   * @ignore
   */
  public getFlowSync(flowId: string) {
    return this.flows.find((flow) => flow.id == flowId)
  }

  public async getFlows() {
    await this.initIfNeeded()
    if (
      this.config.generateGuestId === false &&
      this.getConfig().userId?.startsWith(GUEST_PREFIX)
    ) {
      return []
    }
    return this.flows
  }

  public async getCollection(collectionId: string) {
    await this.initIfNeeded()
    const collection = this.getGlobalState().collections.getCollection(collectionId)

    if (collection == null) {
      return undefined
    }

    this.registerCollection(collectionId)

    const enrichedFlows = await Promise.all(
      collection.flows.map(async (item) => ({
        ...item,
        flow: await this.getFlow(item.flowId),
      }))
    )

    collection.flows = enrichedFlows

    return collection as EnrichedCollection
  }

  public async registerCollection(collectionId: string) {
    await this.initIfNeeded()
    if (collectionId) {
      this.getGlobalState().registeredCollectionIds.add(collectionId)
    }
  }

  /**
   * @ignore
   */
  public getCollectionSync(collectionId: string): Collection | undefined {
    const collection = this.getGlobalState().collections.getCollection(collectionId)

    if (collection == null) {
      return undefined
    }

    this.getGlobalState().registeredCollectionIds.add(collectionId)

    return collection
  }

  /**
   * @ignore
   */
  public getCollectionsSync(): CollectionsList | undefined {
    return this.getGlobalState().collections.getCollections()
  }

  public async getCollections(): Promise<CollectionsList | undefined> {
    await this.initIfNeeded()

    if (!this.config.userId && this.config.generateGuestId === false) {
      return undefined
    }

    const collections = this.getGlobalState().collections.getCollections()

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
    this.triggerAllLegacyEventHandlers()
    this.triggerAllEventHandlers()
  }

  /**
   * @ignore
   */
  private triggerAllLegacyEventHandlers() {
    this.flows.forEach((flow) => {
      this.getGlobalState().onFlowStateChangeHandlers.forEach((handler) => {
        const lastFlow = this.getGlobalState().previousFlows.get(flow.id)
        handler(flow, lastFlow)
        this.getGlobalState().previousFlows.set(flow.id, cloneFlow(flow))
      })
    })
  }

  private triggerAllEventHandlers() {
    this.flows.forEach((flow) => {
      const lastFlow = this.getGlobalState().previousFlows.get(flow.id)
      this.triggerEventHandlers(flow.rawData, lastFlow?.rawData)
    })
  }

  private async resync() {
    await this.refreshStateFromAPI()
  }

  /**
   * Event handler that captures all changes that happen to the state of the Flows.
   * @deprecated Use `frigade.on` instead.
   * @param handler
   */
  public async onStateChange(handler: (flow: Flow, previousFlow?: Flow) => void) {
    await this.initIfNeeded()
    this.getGlobalState().onFlowStateChangeHandlers.push(handler)
  }

  /**
   * Event handler that captures all changes that happen to the state of the Flows. Use `flow.any` to capture all events.
   * @param event `flow.any` | `flow.complete` | `flow.restart` | `flow.skip` | `flow.start` | `step.complete` | `step.skip` | `step.reset` | `step.start`
   * @param handler
   */
  public async on(event: FlowChangeEvent, handler: FlowChangeEventHandler) {
    this.eventHandlers.set(event, [...(this.eventHandlers.get(event) ?? []), handler])
  }

  /**
   * Removes the given handler.
   * @param event `flow.any` | `flow.complete` | `flow.restart` | `flow.skip` | `flow.start` | `step.complete` | `step.skip` | `step.reset` | `step.start`
   * @param handler
   */
  public async off(event: FlowChangeEvent, handler: FlowChangeEventHandler) {
    this.eventHandlers.set(
      event,
      (this.eventHandlers.get(event) ?? []).filter((h) => h !== handler)
    )
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
              that.triggerDeprecatedEventHandlers(newState, previousState)
              that.triggerEventHandlers(newState, previousState)
            }
          }

          target[key] = value
          return true
        },
      }

      frigadeGlobalState[globalStateKey] = {
        refreshStateFromAPI: async () => {},
        collections: new Collections(new Map()),
        registeredCollectionIds: new Set(),
        flowStates: new Proxy({}, validator),
        onFlowStateChangeHandlerWrappers: new Map(),
        onStepStateChangeHandlerWrappers: new Map(),
        onFlowStateChangeHandlers: [],
        previousFlows: new Map(),
        variables: {},
        config: this.config,
        currentUrl: isWeb() ? window.location.href : '',
        pendingRequests: new Map(),
        lastFlowSyncDate: new Map(),
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
                context: getContext(this.getGlobalState()),
              } as FlowStateDTO),
            })

        const collectionsData: CollectionsList = new Map()

        flowStateRaw.collections?.computedOrder?.forEach(
          ({ allowedComponents, collectionId, collectionType, flowId, visible }) => {
            const currentCollection: Collection = collectionsData.get(collectionId) ?? {
              allowedComponents,
              collectionType,
              flows: [],
            }

            currentCollection.flows.push({
              flowId,
              visible,
            })

            collectionsData.set(collectionId, currentCollection)
          }
        )

        if (collectionsData.size > 0) {
          frigadeGlobalState[globalStateKey].collections.ingestCollectionsData(collectionsData)
          if (
            frigadeGlobalState[globalStateKey].collections.collectionsHaveChanged() &&
            // Necessary check to prevent race condition between flow state and collection state
            !overrideFlowStateRaw
          ) {
            this.triggerAllLegacyEventHandlers()
            this.triggerAllEventHandlers()
          }
        }

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

    await frigadeGlobalState[globalStateKey].refreshStateFromAPI(undefined)
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
  private async triggerDeprecatedEventHandlers(
    newState: StatefulFlow,
    previousState?: StatefulFlow
  ) {
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
  private triggerEventHandlers(newState: StatefulFlow, previousState?: StatefulFlow) {
    if (newState) {
      for (const flow of this.flows) {
        if (flow.id == newState.flowSlug) {
          const lastFlow = this.getGlobalState().previousFlows.get(flow.id)
          flow.resyncState(newState)
          for (const [event, handlers] of this.eventHandlers.entries()) {
            switch (event) {
              case 'flow.complete':
                if (newState.$state.completed && previousState?.$state.completed === false) {
                  handlers.forEach((handler) => handler(event, flow, lastFlow))
                }
                break
              case 'flow.restart':
                if (!newState.$state.started && previousState?.$state.started === true) {
                  handlers.forEach((handler) => handler(event, flow, lastFlow))
                }
                break
              case 'flow.skip':
                if (newState.$state.skipped && previousState?.$state.skipped === false) {
                  handlers.forEach((handler) => handler(event, flow, lastFlow))
                }
                break
              case 'flow.start':
                if (newState.$state.started && previousState?.$state.started === false) {
                  handlers.forEach((handler) => handler(event, flow, lastFlow))
                }
                break
              case 'step.complete':
                for (const step of newState.data.steps ?? []) {
                  if (
                    step.$state.completed &&
                    !previousState?.data.steps.find(
                      (previousStepState) =>
                        previousStepState.id === step.id && previousStepState.$state.completed
                    )
                  ) {
                    handlers.forEach((handler) =>
                      handler(event, flow, lastFlow, flow.steps.get(step.id))
                    )
                  }
                }
                break
              case 'step.reset':
                for (const step of newState.data.steps ?? []) {
                  const previousStep = previousState?.data.steps.find(
                    (previousStepState) => previousStepState.id === step.id
                  )
                  if (
                    step.$state.started == false &&
                    !step.$state.lastActionAt &&
                    previousStep?.$state.started &&
                    previousStep?.$state.lastActionAt
                  ) {
                    handlers.forEach((handler) =>
                      handler(event, flow, lastFlow, flow.steps.get(step.id))
                    )
                  }
                }
                break
              case 'step.skip':
                for (const step of newState.data.steps ?? []) {
                  if (
                    step.$state.skipped &&
                    !previousState?.data.steps.find(
                      (previousStepState) =>
                        previousStepState.id === step.id && previousStepState.$state.skipped
                    )
                  ) {
                    handlers.forEach((handler) =>
                      handler(event, flow, lastFlow, flow.steps.get(step.id))
                    )
                  }
                }
                break
              case 'step.start':
                for (const step of newState.data.steps ?? []) {
                  if (
                    step.$state.started &&
                    previousState?.data.steps.find(
                      (previousStepState) =>
                        previousStepState.id === step.id &&
                        previousStepState.$state.started === false
                    )
                  ) {
                    handlers.forEach((handler) =>
                      handler(event, flow, lastFlow, flow.steps.get(step.id))
                    )
                  }
                }
                break
              case 'flow.any':
                if (JSON.stringify(newState) !== JSON.stringify(previousState ?? {})) {
                  handlers.forEach((handler) => handler(event, flow, lastFlow))
                }
                break
            }
          }
          this.getGlobalState().previousFlows.set(flow.id, cloneFlow(flow))
        }
      }
    }
  }

  /**
   * @ignore
   */
  async batchRegister(flowIds: CollectionsRegistryBatch) {
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

      return [flowId, wrappedCallback] as CollectionsRegistryBatch[number]
    })

    Promise.all(flowIdsWithWrappedCallbacks).then((results) => {
      this.getGlobalState().collections.batchRegister(results)
    })
  }
}
