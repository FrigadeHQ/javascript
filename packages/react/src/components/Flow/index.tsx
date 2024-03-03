import { useEffect } from 'react'

import { Box } from '@/components/Box'

import { useFlow } from '@/hooks/useFlow'
import { useFlowHandlers } from '@/hooks/useFlowHandlers'
import { useStepHandlers } from '@/hooks/useStepHandlers'
import { useModal } from '@/hooks/useModal'

import type { FlowProps } from '@/components/Flow/FlowProps'

export type {
  FlowChildrenProps,
  FlowProps,
  FlowPropsWithoutChildren,
} from '@/components/Flow/FlowProps'

export function Flow({
  as,
  children,
  container,
  dismissible = false,
  flowId,
  onComplete,
  onDismiss,
  onPrimary,
  onSecondary,
  variables,
  forceMount,
  ...props
}: FlowProps) {
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

  const isModal = as && typeof as === 'function' && as.displayName === 'Dialog'

  const { isCurrentModal, removeModal } = useModal(flow, isModal)

  useEffect(() => {
    if (!flow?.isVisible && isCurrentModal) {
      removeModal()
    }
  }, [flow?.isVisible, isCurrentModal])

  if (flow == null || !isCurrentModal) {
    return null
  }

  const shouldForceMount = forceMount && flow.isCompleted

  if (!flow.isVisible && !shouldForceMount) {
    return null
  }

  if (!flow.isCompleted && !flow.isSkipped) {
    step.start()
  }
  const ContainerElement = as ?? Box

  return (
    <ContainerElement position="relative" {...props}>
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
