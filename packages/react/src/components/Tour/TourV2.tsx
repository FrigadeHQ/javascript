import { keyframes } from '@emotion/react'

import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import { Hint, type HintProps } from '@/components/Hint'

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
  flowId,
  side = 'bottom',
  sideOffset = 0,
}: TourProps) {
  return (
    <Flow flowId={flowId}>
      {({ step }) => {
        const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
        const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle

        const stepProps = step.props ?? {}

        const disabled = step.$state.blocked ? true : false

        return (
          <Hint
            align={align}
            alignOffset={alignOffset}
            anchor={step.selector as string}
            side={side}
            sideOffset={sideOffset}
          >
            <Card animation={`${fadeIn} 300ms ease-out`} boxShadow="md">
              <Card.Header subtitle={step.subtitle} title={step.title} />
              <Flex.Row gap={3} justifyContent="flex-end">
                <Card.Secondary title={secondaryButtonTitle} />
                <Card.Primary title={primaryButtonTitle} />
              </Flex.Row>
            </Card>
          </Hint>
        )
      }}
    </Flow>
  )
}
