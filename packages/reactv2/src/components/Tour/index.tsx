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

  step?.start()

  async function handleDismiss() {
    await flow.skip()

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
      progress={`${flow.getNumberOfCompletedSteps()}/${flow.steps.size}`}
      subtitle={step.subtitle}
      title={step.title}
    />
  )

  /*
    return (
      <Tooltip
        align="after"
        anchor={step.selector}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <Tooltip.Close onClick={handleDismiss} />

        <Tooltip.Media src="" />

        <Tooltip.Title>{step.title}</Tooltip.Title>
        <Tooltip.Subtitle>{step.subtitle}</Tooltip.Subtitle>

        <Flex.Row justifyContent='space-between'>
          <Tooltip.Progress>{`${flow.getNumberOfCompletedSteps()}/${flow.steps.size}`}</Tooltip.Progress>
          <Tooltip.Secondary title={step.secondaryButtonTitle} onClick={handleSecondary} />
          <Tooltip.Primary title={step.primaryButtonTitle} onClick={handlePrimary} />
        </Flex.Row>
      </Tooltip>
    )
  */
}
