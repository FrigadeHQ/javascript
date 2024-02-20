import type { ReactNode } from 'react'
import type { Flow as FlowType, FlowStep } from '@frigade/js'

import type { BoxProps } from '@/components/Box'

import type { DismissHandler, FlowHandlerProp } from '@/hooks/useFlowHandlers'
import type { StepHandler, StepHandlerProp } from '@/hooks/useStepHandlers'

export interface FlowProps extends Omit<BoxProps, 'container'> {
  /**
   * Flow accepts a render function as its only child, whose props are described in FlowChildrenProps
   */
  children: (props: FlowChildrenProps) => ReactNode
  /**
   * Whether the Flow is dismissible or not
   *
   * @defaultValue `true`
   */
  dismissible?: boolean
  /**
   * The Flow ID to render. You can find the Flow ID in the Frigade dashboard.
   */
  flowId: string
  /**
   * Handler for when the Flow is completed.
   */
  onComplete?: FlowHandlerProp
  /**
   * Handler for when the Flow is dismissed.
   */
  onDismiss?: FlowHandlerProp
  /**
   * Handler for when primary button is clicked.
   */
  onPrimary?: StepHandlerProp
  /**
   * Handler for when secondary button is clicked.
   */
  onSecondary?: StepHandlerProp
  /**
   * Variables to pass to the Flow. You can use variables in the Flow configuration to customize copy.
   * For instance, you can use `title: Hello, ${name}!` in the Flow configuration and pass `variables={{name: 'John'}}` to customize the copy.
   */
  variables?: Record<string, unknown>
}

export interface FlowChildrenProps {
  flow: FlowType
  handleDismiss: DismissHandler
  handlePrimary: StepHandler
  handleSecondary: StepHandler
  parentProps: Record<string, unknown>
  step: FlowStep
}
