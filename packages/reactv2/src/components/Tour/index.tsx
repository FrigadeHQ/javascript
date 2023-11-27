import { useFlow } from '../../hooks/useFlow'

import { Flex } from '../Flex/Flex'
import { Tooltip, TooltipProps } from '../Tooltip'

export interface TourProps extends TooltipProps {
  flowId: string
}

export function Tour({ flowId, ...props }: TourProps) {
  const { flow } = useFlow(flowId)

  if (flow == null || flow.isVisible === false) {
    return null
  }

  flow.start()

  const step = flow.getCurrentStep()
  step?.start()

  async function handleDismiss() {
    await flow.skip()
  }

  async function handlePrimary() {
    await step.complete()
  }

  const handleSecondary = handlePrimary

  return (
    <Tooltip
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

      <Flex.Row alignItems="center" gap={3} justifyContent="flex-end" part="tooltip-footer" pt={4}>
        <Tooltip.Progress>{`${step?.order + 1}/${flow.steps.size}`}</Tooltip.Progress>

        <Tooltip.Secondary
          marginLeft="auto"
          title={step.secondaryButtonTitle}
          onClick={handleSecondary}
        />
        <Tooltip.Primary title={step.primaryButtonTitle} onClick={handlePrimary} />
      </Flex.Row>
    </Tooltip>
  )
}
