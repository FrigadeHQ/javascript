import { type FlowComponentProps } from '../../shared/types'
import { type TooltipProps } from '../Tooltip'
import { TourStep } from './TourStep'
import { useFlow } from '../../hooks/useFlow'
import { useFlowHandlers } from '../../hooks/useFlowHandlers'

export interface TourProps extends TooltipProps, FlowComponentProps {}

export function Tour({ flowId, onComplete, variables, ...props }: TourProps) {
  const { flow } = useFlow(flowId, {
    variables,
  })
  useFlowHandlers(flow, { onComplete })

  if (flow == null || flow.isVisible === false) {
    return null
  }

  flow.start()

  const step = flow.getCurrentStep()
  step?.start()

  return <TourStep step={step} flow={flow} {...props} />
}
