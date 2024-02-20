import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Text } from '@/components/Text'

import { useFlowComponent } from '@/hooks/useFlowComponent'

import type { FlowComponentProps } from '@/shared/types'

export interface BannerProps extends FlowComponentProps {}

export function Banner(props: BannerProps) {
  const { FlowComponent } = useFlowComponent(props)

  return (
    <FlowComponent
      as={Card}
      border="md"
      borderColor="neutral.border"
      display="flex"
      flexDirection="row"
      gap={3}
      justifyContent="space-between"
    >
      {({ handleDismiss, handlePrimary, handleSecondary, step }) => (
        <>
          <Flex.Row gap={3}>
            {step.imageUri && (
              <img src={step.imageUri} style={{ height: 40, width: 40, alignSelf: 'center' }} />
            )}
            <Flex.Column>
              <Text.H4 mb={1}>{step.title}</Text.H4>
              <Text.Body2 color="gray500">{step.subtitle}</Text.Body2>
            </Flex.Column>
          </Flex.Row>

          <Flex.Row alignItems="center" gap={3} justifyContent="center">
            {step.secondaryButtonTitle && (
              <Button.Secondary title={step.secondaryButtonTitle} onClick={handleSecondary} />
            )}
            <Button.Primary title={step.primaryButtonTitle} onClick={handlePrimary} />
            {props.dismissible && <Card.Dismiss onClick={handleDismiss} />}
          </Flex.Row>
        </>
      )}
    </FlowComponent>
  )
}
