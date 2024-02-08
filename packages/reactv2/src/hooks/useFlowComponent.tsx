import { type ReactNode, useEffect } from 'react'
import { type Flow, type FlowStep } from '@frigade/js'

import { Box, type BoxProps } from '@/components/Box'
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
  step: FlowStep
}

export interface FlowComponentChildren extends BoxProps {
  children: (props: FlowComponentChildrenProps) => ReactNode
}

export function useFlowComponent({
  container,
  dismissible = true,
  flowId,
  onComplete,
  onDismiss,
  onPrimary,
  onSecondary,
  variables,
  ...props
}: FlowComponentProps) {
  const ContainerElement = container === 'dialog' ? Dialog : Box

  // TODO: useMemo this component so it isn't recreated on every render
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

    const { isCurrentModal, removeModal } = useModal(flow?.id)

    useEffect(() => {
      if (!flow?.isVisible && isCurrentModal) {
        removeModal()
      }
    }, [flow?.isVisible, isCurrentModal])

    if (flow == null || !flow.isVisible || !isCurrentModal) {
      return null
    }

    const dismissButton =
      dismissible && container === 'dialog' ? <Dialog.Close onClick={handleDismiss} /> : null

    flow.start()
    step.start()

    return (
      <ContainerElement {...flowComponentProps} {...props}>
        {dismissButton}

        {children({
          flow,
          handleDismiss,
          handlePrimary,
          handleSecondary,
          step,
        })}
      </ContainerElement>
    )
  }

  return {
    FlowComponent,
  }
}
