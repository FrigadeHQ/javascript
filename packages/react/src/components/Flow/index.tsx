import { Fragment, useEffect, useState } from 'react'

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
  const [hasFinishedFlowRegistration, setHasFinishedFlowRegistration] = useState(false)

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

  useEffect(() => {
    flow?.register(() => {
      setHasFinishedFlowRegistration(true)
    })
  }, [flow])

  useEffect(() => {
    return () => {
      flow?.unregister()
    }
  }, [flow])

  if (flow == null || !isCurrentModal) {
    return null
  }

  const shouldForceMount = forceMount && flow.isCompleted
  flow?.register()

  if (!flow.isVisible && !shouldForceMount) {
    return null
  }

  if (!hasFinishedFlowRegistration) {
    return null
  }

  if (!flow.isCompleted && !flow.isSkipped) {
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
