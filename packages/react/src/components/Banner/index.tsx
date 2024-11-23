import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import { Box } from '@/components/Box'

export interface BannerProps extends FlowPropsWithoutChildren {}

export function Banner({ dismissible, flowId, part, ...props }: BannerProps) {
  return (
    <Flow
      alignItems="center"
      aria-label="Banner"
      as={Card}
      borderWidth="md"
      display="flex"
      flexDirection="row"
      flowId={flowId}
      gap={3}
      justifyContent="flex-start"
      part={['banner', part]}
      role="complementary"
      {...props}
    >
      {({ handleDismiss, handlePrimary, handleSecondary, step }) => {
        const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
        const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle

        const disabled = step.$state.blocked

        return (
          <>
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
          </>
        )
      }}
    </Flow>
  )
}
