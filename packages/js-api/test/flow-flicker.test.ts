import { Frigade, FlowType } from '../src'
import { FlowStates, StatefulFlow } from '../src/core/types'
import { frigadeGlobalState, getGlobalStateKey } from '../src/shared/state'

const TEST_FLOW_ID = 'flow_test_flicker'
const TEST_API_KEY = 'api_test_flicker_key'

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
  const steps = (
    opts.steps ?? [
      { id: 'step-1' },
      { id: 'step-2' },
    ]
  ).map((s) => ({
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
        flowName: 'Test Flicker Flow',
        flowType: FlowType.ANNOUNCEMENT,
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

/** Flush all pending microtasks and macrotasks */
async function flushAsync() {
  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
}

// ─── Test Suite ──────────────────────────────────────────────────

describe('Flow visibility flicker on complete/dismiss', () => {
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

  /**
   * Initialize Frigade with a mocked fetch.
   * The initial state-refresh call resolves immediately with `initialState`.
   * All subsequent action calls (COMPLETED_STEP, SKIPPED_FLOW, etc.) return
   * deferred promises so the test can control when they resolve.
   */
  async function setupFrigadeWithMockFlow(initialState: FlowStates) {
    const userId = `guest_test_${Math.random().toString(36).slice(2)}`
    let isInitCall = true

    globalThis.fetch = jest.fn(
      async (_url: RequestInfo | URL, options?: RequestInit) => {
        const url = typeof _url === 'string' ? _url : _url.toString()
        const body = options?.body ? JSON.parse(options.body as string) : {}
        const deferred = createDeferred<Response>()
        fetchCalls.push({ url, body, deferred })

        // The first call without an actionType is the init state refresh — resolve immediately
        if (isInitCall && !body.actionType) {
          isInitCall = false
          return new Response(JSON.stringify(initialState), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // All action calls return a deferred promise the test controls
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

  /** Resolve a pending fetch call by its actionType. */
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
  // TEST 1: Completing last step should NOT flicker
  //
  // When the last step is completed, internalComplete() sends two
  // sequential API calls: COMPLETED_STEP then COMPLETED_FLOW.
  // The COMPLETED_STEP call now skips refreshStateFromAPI (via the
  // skipRefresh parameter), so the intermediate server response
  // cannot revert the optimistic invisible state.
  // ────────────────────────────────────────────────────────────────
  test('completing last step keeps flow invisible throughout', async () => {
    const { flow } = await setupFrigadeWithMockFlow(
      makeFlowStates({
        steps: [
          { id: 'step-1', completed: true, started: true },
          { id: 'step-2', completed: false, started: true },
        ],
        flowState: {
          currentStepId: 'step-2',
          currentStepIndex: 1,
          started: true,
          visible: true,
        },
      })
    )

    // Preconditions
    expect(flow.isVisible).toBe(true)
    expect(flow.isCompleted).toBe(false)
    expect(flow.getCurrentStepIndex()).toBe(1)

    const visibilityLog: boolean[] = []
    visibilityLog.push(flow.isVisible) // [true]

    // Complete step-2 (the last step). Don't await — we control timing.
    const completionPromise = flow.getCurrentStep().complete()

    // Optimistic update ran synchronously
    visibilityLog.push(flow.isVisible) // [true, false]
    expect(flow.isVisible).toBe(false)
    expect(flow.isCompleted).toBe(true)

    // Let the COMPLETED_STEP fetch call be dispatched
    await flushAsync()

    // Resolve COMPLETED_STEP with a response where the *step* is completed
    // but the *flow* is NOT (server hasn't seen COMPLETED_FLOW yet).
    resolveCall(
      'COMPLETED_STEP',
      makeFlowStates({
        steps: [
          { id: 'step-1', completed: true, started: true },
          { id: 'step-2', completed: true, started: true },
        ],
        flowState: {
          currentStepId: 'step-2',
          currentStepIndex: 1,
          started: true,
          completed: false, // server hasn't processed COMPLETED_FLOW
          visible: true, // still visible because flow isn't complete
        },
      })
    )

    // Let refreshStateFromAPI process the response
    await flushAsync()

    // FIX: isVisible stays false — the COMPLETED_STEP response refresh is skipped
    visibilityLog.push(flow.isVisible) // [true, false, false]
    expect(flow.isVisible).toBe(false) // no flicker
    expect(flow.isCompleted).toBe(true) // not reverted

    // Now resolve COMPLETED_FLOW with the final state
    resolveCall(
      'COMPLETED_FLOW',
      makeFlowStates({
        steps: [
          { id: 'step-1', completed: true, started: true },
          { id: 'step-2', completed: true, started: true },
        ],
        flowState: {
          currentStepId: 'step-2',
          currentStepIndex: 1,
          started: true,
          completed: true,
          visible: false,
        },
      })
    )

    await completionPromise
    await flushAsync()

    visibilityLog.push(flow.isVisible) // [true, false, false, false]

    // No flicker: visible → hidden → stays hidden
    expect(visibilityLog).toEqual([true, false, false, false])
  })

  // ────────────────────────────────────────────────────────────────
  // TEST 2: Intermediate state does NOT enable step.start() re-fire
  //
  // With the skipRefresh fix, after COMPLETED_STEP the optimistic
  // state is preserved: isCompleted=true, isVisible=false.
  // The React autoStart condition (!isCompleted && !isSkipped) is
  // NOT met, so step.start() won't fire during the flicker window.
  // ────────────────────────────────────────────────────────────────
  test('optimistic state is preserved after COMPLETED_STEP, preventing step.start() re-fire', async () => {
    const { flow } = await setupFrigadeWithMockFlow(
      makeFlowStates({
        steps: [
          { id: 'step-1', completed: true, started: true },
          { id: 'step-2', completed: false, started: true },
        ],
        flowState: {
          currentStepId: 'step-2',
          currentStepIndex: 1,
          started: true,
          visible: true,
        },
      })
    )

    // Complete the last step
    const completionPromise = flow.getCurrentStep().complete()

    // Optimistic: completed + invisible
    expect(flow.isCompleted).toBe(true)
    expect(flow.isVisible).toBe(false)
    expect(flow.isSkipped).toBe(false)

    await flushAsync()

    // Resolve COMPLETED_STEP with flow still visible/not completed
    resolveCall(
      'COMPLETED_STEP',
      makeFlowStates({
        steps: [
          { id: 'step-1', completed: true, started: true },
          { id: 'step-2', completed: true, started: true },
        ],
        flowState: {
          currentStepId: 'step-2',
          currentStepIndex: 1,
          started: true,
          completed: false,
          visible: true,
        },
      })
    )

    await flushAsync()

    // FIX: Optimistic state is preserved — the COMPLETED_STEP refresh was skipped.
    // The React autoStart condition (!isCompleted && !isSkipped) is NOT met.
    expect(flow.isCompleted).toBe(true) // preserved
    expect(flow.isVisible).toBe(false) // preserved — component would return null
    // step.start() would NOT fire

    // Clean up
    resolveCall(
      'COMPLETED_FLOW',
      makeFlowStates({
        steps: [
          { id: 'step-1', completed: true, started: true },
          { id: 'step-2', completed: true, started: true },
        ],
        flowState: {
          currentStepId: 'step-2',
          currentStepIndex: 1,
          started: true,
          completed: true,
          visible: false,
        },
      })
    )
    await completionPromise
  })

  // ────────────────────────────────────────────────────────────────
  // TEST 3: Stale state refresh does NOT revert a pending skip
  //
  // When a flow has a pending API request (e.g., SKIPPED_FLOW),
  // refreshStateFromAPI now skips updating that flow's state.
  // This prevents stale data from visibility-change polls or
  // other flows' responses from reverting optimistic state.
  // ────────────────────────────────────────────────────────────────
  test('flow skip is preserved despite stale state refresh', async () => {
    const { frigade, flow } = await setupFrigadeWithMockFlow(
      makeFlowStates({
        steps: [
          { id: 'step-1', completed: false, started: true },
          { id: 'step-2', completed: false, started: false },
        ],
        flowState: {
          currentStepId: 'step-1',
          currentStepIndex: 0,
          started: true,
          visible: true,
        },
      })
    )

    expect(flow.isVisible).toBe(true)
    expect(flow.isSkipped).toBe(false)

    // Skip the flow (simulates handleDismiss)
    const skipPromise = flow.skip()

    // Optimistic update: skipped + invisible
    expect(flow.isSkipped).toBe(true)
    expect(flow.isVisible).toBe(false)

    await flushAsync()

    // Simulate a stale state refresh arriving (e.g., from a step.start()
    // API call that was in-flight when the skip happened, or from a
    // visibility-change-triggered refresh).
    const stateKey = getGlobalStateKey(frigade.getConfig())
    const globalState = frigadeGlobalState[stateKey]

    const staleState = makeFlowStates({
      steps: [
        { id: 'step-1', completed: false, started: true },
        { id: 'step-2', completed: false, started: false },
      ],
      flowState: {
        currentStepId: 'step-1',
        currentStepIndex: 0,
        started: true,
        skipped: false, // stale: doesn't reflect the skip
        visible: true, // stale: still visible
      },
    })

    await globalState.refreshStateFromAPI(staleState)
    await flushAsync()

    // FIX: The skip is preserved — refreshStateFromAPI skips flows with pending requests
    expect(flow.isVisible).toBe(false) // preserved
    expect(flow.isSkipped).toBe(true) // preserved

    // Clean up: resolve the pending SKIPPED_FLOW call
    resolveCall(
      'SKIPPED_FLOW',
      makeFlowStates({
        steps: [
          { id: 'step-1', completed: false, started: true },
          { id: 'step-2', completed: false, started: false },
        ],
        flowState: {
          currentStepId: 'step-1',
          currentStepIndex: 0,
          started: true,
          skipped: true,
          visible: false,
        },
      })
    )
    await skipPromise
  })
})
