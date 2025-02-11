import { Fragment } from 'react'
import { FlowType } from '@frigade/js'

import { Box } from '@/components/Box'

import { useFlow } from '@/hooks/useFlow'
import { useFlowHandlers } from '@/hooks/useFlowHandlers'
import { useStepHandlers } from '@/hooks/useStepHandlers'
import { useCheckForModalCollision } from '@/hooks/useModal'

import type { FlowProps } from '@/components/Flow/FlowProps'
import { getVideoProps } from '@/components/Media/videoProps'
// import { FrigadeContext } from '@/components/Provider'

export type {
  FlowChildrenProps,
  FlowProps,
  FlowPropsWithoutChildren,
} from '@/components/Flow/FlowProps'

function isDialog(component) {
  return typeof component === 'function' && component.displayName === 'Dialog'
}

export function Flow({
  as,
  autoStart = true,
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

  const step = flow?.getCurrentStep()

  const initialStepProps = step?.props ?? {}

  // Discard video props when merging step props onto top-level container
  const { otherProps: stepProps } = getVideoProps(initialStepProps)

  const {
    dismissible = isDialog(as) ? true : false,
    forceMount = false,
    ...mergedProps
  } = {
    ...props,
    ...(flow?.props ?? {}),
    ...(flow?.rawData?.flowType === FlowType.CHECKLIST ? {} : stepProps),
  }

  // const { hasInitialized, registerComponent, unregisterComponent } = useContext(FrigadeContext)

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
    isDialog(as) ||
    [FlowType.ANNOUNCEMENT, FlowType.TOUR].includes(flow?.rawData?.flowType)

  const { hasModalCollision } = useCheckForModalCollision(flow, isModal)

  function handleEscapeKeyDown(e) {
    if (dismissible === false) {
      e.preventDefault()
      return
    }

    if (typeof props.onEscapeKeyDown === 'function') {
      props.onEscapeKeyDown(e)
    }

    if (!e.defaultPrevented) {
      handleDismiss(e)
    }
  }

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

  // registerComponent(flowId, () => {
  //   if (!hasProcessedRules) {
  //     setHasProcessedRules(true)
  //   }
  // })

  if ((!flow.isVisible || hasModalCollision) && !shouldForceMount) {
    return null
  }

  // if (!hasInitialized || !hasProcessedRules) {
  //   return null
  // }

  if (shouldForceMount || (!flow.isCompleted && !flow.isSkipped && autoStart)) {
    step?.start()
  }

  const ContainerElement = as === null ? Fragment : as ?? Box

  const containerProps: Record<string, unknown> = {
    ...mergedProps,
    'data-flow-id': flow.id,
  }

  if (isDialog(as)) {
    containerProps.onEscapeKeyDown = handleEscapeKeyDown
  }

  return (
    <ContainerElement {...(as === null ? {} : containerProps)}>
      {children({
        flow,
        handleDismiss,
        handlePrimary,
        handleSecondary,
        parentProps: {
          as,
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
