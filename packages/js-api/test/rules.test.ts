import { type Collection, Collections, type CollectionsList } from '../src/core/collections'

function mockRule(flows: Collection['flows'] = []) {
  return {
    allowedComponents: [],
    collectionType: 'DEFAULT',
    flows,
  } as Collection
}

describe('Rules', () => {
  describe('register', () => {
    it('calls all callbacks when a flow is registered', () => {
      const rulesData: CollectionsList = new Map([
        [
          'rule_1',
          mockRule([
            { flowId: 'flow_a', visible: true },
            { flowId: 'flow_b', visible: true },
          ]),
        ],
      ])

      const cb1 = jest.fn()
      const cb2 = jest.fn()

      const rules = new Collections(rulesData)

      rules.register('flow_a', cb1)

      expect(cb1).toHaveBeenCalledTimes(1)

      rules.register('flow_b', cb2)

      expect(cb1).toHaveBeenCalledTimes(2)
      expect(cb2).toHaveBeenCalledTimes(1)
    })

    it('calls all callbacks when a flow is unregistered', () => {
      const rulesData: CollectionsList = new Map([
        [
          'rule_1',
          mockRule([
            { flowId: 'flow_a', visible: true },
            { flowId: 'flow_b', visible: true },
          ]),
        ],
      ])

      const cb1 = jest.fn()
      const cb2 = jest.fn()

      const rules = new Collections(rulesData)

      rules.register('flow_a', cb1)
      rules.register('flow_b', cb2)

      expect(cb1).toHaveBeenCalledTimes(2)
      expect(cb2).toHaveBeenCalledTimes(1)

      rules.unregister('flow_b')

      expect(cb1).toHaveBeenCalledTimes(3)
      expect(cb2).toHaveBeenCalledTimes(1)
    })

    it('calls all callbacks when rules are ingested', () => {
      const rulesData: CollectionsList = new Map([
        [
          'rule_1',
          mockRule([
            { flowId: 'flow_a', visible: true },
            { flowId: 'flow_b', visible: true },
          ]),
        ],
      ])

      const cb1 = jest.fn()
      const cb2 = jest.fn()

      const rules = new Collections(rulesData)

      rules.register('flow_a', cb1)
      rules.register('flow_b', cb2)

      rules.ingestCollectionsData(rulesData)

      expect(cb1).toHaveBeenCalledTimes(3)
      expect(cb2).toHaveBeenCalledTimes(2)
    })

    it('calls callbacks with current flow visibility', () => {
      const rulesData: CollectionsList = new Map([
        [
          'rule_1',
          mockRule([
            { flowId: 'flow_a', visible: true },
            { flowId: 'flow_b', visible: true },
          ]),
        ],
      ])

      const cb1 = jest.fn()
      const cb2 = jest.fn()

      const rules = new Collections(rulesData)

      rules.register('flow_a', cb1)

      expect(cb1).toHaveBeenLastCalledWith(true)

      rules.register('flow_b', cb2)

      expect(cb1).toHaveBeenLastCalledWith(true)
      expect(cb2).toHaveBeenLastCalledWith(false)
    })
  })

  describe('isFlowVisible', () => {
    it('returns true when node is visible and not registered', () => {
      const rulesData: CollectionsList = new Map([
        ['rule_1', mockRule([{ flowId: 'flow_a', visible: true }])],
      ])

      const rules = new Collections(rulesData)

      expect(rules.isFlowVisible('flow_a')).toBe(true)
    })

    it('returns true when node is not visible and not registered', () => {
      const rulesData: CollectionsList = new Map([
        ['rule_1', mockRule([{ flowId: 'flow_a', visible: false }])],
      ])

      const rules = new Collections(rulesData)

      // Potentially counterintuitive: Rules has no opinion on non-registered flows, so "true" == "I have no reason to prevent this from rendering"
      expect(rules.isFlowVisible('flow_a')).toBe(true)
    })

    it('returns true when node is registered and not in a rule', () => {
      const rulesData: CollectionsList = new Map([
        ['rule_1', mockRule([{ flowId: 'flow_a', visible: false }])],
      ])

      const rules = new Collections(rulesData)

      rules.register('flow_b')

      // Same logic here as the previous test: Rules has no reason to prevent a Flow from rendering when it belongs to zero Rules
      expect(rules.isFlowVisible('flow_b')).toBe(true)
    })

    it('returns true when node is not registered and not in a rule', () => {
      const rulesData: CollectionsList = new Map([
        ['rule_1', mockRule([{ flowId: 'flow_a', visible: false }])],
      ])

      const rules = new Collections(rulesData)

      expect(rules.isFlowVisible('flow_b')).toBe(true)
    })

    it('shows first flow and hides second flow in a rule when both are registered and visible', () => {
      const rulesData: CollectionsList = new Map([
        [
          'rule_1',
          mockRule([
            { flowId: 'flow_a', visible: true },
            { flowId: 'flow_b', visible: true },
          ]),
        ],
      ])

      const rules = new Collections(rulesData)

      rules.register('flow_a')
      rules.register('flow_b')

      expect(rules.isFlowVisible('flow_a')).toBe(true)
      expect(rules.isFlowVisible('flow_b')).toBe(false)
    })

    it('hides first flow and shows second flow in a rule when both are registered and first is not visible', () => {
      const rulesData: CollectionsList = new Map([
        [
          'rule_1',
          mockRule([
            { flowId: 'flow_a', visible: false },
            { flowId: 'flow_b', visible: true },
          ]),
        ],
      ])

      const rules = new Collections(rulesData)

      rules.register('flow_a')
      rules.register('flow_b')

      expect(rules.isFlowVisible('flow_a')).toBe(false)
      expect(rules.isFlowVisible('flow_b')).toBe(true)
    })

    it('hides first flow in rule when second flow is visible due to previous rule', () => {
      const rulesData: CollectionsList = new Map([
        ['rule_1', mockRule([{ flowId: 'flow_a', visible: true }])],
        [
          'rule_2',
          mockRule([
            { flowId: 'flow_b', visible: true },
            { flowId: 'flow_a', visible: true },
          ]),
        ],
      ])

      const rules = new Collections(rulesData)

      rules.register('flow_a')
      rules.register('flow_b')

      expect(rules.isFlowVisible('flow_a')).toBe(true)
      expect(rules.isFlowVisible('flow_b')).toBe(false)
    })

    it('actually, give me one with everything...', () => {
      const rulesData: CollectionsList = new Map([
        [
          'rule_1',
          mockRule([
            {
              flowId: 'flow_a',
              visible: true,
            },
            {
              flowId: 'flow_b',
              visible: true,
            },
            {
              flowId: 'flow_c',
              visible: true,
            },
          ]),
        ],

        [
          'rule_2',
          mockRule([
            {
              flowId: 'flow_c',
              visible: false,
            },
            {
              flowId: 'flow_b',
              visible: false,
            },
            {
              flowId: 'flow_a',
              visible: false,
            },
          ]),
        ],

        [
          'rule_3',
          mockRule([
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
              visible: false,
            },
          ]),
        ],

        [
          'rule_4',
          mockRule([
            {
              flowId: 'flow_b',
              visible: false,
            },
            {
              flowId: 'flow_d',
              visible: false,
            },
            {
              flowId: 'flow_e',
              visible: true,
            },
          ]),
        ],
      ])

      const rules = new Collections(rulesData)

      rules.register('flow_a')
      rules.register('flow_b')
      rules.register('flow_c')
      rules.register('flow_d')
      rules.register('flow_e')

      expect(rules.isFlowVisible('flow_a')).toBe(true)
      expect(rules.isFlowVisible('flow_b')).toBe(false)
      expect(rules.isFlowVisible('flow_c')).toBe(false)
      expect(rules.isFlowVisible('flow_d')).toBe(false)
      expect(rules.isFlowVisible('flow_e')).toBe(true)
    })
  })
})
