import { type BoxProps } from '@/components/Box'

import { type FlowHandlerProp } from '@/hooks/useFlowHandlers'
import { type StepHandlerProp } from '@/hooks/useStepHandlers'

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export interface FlowComponentProps extends Omit<BoxProps, 'container'> {
  container?: 'dialog' | 'none'
  dismissible?: boolean
  flowId: string
  onComplete?: FlowHandlerProp
  onDismiss?: FlowHandlerProp
  onPrimary?: StepHandlerProp
  onSecondary?: StepHandlerProp
  variables?: Record<string, unknown>
}
