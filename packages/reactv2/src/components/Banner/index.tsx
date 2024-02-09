import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Text } from '@/components/Text'

import { XMarkIcon } from '@heroicons/react/24/solid'

import { useFlowComponent } from '@/hooks/useFlowComponent'

import type { FlowComponentProps } from '@/shared/types'

interface BannerProps extends FlowComponentProps {}

export function Banner(props: BannerProps) {
  const { FlowComponent } = useFlowComponent(props)

  return (
    <FlowComponent
      as={Card}
      border="md"
      borderColor="gray900"
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
              <Text.Body2>{step.subtitle}</Text.Body2>
            </Flex.Column>
          </Flex.Row>

          <Flex.Row alignItems="center" gap={3} justifyContent="center">
            {step.secondaryButtonTitle && (
              <Button.Secondary title={step.secondaryButtonTitle} onClick={handleSecondary} />
            )}
            <Button.Primary title={step.primaryButtonTitle} onClick={handlePrimary} />
            {props.dismissible && props.container != 'dialog' && (
              <Button.Plain part="banner-close" onClick={handleDismiss}>
                <XMarkIcon height="24" fill="currentColor" />
              </Button.Plain>
            )}
          </Flex.Row>
        </>
      )}
    </FlowComponent>
  )
}
