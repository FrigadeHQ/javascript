import { Dialog, type DialogProps } from '../Dialog'
import { Flex } from '../Flex'
import { type FlowComponentProps } from '@/shared/types'
import { useFlowComponent } from '@/hooks/useFlowComponent'

export interface AnnouncementProps extends FlowComponentProps, Omit<DialogProps, 'container'> {}

export function Announcement(props: AnnouncementProps) {
  // TODO: Make Dialog subcomponents agnostic once Card is fleshed out, remove forced container='dialog'
  const { FlowComponent } = useFlowComponent({ ...props, container: 'dialog' })

  return (
    <FlowComponent>
      {({ flow, handlePrimary, handleSecondary, step }) => (
        <>
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
                flexGrow: 1,
              },
            }}
            gap={3}
            part="announcement-footer"
          >
            {step.secondaryButtonTitle && (
              <Dialog.Secondary title={step.secondaryButtonTitle} onClick={handleSecondary} />
            )}
            <Dialog.Primary title={step.primaryButtonTitle ?? 'Continue'} onClick={handlePrimary} />
          </Flex.Row>
        </>
      )}
    </FlowComponent>
  )
}
