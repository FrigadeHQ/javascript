import { useFlow } from '../../hooks/useFlow'
import { TooltipProps } from '../Tooltip'
import { TourStep } from './TourStep'

import { StepHandler } from '../../hooks/useStepHandlers'

export interface TourProps extends TooltipProps {
  flowId: string
  onPrimary: StepHandler
  onSecondary: StepHandler
}

export function Tour({ flowId, ...props }: TourProps) {
  const { flow } = useFlow(flowId)

  if (flow == null || flow.isVisible === false) {
    return null
  }

  flow.start()

  const step = flow.getCurrentStep()
  step?.start()

  return <TourStep step={step} flow={flow} {...props} />
}
