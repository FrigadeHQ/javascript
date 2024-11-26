import { Dialog, type DialogProps } from '@/components/Dialog'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'

import { getVideoProps } from '@/components/Media/videoProps'

export interface AnnouncementProps extends FlowPropsWithoutChildren, DialogProps {
  /**
   * @ignore
   */
  children?: React.ReactNode
  /**
   * @ignore
   */
  open?: boolean
  /**
   * @ignore
   */
  defaultOpen?: boolean
}

export function Announcement({ flowId, part, ...props }: AnnouncementProps) {
  return (
    <Flow
      as={Dialog}
      display="flex"
      flexDirection="column"
      flowId={flowId}
      gap={5}
      part={['announcement', part]}
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
        const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
        const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle

        const disabled = step.$state.blocked

        const { videoProps } = getVideoProps(step.props ?? {})

        return (
          <>
            {dismissible && <Dialog.Dismiss onClick={handleDismiss} />}
            <Flex.Column gap={1} part="announcement-header">
              <Dialog.Title>{step.title}</Dialog.Title>
              <Dialog.Subtitle>{step.subtitle}</Dialog.Subtitle>
            </Flex.Column>

            <Dialog.Media
              aspectRatio="1.5"
              objectFit="cover"
              overflowClipMargin="unset"
              src={step.videoUri ?? step.imageUri}
              transform="translate3d(0, 0, 1px)"
              type={step.videoUri ? 'video' : 'image'}
              width="100%"
              {...videoProps}
            />

            <Dialog.ProgressDots
              current={flow.getCurrentStepIndex()}
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
              {secondaryButtonTitle && (
                <Dialog.Secondary
                  disabled={disabled}
                  onClick={handleSecondary}
                  title={secondaryButtonTitle}
                />
              )}
              {primaryButtonTitle && (
                <Dialog.Primary
                  disabled={disabled}
                  onClick={handlePrimary}
                  title={primaryButtonTitle}
                />
              )}
            </Flex.Row>
          </>
        )
      }}
    </Flow>
  )
}
