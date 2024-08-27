import { keyframes } from '@emotion/react'

import { Card } from '@/components/Card'
import { Hint } from '@/components/Hint'
import * as Progress from '@/components/Progress'

import { useStepHandlers } from '@/hooks/useStepHandlers'

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

// TODO: TourStep prop type

export function TourV2Step({
  align,
  alignOffset,
  defaultOpen,
  dismissible,
  flow,
  handleDismiss,
  onPrimary,
  onSecondary,
  part,
  side,
  sideOffset,
  spotlight,
  step,
}) {
  // TODO: Only render spotlight if current step

  const { handlePrimary, handleSecondary } = useStepHandlers(step, {
    onPrimary,
    onSecondary,
  })

  const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
  const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle
  const disabled = !!step.$state.blocked

  return (
    <Hint
      align={align}
      alignOffset={alignOffset}
      anchor={step.selector as string}
      data-step-id={step.id}
      defaultOpen={defaultOpen}
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
        <Card.Footer>
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
          <Card.Primary disabled={disabled} onClick={handlePrimary} title={primaryButtonTitle} />
        </Card.Footer>
      </Card>
    </Hint>
  )
}
