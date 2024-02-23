import { useEffect, useState } from 'react'

import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow, type FlowChildrenProps, type FlowPropsWithoutChildren } from '@/components/Flow'

import * as CollapsibleStep from '@/components/Checklist/CollapsibleStep'

export interface CollapsibleProps extends FlowPropsWithoutChildren {
  stepTypes: Record<string, (props: FlowChildrenProps) => React.ReactNode>
}

export interface CollapsibleStepProps extends FlowChildrenProps {
  onOpenChange: (isOpening: boolean) => void
  open: boolean
}

function DefaultCollapsibleStep({
  handlePrimary,
  handleSecondary,
  open,
  onOpenChange,
  step,
}: CollapsibleStepProps) {
  const { isCompleted, primaryButtonTitle, secondaryButtonTitle, subtitle, title } = step

  return (
    <CollapsibleStep.Root open={open} onOpenChange={onOpenChange}>
      <CollapsibleStep.Trigger isCompleted={isCompleted} title={title} />

      <CollapsibleStep.Content>
        <Card.Media aspectRatio={2.5} objectFit="cover" src={step.imageUri} />
        <Card.Subtitle color="gray500">{subtitle}</Card.Subtitle>
        <Flex.Row gap={3}>
          <Card.Secondary title={secondaryButtonTitle} onClick={handleSecondary} />
          <Card.Primary title={primaryButtonTitle} onClick={handlePrimary} />
        </Flex.Row>
      </CollapsibleStep.Content>
    </CollapsibleStep.Root>
  )
}

const defaultStepTypes = {
  default: DefaultCollapsibleStep,
}

interface ChecklistContentProps extends FlowChildrenProps, Pick<CollapsibleProps, 'stepTypes'> {}

function ChecklistContent({ flow, step, stepTypes, ...props }: ChecklistContentProps) {
  const [openStepId, setOpenStepId] = useState(step.id)

  useEffect(() => {
    setOpenStepId(step.id)
  }, [step.id])

  const mergedStepTypes = {
    ...defaultStepTypes,
    ...stepTypes,
  }

  const stepList = Array.from(flow.steps?.entries()).map(([, s]) => {
    const StepComponent = mergedStepTypes[s.type as string] ?? DefaultCollapsibleStep

    function onOpenChange(isOpening: boolean) {
      setOpenStepId(isOpening ? s.id : null)
      flow.steps?.get(s.id)?.start()
    }

    return (
      <StepComponent
        flow={flow}
        key={s.id}
        onOpenChange={onOpenChange}
        open={s.id === openStepId}
        step={s}
        {...props}
      />
    )
  })

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

export function Collapsible({ flowId, stepTypes = {}, ...props }: CollapsibleProps) {
  return (
    <Flow as={Card} borderWidth="md" flowId={flowId} part="checklist" {...props}>
      {(childrenProps) => <ChecklistContent stepTypes={stepTypes} {...childrenProps} />}
    </Flow>
  )
}
