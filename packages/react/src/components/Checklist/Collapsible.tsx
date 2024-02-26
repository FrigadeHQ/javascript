import { createContext, type Dispatch, type SetStateAction, useContext, useState } from 'react'

import { Card } from '@/components/Card'
import * as CollapsibleStep from '@/components/Checklist/CollapsibleStep'
import { Flex } from '@/components/Flex'
import { Flow, type FlowChildrenProps, type FlowPropsWithoutChildren } from '@/components/Flow'
import * as Progress from '@/components/Progress'
import { Text } from '@/components/Text'

import { type StepHandlerProp, useStepHandlers } from '@/hooks/useStepHandlers'

export interface CollapsibleStepProps extends FlowChildrenProps {
  onOpenChange: (isOpening: boolean) => void
  open: boolean
}

export type StepTypes = Record<string, (props: CollapsibleStepProps) => React.ReactNode>

export interface CollapsibleContextType {
  onPrimary: StepHandlerProp
  onSecondary: StepHandlerProp
  openStepId: string | null
  setOpenStepId: Dispatch<SetStateAction<string>>
  stepTypes: StepTypes
}

const CollapsibleContext = createContext<CollapsibleContextType>({
  onPrimary: () => {},
  onSecondary: () => {},
  openStepId: null,
  setOpenStepId: () => {},
  stepTypes: {},
})

export interface CollapsibleProps extends FlowPropsWithoutChildren {
  stepTypes?: StepTypes
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

function StepWrapper({ flow, step, ...props }: FlowChildrenProps) {
  const { onPrimary, onSecondary, openStepId, setOpenStepId, stepTypes } =
    useContext(CollapsibleContext)
  const { handlePrimary, handleSecondary } = useStepHandlers(step, { onPrimary, onSecondary })

  const open = (openStepId ?? flow.getCurrentStep().id) === step.id

  const StepComponent = stepTypes[step.type as string] ?? DefaultCollapsibleStep

  async function onOpenChange(isOpening: boolean) {
    setOpenStepId(isOpening ? step.id : '')

    if (isOpening && !step.isCompleted) {
      await step.start()
    }
  }

  // TODO: Allow user override of onOpenChange w/ same behavior as other handlers
  return (
    <StepComponent
      flow={flow}
      key={step.id}
      onOpenChange={onOpenChange}
      open={open}
      step={step}
      {...props}
      handlePrimary={handlePrimary}
      handleSecondary={handleSecondary}
    />
  )
}

export function Collapsible({
  flowId,
  onPrimary,
  onSecondary,
  stepTypes = {},
  ...props
}: CollapsibleProps) {
  const [openStepId, setOpenStepId] = useState(null)

  const mergedStepTypes: StepTypes = {
    ...defaultStepTypes,
    ...stepTypes,
  }

  return (
    <CollapsibleContext.Provider
      value={{ openStepId, setOpenStepId, onPrimary, onSecondary, stepTypes: mergedStepTypes }}
    >
      <Flow as={Card} borderWidth="md" flowId={flowId} part="checklist" {...props}>
        {({ flow, ...childrenProps }) => {
          const stepList = Array.from(flow.steps.entries()).map(([, s]) => (
            <StepWrapper key={s.id} flow={flow} {...childrenProps} step={s} />
          ))

          const currentSteps = flow.getNumberOfCompletedSteps()
          const availableSteps = flow.getNumberOfAvailableSteps()

          return (
            <>
              <Flex.Column gap={2}>
                <Card.Title>{flow.title}</Card.Title>
                <Card.Subtitle color="gray500">{flow.subtitle}</Card.Subtitle>

                <Flex.Row alignItems="center" gap={2}>
                  <Text.Body2 fontWeight="demibold">
                    {currentSteps}/{availableSteps}
                  </Text.Body2>
                  <Progress.Bar current={currentSteps} total={availableSteps} flexGrow={1} />
                </Flex.Row>
              </Flex.Column>

              {stepList}
            </>
          )
        }}
      </Flow>
    </CollapsibleContext.Provider>
  )
}
