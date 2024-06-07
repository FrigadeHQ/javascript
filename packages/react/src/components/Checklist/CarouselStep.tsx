import type { FlowStep } from '@frigade/js'

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

  const disabled = step.$state.completed || step.$state.blocked ? true : false

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
      flex="0 0 30%"
      gap="2"
      p="4"
      part="carousel-step"
      userSelect="none"
    >
      <Flex.Row justifyContent="space-between" part="carousel-step-header">
        <Card.Title>{step.title}</Card.Title>
        <CheckIndicator checked={step.$state.completed} />
      </Flex.Row>
      <Card.Subtitle>{step.subtitle}</Card.Subtitle>
      <Flex.Row
        css={{
          '& > button': {
            flexBasis: '50%',
            flexGrow: 1,
          },

          '@container (max-width: 200px)': {
            flexDirection: 'column-reverse',
          },
        }}
        gap="2"
        marginTop="auto"
        paddingTop="3"
        part="carousel-step-footer"
      >
        <Card.Secondary
          disabled={disabled}
          onClick={handleSecondary}
          title={step.secondaryButton?.title}
        />
        <Card.Primary
          disabled={disabled}
          onClick={handlePrimary}
          title={step.primaryButton?.title}
        />
      </Flex.Row>
    </Card>
  )
}