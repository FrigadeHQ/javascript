import { type FlowHandler } from '@/hooks/useFlowHandlers'
import { type StepHandler } from '@/hooks/useStepHandlers'

export interface FlowComponentProps {
  flowId: string
  onComplete?: FlowHandler
  onDismiss?: FlowHandler
  onPrimary?: StepHandler
  onSecondary?: StepHandler
  variables?: Record<string, any>
}
