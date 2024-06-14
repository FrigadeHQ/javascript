import type { Flow } from './flow'

export type CollectionsRegistryCallback = (visible: boolean) => void

export type CollectionsRegistryBatch = [string, CollectionsRegistryCallback][]

export interface CollectionsRegistryItem {
  visible: boolean
  visited: boolean
  callback: CollectionsRegistryCallback
}

export interface Collection {
  allowedComponents: string[]
  collectionType: 'DEFAULT' | 'CUSTOM'
  flows: {
    flowId: string
    visible: boolean
  }[]
}

export interface EnrichedCollection extends Omit<Collection, 'flows'> {
  flows: Array<
    Collection['flows'][number] & {
      flow: Flow
    }
  >
}

export type CollectionsList = Map<string, Collection>

export class Collections {
  private readonly registry: Map<string, CollectionsRegistryItem> = new Map()
  private registryStateLocked: boolean = false
  private collections: CollectionsList = new Map()
  private flowsInCollections: Set<string> = new Set()

  constructor(collecdtionsData: CollectionsList) {
    this.ingestCollectionsData(collecdtionsData)
  }

  getCollection(collectionId: string) {
    return this.collections.get(collectionId)
  }

  getCollections() {
    return this.collections
  }

  ingestCollectionsData(collectionsData: CollectionsList) {
    this.collections = collectionsData

    for (const [, collection] of this.collections) {
      for (const { flowId } of collection.flows) {
        this.flowsInCollections.add(flowId)
      }
    }

    if (this.registry.size > 0) {
      if (!this.registryStateLocked) {
        this.resetRegistryState()
      }

      this.processCollections()
    }

    this.fireCallbacks()
  }

  fireCallbacks() {
    for (const [flowId, { callback }] of this.registry) {
      if (typeof callback === 'function') {
        callback(this.isFlowVisible(flowId))
      }
    }
  }

  isFlowVisible(flowId: string) {
    const registeredFlow = this.registry.get(flowId)
    const flowInCollections = this.flowsInCollections.has(flowId)

    if (registeredFlow == null || !flowInCollections) {
      return true
    }

    return registeredFlow.visible
  }

  lockRegistryState() {
    this.registryStateLocked = true
  }

  unlockRegistryState() {
    this.registryStateLocked = false
  }

  resetRegistryState() {
    for (const [flowId, item] of this.registry) {
      item.visible = false
      item.visited = false

      this.registry.set(flowId, item)
    }
  }

  processCollections() {
    for (const [, collection] of this.collections) {
      for (const { flowId, visible: visibleAPIOverride } of collection.flows) {
        const registeredFlow = this.registry.get(flowId)

        // If this flow in the collection isn't registered, we have no opinion on it yet
        if (registeredFlow == null) {
          continue
        }

        // The API can force a flow to be hidden due to cool-offs, etc.
        if (visibleAPIOverride === false && registeredFlow.visible !== true) {
          this.visit(flowId, false)
          continue
        }

        // If this flow was processed in a previous collection and the registry is locked,
        // visibility shouldn't change until next time we run processCollections
        if (registeredFlow.visited && this.registryStateLocked) {
          continue
        }

        const flowIdsInThisCollection = collection.flows
          .map(({ flowId: otherFlowId }) => otherFlowId)
          .filter((otherFlowId) => otherFlowId !== flowId)

        // If another flow in this collection has been visited already and is visible...
        const anotherFlowInThisCollectionIsVisible = flowIdsInThisCollection.some((otherId) => {
          const { visible: otherVisible, visited: otherVisited } = this.registry.get(otherId) ?? {}

          return otherVisible && otherVisited
        })

        // ...then this flow is hidden
        if (anotherFlowInThisCollectionIsVisible) {
          this.visit(flowId, false)

          continue
        }

        // No other flows are visible, so this flow is visible by default
        this.visit(flowId)
      }
    }
  }

  register(flowId: string | CollectionsRegistryBatch, callback?: CollectionsRegistryCallback) {
    if (Array.isArray(flowId)) {
      this.batchRegister(flowId)
      return
    }

    this.registry.set(flowId, {
      callback: callback ?? (() => {}),
      visible: false,
      visited: false,
    })

    if (!this.registryStateLocked) {
      this.resetRegistryState()
    }

    this.processCollections()

    this.fireCallbacks()
  }

  batchRegister(flowIds: CollectionsRegistryBatch) {
    flowIds.forEach(([flowId, callback]) => {
      this.registry.set(flowId, {
        callback: callback ?? (() => {}),
        visible: false,
        visited: false,
      })
    })

    if (!this.registryStateLocked) {
      this.resetRegistryState()
    }

    this.processCollections()

    this.lockRegistryState()

    this.fireCallbacks()
  }

  unregister(flowId: string) {
    this.registry.delete(flowId)

    this.resetRegistryState()
    this.processCollections()

    this.fireCallbacks()
  }

  private visit(flowId: string, visible: boolean = true) {
    const item = this.registry.get(flowId) ?? {
      callback: () => {},
      visible,
      visited: true,
    }

    item.visible = visible
    item.visited = true

    this.registry.set(flowId, item)
  }
}
