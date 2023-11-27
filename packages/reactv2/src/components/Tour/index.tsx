import { Flow } from '@frigade/js'

import { useFlow } from '../../hooks/useFlow'
import { TooltipProps } from '../Tooltip'
import { TourStep } from './TourStep'

export interface TourProps extends TooltipProps {
  flowId: string
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
