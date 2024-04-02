import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import { Box } from '@/components/Box'

export interface BannerProps extends FlowPropsWithoutChildren {}

export function Banner({ dismissible, flowId, ...props }: BannerProps) {
  return (
    <Flow as={null} flowId={flowId}>
      {({ handleDismiss, handlePrimary, handleSecondary, step }) => {
        const stepProps = step.props ?? {}

        const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
        const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle

        return (
          <Card
            alignItems="center"
            borderWidth="md"
            display="flex"
            flexDirection="row"
            gap={3}
            justifyContent="flex-start"
            part="banner"
            {...props}
            {...stepProps}
          >
            {step.imageUri && (
              <Box
                as="img"
                part="image"
                src={step.imageUri}
                style={{ height: 40, width: 40, alignSelf: 'center' }}
              />
            )}

            <Flex.Column marginInlineEnd="auto" part="banner-title-wrapper">
              <Card.Title part="title">{step.title}</Card.Title>
              <Card.Subtitle part="subtitle">{step.subtitle}</Card.Subtitle>
            </Flex.Column>

            <Card.Secondary title={secondaryButtonTitle} onClick={handleSecondary} />
            <Card.Primary title={primaryButtonTitle} onClick={handlePrimary} />
            {dismissible && <Card.Dismiss onClick={handleDismiss} />}
          </Card>
        )
      }}
    </Flow>
  )
}
