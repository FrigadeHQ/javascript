import { Dialog, type DialogProps } from '../Dialog'
import { Flex } from '../Flex/Flex'
import { type FlowComponentProps } from '../../shared/types'
import { useFlow } from '../../hooks/useFlow'
import { useFlowHandlers } from '../../hooks/useFlowHandlers'
import { useStepHandlers } from '@/hooks/useStepHandlers'

export interface AnncouncementProps extends FlowComponentProps, Omit<DialogProps, 'container'> {}

export function Announcement({
  dismissible = true,
  flowId,
  onComplete,
  onDismiss,
  onPrimary,
  onSecondary,
  variables,
  ...props
}: AnncouncementProps) {
  const { flow } = useFlow(flowId, {
    variables,
  })
  const step = flow?.getCurrentStep()

  const { handleDismiss } = useFlowHandlers(flow, {
    onComplete,
    onDismiss,
  })

  const { handlePrimary, handleSecondary } = useStepHandlers(step, {
    onPrimary,
    onSecondary,
  })

  if (flow == null || flow.isVisible === false) {
    return null
  }

  flow.start()

  step?.start()

  return (
    <Dialog {...props}>
      {dismissible && <Dialog.Close onClick={handleDismiss} />}

      <Dialog.Title>{step.title}</Dialog.Title>
      <Dialog.Subtitle>{step.subtitle}</Dialog.Subtitle>

      <Dialog.Media
        src={step.imageUri}
        css={{ aspectRatio: '1.5', objectFit: 'cover', width: '100%' }}
      />

      <Dialog.ProgressDots
        current={flow.getNumberOfCompletedSteps()}
        total={flow.getNumberOfAvailableSteps()}
      />

      <Flex.Row
        css={{
          '& > button': {
            flexGrow: 1,
          },
        }}
        gap={3}
      >
        <Dialog.Secondary title="Secondary" onClick={handleSecondary} />
        <Dialog.Primary title="Primary" onClick={handlePrimary} />
      </Flex.Row>
    </Dialog>
  )
}
