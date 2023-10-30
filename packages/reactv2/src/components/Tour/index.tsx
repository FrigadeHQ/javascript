import { useFlow } from '../../hooks/useFlow'

import { Tooltip } from '../Tooltip'

export interface TourProps {
  flowId: string
}

export function Tour({ flowId }: TourProps) {
  const { flow, fetchFlow } = useFlow(flowId)

  // TODO: Don't render if the flow is complete (or skipped too?)
  if (flow == null || flow?.isCompleted) {
    return null
  }

  // TODO: Mark flow as started if not started already

  // TODO: Why is this not returning the second tooltip step? The first says COMPLETED_STEP in the API :thinking:
  const step = flow.getCurrentStep()

  // TEMP: Compute progress in the API / Frigade class instead of here
  const completeStepsCount = Array.from(flow.steps.values()).filter(
    // @ts-ignore - TODO: Get step typed to FlowStep
    (step) => step.isCompleted
  ).length

  if (!step.isStarted && !step.isCompleted) {
    step?.start()
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
      onPrimary={handlePrimary}
      primaryButtonTitle={step.primaryButtonTitle}
      progress={`${completeStepsCount}/${Array.from(flow.steps.keys()).length}`}
      subtitle={step.subtitle}
      title={step.title}
    />
  )
}
