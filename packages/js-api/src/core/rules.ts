export type RulesRegistryCallback = (visible: boolean) => void

export interface RulesRegistryItem {
  visible: boolean
  visited: boolean
  callback: RulesRegistryCallback
}

export interface Rule
  extends Array<{
    flowId: string
    visible: boolean
  }> {}

export interface RulesData {
  rules: {
    [ruleId: string]: Rule
  }
}

export class Rules {
  private readonly registry: Map<string, RulesRegistryItem> = new Map()
  private rules: Map<string, Rule> = new Map()

  constructor(rulesData: RulesData) {
    this.ingestRulesData(rulesData?.rules ?? {})
  }

  ingestRulesData(rulesData: RulesData['rules']) {
    this.rules = new Map(Object.entries(rulesData))

    if (this.registry.size > 0) {
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
    return this.registry.get(flowId)?.visible
  }

  processRules() {
    // Reset registry to unprocessed state before each run
    for (const [flowId, item] of this.registry) {
      item.visible = null
      item.visited = false

      this.registry.set(flowId, item)
    }

    for (const [, rule] of this.rules) {
      for (const { flowId, visible: visibleAPIOverride } of rule) {
        const registeredFlow = this.registry.get(flowId)

        // If this flow isn't registered, it can't be visible
        if (registeredFlow == null) {
          continue
        }

        // The API can force a flow to be hidden due to cool-offs, etc.
        if (visibleAPIOverride === false && registeredFlow.visible !== false) {
          this.visit(flowId, false)
          continue
        }

        // If this flow is already visible according to processRules, it will stay visible until next time processRules runs
        if (registeredFlow.visible && registeredFlow.visited) {
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

        // no other flows are visible, so this flow is visible
        this.visit(flowId)
      }
    }
  }

  register(flowId: string, callback?: RulesRegistryCallback) {
    this.registry.set(flowId, {
      callback: callback ?? (() => {}),
      visible: null,
      visited: false,
    })

    this.processRules()

    this.fireCallbacks()
  }

  unregister(flowId: string) {
    this.registry.delete(flowId)

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

const rulesData = {
  rule_1: [
    {
      flowId: 'flow_a',
      visible: false,
    },
    {
      flowId: 'flow_b',
      visible: true,
    },
    {
      flowId: 'flow_c',
      visible: true,
    },
  ],

  rule_2: [
    {
      flowId: 'flow_c',
      visible: true,
    },
    {
      flowId: 'flow_b',
      visible: true,
    },
    {
      flowId: 'flow_a',
      visible: false,
    },
  ],

  rule_3: [
    {
      flowId: 'flow_d',
      visible: true,
    },
    {
      flowId: 'flow_a',
      visible: false,
    },
    {
      flowId: 'flow_b',
      visible: true,
    },
  ],

  rule_4: [
    {
      flowId: 'flow_e',
      visible: true,
    },
    {
      flowId: 'flow_d',
      visible: true,
    },
    {
      flowId: 'flow_b',
      visible: true,
    },
  ],

  // rule_4: [
  //   {
  //     flowId: 'flow_b',
  //     visible: true,
  //   },
  //   {
  //     flowId: 'flow_d',
  //     visible: true,
  //   },
  //   {
  //     flowId: 'flow_e',
  //     visible: true,
  //   },
  // ],
}

const rules = new Rules({ rules: rulesData })

rules.register('flow_a')
rules.register('flow_b')
rules.register('flow_c')
rules.register('flow_d')
rules.register('flow_e')
