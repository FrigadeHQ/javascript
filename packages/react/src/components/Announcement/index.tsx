import { Dialog, type DialogProps } from '@/components/Dialog'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'

export interface AnnouncementProps extends FlowPropsWithoutChildren, DialogProps {
  /**
   * @ignore
   */
  children: React.ReactNode
  /**
   * @ignore
   */
  open?: boolean
  /**
   * @ignore
   */
  defaultOpen?: boolean
}

const flowPropNames = [
  'dismissible',
  'flowId',
  'forceMount',
  'onComplete',
  'onDismiss',
  'onPrimary',
  'onSecondary',
  'variables',
]

export function Announcement({ flowId, ...props }: AnnouncementProps) {
  const flowProps = Object.fromEntries(
    Object.entries(props).filter(([k]) => flowPropNames.some((name) => k === name))
  )
  const dialogProps = Object.fromEntries(
    Object.entries(props).filter(([k]) => flowPropNames.indexOf(k) === -1)
  )

  return (
    <Flow as={null} flowId={flowId} {...flowProps}>
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
          <Dialog
            part="announcement"
            textAlign="center"
            {...dialogProps}
            onEscapeKeyDown={(e) => {
              if (typeof props.onEscapeKeyDown === 'function') {
                props.onEscapeKeyDown(e)
              }

              if (!e.defaultPrevented) {
                handleDismiss(e)
              }
            }}
          >
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
          </Dialog>
        )
      }}
    </Flow>
  )
}
