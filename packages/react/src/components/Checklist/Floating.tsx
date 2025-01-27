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
export function Floating({ children, onPrimary, onSecondary, ...props }: FloatingChecklistProps) {
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
    <Flow flowId={props.flowId}>
      {({ flow }) => {
        const currentSteps = flow.getNumberOfCompletedSteps()
        const availableSteps = flow.getNumberOfAvailableSteps()

        return (
          <FloatingTree>
            <Popover.Root align="start" anchor="#temp-popover-anchor" onOpenChange={resetOpenStep}>
              <Popover.Trigger display="inline-block" id="temp-popover-anchor">
                {children}
              </Popover.Trigger>

              <Popover.Content
                css={{
                  ...floatingTransitionCSS,
                  '& .fr-popover-transition-container': {
                    transformOrigin: 'top left',
                    transition: 'transform 0.2s ease-out',
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
                  p="1"
                >
                  <Flex.Column gap="1" marginBottom="1" padding="1 2">
                    <Text.Body2 fontWeight="medium">{flow.title}</Text.Body2>
                    <Progress.Bar current={currentSteps} total={availableSteps} flexGrow={1} />
                  </Flex.Column>
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
