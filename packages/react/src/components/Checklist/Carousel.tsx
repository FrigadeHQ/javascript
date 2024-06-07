import { keyframes } from '@emotion/react'
import { useLayoutEffect, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import useEmblaCarousel from 'embla-carousel-react'

import { Box } from '@/components/Box'
import { Button } from '@/components/Button'
import { Flex } from '@/components/Flex'
import { Card } from '@/components/Card'
import { Flow, FlowChildrenProps, type FlowProps } from '@/components/Flow'
import * as Progress from '@/components/Progress'
import { Text } from '@/components/Text'

import { CarouselStep } from '@/components/Checklist/CarouselStep'

import { theme } from '@/shared/theme'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export function Carousel({ ...props }: FlowProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    container: '.fr-carousel-content',
    containScroll: 'trimSnaps',
    skipSnaps: true,
    slides: '.fr-carousel-step',
  })
  const [hasNext, setHasNext] = useState<boolean>()
  const [hasPrev, setHasPrev] = useState<boolean>()

  useLayoutEffect(() => {
    if (!emblaApi) return

    if (hasNext == null) {
      setHasNext(emblaApi.canScrollNext())
    }

    if (hasPrev == null) {
      setHasPrev(emblaApi.canScrollPrev())
    }

    emblaApi.on('select', () => {
      setHasNext(emblaApi.canScrollNext())
      setHasPrev(emblaApi.canScrollPrev())
    })
  }, [emblaApi])

  return (
    <Flow as={Card} borderWidth={1} containerType="inline-size" p="4" part="carousel" {...props}>
      {({ flow }: FlowChildrenProps) => {
        const currentSteps = flow.getNumberOfCompletedSteps()
        const availableSteps = flow.getNumberOfAvailableSteps()

        return (
          <>
            <Flex.Row
              css={{
                '@container (max-width: 750px)': {
                  flexDirection: 'column',
                  gap: theme.space[5],
                },
              }}
              justifyContent="space-between"
              part="carousel-header"
            >
              <Flex.Column part="carousel-header-content">
                <Text.H3>{flow.title}</Text.H3>
                <Text.Body2 color="neutral.400">{flow.subtitle}</Text.Body2>
              </Flex.Column>
              <Flex.Row alignItems="center" gap={2} part="progress">
                <Text.Body2 fontWeight="demibold" part="progress-text">
                  {currentSteps}/{availableSteps}
                </Text.Body2>
                <Progress.Bar current={currentSteps} total={availableSteps} minWidth="200px" />
              </Flex.Row>
            </Flex.Row>

            <Box
              margin={`0 ${theme.space[-4]}`}
              overflow="hidden"
              part="carousel-wrapper"
              px="5"
              position="relative"
              ref={emblaRef}
            >
              <Flex.Row gap={4} part="carousel-content">
                {Array.from(flow.steps.values()).map((step) => (
                  <CarouselStep
                    key={step.id}
                    onPrimary={props.onPrimary}
                    onSecondary={props.onSecondary}
                    step={step}
                  />
                ))}
              </Flex.Row>

              {hasPrev && (
                <Flex.Column
                  animation={`${fadeIn} 300ms ease-out`}
                  background="linear-gradient(to right, #fff, transparent)"
                  bottom="0"
                  left="0"
                  justifyContent="center"
                  paddingLeft="3"
                  part="carousel-prev-wrapper"
                  position="absolute"
                  top="0"
                >
                  <Button.Plain
                    border="1px solid neutral.border"
                    borderRadius="100%"
                    backgroundColor="neutral.background"
                    color="primary.surface"
                    onClick={() => emblaApi.scrollPrev()}
                    padding="2"
                  >
                    <ArrowLeftIcon height="24px" width="24px" />
                  </Button.Plain>
                </Flex.Column>
              )}

              {hasNext && (
                <Flex.Column
                  animation={`${fadeIn} 300ms ease-out`}
                  background="linear-gradient(to left, #fff, transparent)"
                  bottom="0"
                  justifyContent="center"
                  paddingRight="3"
                  part="carousel-next-wrapper"
                  position="absolute"
                  right="0"
                  top="0"
                >
                  <Button.Plain
                    border="1px solid neutral.border"
                    borderRadius="100%"
                    backgroundColor="neutral.background"
                    color="primary.surface"
                    onClick={() => emblaApi.scrollNext()}
                    padding="2"
                  >
                    <ArrowRightIcon height="24px" width="24px" />
                  </Button.Plain>
                </Flex.Column>
              )}
            </Box>
          </>
        )
      }}
    </Flow>
  )
}
