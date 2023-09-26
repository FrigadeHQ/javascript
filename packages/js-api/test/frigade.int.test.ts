import frigade from '../src/core/frigade'
import { generateGuestId } from '../src/shared/utils'

const testAPIKey = 'api_public_3MPLH7NJ9L0U963XKW7BPE2IT137GC6L742JLC2XCT6NOIYSI4QUI9I1RA3ZOGIL'
const testFlowId = 'flow_E38do46lrNWEbVa7'
const testFlowStepId = 'welcome'

test('can init Frigade', async () => {
  await frigade.init(testAPIKey, {})
  const flows = await frigade.getFlows()
  expect(flows.length).toBeGreaterThan(0)
})

test('flows have fields set', async () => {
  await frigade.init(testAPIKey, {})
  const flows = await frigade.getFlows()
  expect(
    flows.filter((flow) => flow.id && flow.metadata && flow.metadata.type).length
  ).toBeGreaterThan(0)
})

test('read and set flow state', async () => {
  await frigade.init(testAPIKey, {
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
  await frigade.init(testAPIKey, {
    userId: generateGuestId(),
  })
  const flow = await frigade.getFlow(testFlowId)
  expect(flow).toBeDefined()
  expect(flow.id).toEqual(testFlowId)
  expect(flow.getCurrentStepIndex()).toEqual(0)
  const step = flow.steps.find((step) => step.id == testFlowStepId)
  expect(flow.steps.find((step) => step.id == testFlowStepId)).toBeDefined()
  expect(step.isCompleted).toBeFalsy()
  expect(step.isStarted).toBeFalsy()
  await step.start()
  expect(step.isStarted).toBeTruthy()
  await step.complete()
  expect(step.isCompleted).toBeTruthy()
})
