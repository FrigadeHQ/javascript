import { useContext, useEffect, useState } from 'react'

import { type FlowPropsWithoutChildren } from '@/components/Flow'
import { FrigadeContext } from '@/components/Provider'
import { type TooltipProps } from '@/components/Tooltip'
import { TourStep } from '@/components/Tour/TourStep'

import { useFlow } from '@/hooks/useFlow'
import { useFlowHandlers } from '@/hooks/useFlowHandlers'
import { useModal } from '@/hooks/useModal'

export interface TourProps extends TooltipProps, FlowPropsWithoutChildren {
  /**
   * @ignore
   */
  defaultOpen?: boolean
  /**
   * @ignore
   */
  open?: boolean
  /**
   * The modality of the tooltip. When set to `true`, interaction with outside elements will be disabled and only popover content will be visible to screen readers.
   */
  modal?: boolean
}

export function Tour({ flowId, onComplete, variables, part, ...props }: TourProps) {
  const [hasProcessedRules, setHasProcessedRules] = useState(false)

  const { flow } = useFlow(flowId, {
    variables,
  })

  const { hasInitialized, registerComponent, unregisterComponent } = useContext(FrigadeContext)

  useFlowHandlers(flow, { onComplete })

  const { isCurrentModal, removeModal } = useModal(flow)

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

  if (flow == null || flow.isVisible === false || !isCurrentModal) {
    return null
  }

  registerComponent(flowId, () => {
    if (!hasProcessedRules) {
      setHasProcessedRules(true)
    }
  })

  if (!hasInitialized || !hasProcessedRules) {
    return null
  }

  const step = flow.getCurrentStep()
  step?.start()

  return (
    <TourStep data-flow-id={flow.id} flow={flow} part={['tour', part]} step={step} {...props} />
  )
}
