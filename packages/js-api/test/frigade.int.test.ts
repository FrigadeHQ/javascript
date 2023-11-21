import { Frigade } from '../src'
import {
  COMPLETED_FLOW,
  generateGuestId,
  NOT_STARTED_FLOW,
  STARTED_FLOW,
} from '../src/shared/utils'
import { getRandomID } from './util'

const testAPIKey = 'api_public_3MPLH7NJ9L0U963XKW7BPE2IT137GC6L742JLC2XCT6NOIYSI4QUI9I1RA3ZOGIL'
const testFlowId = 'flow_yJfjksFrs5QEH0c8'
const testFlowStepId = 'checklist-step-one'

test('can init Frigade', async () => {
  const frigade = new Frigade(testAPIKey, {})
  const flows = await frigade.getFlows()
  expect(flows.length).toBeGreaterThan(0)
})

test('flows have fields set', async () => {
  const frigade = new Frigade(testAPIKey, {})
  const flows = await frigade.getFlows()
  expect(
    flows.filter((flow) => flow.id && flow.metadata && flow.metadata.type).length
  ).toBeGreaterThan(0)
  const flow = flows[0]
  flow.steps.forEach((step) => {
    expect(step.id).toBeDefined()
    expect(step.title).toBeDefined()
  })
})

test('read and set flow state', async () => {
  const frigade = new Frigade(testAPIKey, {
    userId: generateGuestId(),
  })
  const flow = await frigade.getFlow(testFlowId)
  expect(flow).toBeDefined()
  expect(flow.id).toEqual(testFlowId)
  expect(flow.isCompleted).toBeFalsy()
  await flow.complete()
  expect(flow.isCompleted).toBeTruthy()
})

test('read and set flow step state', async () => {
  const frigade = new Frigade(testAPIKey, {
    userId: generateGuestId(),
  })
  const flow = await frigade.getFlow(testFlowId)
  expect(flow).toBeDefined()
  expect(flow.id).toEqual(testFlowId)
  const step = flow.steps.get(testFlowStepId)
  expect(step).toBeDefined()
  expect(step.isCompleted).toBeFalsy()
  expect(step.isStarted).toBeFalsy()
  await step.start()
  expect(step.isStarted).toBeTruthy()
  await step.complete()
  expect(step.isCompleted).toBeTruthy()
})

test('handle flow event changes', async () => {
  const frigade = new Frigade(testAPIKey, {
    userId: getRandomID(),
  })

  const callback1 = jest.fn((flow, newState, previousState) => {
    expect(flow).toBeDefined()
    expect(flow.id).toEqual(testFlowId)
    expect(newState).toEqual(STARTED_FLOW)
    expect(previousState).toEqual(NOT_STARTED_FLOW)
  })
  frigade.onFlowStateChange(callback1)
  const flow = await frigade.getFlow(testFlowId)
  expect(flow).toBeDefined()
  expect(flow.id).toEqual(testFlowId)
  expect(flow.isCompleted).toBeFalsy()
  expect(callback1).toHaveBeenCalledTimes(0)
  await flow.getStepByIndex(0).complete()
  expect(flow.isCompleted).toBeFalsy()
  expect(callback1).toHaveBeenCalledTimes(1)
  frigade.removeOnFlowStateChangeHandler(callback1)

  const callback2 = jest.fn((flow, newState, previousState) => {
    expect(flow).toBeDefined()
    expect(flow.id).toEqual(testFlowId)
    expect(previousState).toEqual(STARTED_FLOW)
    expect(newState).toEqual(COMPLETED_FLOW)
  })
  frigade.onFlowStateChange(callback2)
  expect(callback2).toHaveBeenCalledTimes(0)
  await flow.complete()
  expect(flow.isCompleted).toBeTruthy()
  expect(callback2).toHaveBeenCalledTimes(1)
  frigade.removeOnFlowStateChangeHandler(callback2)
})

test('handle flow event changes unsubscribe', async () => {
  const frigade = new Frigade(testAPIKey, {
    userId: getRandomID(),
  })
  const callback = jest.fn(() => {})
  frigade.onFlowStateChange(callback)
  const flow = await frigade.getFlow(testFlowId)
  expect(flow).toBeDefined()
  expect(flow.id).toEqual(testFlowId)
  expect(flow.isCompleted).toBeFalsy()
  frigade.removeOnFlowStateChangeHandler(callback)
  await flow.complete()
  expect(flow.isCompleted).toBeTruthy()
  expect(callback).toHaveBeenCalledTimes(0)
})
