import { keyframes } from '@emotion/react'

import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import { Hint, type HintProps } from '@/components/Hint'
import * as Progress from '@/components/Progress'

export interface TourProps extends FlowPropsWithoutChildren, HintProps {
  sequential?: boolean
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  25% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export function TourV2({
  align = 'after',
  alignOffset = 0,
  as = null,
  dismissible = true,
  flowId,
  part,
  side = 'bottom',
  sideOffset = 0,
  spotlight,
  ...props
}: TourProps) {
  return (
    <Flow as={as} flowId={flowId} {...props}>
      {({ flow, handleDismiss, handlePrimary, handleSecondary, step }) => {
        const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
        const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle
        const disabled = !!step.$state.blocked

        // const stepProps = step.props ?? {}

        return (
          <Hint
            align={align}
            alignOffset={alignOffset}
            anchor={step.selector as string}
            data-flow-id={flow.id}
            data-step-id={step.id}
            part={part}
            side={side}
            sideOffset={sideOffset}
            spotlight={spotlight}
          >
            <Card
              animation={`${fadeIn} 300ms ease-out`}
              boxShadow="md"
              maxWidth="min(360px, calc(100vw - 25px))"
            >
              <Card.Media
                aspectRatio="2"
                borderRadius="md md 0 0"
                borderWidth="0"
                margin="-5 -5 0"
                objectFit="cover"
                overflowClipMargin="unset"
                src={step.videoUri ?? step.imageUri}
                transform="translate3d(0, 0, 1px)"
                type={step.videoUri ? 'video' : 'image'}
              />

              <Card.Header
                css={{
                  '.fr-dismiss': {
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                  },
                }}
                dismissible={dismissible}
                handleDismiss={handleDismiss}
                subtitle={step.subtitle}
                title={step.title}
              />
              <Flex.Row alignItems="center" gap={3} justifyContent="flex-end">
                {flow.getNumberOfAvailableSteps() > 1 && (
                  <Progress.Fraction
                    current={flow.getCurrentStepOrder() + 1}
                    marginRight="auto"
                    total={flow.getNumberOfAvailableSteps()}
                  />
                )}
                <Card.Secondary
                  disabled={disabled}
                  onClick={handleSecondary}
                  title={secondaryButtonTitle}
                />
                <Card.Primary
                  disabled={disabled}
                  onClick={handlePrimary}
                  title={primaryButtonTitle}
                />
              </Flex.Row>
            </Card>
          </Hint>
        )
      }}
    </Flow>
  )
}
