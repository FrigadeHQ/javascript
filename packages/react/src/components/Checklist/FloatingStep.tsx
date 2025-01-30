import { useMemo, useRef } from 'react'
import * as Popover from '@/components/Popover'

import { Card } from '@/components/Card'
import { CheckIndicator } from '@/components/CheckIndicator'
import { Flex } from '@/components/Flex'
import { getVideoProps } from '@/components/Media/videoProps'
import { Text } from '@/components/Text'

import { useStepHandlers } from '@/hooks/useStepHandlers'

import { floatingTransitionCSS } from '@/components/Checklist/Floating.styles'

// TODO: Type props
export function FloatingStep({ onPrimary, onSecondary, openStepId, setOpenStepId, step }) {
  const anchorId = useMemo(() => `floating-checklist-step-${step.id}`, [step.id])
  const anchorPointerEnterTimeout = useRef<ReturnType<typeof setTimeout>>()
  const { handlePrimary, handleSecondary } = useStepHandlers(step, { onPrimary, onSecondary })

  const isStepOpen = openStepId === step.id

  async function wrappedHandlePrimary(...args: Parameters<typeof handlePrimary>) {
    const primaryReturnValue = await handlePrimary(...args)

    if (primaryReturnValue) {
      setOpenStepId(null)
    }
  }

  async function wrappedHandleSecondary(...args: Parameters<typeof handleSecondary>) {
    const secondaryReturnValue = await handleSecondary(...args)

    if (secondaryReturnValue) {
      setOpenStepId(null)
    }
  }

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

  const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
  const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle

  const { videoProps } = getVideoProps(step.props ?? {})

  return (
    <>
      <Flex.Row
        alignItems="center"
        borderRadius="md"
        gap="2"
        justifyContent="space-between"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        id={anchorId}
        padding="1 2"
        part="floating-checklist-step-list-item"
        style={{
          backgroundColor: isStepOpen ? 'var(--fr-colors-neutral-800)' : 'transparent',
        }}
        userSelect="none"
      >
        <Text.Body2 part="floating-checklist-step-title">{step.title}</Text.Body2>
        <CheckIndicator checked={step.$state.completed || step.$state.skipped} size="18px" />
      </Flex.Row>
      <Popover.Root
        align="start"
        anchor={`#${anchorId}`}
        open={isStepOpen}
        side="right"
        sideOffset={8}
      >
        <Popover.Content css={floatingTransitionCSS} part="floating-step">
          <Card
            backgroundColor="neutral.background"
            border="md solid neutral.border"
            borderRadius="md"
            gap="3"
            minWidth="400px"
            p="2"
          >
            <Card.Media
              src={step.videoUri ?? step.imageUri}
              type={step.videoUri ? 'video' : 'image'}
              css={{ objectFit: 'contain', width: '100%' }}
              {...videoProps}
            />
            <Card.Header dismissible={false} padding="0 1" subtitle={step.subtitle} />

            <Flex.Row gap={3} justifyContent="flex-end" part="card-footer">
              <Card.Secondary
                disabled={step.$state.blocked}
                onClick={wrappedHandleSecondary}
                padding="1 2"
                title={secondaryButtonTitle}
              />
              <Card.Primary
                disabled={step.$state.blocked}
                onClick={wrappedHandlePrimary}
                padding="1 2"
                title={primaryButtonTitle}
              />
            </Flex.Row>
          </Card>
        </Popover.Content>
      </Popover.Root>
    </>
  )
}
