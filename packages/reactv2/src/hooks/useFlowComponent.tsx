import { type ReactNode } from 'react'
import { type Flow, type FlowStep } from '@frigade/js'

import { Box } from '@/components/Box'
import { Dialog } from '@/components/Dialog'

import { type FlowComponentProps } from '@/shared/types'

import { useFlow } from './useFlow'
import { type DismissHandler, useFlowHandlers } from './useFlowHandlers'

export interface FlowComponentChildrenProps {
  flow: Flow
  handleDismiss: DismissHandler
  step: FlowStep
}

export interface FlowComponentChildren {
  children: (props: FlowComponentChildrenProps) => ReactNode
}

export function useFlowComponent({
  container,
  dismissible = true,
  flowId,
  onComplete,
  onDismiss,
  variables,
  ...props
}: FlowComponentProps) {
  const ContainerElement = container === 'dialog' ? Dialog : Box

  // TODO: useMemo this component so it isn't recreated on every render
  const FlowComponent = function FlowComponent({ children }: FlowComponentChildren) {
    const { flow } = useFlow(flowId, {
      variables,
    })

    const { handleDismiss } = useFlowHandlers(flow, {
      onComplete,
      onDismiss,
    })

    if (flow == null || flow.isVisible === false) {
      return null
    }

    const step = flow.getCurrentStep()

    const dismissButton =
      dismissible && container === 'dialog' ? <Dialog.Close onClick={handleDismiss} /> : null

    flow.start()
    step.start()

    return (
      <ContainerElement {...props}>
        {dismissButton}

        {children({
          flow,
          handleDismiss,
          step,
        })}
      </ContainerElement>
    )
  }

  return {
    FlowComponent,
  }
}
