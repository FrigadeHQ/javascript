import { Flow } from '@frigade/js'

import { useFlow } from '../../hooks/useFlow'
import { TooltipProps } from '../Tooltip'
import { TourStep } from './TourStep'

import { FlowHandler, useFlowHandlers } from '../../hooks/useFlowHandlers'
import { StepHandler } from '../../hooks/useStepHandlers'

export interface TourProps extends TooltipProps {
  flowId: string
  onComplete?: (flow?: Flow, previousFlow?: Flow) => void
  onDismiss?: FlowHandler
  onPrimary?: StepHandler
  onSecondary?: StepHandler
}

export function Tour({ flowId, onComplete, ...props }: TourProps) {
  const { flow } = useFlow(flowId)
  useFlowHandlers(flow, { onComplete })

  if (flow == null || flow.isVisible === false) {
    return null
  }

  flow.start()

  const step = flow.getCurrentStep()
  step?.start()

  return <TourStep step={step} flow={flow} {...props} />
}
