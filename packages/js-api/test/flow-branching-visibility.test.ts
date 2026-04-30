import { Frigade, FlowType } from '../src'
import { FlowStates, StatefulFlow } from '../src/core/types'

const TEST_FLOW_ID = 'flow_test_branching'
const TEST_API_KEY = 'api_test_branching_key'

// ─── Helpers ─────────────────────────────────────────────────────

function createDeferred<T = any>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: any) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

function makeFlowStates(opts: {
  steps?: Array<{
    id: string
    completed?: boolean
    started?: boolean
    skipped?: boolean
    visible?: boolean
  }>
  flowState?: Partial<{
    completed: boolean
    started: boolean
    skipped: boolean
    visible: boolean
    currentStepId: string
    currentStepIndex: number
  }>
}): FlowStates {
  const steps = (opts.steps ?? [{ id: 'step-1' }, { id: 'step-2' }]).map((s) => ({
    id: s.id,
    $state: {
      completed: s.completed ?? false,
      skipped: s.skipped ?? false,
      started: s.started ?? false,
      visible: s.visible ?? true,
      blocked: false,
    },
  }))

  return {
    eligibleFlows: [
      {
        flowSlug: TEST_FLOW_ID,
        flowName: 'Test Branching Flow',
        flowType: FlowType.FORM,
        version: 1,
        data: { steps },
        $state: {
          currentStepId: opts.flowState?.currentStepId ?? steps[0].id,
          currentStepIndex: opts.flowState?.currentStepIndex ?? 0,
          completed: opts.flowState?.completed ?? false,
          started: opts.flowState?.started ?? false,
          skipped: opts.flowState?.skipped ?? false,
          visible: opts.flowState?.visible ?? true,
        },
      } as StatefulFlow,
    ],
    ineligibleFlows: [],
  }
}

async function flushAsync() {
  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
}

// ─── Test Suite ──────────────────────────────────────────────────

describe('Form branching with visibilityCriteria', () => {
  const originalFetch = globalThis.fetch
  let fetchCalls: Array<{
    url: string
    body: any
    deferred: ReturnType<typeof createDeferred<Response>>
  }>

  beforeEach(() => {
    fetchCalls = []
    ;(globalThis as any).callQueue?.cancelAllPendingRequests?.()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  async function setupFrigadeWithMockFlow(initialState: FlowStates) {
    const userId = `guest_test_${Math.random().toString(36).slice(2)}`
    let isInitCall = true

    globalThis.fetch = jest.fn(
      async (_url: RequestInfo | URL, options?: RequestInit) => {
        const url = typeof _url === 'string' ? _url : _url.toString()
        const body = options?.body ? JSON.parse(options.body as string) : {}
        const deferred = createDeferred<Response>()
        fetchCalls.push({ url, body, deferred })

        if (isInitCall && !body.actionType) {
          isInitCall = false
          return new Response(JSON.stringify(initialState), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        return deferred.promise
      }
    ) as typeof fetch

    const frigade = new Frigade(TEST_API_KEY, {
      userId,
      syncOnWindowUpdates: false,
    })

    const flow = await frigade.getFlow(TEST_FLOW_ID)
    return { frigade, flow }
  }

  function resolveCall(actionType: string, responseState: FlowStates) {
    const call = fetchCalls.find((c) => c.body?.actionType === actionType)
    if (!call) {
      throw new Error(
        `No fetch call found with actionType "${actionType}". ` +
          `Available: [${fetchCalls.map((c) => c.body?.actionType ?? '(init)').join(', ')}]`
      )
    }
    call.deferred.resolve(
      new Response(JSON.stringify(responseState), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )
  }

  // ────────────────────────────────────────────────────────────────
  // BUG: When completing a step whose form data causes the next step
  // to be hidden via visibilityCriteria, the client used to fire a
  // STARTED_STEP for the optimistically-chosen next step (now hidden),
  // because nextStepForStartEvent was computed from stale visibility
  // BEFORE the COMPLETED_STEP server response arrived.
  //
  // Repro: 3-step form. page-2 has visibilityCriteria depending on
  // page-1's form data. Submitting page-1 with the value that hides
  // page-2 should land the user on page-3.
  // ────────────────────────────────────────────────────────────────
  test('after complete that hides the optimistic next step, STARTED_STEP fires for the actual visible next step', async () => {
    const { flow } = await setupFrigadeWithMockFlow(
      makeFlowStates({
        steps: [
          { id: 'page-1', visible: true },
          { id: 'page-2', visible: true },
          { id: 'page-3', visible: true },
        ],
        flowState: {
          currentStepId: 'page-1',
          currentStepIndex: 0,
        },
      })
    )

    expect(flow.getCurrentStep().id).toBe('page-1')

    // Submit page-1 with form data that the server will use to hide page-2.
    // Don't await — we control timing with deferred fetch.
    void flow.getCurrentStep().complete({ 'test-radio-1': 'x' })

    await flushAsync()

    // Server processes the form data, hides page-2, advances currentStepId
    // to page-3 (the actual next visible step).
    resolveCall(
      'COMPLETED_STEP',
      makeFlowStates({
        steps: [
          { id: 'page-1', completed: true, started: true, visible: true },
          { id: 'page-2', visible: false }, // hidden by visibilityCriteria
          { id: 'page-3', started: true, visible: true },
        ],
        flowState: {
          currentStepId: 'page-3',
          currentStepIndex: 2,
          started: true,
        },
      })
    )

    await flushAsync()

    // After the COMPLETED_STEP response refreshes state, the client fires
    // a follow-up STARTED_STEP. That call MUST be for the actual current
    // step from the refreshed state (page-3), not for the optimistically
    // chosen page-2 — otherwise the server flips currentStepId back to
    // the now-hidden page-2.
    const startedStepCalls = fetchCalls.filter(
      (c) => c.body?.actionType === 'STARTED_STEP'
    )
    expect(startedStepCalls.length).toBe(1)
    expect(startedStepCalls[0].body.stepId).toBe('page-3')
    expect(startedStepCalls[0].body.stepId).not.toBe('page-2')

    // Local state should also reflect that the user is on page-3.
    expect(flow.getCurrentStep().id).toBe('page-3')
  })

  // ────────────────────────────────────────────────────────────────
  // REGRESSION GUARD for commit 2723c815: when the optimistic next
  // step is still visible after the server response (the common
  // non-branching case), the STARTED_STEP must still be fired for it
  // so the server isn't left thinking that step was never started.
  // ────────────────────────────────────────────────────────────────
  test('non-branching flow: STARTED_STEP for the next step is still fired after complete', async () => {
    const { flow } = await setupFrigadeWithMockFlow(
      makeFlowStates({
        steps: [
          { id: 'step-1', visible: true },
          { id: 'step-2', visible: true },
        ],
        flowState: {
          currentStepId: 'step-1',
          currentStepIndex: 0,
        },
      })
    )

    void flow.getCurrentStep().complete()

    await flushAsync()

    // Server response: nothing exotic, step-2 is still the next step.
    resolveCall(
      'COMPLETED_STEP',
      makeFlowStates({
        steps: [
          { id: 'step-1', completed: true, started: true, visible: true },
          { id: 'step-2', started: true, visible: true },
        ],
        flowState: {
          currentStepId: 'step-2',
          currentStepIndex: 1,
          started: true,
        },
      })
    )

    await flushAsync()

    const startedStepCalls = fetchCalls.filter(
      (c) => c.body?.actionType === 'STARTED_STEP'
    )
    expect(startedStepCalls.length).toBe(1)
    expect(startedStepCalls[0].body.stepId).toBe('step-2')
  })
})
