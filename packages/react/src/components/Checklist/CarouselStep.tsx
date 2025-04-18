import type { FlowStep } from '@frigade/js'
import { LockClosedIcon } from '@/components/Icon/LockClosedIcon'

import { Box } from '@/components/Box'
import { CheckIndicator } from '@/components/CheckIndicator'
import { Flex } from '@/components/Flex'
import { Card } from '@/components/Card'

import { type StepHandlerProp, useStepHandlers } from '@/hooks/useStepHandlers'

interface CarouselStepProps {
  onPrimary: StepHandlerProp
  onSecondary: StepHandlerProp
  step: FlowStep
}

export function CarouselStep({ onPrimary, onSecondary, step }: CarouselStepProps) {
  const { handlePrimary, handleSecondary } = useStepHandlers(step, { onPrimary, onSecondary })

  const { blocked, completed, skipped } = step.$state

  const topRightIcon =
    // TODO: Consider adding a specific UI state for Skipped
    completed || skipped || !blocked ? (
      <CheckIndicator checked={completed || skipped} marginLeft="auto" />
    ) : (
      <Box as={LockClosedIcon} height="22px" marginLeft="auto" width="22px" />
    )

  return (
    <Card
      borderWidth={1}
      containerType="inline-size"
      css={{
        '@container (max-width: 600px)': {
          flexBasis: '85%',
        },
        '@container (min-width: 601px) and (max-width: 900px)': {
          flexBasis: '45%',
        },
        '@container (min-width: 1200px)': {
          flexBasis: '25%',
        },
      }}
      data-step-id={step.id}
      flex="0 0 30%"
      gap="2"
      p="4"
      part="carousel-step"
      userSelect="none"
      disabled={blocked}
      opacity={blocked ? 0.5 : 1}
    >
      <Flex.Row marginBottom="2" part="carousel-step-header">
        {step.iconUri && (
          <Card.Media borderRadius="0" height="24px" src={step.iconUri} width="24px" />
        )}
        {topRightIcon}
      </Flex.Row>
      <Card.Title>{step.title}</Card.Title>
      <Card.Subtitle>{step.subtitle}</Card.Subtitle>

      <Flex.Row
        css={{
          '@container (max-width: 200px)': {
            '& > button': {
              flexBasis: '50%',
              flexGrow: 1,
            },

            flexDirection: 'column-reverse',
          },
        }}
        gap="2"
        marginTop="auto"
        paddingTop="3"
        part="carousel-step-footer"
      >
        <Card.Secondary
          disabled={blocked}
          onClick={handleSecondary}
          title={step.secondaryButton?.title}
        />
        <Card.Primary
          disabled={blocked}
          onClick={handlePrimary}
          title={step.primaryButton?.title}
        />
      </Flex.Row>
    </Card>
  )
}
