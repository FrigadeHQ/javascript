import { useFlow } from '../../hooks/useFlow'

import { Tooltip } from '../Tooltip'

export interface TourProps {
  flowId: string
}

export function Tour({ flowId }: TourProps) {
  const { flow, fetchFlow } = useFlow(flowId)

  // TODO: Add skipped state here as well
  if (flow == null || flow?.isCompleted) {
    return null
  }

  flow.start()

  const step = flow.getCurrentStep()

  // TEMP: Compute progress in the API / Frigade class instead of here
  const completeStepsCount = Array.from(flow.steps.values()).filter(
    // @ts-ignore - TODO: Get step typed to FlowStep
    (step) => step.isCompleted
  ).length

  step?.start()

  async function handleDismiss() {
    // TODO: Use flow.skip() once the js api supports it
    await flow.complete()

    // TEMP: Manually refreshing flow data until useFlow can handle it internally
    fetchFlow()
  }

  async function handlePrimary() {
    await step.complete()

    // TEMP: Manually refreshing flow data until useFlow can handle it internally
    fetchFlow()
  }

  return (
    <Tooltip
      align="after"
      anchor={step.selector}
      onDismiss={handleDismiss}
      onPointerDownOutside={(e) => e.preventDefault()}
      onPrimary={handlePrimary}
      // Secondary button also advances to next step
      onSecondary={handlePrimary}
      primaryButtonTitle={step.primaryButtonTitle}
      progress={`${completeStepsCount}/${flow.steps.size}`}
      subtitle={step.subtitle}
      title={step.title}
    />
  )
}
