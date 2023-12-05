import { useFlow } from '../../hooks/useFlow'
import { TooltipProps } from '../Tooltip'
import { TourStep } from './TourStep'

import { FlowHandler, useFlowHandlers } from '../../hooks/useFlowHandlers'
import { StepHandler } from '../../hooks/useStepHandlers'

export interface TourProps extends TooltipProps {
  flowId: string
  onComplete?: FlowHandler
  onDismiss?: FlowHandler
  onPrimary?: StepHandler
  onSecondary?: StepHandler
  variables?: Record<string, any>
}

export function Tour({ flowId, onComplete, variables, ...props }: TourProps) {
  const { flow } = useFlow(flowId, variables)
  useFlowHandlers(flow, { onComplete })

  if (flow == null || flow.isVisible === false) {
    return null
  }

  flow.start()

  const step = flow.getCurrentStep()
  step?.start()

  return <TourStep step={step} flow={flow} {...props} />
}
