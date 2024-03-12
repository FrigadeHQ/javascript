import { Dialog, type DialogProps } from '@/components/Dialog'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'

export interface AnnouncementProps extends FlowPropsWithoutChildren, DialogProps {}

export function Announcement({ flowId, ...props }: AnnouncementProps) {
  return (
    <Flow
      as={Dialog}
      dismissible={true}
      flowId={flowId}
      part="announcement"
      textAlign="center"
      {...props}
    >
      {({
        flow,
        handleDismiss,
        handlePrimary,
        handleSecondary,
        parentProps: { dismissible },
        step,
      }) => {
        const stepProps = step.props ?? {}

        return (
          <Flex.Column gap={5} part="announcement-step" {...stepProps}>
            {dismissible && <Dialog.Dismiss onClick={handleDismiss} />}
            <Flex.Column gap={1} part="announcement-header">
              <Dialog.Title>{step.title}</Dialog.Title>
              <Dialog.Subtitle>{step.subtitle}</Dialog.Subtitle>
            </Flex.Column>

            <Dialog.Media
              src={step.videoUri ?? step.imageUri}
              type={step.videoUri ? 'video' : 'image'}
              css={{ aspectRatio: '1.5', objectFit: 'cover', width: '100%' }}
            />

            <Dialog.ProgressDots
              current={flow.getNumberOfCompletedSteps()}
              total={flow.getNumberOfAvailableSteps()}
            />

            <Flex.Row
              css={{
                '& > button': {
                  flexBasis: '50%',
                  flexGrow: 1,
                },
              }}
              gap={3}
              part="announcement-footer"
            >
              {step.secondaryButtonTitle && (
                <Dialog.Secondary onClick={handleSecondary} title={step.secondaryButtonTitle} />
              )}
              {step.primaryButtonTitle && (
                <Dialog.Primary
                  onClick={handlePrimary}
                  title={step.primaryButtonTitle ?? 'Continue'}
                />
              )}
            </Flex.Row>
          </Flex.Column>
        )
      }}
    </Flow>
  )
}
