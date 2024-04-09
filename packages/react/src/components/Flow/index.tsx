import { Fragment, useContext, useEffect } from 'react'

import { Box } from '@/components/Box'

import { useFlow } from '@/hooks/useFlow'
import { useFlowHandlers } from '@/hooks/useFlowHandlers'
import { useStepHandlers } from '@/hooks/useStepHandlers'
import { useModal } from '@/hooks/useModal'

import type { FlowProps } from '@/components/Flow/FlowProps'
import { FrigadeContext } from '@/components/Provider'

export type {
  FlowChildrenProps,
  FlowProps,
  FlowPropsWithoutChildren,
} from '@/components/Flow/FlowProps'

export function Flow({
  as,
  children,
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

  const { hasInitialized, registerComponent } = useContext(FrigadeContext)

  const step = flow?.getCurrentStep()

  const { handleDismiss } = useFlowHandlers(flow, {
    onComplete,
    onDismiss,
  })

  const { handlePrimary, handleSecondary } = useStepHandlers(step, {
    onPrimary,
    onSecondary,
  })

  const isModal =
    as && typeof as === 'function' && (as.displayName === 'Dialog' || as.displayName === 'Modal')

  const { isCurrentModal, removeModal } = useModal(flow, isModal)

  useEffect(() => {
    if (!flow?.isVisible && isCurrentModal) {
      removeModal()
    }
  }, [flow?.isVisible, isCurrentModal])

  const shouldForceMount = forceMount && (flow?.isCompleted || flow?.isSkipped)

  if (!flow) {
    return null
  }

  if (!shouldForceMount && !isCurrentModal) {
    return null
  }

  if (!flow.isVisible && !shouldForceMount) {
    return null
  }

  registerComponent(flowId)

  if (!hasInitialized) {
    return null
  }

  if (shouldForceMount || (!flow.isCompleted && !flow.isSkipped)) {
    step.start()
  }

  const ContainerElement = as === null ? Fragment : as ?? Box

  const containerProps = as === null ? {} : props

  return (
    <ContainerElement {...containerProps}>
      {children({
        flow,
        handleDismiss,
        handlePrimary,
        handleSecondary,
        parentProps: {
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
