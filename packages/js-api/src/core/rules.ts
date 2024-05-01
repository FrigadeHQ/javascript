export type RulesRegistryCallback = (visible: boolean) => void

export type RulesRegistryBatch = [string, RulesRegistryCallback][]

export interface RulesRegistryItem {
  visible: boolean
  visited: boolean
  callback: RulesRegistryCallback
}

export type Rule = Array<{
  flowId: string
  visible: boolean
}>

export type RulesData = Map<string, Rule>

export class Rules {
  private readonly registry: Map<string, RulesRegistryItem> = new Map()
  private registryStateLocked: boolean = false
  private rules: Map<string, Rule> = new Map()
  private flowsInRules: Set<string> = new Set()

  constructor(rulesData: RulesData) {
    this.ingestRulesData(rulesData)
  }

  getRule(ruleId: string) {
    return this.rules.get(ruleId)
  }

  ingestRulesData(rulesData: RulesData) {
    this.rules = rulesData

    for (const [, rule] of this.rules) {
      for (const { flowId } of rule) {
        this.flowsInRules.add(flowId)
      }
    }

    if (this.registry.size > 0) {
      if (!this.registryStateLocked) {
        this.resetRegistryState()
      }

      this.processRules()
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
    const flowInRules = this.flowsInRules.has(flowId)

    if (registeredFlow == null || !flowInRules) {
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

  processRules() {
    for (const [, rule] of this.rules) {
      for (const { flowId, visible: visibleAPIOverride } of rule) {
        const registeredFlow = this.registry.get(flowId)

        // If this flow in the rule isn't registered, we have no opinion on it yet
        if (registeredFlow == null) {
          continue
        }

        // The API can force a flow to be hidden due to cool-offs, etc.
        if (visibleAPIOverride === false && registeredFlow.visible !== true) {
          this.visit(flowId, false)
          continue
        }

        // If this flow was processed in a previous rule and the registry is locked,
        // visibility shouldn't change until next time we run processRules
        if (registeredFlow.visited && this.registryStateLocked) {
          continue
        }

        const flowIdsInThisRule = rule
          .map(({ flowId: otherFlowId }) => otherFlowId)
          .filter((otherFlowId) => otherFlowId !== flowId)

        // If another flow in this rule has been visited already and is visible...
        const anotherFlowInThisRuleIsVisible = flowIdsInThisRule.some((otherId) => {
          const { visible: otherVisible, visited: otherVisited } = this.registry.get(otherId) ?? {}

          return otherVisible && otherVisited
        })

        // ...then this flow is hidden
        if (anotherFlowInThisRuleIsVisible) {
          this.visit(flowId, false)

          continue
        }

        // No other flows are visible, so this flow is visible by default
        this.visit(flowId)
      }
    }
  }

  register(flowId: string | RulesRegistryBatch, callback?: RulesRegistryCallback) {
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

    this.processRules()

    this.fireCallbacks()
  }

  batchRegister(flowIds: RulesRegistryBatch) {
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

    this.processRules()

    this.lockRegistryState()

    this.fireCallbacks()
  }

  unregister(flowId: string) {
    this.registry.delete(flowId)

    this.resetRegistryState()
    this.processRules()

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
