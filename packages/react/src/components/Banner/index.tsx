import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import { Text } from '@/components/Text'
import { Box } from '@/components/Box'

export interface BannerProps extends FlowPropsWithoutChildren {}

export function Banner({ flowId, ...props }: BannerProps) {
  return (
    <Flow as={Card} borderWidth="md" flowId={flowId} part="banner" {...props}>
      {({ handleDismiss, handlePrimary, handleSecondary, step }) => {
        const stepProps = step.props ?? {}

        return (
          <Box
            display="flex"
            flexDirection="row"
            gap={3}
            justifyContent="space-between"
            part="banner-step"
            {...stepProps}
          >
            <Flex.Row gap={3}>
              {step.imageUri && (
                <Box
                  as="img"
                  part="image"
                  src={step.imageUri}
                  style={{ height: 40, width: 40, alignSelf: 'center' }}
                />
              )}
              <Flex.Column>
                <Text.H4 part="title">{step.title}</Text.H4>
                <Text.Body2 part="subtitle">{step.subtitle}</Text.Body2>
              </Flex.Column>
            </Flex.Row>

            <Flex.Row alignItems="center" gap={3} justifyContent="center">
              {step.secondaryButtonTitle && (
                <Button.Secondary title={step.secondaryButtonTitle} onClick={handleSecondary} />
              )}
              <Button.Primary title={step.primaryButtonTitle} onClick={handlePrimary} />
              {props.dismissible && <Card.Dismiss onClick={handleDismiss} />}
            </Flex.Row>
          </Box>
        )
      }}
    </Flow>
  )
}
