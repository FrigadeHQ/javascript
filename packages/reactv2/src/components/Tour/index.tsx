import { useFlow } from '../../hooks/useFlow'

import { Flex } from '../Flex/Flex'
import { Tooltip, TooltipProps } from '../Tooltip'

export interface TourProps extends TooltipProps {
  flowId: string
}

export function Tour({ flowId, ...props }: TourProps) {
  const { flow, fetchFlow } = useFlow(flowId)

  if (flow == null || flow?.isCompleted || flow?.isSkipped) {
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

  const handleSecondary = handlePrimary

  return (
    <Tooltip
      align="after"
      anchor={step.selector as string}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onPointerDownOutside={(e) => e.preventDefault()}
      {...props}
    >
      <Tooltip.Close onClick={handleDismiss} />

      <Tooltip.Media
        src={step.videoUri ?? step.imageUri}
        type={step.videoUri ? 'video' : 'image'}
      />

      <Tooltip.Title>{step.title}</Tooltip.Title>
      <Tooltip.Subtitle>{step.subtitle}</Tooltip.Subtitle>

      <Flex.Row pt={4} alignItems="center" justifyContent="space-between">
        <Tooltip.Progress>
          {`${flow.getNumberOfCompletedSteps()}/${flow.steps.size}`}
        </Tooltip.Progress>

        <Flex.Row gap={3}>
          <Tooltip.Secondary title={step.secondaryButtonTitle} onClick={handleSecondary} />
          <Tooltip.Primary title={step.primaryButtonTitle} onClick={handlePrimary} />
        </Flex.Row>
      </Flex.Row>
    </Tooltip>
  )
}
