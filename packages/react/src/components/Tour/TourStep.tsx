import { keyframes } from '@emotion/react'

import { Card } from '@/components/Card'
import type { FlowProps, FlowChildrenProps } from '@/components/Flow'
import { Hint, type HintProps } from '@/components/Hint'
import * as Progress from '@/components/Progress'

import { useStepHandlers } from '@/hooks/useStepHandlers'

import { VIDEO_PROP_NAMES } from '@/components/Media/videoPropNames'

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

export interface TourStepProps
  extends Omit<HintProps, 'anchor'>,
    Pick<FlowProps, 'dismissible' | 'onPrimary' | 'onSecondary'>,
    Pick<FlowChildrenProps, 'flow' | 'handleDismiss' | 'step'> {}

export function TourStep({
  align,
  alignOffset,
  autoScroll,
  defaultOpen,
  dismissible,
  flow,
  handleDismiss,
  modal,
  onPrimary,
  onSecondary,
  part,
  side,
  sideOffset,
  spotlight,
  step,
  ...props
}: TourStepProps) {
  const { handlePrimary, handleSecondary } = useStepHandlers(step, {
    onPrimary,
    onSecondary,
  })

  const mediaProps = {}
  const hintProps = {}

  for (const [propName, propValue] of Object.entries(props)) {
    if (VIDEO_PROP_NAMES.some((name) => name === propName)) {
      mediaProps[propName] = propValue
    } else {
      hintProps[propName] = propValue
    }
  }

  const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
  const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle
  const disabled = !!step.$state.blocked

  return (
    <Hint
      align={align}
      alignOffset={alignOffset}
      anchor={step.selector as string}
      autoScroll={autoScroll}
      data-step-id={step.id}
      defaultOpen={defaultOpen}
      modal={modal}
      part={part}
      side={side}
      sideOffset={sideOffset}
      spotlight={spotlight}
      {...hintProps}
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
          {...mediaProps}
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
