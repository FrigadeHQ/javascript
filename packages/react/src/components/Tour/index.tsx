import { useEffect } from 'react'

import { type FlowPropsWithoutChildren } from '@/components/Flow'
import { type TooltipProps } from '@/components/Tooltip'
import { TourStep } from '@/components/Tour/TourStep'

import { useFlow } from '@/hooks/useFlow'
import { useFlowHandlers } from '@/hooks/useFlowHandlers'
import { useModal } from '@/hooks/useModal'

export interface TourProps extends TooltipProps, FlowPropsWithoutChildren {}

export function Tour({ flowId, onComplete, variables, ...props }: TourProps) {
  const { flow } = useFlow(flowId, {
    variables,
  })
  useFlowHandlers(flow, { onComplete })

  const { isCurrentModal, removeModal } = useModal(flow)

  useEffect(() => {
    if (!flow?.isVisible && isCurrentModal) {
      removeModal()
    }
  }, [flow?.isVisible, isCurrentModal])

  if (flow == null || flow.isVisible === false || !isCurrentModal) {
    return null
  }

  flow.start()

  const step = flow.getCurrentStep()
  step?.start()

  return <TourStep step={step} flow={flow} {...props} />
}
