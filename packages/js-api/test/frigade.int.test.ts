import { FlowStep, Frigade } from '../src'
import { getRandomID } from './util'
import { Flow } from '../src/.'

const testAPIKey = 'api_public_3MPLH7NJ9L0U963XKW7BPE2IT137GC6L742JLC2XCT6NOIYSI4QUI9I1RA3ZOGIL'
const testFlowId = 'flow_yJfjksFrs5QEH0c8'
const testFlowStepId = 'checklist-step-one'

describe('SDK integration test', () => {
  test('can init Frigade', async () => {
    const frigade = new Frigade(testAPIKey, {})
    const flows = await frigade.getFlows()
    expect(flows.length).toBeGreaterThan(0)
  })

  test('flows have fields set', async () => {
    const frigade = new Frigade(testAPIKey, {})
    const flows = await frigade.getFlows()

    expect(
      flows.filter((flow) => flow.id && flow.isVisible && flow.rawData.flowType).length
    ).toBeGreaterThan(0)
    const flow = flows[0]
    flow.steps.forEach((step) => {
      expect(step.id).toBeDefined()
      expect(step.title).toBeDefined()
    })
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
      __flowConfigOverrides: {
        [madeUpFlowId]: JSON.stringify({
          steps: [
            {
              id: 'step-one',
              title: 'Some step',
            },
            {
              id: 'step-two',
              title: 'Some step',
            },
          ],
        }),
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
    expect(flow.steps.get('step-two').$state.started).toBeTruthy()
    expect(flow.getCurrentStepIndex()).toEqual(1)
    await flow.complete()
    expect(flow.isCompleted).toBeTruthy()
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
    const frigade = new Frigade(testAPIKey, {
      userId,
    })
    const flow = await frigade.getFlow(testFlowId)
    expect(flow).toBeDefined()
    expect(flow.id).toEqual(testFlowId)
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
    frigade.onStateChange(callback2)
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
    expect(callback).toHaveBeenCalledTimes(1)
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
    expect(flow.getStepByIndex(0).subtitle).toContain('${email}')
    expect(flow.getStepByIndex(0).subtitle).toContain('${name}')
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
    const frigade = new Frigade(testAPIKey, {
      userId,
    })
    const flow = await frigade.getFlow(testFlowId)
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
})
