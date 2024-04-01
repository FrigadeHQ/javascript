import { EmotionJSX } from '@emotion/react/types/jsx-namespace'
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

export type StepTypes = Record<string, (props: CollapsibleStepProps) => EmotionJSX.Element>

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
  /**
   * Map of step types to their respective components.
   * Use this to build custom step components. The `type` defined on the step in the Flow YAML config should match the key in this object.
   * For instance, if you have a step with `type: 'custom'`, you should provide a component for it like so:
   * ```
   * <Checklist.Collapsible stepTypes={{ custom: CustomStepComponent }} />
   * ```
   * The corresponding YAML config would look like:
   * ```
   * steps:
   *  - id: custom-step
   *    type: custom
   * ```
   */
  stepTypes?: StepTypes
}

function DefaultCollapsibleStep({
  handlePrimary,
  handleSecondary,
  open,
  onOpenChange,
  step,
}: CollapsibleStepProps) {
  const { isBlocked, isCompleted, primaryButtonTitle, secondaryButtonTitle, subtitle, title } = step

  const stepProps = step.props ?? {}

  return (
    <CollapsibleStep.Root open={open} onOpenChange={onOpenChange} {...stepProps}>
      <CollapsibleStep.Trigger isCompleted={isCompleted} title={title} />

      <CollapsibleStep.Content>
        <Card.Media
          aspectRatio={2.5}
          objectFit="cover"
          src={step.videoUri ?? step.imageUri}
          type={step.videoUri ? 'video' : 'image'}
        />
        <Card.Subtitle color="gray500">{subtitle}</Card.Subtitle>
        <Flex.Row gap={3}>
          <Card.Secondary
            disabled={isCompleted || isBlocked ? true : false}
            title={secondaryButtonTitle}
            onClick={handleSecondary}
          />
          <Card.Primary
            disabled={isCompleted || isBlocked ? true : false}
            title={primaryButtonTitle}
            onClick={handlePrimary}
          />
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
  dismissible,
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
        {({ flow, handleDismiss, ...childrenProps }) => {
          const stepList = Array.from(flow.steps.entries()).map(([, s]) => (
            <StepWrapper
              key={s.id}
              flow={flow}
              handleDismiss={handleDismiss}
              {...childrenProps}
              step={s}
            />
          ))

          const currentSteps = flow.getNumberOfCompletedSteps()
          const availableSteps = flow.getNumberOfAvailableSteps()

          return (
            <>
              <Flex.Column gap={2}>
                <Card.Header
                  dismissible={dismissible}
                  handleDismiss={handleDismiss}
                  part="checklist-header"
                  subtitle={flow.subtitle}
                  title={flow.title}
                />

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
