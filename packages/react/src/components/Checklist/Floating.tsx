import { useState } from 'react'
import { FloatingTree } from '@floating-ui/react'

import { Box } from '@/components/Box'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import * as Popover from '@/components/Popover'
import * as Progress from '@/components/Progress'
import { Text } from '@/components/Text'

import { FloatingStep } from '@/components/Checklist/FloatingStep'

export interface FloatingChecklistProps
  extends Popover.PopoverRootProps,
    FlowPropsWithoutChildren {}

// TODO: Fix props here (split popover and flow props and pass them to Flow / Popover.Root)
export function Floating({ children, onPrimary, onSecondary, ...props }: FloatingChecklistProps) {
  const [openStepId, setOpenStepId] = useState(null)

  function resetOpenStepOnClose(isOpen: boolean) {
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
            <Popover.Root
              align="start"
              anchor="#temp-popover-anchor"
              onOpenChange={resetOpenStepOnClose}
            >
              <Popover.Trigger display="inline-block" id="temp-popover-anchor">
                {children}
              </Popover.Trigger>

              <Popover.Content
                backgroundColor="neutral.background"
                border="md solid neutral.border"
                borderRadius="md"
                padding="1"
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
              </Popover.Content>
            </Popover.Root>
          </FloatingTree>
        )
      }}
    </Flow>
  )
}
