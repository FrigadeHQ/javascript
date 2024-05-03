import type { Flow, FlowStep } from '@frigade/js'

import { TourProps } from '.'
import { useFlowHandlers } from '@/hooks/useFlowHandlers'
import { useStepHandlers } from '@/hooks/useStepHandlers'

import { Flex } from '@/components/Flex'
import { Tooltip } from '@/components/Tooltip'

export interface TourStepProps extends Omit<TourProps, 'flowId'> {
  step: FlowStep
  flow: Flow
}

export function TourStep({
  dismissible = true,
  flow,
  onDismiss,
  onEscapeKeyDown,
  onPrimary,
  onSecondary,
  step,
  ...props
}: TourStepProps) {
  const { handleDismiss } = useFlowHandlers(flow, {
    onDismiss,
  })

  const { handlePrimary, handleSecondary } = useStepHandlers(step, {
    onPrimary,
    onSecondary,
  })

  const stepProps = step.props ?? {}

  const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
  const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle

  const disabled = step.$state.completed || step.$state.blocked ? true : false

  return (
    <Tooltip
      key={step.id}
      anchor={step.selector as string}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onPointerDownOutside={(e) => e.preventDefault()}
      onInteractOutside={(e) => e.preventDefault()}
      {...props}
      {...stepProps}
      onEscapeKeyDown={(e) => {
        if (typeof onEscapeKeyDown === 'function') {
          onEscapeKeyDown(e)
        }

        if (!e.defaultPrevented) {
          handleDismiss(e)
        }
      }}
    >
      {dismissible && <Tooltip.Close onClick={handleDismiss} />}

      <Tooltip.Media
        src={step.videoUri ?? step.imageUri}
        type={step.videoUri ? 'video' : 'image'}
      />

      <Flex.Column gap={1} part="tooltip-header">
        <Tooltip.Title>{step.title}</Tooltip.Title>
        <Tooltip.Subtitle color="neutral.400">{step.subtitle}</Tooltip.Subtitle>
      </Flex.Column>

      <Flex.Row alignItems="center" gap={3} justifyContent="flex-end" part="tooltip-footer">
        {flow.getNumberOfAvailableSteps() > 1 && (
          <Tooltip.Progress marginRight="auto" transform="translateY(1px)">{`${
            flow.getCurrentStepIndex() + 1
          }/${flow.getNumberOfAvailableSteps()}`}</Tooltip.Progress>
        )}

        <Tooltip.Secondary
          disabled={disabled}
          onClick={handleSecondary}
          title={secondaryButtonTitle}
        />
        <Tooltip.Primary disabled={disabled} onClick={handlePrimary} title={primaryButtonTitle} />
      </Flex.Row>
    </Tooltip>
  )
}
