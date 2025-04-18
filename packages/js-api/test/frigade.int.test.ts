import { FlowStep, FlowType, Frigade } from '../src'
import { getRandomID } from './util'
import { Flow } from '../src/.'

const testAPIKey = 'api_public_3MPLH7NJ9L0U963XKW7BPE2IT137GC6L742JLC2XCT6NOIYSI4QUI9I1RA3ZOGIL'
const testFlowId = 'flow_yJfjksFrs5QEH0c8'
const testFlowIdWithTargeting = 'flow_61YBPQek'
const testFlowStepId = 'checklist-step-one'
const testFlowStepId2 = 'checklist-step-two'
jest.retryTimes(2, { logErrorsBeforeRetry: false })

describe('Basic Checklist integration test', () => {
  test('can init Frigade', async () => {
    const frigade = new Frigade(testAPIKey, {})
    const flows = await frigade.getFlows()
    expect(flows.length).toBeGreaterThan(0)
    expect(frigade.isReady()).toBeTruthy()
  })

  test('can disable guest id generation', async () => {
    const frigade = new Frigade(testAPIKey, {
      generateGuestId: false,
    })
    let flows = await frigade.getFlows()
    expect(flows.length).toEqual(0)
    expect(frigade.isReady()).toBeTruthy()
    await frigade.identify(getRandomID())
    flows = await frigade.getFlows()
    expect(flows.length).toBeGreaterThan(0)
    expect(frigade.isReady()).toBeTruthy()
  })

  test('flows have fields set', async () => {
    const frigade = new Frigade(testAPIKey, {})
    const flows = await frigade.getFlows()

    expect(
      flows.filter((flow) => flow.id && flow.isVisible && flow.rawData.flowType).length
    ).toBeGreaterThan(0)
    const flow = flows.find((flow) => flow.id === testFlowId)
    flow.steps.forEach((step) => {
      expect(step.id).toBeDefined()
      expect(step.title).toBeDefined()
    })
    expect(flow.version).toBeDefined()
  })

  test('read and set flow state', async () => {
    const frigade = new Frigade(testAPIKey, {
      userId: getRandomID(),
    })
    const flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()
    expect(flow.id).toEqual(testFlowId)
    expect(flow.isCompleted).toBeFalsy()
    await flow.complete()
    expect(flow.isCompleted).toBeTruthy()
  })

  test('read and set flow state with flow overrides and readonly enabled', async () => {
    const madeUpFlowId = 'flow_abc'
    const frigade = new Frigade(testAPIKey, {
      userId: getRandomID(),
      __flowStateOverrides: {
        [madeUpFlowId]: {
          flowSlug: 'some-flow',
          flowName: 'Some flow',
          flowType: FlowType.CHECKLIST,
          version: 1,
          data: {
            steps: [
              {
                id: 'step-one',
                $state: {
                  completed: false,
                  started: false,
                  visible: true,
                  blocked: false,
                  skipped: false,
                },
              },
              {
                id: 'step-two',
                $state: {
                  completed: false,
                  started: false,
                  visible: true,
                  blocked: false,
                  skipped: false,
                },
              },
            ],
          },
          $state: {
            currentStepId: 'step-one',
            visible: true,
            started: false,
            completed: false,
            skipped: false,
            currentStepIndex: -1,
          },
        },
      },
      __readOnly: true,
    })
    const flow = await frigade.getFlow(madeUpFlowId)
    expect(flow).toBeDefined()
    expect(flow.id).toEqual(madeUpFlowId)
    expect(flow.isCompleted).toBeFalsy()
    await flow.steps.get('step-one').complete()
    expect(flow.steps.get('step-one').$state.completed).toBeTruthy()
    expect(flow.steps.get('step-two').$state.completed).toBeFalsy()
    await flow.steps.get('step-two').start()
    expect(flow.steps.get('step-two').$state.started).toBeTruthy()
    expect(flow.getCurrentStepIndex()).toEqual(1)
    await flow.complete()
    expect(flow.isCompleted).toBeTruthy()
  })

  test('read and set flow state with flow overrides, including current step index', async () => {
    const madeUpFlowId = 'flow_abc'
    const frigade = new Frigade(testAPIKey, {
      userId: getRandomID(),
      __flowStateOverrides: {
        [madeUpFlowId]: {
          flowSlug: 'some-flow',
          flowName: 'Some flow',
          version: 1,
          flowType: FlowType.CHECKLIST,
          data: {
            steps: [
              {
                id: 'step-one',
                title: 'Step One',
                $state: {
                  completed: false,
                  started: false,
                  visible: true,
                  blocked: false,
                  skipped: false,
                },
              },
              {
                id: 'step-two',
                title: 'Step Two',
                $state: {
                  completed: false,
                  started: false,
                  visible: true,
                  blocked: false,
                  skipped: false,
                },
              },
            ],
          },
          $state: {
            currentStepId: 'step-two',
            visible: true,
            started: true,
            completed: false,
            skipped: false,
            currentStepIndex: 1,
          },
        },
      },
      __readOnly: true,
    })
    const flow = await frigade.getFlow(madeUpFlowId)
    expect(flow).toBeDefined()
    expect(flow.id).toEqual(madeUpFlowId)
    expect(flow.getStepByIndex(0).title).toEqual('Step One')
    expect(flow.getCurrentStepIndex()).toEqual(1)
    await flow.complete()
    expect(flow.isCompleted).toBeTruthy()
    expect(flow.isVisible).toBeFalsy()

    // Now get the config and update the current step index to be 0
    const config = frigade.getConfig()
    config.__flowStateOverrides = {
      ...config.__flowStateOverrides,
      [madeUpFlowId]: {
        flowSlug: 'some-flow',
        flowName: 'Some flow',
        version: 1,
        flowType: FlowType.CHECKLIST,
        data: {
          steps: [
            {
              id: 'step-one',
              title: 'Step One Updated',
              $state: {
                completed: false,
                started: false,
                visible: true,
                blocked: false,
                skipped: false,
              },
            },
            {
              id: 'step-two',
              title: 'Step Two Updated',
              $state: {
                completed: false,
                started: false,
                visible: true,
                blocked: false,
                skipped: false,
              },
            },
          ],
        },
        $state: {
          currentStepId: 'step-one',
          visible: true,
          started: true,
          completed: false,
          skipped: false,
          currentStepIndex: 0,
        },
      },
    }
    // set event handler
    const callback = jest.fn(() => {})
    await frigade.onStateChange(callback)
    expect(callback).toHaveBeenCalledTimes(0)
    await frigade.reload(config)
    expect(callback).toHaveBeenCalled()
    const updatedFlow = await frigade.getFlow(madeUpFlowId)
    expect(updatedFlow.isCompleted).toBeFalsy()
    expect(updatedFlow.isVisible).toBeTruthy()
    expect(updatedFlow.getStepByIndex(0).title).toEqual('Step One Updated')

    expect(updatedFlow).toBeDefined()
    expect(updatedFlow.id).toEqual(madeUpFlowId)
    expect(updatedFlow.getCurrentStepIndex()).toEqual(0)
  })

  test('read and set flow step state', async () => {
    const frigade = new Frigade(testAPIKey, {
      userId: getRandomID(),
    })
    const flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()
    expect(flow.id).toEqual(testFlowId)
    const step = flow.steps.get(testFlowStepId)
    expect(flow.getCurrentStepIndex()).toEqual(0)
    expect(step).toBeDefined()
    expect(step.$state.completed).toBeFalsy()
    expect(step.$state.started).toBeFalsy()
    await step.start()
    expect(flow.getCurrentStepIndex()).toEqual(0)
    expect(step.$state.started).toBeTruthy()
    await step.complete()
    expect(flow.getCurrentStepIndex()).toEqual(1)
    expect(step.$state.completed).toBeTruthy()
    await step.reset()
    expect(step.$state.completed).toBeFalsy()
    expect(step.$state.started).toBeFalsy()
  })

  test('navigates back and forth in a flow', async () => {
    const userId = getRandomID()
    let frigade = new Frigade(testAPIKey, {
      userId,
    })
    let flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()
    expect(flow.id).toEqual(testFlowId)

    await flow.start()
    expect(flow.isStarted).toBeTruthy()

    const previousStep = flow.steps.get(testFlowStepId)
    expect(flow.getCurrentStepIndex()).toEqual(0)
    expect(previousStep).toBeDefined()
    expect(previousStep.$state.completed).toBeFalsy()
    expect(previousStep.$state.started).toBeFalsy()
    await flow.forward()
    expect(flow.getCurrentStepIndex()).toEqual(1)
    const currentStep = flow.getCurrentStep()
    expect(currentStep.$state.started).toBeTruthy()
    expect(currentStep.$state.completed).toBeFalsy()
    await flow.back()
    expect(flow.getCurrentStepIndex()).toEqual(0)
    expect(previousStep.$state.started).toBeTruthy()
    expect(previousStep.$state.completed).toBeFalsy()
    await flow.forward()
    expect(flow.getCurrentStepIndex()).toEqual(1)
    expect(currentStep.$state.started).toBeTruthy()
    // reset the frigade instance and ensure index is still the same (this is the equivalent of a page refresh)
    frigade = new Frigade(testAPIKey, {
      userId,
    })
    flow = await frigade.getFlow(testFlowId)
    expect(flow.getCurrentStepIndex()).toEqual(1)
    await flow.back()
    expect(flow.getCurrentStepIndex()).toEqual(0)
    await flow.getStepByIndex(0).complete()
    expect(flow.isCompleted).toBeFalsy()
    expect(flow.getCurrentStepIndex()).toEqual(1)
    await flow.back()
    expect(flow.getCurrentStepIndex()).toEqual(0)
    frigade = new Frigade(testAPIKey, {
      userId,
    })
    flow = await frigade.getFlow(testFlowId)
    expect(flow.getCurrentStepIndex()).toEqual(0)
  })

  test('handle flow event changes', async () => {
    const frigade = new Frigade(testAPIKey, {
      userId: getRandomID(),
    })

    const callback1 = jest.fn((flow: Flow) => {
      if (flow.id != testFlowId) {
        return
      }
      expect(flow).toBeDefined()
      expect(flow.id).toEqual(testFlowId)
      expect(flow.isCompleted).toBeFalsy()
      expect(flow.isStarted).toBeTruthy()
    })
    await frigade.onStateChange(callback1)
    const flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()
    expect(flow.id).toEqual(testFlowId)
    expect(flow.isCompleted).toBeFalsy()
    expect(callback1).toHaveBeenCalledTimes(0)
    await flow.getStepByIndex(0).complete()
    expect(flow.isCompleted).toBeFalsy()
    expect(callback1).toHaveBeenCalled()
    await frigade.removeStateChangeHandler(callback1)

    const callback2 = jest.fn((flow) => {
      if (flow.id != testFlowId) {
        return
      }
      expect(flow).toBeDefined()
      expect(flow.id).toEqual(testFlowId)
      expect(flow.isCompleted).toBeTruthy()
    })
    await frigade.onStateChange(callback2)
    expect(callback2).toHaveBeenCalledTimes(0)
    await flow.complete()
    expect(flow.isCompleted).toBeTruthy()
    expect(callback2).toHaveBeenCalled()
    frigade.removeStateChangeHandler(callback2)
  })

  test('handle flow event changes unsubscribe', async () => {
    const frigade = new Frigade(testAPIKey, {
      userId: getRandomID(),
    })
    const callback = jest.fn(() => {})
    await frigade.onStateChange(callback)
    const flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()
    expect(flow.id).toEqual(testFlowId)
    expect(flow.isCompleted).toBeFalsy()
    await frigade.removeStateChangeHandler(callback)
    await flow.complete()
    expect(flow.isCompleted).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(0)
  })

  test('handle single flow event changes subscribes and unsubscribes', async () => {
    const frigade = new Frigade(testAPIKey, {
      userId: getRandomID(),
    })
    const instanceId = frigade.config.__instanceId
    expect(instanceId).toBeDefined()
    const callback = jest.fn((flow: Flow) => {
      expect(flow).toBeDefined()
      expect(flow.id).toEqual(testFlowId)
    })
    const flow = await frigade.getFlow(testFlowId)
    flow.onStateChange(callback)
    expect(flow).toBeDefined()
    expect(flow.id).toEqual(testFlowId)
    expect(flow.isCompleted).toBeFalsy()
    expect(flow.isStarted).toBeFalsy()
    expect(callback).toHaveBeenCalledTimes(0)
    await flow.complete()
    expect(flow.isCompleted).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(2)
    flow.removeStateChangeHandler(callback)
    expect(frigade.config.__instanceId).toEqual(instanceId)
    expect(flow.config.__instanceId).toEqual(instanceId)
  })

  test('handle step event changes', async () => {
    const frigade = new Frigade(testAPIKey, {
      userId: getRandomID(),
    })

    const callback = jest.fn((step: FlowStep) => {
      expect(step).toBeDefined()
      expect(step.id).toEqual(testFlowStepId)
    })
    const flow = await frigade.getFlow(testFlowId)

    expect(callback).toHaveBeenCalledTimes(0)
    flow.steps.get(testFlowStepId).onStateChange(callback)
    expect(callback).toHaveBeenCalledTimes(0)
    await flow.steps.get(testFlowStepId).start()
    expect(callback).toHaveBeenCalledTimes(2)
    await flow.steps.get(testFlowStepId).complete()
    expect(callback).toHaveBeenCalledTimes(3)
  })

  test('custom variables get substituted', async () => {
    const frigade = new Frigade(testAPIKey, {
      userId: getRandomID(),
    })
    const flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()
    expect(flow.getStepByIndex(0)).toBeDefined()
    expect(flow.getStepByIndex(0).subtitle).not.toContain('${email}')
    expect(flow.getStepByIndex(0).subtitle).not.toContain('${name}')
    const step = flow.steps.get(testFlowStepId)
    const customVariables = {
      name: 'John Doe',
      email: 'john@doe.com',
    }
    flow.applyVariables(customVariables)
    expect(step.subtitle).toContain(customVariables.email)
    expect(step.subtitle).toContain(customVariables.name)
    // Complete the first step. Expect content to still be substituted.
    await step.complete()
    expect(step.subtitle).toContain(customVariables.email)
    expect(step.subtitle).toContain(customVariables.name)
  })

  test('restart a flow', async () => {
    const userId = getRandomID()
    let frigade = new Frigade(testAPIKey, {
      userId,
    })
    let flow = await frigade.getFlow(testFlowId)
    expect(flow.isVisible).toBeFalsy()
    // workaround to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, 250))
    await frigade.identify(userId, {
      createdAt: new Date().toISOString(),
    })
    flow = await frigade.getFlow(testFlowId)
    expect(flow.isVisible).toBeTruthy()
    const step = flow.steps.get(testFlowStepId)
    expect(flow).toBeDefined()
    expect(flow.id).toEqual(testFlowId)
    expect(flow.isVisible).toBeTruthy()
    expect(step.$state.started).toBeFalsy()
    await step.start()
    expect(step.$state.started).toBeTruthy()
    expect(flow.isCompleted).toBeFalsy()
    await flow.complete()
    expect(flow.isCompleted).toBeTruthy()
    expect(flow.isVisible).toBeFalsy()
    await flow.restart()
    expect(flow.isCompleted).toBeFalsy()
    expect(flow.isVisible).toBeTruthy()
  })
  test('on() event handler for flow.complete', async () => {
    const userId = getRandomID()
    const frigade = new Frigade(testAPIKey, {
      userId,
    })
    await frigade.identify(userId)
    const flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()

    const callback = jest.fn(
      (event: string, flow: Flow, _previousFlow?: Flow, _step?: FlowStep) => {
        expect(event).toBe('flow.complete')
        expect(flow).toBeDefined()
        expect(flow.id).toEqual(testFlowId)
      }
    )
    frigade.on('flow.complete', callback)

    expect(flow.isCompleted).toBeFalsy()
    await flow.complete()
    expect(flow.isCompleted).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('on() event handler for flow.start', async () => {
    const userId = getRandomID()
    const frigade = new Frigade(testAPIKey, {
      userId,
    })
    await frigade.identify(userId)
    const flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()

    const callback = jest.fn(
      (event: string, flow: Flow, _previousFlow?: Flow, _step?: FlowStep) => {
        expect(event).toBe('flow.start')
        expect(flow).toBeDefined()
        expect(flow.id).toEqual(testFlowId)
      }
    )
    frigade.on('flow.start', callback)

    const step = flow.steps.get(testFlowStepId)
    expect(step).toBeDefined()

    await step.start()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('on() event handler for step.start', async () => {
    const userId = getRandomID()
    const frigade = new Frigade(testAPIKey, {
      userId,
    })
    await frigade.identify(userId)
    const flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()

    const callback = jest.fn((event: string, flow: Flow, _previousFlow?: Flow, step?: FlowStep) => {
      expect(event).toBe('step.start')
      expect(flow).toBeDefined()
      expect(flow.id).toEqual(testFlowId)
      expect(step).toBeDefined()
      expect(step.id).toEqual(testFlowStepId)
    })
    frigade.on('step.start', callback)

    const step = flow.steps.get(testFlowStepId)
    expect(step).toBeDefined()
    if (step) {
      await step.start()
      expect(callback).toHaveBeenCalledTimes(1)
    }

    frigade.off('step.start', callback)

    const callback2 = jest.fn(
      (event: string, flow: Flow, _previousFlow?: Flow, step?: FlowStep) => {
        expect(event).toBe('step.start')
        expect(flow).toBeDefined()
        expect(flow.id).toEqual(testFlowId)
        expect(step).toBeDefined()
        expect(step.id).toEqual(testFlowStepId2) // Assuming testFlowStepId2 is the ID of step 2
      }
    )
    frigade.on('step.start', callback2)

    const step1 = flow.steps.get(testFlowStepId)
    expect(step1).toBeDefined()
    if (step1) {
      await step1.complete()
      const step2 = flow.steps.get(testFlowStepId2) // Assuming testFlowStepId2 is the ID of step 2
      expect(step2).toBeDefined()
      if (step2) {
        await step2.start()
        expect(callback2).toHaveBeenCalledTimes(1)
      }
    }

    frigade.off('step.start', callback2)
  })

  test('on() event handler for step.complete', async () => {
    const userId = getRandomID()
    const frigade = new Frigade(testAPIKey, {
      userId,
    })
    await frigade.identify(userId)
    const flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()

    const callback = jest.fn((event: string, flow: Flow, _previousFlow?: Flow, step?: FlowStep) => {
      expect(event).toBe('step.complete')
      expect(flow).toBeDefined()
      expect(flow.id).toEqual(testFlowId)
      expect(step).toBeDefined()
      expect(step.id).toEqual(testFlowStepId)
    })
    frigade.on('step.complete', callback)

    if (flow) {
      const step = flow.steps.get(testFlowStepId)
      expect(step).toBeDefined()
      if (step) {
        await step.complete()
        expect(callback).toHaveBeenCalledTimes(1)
      }
    }
  })

  test('on() event handler for flow.skip', async () => {
    const userId = getRandomID()
    const frigade = new Frigade(testAPIKey, {
      userId,
    })
    await frigade.identify(userId)
    const flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()

    const callback = jest.fn(
      (event: string, flow: Flow, _previousFlow?: Flow, _step?: FlowStep) => {
        expect(event).toBe('flow.skip')
        expect(flow).toBeDefined()
        expect(flow.id).toEqual(testFlowId)
      }
    )
    frigade.on('flow.skip', callback)

    if (flow) {
      await flow.skip()
      expect(callback).toHaveBeenCalledTimes(1)
    }
  })

  test('on() event handler for step.reset', async () => {
    const userId = getRandomID()
    const frigade = new Frigade(testAPIKey, {
      userId,
    })
    await frigade.identify(userId)
    const flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()

    const callback = jest.fn((event: string, flow: Flow, _previousFlow?: Flow, step?: FlowStep) => {
      expect(event).toBe('step.reset')
      expect(flow).toBeDefined()
      expect(flow.id).toEqual(testFlowId)
      expect(step).toBeDefined()
      expect(step.id).toEqual(testFlowStepId)
    })
    frigade.on('step.reset', callback)

    if (flow) {
      const step = flow.steps.get(testFlowStepId)
      expect(step).toBeDefined()
      if (step) {
        await step.complete()
        await step.reset()
        expect(callback).toHaveBeenCalledTimes(1)
      }
    }
  })

  test('on() event handler for steps completion should fire expected number of times', async () => {
    const userId = getRandomID()
    // First instance to complete the flow
    const frigade = new Frigade(testAPIKey, {
      userId,
    })
    const callback = jest.fn(
      (event: string, flow: Flow, _previousFlow?: Flow, _step?: FlowStep) => {
        expect(event).toBe('step.complete')
        expect(flow).toBeDefined()
        expect(flow.id).toEqual(testFlowId)
      }
    )
    frigade.on('step.complete', callback)
    await frigade.identify(userId)
    const flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()
    expect(callback).toHaveBeenCalledTimes(0)

    // Complete the flow first
    expect(flow.steps.get(testFlowStepId).$state.completed).toBeFalsy()
    await flow.steps.get(testFlowStepId).complete()
    expect(flow.steps.get(testFlowStepId).$state.completed).toBeTruthy()
    await flow.complete()
    expect(callback).toHaveBeenCalledTimes(1)

    // Create a new Frigade instance with the same userId
    const newFrigade = new Frigade(testAPIKey, {
      userId,
    })
    await newFrigade.identify(userId)

    // Register event handler after flow is already completed
    const newCallback = jest.fn(
      (event: string, flow: Flow, _previousFlow?: Flow, _step?: FlowStep) => {
        expect(event).toBe('step.complete')
        expect(flow).toBeDefined()
        expect(flow.id).toEqual(testFlowId)
      }
    )

    // Register the handler on the new instance - it should not fire for the already completed flow
    newFrigade.on('step.complete', newCallback)

    // Verify the callback wasn't called
    expect(newCallback).toHaveBeenCalledTimes(0)

    // Get the flow from the new instance and verify it's still completed
    const newFlow = await newFrigade.getFlow(testFlowId)
    expect(newFlow.isCompleted).toBeTruthy()

    // Reset and complete the flow step again to verify the handler works for new completions
    await newFlow.restart()
    expect(newFlow.steps.get(testFlowStepId).$state.completed).toBeFalsy()
    await newFlow.steps.get(testFlowStepId).complete()
    expect(newFlow.steps.get(testFlowStepId).$state.completed).toBeTruthy()
    expect(newCallback).toHaveBeenCalledTimes(1)
  })
})

describe('Advanced Checklist integration test', () => {
  test('shows and hides steps based on visibilityCriteria', async () => {
    const frigade = new Frigade(testAPIKey, {})
    await frigade.identify(getRandomID())
    const flow = await frigade.getFlow(testFlowIdWithTargeting)
    // First step should not be visible
    expect(flow.getStepByIndex(0).$state.visible).toBeFalsy()
    // Current step ID should be the second step
    expect(flow.getCurrentStep().id).toEqual('step2')
    // Complete current step
    await flow.getCurrentStep().complete()
    // Current step index should be 2
    expect(flow.getCurrentStepIndex()).toEqual(2)
    // Reset the flow. Index should be back to 1
    await flow.restart()
    expect(flow.getCurrentStepIndex()).toEqual(1)
  })

  test('steps automatically complete and move the cursor forward based on completionCriteria', async () => {
    const userId = getRandomID()
    const frigade = new Frigade(testAPIKey, {
      userId: userId,
    })
    await frigade.identify(userId)
    let flow = await frigade.getFlow(testFlowIdWithTargeting)
    // await flow.getCurrentStep().complete()
    // Add the prop to the user `myProperty` = `myValue`
    await frigade.identify(userId, {
      testProp: true,
    })

    flow = await frigade.getFlow(testFlowIdWithTargeting)
    // get step by id
    const step = flow.steps.get('step3')
    expect(step).toBeDefined()

    // console.log(step.$state)
    // The step should be completed
    expect(step.$state.completed).toBeTruthy()
  })
})
