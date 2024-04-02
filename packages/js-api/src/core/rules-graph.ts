export interface RulesGraphNode {
  visible: boolean
  edges: RulesGraphEdge[]
}

export interface RulesGraphEdge {
  head: string
  ruleId: string
}

export type RulesGraphRegistryCallback = (visible: boolean) => void

export type RulesGraphData = [string, RulesGraphNode][]

// TODO: JSDoc this class
export class RulesGraph {
  private graph: Map<string, RulesGraphNode> = new Map()
  private readonly registry: Map<string, RulesGraphRegistryCallback> = new Map()
  private readonly _rawGraphData: Record<string, RulesGraphNode>
  public get rawGraphData() {
    return this._rawGraphData
  }

  constructor(
    graphData: Record<string, RulesGraphNode>,
    registry?: Map<string, RulesGraphRegistryCallback>
  ) {
    this._rawGraphData = graphData
    if (registry) {
      this.registry = registry
    }
    this.ingestGraphData(graphData)
  }

  ingestGraphData(graphData: Record<string, RulesGraphNode>) {
    this.graph = new Map(Object.entries(graphData))

    this.fireCallbacks()
  }

  fireCallbacks() {
    for (const [flowId, callback] of this.registry) {
      if (typeof callback === 'function') {
        callback(this.isFlowVisible(flowId))
      }
    }
  }

  isFlowVisible(flowId: string) {
    const currentNode = this.graph.get(flowId)

    // Is the flow in the graph?
    // If not, it belongs to 0 rules and can carry on about its business
    if (!currentNode) {
      return true
    }

    if (currentNode.visible === false) {
      return false
    }

    // Does the flow have edges?
    // If not, it's the king of all flows, and it does what it wants
    if (currentNode.edges.length === 0) {
      return true
    }

    // Are any of the flow's descendants visible and in the registry already?
    const registeredDescendant = this.findRegisteredDescendant(flowId)

    // If so, this flow is not visible
    if (registeredDescendant != null) {
      return false
    }

    // Congrats! There are no conditions in the graph that disqualify this flow from being visible
    return true
  }

  register(flowId: string, callback?: RulesGraphRegistryCallback) {
    this.registry.set(flowId, callback)

    this.fireCallbacks()
  }

  unregister(flowId: string) {
    this.registry.delete(flowId)

    this.fireCallbacks()
  }

  getRegistry() {
    return this.registry
  }

  private findRegisteredDescendant(nodeId: string, originId = nodeId, ruleId?: string) {
    const node = this.graph.get(nodeId)

    if (node == null) {
      return undefined
    }

    if (this.registry.has(nodeId) && originId !== nodeId) {
      return node
    }

    let result = undefined

    if (node.edges.length > 0) {
      for (const edge of node.edges) {
        // If we went past the end of the rule, stop searching for this rule
        if (ruleId != null && edge.ruleId !== ruleId) {
          continue
        }

        const ancestor = this.findRegisteredDescendant(edge.head, originId, ruleId ?? edge.ruleId)

        if (ancestor != null && ancestor.visible) {
          result = ancestor
          break
        }
      }
    }

    return result
  }
}
