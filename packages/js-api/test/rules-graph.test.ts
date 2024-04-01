import { RulesGraph } from '../src/core/rules-graph'

/*
  Rule x: a, b, c
  Rule y: b, d
  Rule z: b, c, e
*/
const testGraphData = {
  a: {
    visible: true,
    edges: [],
  },
  b: {
    visible: true,
    edges: [
      {
        head: 'a',
        ruleId: 'x',
      },
    ],
  },
  c: {
    visible: true,
    edges: [
      {
        head: 'b',
        ruleId: 'x',
      },
      {
        head: 'b',
        ruleId: 'z',
      },
    ],
  },
  d: {
    visible: true,
    edges: [
      {
        head: 'b',
        ruleId: 'y',
      },
    ],
  },
  e: {
    visible: true,
    edges: [
      {
        head: 'c',
        ruleId: 'z',
      },
    ],
  },
}

describe('RulesGraph', () => {
  describe('register', () => {
    it('calls all callbacks when a flow is registered', () => {
      const graphData = {
        a: {
          visible: true,
          edges: [],
        },
      }

      const rules = new RulesGraph(graphData)

      const cb1 = jest.fn()
      const cb2 = jest.fn()

      rules.register('a', cb1)

      expect(cb1).toHaveBeenCalledTimes(1)

      rules.register('b', cb2)

      expect(cb1).toHaveBeenCalledTimes(2)
      expect(cb2).toHaveBeenCalledTimes(1)
    })

    it('calls all callbacks when a flow is unregistered', () => {
      const graphData = {
        a: {
          visible: true,
          edges: [],
        },
      }

      const rules = new RulesGraph(graphData)

      const cb1 = jest.fn()
      const cb2 = jest.fn()
      const cb3 = jest.fn()

      rules.register('a', cb1)
      rules.register('b', cb2)
      rules.register('c', cb3)

      expect(cb1).toHaveBeenCalledTimes(3)
      expect(cb2).toHaveBeenCalledTimes(2)
      expect(cb3).toHaveBeenCalledTimes(1)

      rules.unregister('c')

      expect(cb1).toHaveBeenCalledTimes(4)
      expect(cb2).toHaveBeenCalledTimes(3)
      expect(cb3).toHaveBeenCalledTimes(1)
    })

    it('calls all callbacks when graph is ingested', () => {
      const graphData = {
        a: {
          visible: true,
          edges: [],
        },
      }

      const rules = new RulesGraph(graphData)

      const cb1 = jest.fn()

      rules.register('a', cb1)

      expect(cb1).toHaveBeenCalledTimes(1)

      rules.ingestGraphData(graphData)

      expect(cb1).toHaveBeenCalledTimes(2)
    })

    it('calls callback with current flow visibility', () => {
      const rules = new RulesGraph(testGraphData)

      const cb1 = jest.fn()
      const cb2 = jest.fn()

      rules.register('b', cb2)

      expect(cb2).toHaveBeenLastCalledWith(true)

      rules.register('a', cb1)

      expect(cb1).toHaveBeenLastCalledWith(true)
      expect(cb2).toHaveBeenLastCalledWith(false)
    })
  })

  describe('isFlowVisible', () => {
    it('returns true when node is visible and registry is empty', () => {
      const rules = new RulesGraph({
        a: {
          visible: true,
          edges: [],
        },
      })

      expect(rules.isFlowVisible('a')).toBe(true)
    })

    it('returns false when node is not visible and registry is empty', () => {
      const rules = new RulesGraph({
        a: {
          visible: false,
          edges: [],
        },
      })

      expect(rules.isFlowVisible('a')).toBe(false)
    })

    it('returns false when descendant is registered and visible', () => {
      const rules = new RulesGraph({
        a: {
          visible: true,
          edges: [],
        },
        b: {
          visible: true,
          edges: [
            {
              head: 'a',
              ruleId: 'x',
            },
          ],
        },
        c: {
          visible: true,
          edges: [
            {
              head: 'b',
              ruleId: 'x',
            },
          ],
        },
      })

      rules.register('a')

      expect(rules.isFlowVisible('b')).toBe(false)
      expect(rules.isFlowVisible('c')).toBe(false)
    })

    it('returns true when descendant is registered and not visible', () => {
      const rules = new RulesGraph({
        a: {
          visible: false,
          edges: [],
        },
        b: {
          visible: true,
          edges: [
            {
              head: 'a',
              ruleId: 'x',
            },
          ],
        },
        c: {
          visible: true,
          edges: [
            {
              head: 'b',
              ruleId: 'x',
            },
          ],
        },
      })

      rules.register('a')

      expect(rules.isFlowVisible('b')).toBe(true)
      expect(rules.isFlowVisible('c')).toBe(true)
    })

    it('returns true when visible, registered descendant is not part of the same rule', () => {
      const rules = new RulesGraph(testGraphData)

      rules.register('a')

      expect(rules.isFlowVisible('c')).toBe(false)
      expect(rules.isFlowVisible('d')).toBe(true)
    })

    it('reports correct visibility after change in registry', () => {
      const rules = new RulesGraph({
        a: {
          visible: true,
          edges: [],
        },
        b: {
          visible: true,
          edges: [
            {
              head: 'a',
              ruleId: 'x',
            },
          ],
        },
      })

      rules.register('a')

      expect(rules.isFlowVisible('b')).toBe(false)

      rules.unregister('a')

      expect(rules.isFlowVisible('b')).toBe(true)
    })

    it('ignores ancestor visibility/registration', () => {
      const rules = new RulesGraph({
        a: {
          visible: true,
          edges: [],
        },
        b: {
          visible: true,
          edges: [
            {
              head: 'a',
              ruleId: 'x',
            },
          ],
        },
      })

      rules.register('b')

      expect(rules.isFlowVisible('a')).toBe(true)
    })

    it('follows multiple edges', () => {
      const rules = new RulesGraph({
        a: {
          visible: true,
          edges: [],
        },
        b: {
          visible: true,
          edges: [],
        },
        c: {
          visible: true,
          edges: [
            {
              head: 'a',
              ruleId: 'x',
            },
            {
              head: 'b',
              ruleId: 'y',
            },
          ],
        },
      })

      expect(rules.isFlowVisible('c')).toBe(true)

      rules.register('a')

      expect(rules.isFlowVisible('c')).toBe(false)

      rules.register('b')

      expect(rules.isFlowVisible('c')).toBe(false)

      rules.unregister('a')

      expect(rules.isFlowVisible('c')).toBe(false)

      rules.unregister('b')

      expect(rules.isFlowVisible('c')).toBe(true)
    })
  })
})
