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
  // TEST 1: The core flicker bug
  //
  // When the last step is completed, internalComplete() does:
  //   await sendFlowStateToAPI(COMPLETED_STEP)  ← refreshes state from response
  //   await sendFlowStateToAPI(COMPLETED_FLOW)  ← refreshes state from response
  //
  // These are sequential awaits. When COMPLETED_STEP resolves, pendingRequests
  // is 0 (COMPLETED_FLOW hasn't started yet), so refreshStateFromAPI runs.
  // If the server response for COMPLETED_STEP shows the flow as still visible
  // (because the server hasn't received COMPLETED_FLOW yet), the optimistic
  // invisible state is overwritten → the flow reappears briefly.
  // ────────────────────────────────────────────────────────────────
  test('completing last step causes isVisible to temporarily revert to true', async () => {
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

    // BUG: isVisible has reverted to true — the server response overwrote the optimistic state
    visibilityLog.push(flow.isVisible) // [true, false, true]
    expect(flow.isVisible).toBe(true) // ← FLICKER
    expect(flow.isCompleted).toBe(false) // ← also reverted

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

    visibilityLog.push(flow.isVisible) // [true, false, true, false]

    // The complete flicker cycle: visible → hidden → VISIBLE AGAIN → hidden
    expect(visibilityLog).toEqual([true, false, true, false])
  })

  // ────────────────────────────────────────────────────────────────
  // TEST 2: The intermediate state creates conditions for cascading issues
  //
  // After COMPLETED_STEP reverts the optimistic state, the flow is:
  //   isVisible = true, isCompleted = false, isSkipped = false
  //
  // In React, Flow/index.tsx:126-128 checks:
  //   if (!flow.isCompleted && !flow.isSkipped && autoStart) step?.start()
  //
  // All three conditions are met → step.start() fires during render,
  // creating ANOTHER API call that can cause further state oscillation.
  // ────────────────────────────────────────────────────────────────
  test('intermediate state after COMPLETED_STEP enables step.start() re-fire conditions', async () => {
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

    // These are the exact conditions checked in React's Flow component
    // at Flow/index.tsx:126-128 for calling step.start() during render:
    //   if (!flow.isCompleted && !flow.isSkipped && autoStart) { step?.start() }
    expect(flow.isCompleted).toBe(false) // reverted by server
    expect(flow.isSkipped).toBe(false)
    expect(flow.isVisible).toBe(true) // component would render (not returning null)
    // ALL CONDITIONS MET → step.start() would fire, creating another API call

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
  // TEST 3: A stale state refresh after skip reverts the dismiss
  //
  // When step.start() fires during the flicker window (test 2), its
  // API response can arrive after a subsequent skip, reverting it.
  // This test simulates that by calling refreshStateFromAPI with
  // stale data while the skip's API call is still in flight.
  // ────────────────────────────────────────────────────────────────
  test('flow skip can be reverted by stale state refresh', async () => {
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

    // BUG: The skip was reverted — the stale refresh overwrote the optimistic state
    expect(flow.isVisible).toBe(true) // ← was false after skip
    expect(flow.isSkipped).toBe(false) // ← was true after skip

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
