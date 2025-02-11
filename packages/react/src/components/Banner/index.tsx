import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import { Box } from '@/components/Box'

export interface BannerProps extends FlowPropsWithoutChildren {}

export function Banner({ flowId, ...props }: BannerProps) {
  return (
    <Flow as={null} flowId={flowId} {...props}>
      {({
        handleDismiss,
        handlePrimary,
        handleSecondary,
        parentProps: { containerProps, dismissible },
        step,
      }) => {
        const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
        const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle

        const disabled = step.$state.blocked

        return (
          <Card
            alignItems="center"
            aria-label="Banner"
            borderWidth="md"
            data-step-id={step.id}
            display="flex"
            flexDirection="row"
            gap={3}
            justifyContent="flex-start"
            part="banner"
            role="complementary"
            {...containerProps}
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

            <Card.Secondary
              disabled={disabled}
              title={secondaryButtonTitle}
              onClick={handleSecondary}
            />
            <Card.Primary disabled={disabled} title={primaryButtonTitle} onClick={handlePrimary} />
            {dismissible && <Card.Dismiss onClick={handleDismiss} />}
          </Card>
        )
      }}
    </Flow>
  )
}
