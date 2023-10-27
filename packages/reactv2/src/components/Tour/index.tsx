import { useFlow } from '../../hooks/useFlow'

import { Tooltip } from '../Tooltip'

export interface TourProps {
  flowId: string
}

export function Tour({ flowId }: TourProps) {
  const flow = useFlow(flowId)

  if (flow == null) {
    return null
  }

  const step = flow.steps[Object.keys(flow.steps)[0]]

  return (
    <Tooltip
      anchor={step.selector}
      title={step.title}
      subtitle={step.subtitle}
      primaryButtonTitle={step.primaryButtonTitle}
      align="after"
    />
  )
}
