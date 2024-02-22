import { useEffect, useState } from 'react'
import { keyframes } from '@emotion/react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import * as Collapsible from '@radix-ui/react-collapsible'

import { Box } from '@/components/Box'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow, type FlowChildrenProps, type FlowPropsWithoutChildren } from '@/components/Flow'
import { Text } from '@/components/Text'

import { useStepHandlers } from '@/hooks/useStepHandlers'

export interface ChecklistProps extends FlowPropsWithoutChildren {}

const slideDown = keyframes`
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: var(--radix-collapsible-content-height);
    opacity: 1;
  }
`

const slideUp = keyframes`
  from {
    height: var(--radix-collapsible-content-height);
    opacity: 1;
  }
  to {
    height: 0;
    opacity: 0;
  }
`
// TODO: CheckIcon and CheckIndicator are copypasta from RadioField.tsx. Clean this up.
const CheckIcon = () => (
  <Box as="svg" color="primary.foreground" width="10px" height="8px" viewBox="0 0 10 8" fill="none">
    <path
      d="M1 4.34664L3.4618 6.99729L3.4459 6.98017L9 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Box>
)

function CheckIndicator({ checked = false }) {
  return (
    <Box
      backgroundColor="inherit"
      borderWidth="md"
      borderStyle="solid"
      borderColor="neutral.border"
      borderRadius="100%"
      padding="0"
      part="field-radio-value"
      position="relative"
      height="22px"
      width="22px"
    >
      {checked && (
        <Box
          alignItems="center"
          bg="green500"
          borderWidth="md"
          borderStyle="solid"
          borderColor="green500"
          borderRadius="100%"
          display="flex"
          height="calc(100% + 2px)"
          justifyContent="center"
          left="-1px"
          part="field-radio-indicator"
          position="absolute"
          top="-1px"
          width="calc(100% + 2px)"
        >
          <CheckIcon />
        </Box>
      )}
    </Box>
  )
}

function CollapsibleStep({ open = false, setOpenStepId, step }) {
  const { onPrimary, onSecondary, primaryButtonTitle, secondaryButtonTitle, subtitle, title } = step
  const { handlePrimary, handleSecondary } = useStepHandlers(step, {
    onPrimary,
    onSecondary,
  })

  function toggleOpenStep(isOpening: boolean) {
    console.log(isOpening, step.id)
    setOpenStepId(isOpening ? step.id : null)
  }

  return (
    <Collapsible.Root asChild open={open} onOpenChange={toggleOpenStep}>
      <Card
        borderWidth="md"
        css={{
          '&[data-state="open"] .fr-collapsible-step-icon': {
            transform: 'rotate(180deg)',
          },
        }}
        gap={0}
      >
        <Collapsible.Trigger asChild>
          <Flex.Row alignItems="center" justifyContent="space-between">
            <Flex.Row alignItems="center" gap={2}>
              <CheckIndicator checked={step.isCompleted} />
              <Text.Body2 fontWeight="demibold">{title}</Text.Body2>
            </Flex.Row>

            <Box
              as={ChevronDownIcon}
              color="gray100"
              display="block"
              height="16px"
              order={2}
              part="collapsible-step-icon"
              width="16px"
            />
          </Flex.Row>
        </Collapsible.Trigger>
        <Collapsible.Content asChild>
          <Flex.Column
            css={{
              '&[data-state="open"]': {
                animation: `${slideDown} 300ms ease-out`,
              },
              '&[data-state="closed"]': {
                animation: `${slideUp} 300ms ease-out`,
              },
              overflow: 'hidden',
            }}
            gap={5}
          >
            {/*
              This humble box is doing yeoman's work, don't remove it.
              It creates a flex gap at the top of this column, which animates smoothly.
              Other forms of whitespace like margin or padding? Not so smooth!
            */}
            <Box />

            <Card.Media aspectRatio={2.5} objectFit="cover" src={step.imageUri} />
            <Card.Subtitle color="gray500">{subtitle}</Card.Subtitle>
            <Flex.Row gap={3}>
              <Card.Secondary title={secondaryButtonTitle} onClick={handleSecondary} />
              <Card.Primary title={primaryButtonTitle} onClick={handlePrimary} />
            </Flex.Row>
          </Flex.Column>
        </Collapsible.Content>
      </Card>
    </Collapsible.Root>
  )
}

function ChecklistContent({ flow, step }: FlowChildrenProps) {
  const [openStepId, setOpenStepId] = useState(step.id)

  useEffect(() => {
    setOpenStepId(step.id)
  }, [step.id])

  const stepList = Array.from(flow.steps?.entries()).map(([, s]) => (
    <CollapsibleStep key={s.id} open={s.id === openStepId} setOpenStepId={setOpenStepId} step={s} />
  ))

  return (
    <>
      <Flex.Column gap={2}>
        <Card.Title>{flow.title}</Card.Title>
        <Card.Subtitle color="gray500">{flow.subtitle}</Card.Subtitle>
      </Flex.Column>

      {stepList}
    </>
  )
}

export function Checklist({ flowId, ...props }: ChecklistProps) {
  return (
    <Flow as={Card} borderWidth="md" flowId={flowId} part="checklist" {...props}>
      {(childrenProps) => <ChecklistContent {...childrenProps} />}
    </Flow>
  )
}
