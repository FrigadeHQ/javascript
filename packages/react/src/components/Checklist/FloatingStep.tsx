import { useMemo, useRef } from 'react'
import * as Popover from '@/components/Popover'

import { Box } from '@/components/Box'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { getVideoProps } from '@/components/Media/videoProps'
import { Text } from '@/components/Text'

import { useStepHandlers } from '@/hooks/useStepHandlers'

// TODO: Type props
export function FloatingStep({ onPrimary, onSecondary, openStepId, setOpenStepId, step }) {
  const anchorId = useMemo(() => `floating-checklist-step-${step.id}`, [step.id])
  const anchorPointerEnterTimeout = useRef<ReturnType<typeof setTimeout>>()

  const { handlePrimary, handleSecondary } = useStepHandlers(step, { onPrimary, onSecondary })

  const isStepOpen = openStepId === step.id

  // TODO: Handle tap while open on mobile to close step
  function handlePointerEnter() {
    clearTimeout(anchorPointerEnterTimeout.current)

    if (!isStepOpen) {
      anchorPointerEnterTimeout.current = setTimeout(() => setOpenStepId(step.id), 300)
    }
  }

  function handlePointerLeave() {
    clearTimeout(anchorPointerEnterTimeout.current)
  }

  // TODO: set a timeout on pointer leave trigger and cancel it when pointer enters content

  const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
  const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle

  const { videoProps } = getVideoProps(step.props ?? {})

  // TODO: Steps have no visual state indicator (and button aren't disabled when completed)

  return (
    <>
      <Text.Body2
        borderRadius="md"
        display="block"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        id={anchorId}
        padding="1 2"
        style={{
          backgroundColor: isStepOpen ? 'var(--fr-colors-neutral-800)' : 'transparent',
        }}
        userSelect="none"
      >
        {step.title}
      </Text.Body2>
      <Popover.Root
        align="start"
        anchor={`#${anchorId}`}
        open={isStepOpen}
        side="right"
        sideOffset={4}
      >
        <Popover.Content>
          <Card
            backgroundColor="neutral.background"
            border="md solid neutral.border"
            borderRadius="md"
            minWidth="400px"
            padding="2"
          >
            <Card.Header dismissible={false} subtitle={step.subtitle} title={step.title} />

            <Card.Media
              src={step.videoUri ?? step.imageUri}
              type={step.videoUri ? 'video' : 'image'}
              css={{ objectFit: 'contain', width: '100%' }}
              {...videoProps}
            />

            <Flex.Row gap={3} justifyContent="flex-end" part="card-footer">
              <Card.Secondary title={secondaryButtonTitle} onClick={handleSecondary} />
              <Card.Primary title={primaryButtonTitle} onClick={handlePrimary} />
            </Flex.Row>
          </Card>
        </Popover.Content>
      </Popover.Root>
    </>
  )
}
