import { useRef, useState } from 'react'
import { FloatingTree } from '@floating-ui/react'

import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import * as Popover from '@/components/Popover'
import * as Progress from '@/components/Progress'
import { Text } from '@/components/Text'

import { FloatingStep } from '@/components/Checklist/FloatingStep'
import { floatingTransitionCSS } from '@/components/Checklist/Floating.styles'

export interface FloatingChecklistProps
  extends Popover.PopoverRootProps,
    FlowPropsWithoutChildren {}

// TODO: Fix props here (split popover and flow props and pass them to Flow / Popover.Root)
export function Floating({
  children,
  flowId,
  onPrimary,
  onSecondary,
  part,
  ...props
}: FloatingChecklistProps) {
  const [openStepId, setOpenStepId] = useState(null)
  const pointerLeaveTimeout = useRef<ReturnType<typeof setTimeout>>()

  function handlePointerEnter() {
    clearTimeout(pointerLeaveTimeout.current)
  }

  function handlePointerLeave() {
    clearTimeout(pointerLeaveTimeout.current)

    if (openStepId != null) {
      pointerLeaveTimeout.current = setTimeout(() => setOpenStepId(null), 300)
    }
  }

  function resetOpenStep(isOpen: boolean) {
    if (!isOpen && openStepId != null) {
      setOpenStepId(null)
    }
  }

  return (
    <Flow flowId={flowId} part={['floating-checklist', part]} {...props}>
      {({ flow }) => {
        const currentSteps = flow.getNumberOfCompletedSteps()
        const availableSteps = flow.getNumberOfAvailableSteps()

        const anchorContent = children ?? (
          <Flex.Row
            alignItems="center"
            backgroundColor="neutral.background"
            border="md solid neutral.border"
            borderRadius="md"
            cursor="pointer"
            gap="2"
            padding="1 2"
            part="floating-checklist-anchor"
            userSelect="none"
          >
            <Text.Body2 fontWeight="medium" part="floating-checklist-title">
              {flow.title}
            </Text.Body2>
            <Progress.Ring
              current={currentSteps}
              height="24px"
              strokeWidth="4px"
              total={availableSteps}
              width="24px"
            />
          </Flex.Row>
        )

        return (
          <FloatingTree>
            <Popover.Root
              align="start"
              anchor="#temp-popover-anchor"
              onOpenChange={resetOpenStep}
              sideOffset={4}
            >
              <Popover.Trigger display="inline-block" id="temp-popover-anchor">
                {anchorContent}
              </Popover.Trigger>

              <Popover.Content
                data-flow-id={flowId}
                css={{
                  ...floatingTransitionCSS,
                  '&[data-status="initial"]': {
                    opacity: 0.3,
                  },
                  '& .fr-popover-transition-container': {
                    transformOrigin: 'top left',
                    transition: 'transform 0.2s ease-out',
                  },
                  '&[data-placement^="top"] .fr-popover-transition-container': {
                    transformOrigin: 'bottom left',
                  },
                }}
              >
                <Card
                  backgroundColor="neutral.background"
                  border="md solid neutral.border"
                  borderRadius="md"
                  gap="0"
                  onPointerEnter={handlePointerEnter}
                  onPointerLeave={handlePointerLeave}
                  p="0 1 1"
                  part="floating-checklist-step-list"
                >
                  <Progress.Bar
                    borderRadius="md md 0 0"
                    clipPath="border-box"
                    css={{
                      '& .fr-progress-bar-fill': {
                        borderRadius: 0,
                      },
                    }}
                    current={currentSteps}
                    height="5px"
                    total={availableSteps}
                    flexGrow={1}
                    margin="0 -1 2"
                  />
                  {Array.from(flow.steps.values()).map((step) => (
                    <FloatingStep
                      key={step.id}
                      onPrimary={onPrimary}
                      onSecondary={onSecondary}
                      openStepId={openStepId}
                      setOpenStepId={setOpenStepId}
                      step={step}
                    />
                  ))}
                </Card>
              </Popover.Content>
            </Popover.Root>
          </FloatingTree>
        )
      }}
    </Flow>
  )
}
