import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow, type FlowProps } from '@/components/Flow'

import { getVideoProps } from '@/components/Media/videoProps'

export function FlowCard({ part, ...props }: FlowProps) {
  return (
    <Flow
      as={Card}
      gap={5}
      borderColor="neutral.border"
      borderStyle="solid"
      borderWidth="md"
      part={['card', part]}
      {...props}
    >
      {({ handleDismiss, handlePrimary, handleSecondary, parentProps: { dismissible }, step }) => {
        const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
        const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle

        const { videoProps } = getVideoProps(step.props ?? {})

        return (
          <>
            <Card.Header
              dismissible={dismissible}
              handleDismiss={handleDismiss}
              subtitle={step.subtitle}
              title={step.title}
            />

            <Card.Media
              src={step.videoUri ?? step.imageUri}
              type={step.videoUri ? 'video' : 'image'}
              css={{ objectFit: 'contain', width: '100%' }}
              {...videoProps}
            />

            <Flex.Row gap={3} justifyContent="flex-end" part="card-footer">
              <Card.Secondary title={secondaryButtonTitle} onClick={handleSecondary} />
              <Card.Primary title={primaryButtonTitle} onClick={handlePrimary} />
            </Flex.Row>
          </>
        )
      }}
    </Flow>
  )
}
