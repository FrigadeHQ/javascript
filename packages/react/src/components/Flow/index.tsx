import { Fragment } from 'react'
import { FlowType } from '@frigade/js'

import { Box } from '@/components/Box'

import { useFlow } from '@/hooks/useFlow'
import { useFlowHandlers } from '@/hooks/useFlowHandlers'
import { useStepHandlers } from '@/hooks/useStepHandlers'
import { useModal } from '@/hooks/useModal'

import type { FlowProps } from '@/components/Flow/FlowProps'
// import { FrigadeContext } from '@/components/Provider'

export type {
  FlowChildrenProps,
  FlowProps,
  FlowPropsWithoutChildren,
} from '@/components/Flow/FlowProps'

export function Flow({
  as,
  children,
  flowId,
  onComplete,
  onDismiss,
  onPrimary,
  onSecondary,
  variables,

  ...props
}: FlowProps) {
  // const [hasProcessedRules, setHasProcessedRules] = useState(false)

  const { flow } = useFlow(flowId, {
    variables,
  })

  const {
    dismissible = false,
    forceMount = false,
    ...mergedProps
  } = {
    ...(flow?.props ?? {}),
    ...props,
  }

  // const { hasInitialized, registerComponent, unregisterComponent } = useContext(FrigadeContext)

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
    mergedProps?.modal ||
    (typeof as === 'function' && as?.displayName === 'Dialog') ||
    [FlowType.ANNOUNCEMENT, FlowType.TOUR].includes(flow?.rawData?.flowType)

  const { isCurrentModal, removeModal } = useModal(flow, isModal)

  // useEffect(() => {
  //   return () => {
  //     unregisterComponent(flowId)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (flow?.isCompleted || flow?.isSkipped) {
  //     unregisterComponent(flowId)
  //   }
  // }, [flow?.isCompleted, flow?.isSkipped])

  const shouldForceMount = forceMount && (flow?.isCompleted || flow?.isSkipped)

  if (!flow) {
    return null
  }

  if (!shouldForceMount && !isCurrentModal) {
    return null
  }

  // registerComponent(flowId, () => {
  //   if (!hasProcessedRules) {
  //     setHasProcessedRules(true)
  //   }
  // })

  if (!flow.isVisible && !shouldForceMount) {
    removeModal()
    return null
  }

  // if (!hasInitialized || !hasProcessedRules) {
  //   return null
  // }

  if (shouldForceMount || (!flow.isCompleted && !flow.isSkipped)) {
    step.start()
  }

  const ContainerElement = as === null ? Fragment : as ?? Box

  const containerProps = {
    ...mergedProps,
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
