import { Fragment, useContext, useEffect, useState } from 'react'

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
  const [hasProcessedRules, setHasProcessedRules] = useState(false)

  const { flow } = useFlow(flowId, {
    variables,
  })

  const { hasInitialized, registerComponent, unregisterComponent } = useContext(FrigadeContext)

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

  useEffect(() => {
    return () => {
      unregisterComponent(flowId)
    }
  }, [])

  const shouldForceMount = forceMount && (flow?.isCompleted || flow?.isSkipped)

  if (!flow) {
    return null
  }

  if (!shouldForceMount && !isCurrentModal) {
    return null
  }

  registerComponent(flowId, () => {
    if (!hasProcessedRules) {
      setHasProcessedRules(true)
    }
  })

  if (!flow.isVisible && !shouldForceMount) {
    return null
  }

  if (!hasInitialized || !hasProcessedRules) {
    return null
  }

  if (shouldForceMount || (!flow.isCompleted && !flow.isSkipped)) {
    step.start()
  }

  const ContainerElement = as === null ? Fragment : as ?? Box

  const containerProps = {
    ...props,
    'data-flow-id': flow.id,
  }

  return (
    <ContainerElement {...(as === null ? {} : containerProps)}>
      {children({
        flow,
        handleDismiss,
        handlePrimary,
        handleSecondary,
        parentProps: {
          dismissible,
          flowId,
          variables,
          containerProps,
        },
        step,
      })}
    </ContainerElement>
  )
}
