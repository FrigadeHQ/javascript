import { type BoxProps } from '@/components/Box'

import { type FlowHandler } from '@/hooks/useFlowHandlers'
import { type StepHandler } from '@/hooks/useStepHandlers'

export interface FlowComponentProps extends Omit<BoxProps, 'container'> {
  container?: 'dialog' | 'none'
  dismissible?: boolean
  flowId: string
  onComplete?: FlowHandler
  onDismiss?: FlowHandler
  onPrimary?: StepHandler
  onSecondary?: StepHandler
  variables?: Record<string, any>
}
