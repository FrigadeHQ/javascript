import { type ReactNode, useEffect, useMemo } from 'react'
import { type Flow, type FlowStep } from '@frigade/js'
import { XMarkIcon } from '@heroicons/react/24/solid'

import { Box, type BoxProps } from '@/components/Box'
import { Button, type ButtonProps } from '@/components/Button'
import { Dialog } from '@/components/Dialog'

import { type FlowComponentProps } from '@/shared/types'

import { useFlow } from './useFlow'
import { type DismissHandler, useFlowHandlers } from './useFlowHandlers'
import { type StepHandler, useStepHandlers } from './useStepHandlers'
import { useModal } from './useModal'

export interface FlowComponentChildrenProps {
  flow: Flow
  handleDismiss: DismissHandler
  handlePrimary: StepHandler
  handleSecondary: StepHandler
  parentProps: Record<string, unknown>
  step: FlowStep
}

export interface FlowComponentChildren extends BoxProps {
  children: (props: FlowComponentChildrenProps) => ReactNode
}

export function CloseButton(props: ButtonProps) {
  return (
    <Button.Plain part="close" position="absolute" right="-4px" top="4px" {...props}>
      <XMarkIcon height="24" fill="currentColor" />
    </Button.Plain>
  )
}

export function useFlowComponent({
  as,
  container,
  dismissible = container === 'dialog' ? true : false,
  flowId,
  onComplete,
  onDismiss,
  onPrimary,
  onSecondary,
  variables,
  ...props
}: FlowComponentProps) {
  const ContainerElement = container === 'dialog' ? Dialog : as ?? Box

  // useMemo this component so it isn't recreated on every render
  const FlowComponent = function FlowComponent({
    children,
    ...flowComponentProps
  }: FlowComponentChildren) {
    const { flow } = useFlow(flowId, {
      variables,
    })
    const step = flow?.getCurrentStep()

    const { handleDismiss } = useFlowHandlers(flow, {
      onComplete,
      onDismiss,
    })

    const { handlePrimary, handleSecondary } = useStepHandlers(step, {
      onPrimary,
      onSecondary,
    })

    const { isCurrentModal, removeModal } = useModal(flow)

    useEffect(() => {
      if (!flow?.isVisible && isCurrentModal) {
        removeModal()
      }
    }, [flow?.isVisible, isCurrentModal])

    if (flow == null || !flow.isVisible || !isCurrentModal) {
      return null
    }

    flow.start()
    step.start()

    return (
      <ContainerElement position="relative" {...flowComponentProps} {...props}>
        {children({
          flow,
          handleDismiss,
          handlePrimary,
          handleSecondary,
          parentProps: {
            container,
            dismissible,
            flowId,
            variables,
            ...props,
          },
          step,
        })}
      </ContainerElement>
    )
  }

  const MemoizedFlowComponent = useMemo(() => FlowComponent, [])

  return {
    FlowComponent: MemoizedFlowComponent,
  }
}
