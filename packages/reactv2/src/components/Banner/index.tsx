import { BoxProps } from '../Box'
import { Button } from '../Button'
import { Card } from '../Card'
import { Flex } from '../Flex/Flex'
import { Text } from '../Text'

import { XMarkIcon } from '@heroicons/react/24/solid'

import { useFlow } from '../../hooks/useFlow'
import { FlowHandler, useFlowHandlers } from '../../hooks/useFlowHandlers'
import { StepHandler, useStepHandlers } from '../../hooks/useStepHandlers'

interface BannerProps extends BoxProps {
  flowId: string
  onComplete?: FlowHandler
  onDismiss?: FlowHandler
  onPrimary?: StepHandler
  onSecondary?: StepHandler
}

export function Banner({
  flowId,
  onComplete,
  onDismiss,
  onPrimary,
  onSecondary,
  ...props
}: BannerProps) {
  const { flow } = useFlow(flowId)
  const step = flow?.getCurrentStep()

  const { handleDismiss } = useFlowHandlers(flow, { onComplete, onDismiss })
  const { handlePrimary, handleSecondary } = useStepHandlers(step, { onPrimary, onSecondary })

  if (flow == null || flow.isVisible === false) {
    return null
  }

  flow.start()
  step?.start()

  return (
    <Card as={Flex.Row} border="md" borderColor="gray900" justifyContent="space-between" {...props}>
      <Flex.Row gap={3}>
        <img src={step.imageUri} style={{ height: 40, width: 40, alignSelf: 'center' }} />
        <Flex.Column>
          <Text.H4 mb={1}>{step.title}</Text.H4>
          <Text.Body2>{step.subtitle}</Text.Body2>
        </Flex.Column>
      </Flex.Row>

      <Flex.Row alignItems="center" gap={3}>
        <Button.Secondary title={step.secondaryButtonTitle} onClick={handleSecondary} />
        <Button.Primary title={step.primaryButtonTitle} onClick={handlePrimary} />
        <Button.Plain part="banner-close" onClick={handleDismiss}>
          <XMarkIcon height="24" fill="currentColor" />
        </Button.Plain>
      </Flex.Row>
    </Card>
  )
}
