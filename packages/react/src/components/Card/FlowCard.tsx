import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow, type FlowProps } from '@/components/Flow'

export function FlowCard({ part, ...props }: FlowProps) {
  return (
    <Flow
      as={Card}
      gap={5}
      padding={4}
      borderColor="neutral.border"
      borderStyle="solid"
      borderWidth="md"
      part={['card', part]}
      {...props}
    >
      {({ handleDismiss, handlePrimary, handleSecondary, parentProps: { dismissible }, step }) => {
        const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
        const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle

        return (
          <>
            <Card.Header
              dismissible={dismissible}
              handleDismiss={handleDismiss}
              subtitle={step.subtitle}
              title={step.title}
            />

            <Card.Media src={step.imageUri} css={{ objectFit: 'contain', width: '100%' }} />

            <Flex.Row gap={3} justifyContent="flex-start" part="card-footer">
              <Card.Primary title={primaryButtonTitle} onClick={handlePrimary} />
              <Card.Secondary title={secondaryButtonTitle} onClick={handleSecondary} />
            </Flex.Row>
          </>
        )
      }}
    </Flow>
  )
}
