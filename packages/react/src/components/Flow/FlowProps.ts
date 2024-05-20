import type { ReactNode } from 'react'
import * as React from 'react'
import type { Flow as FlowType, FlowStep } from '@frigade/js'

import type { BoxProps } from '@/components/Box'

import type { DismissHandler, FlowHandlerProp } from '@/hooks/useFlowHandlers'
import type { StepHandler, StepHandlerProp } from '@/hooks/useStepHandlers'

export interface BoxPropsWithoutChildren extends Omit<BoxProps, 'children'> {}

export interface FlowPropsWithoutChildren extends BoxPropsWithoutChildren {
  /**
   * Whether the Flow is dismissible or not
   *
   */
  dismissible?: boolean
  /**
   * The Flow ID to render. You can find the Flow ID in the Frigade dashboard.
   */
  flowId: string
  /**
   * If true, the Flow will be mounted even if it has already been completed or dismissed.
   * However, if the user does not match the Flow's targeting, the Flow will not be mounted.
   */
  forceMount?: boolean
  /**
   * Handler for when the Flow is completed.
   * If this function a promise that evaluates to `false`, the Flow will not be marked as completed.
   */
  onComplete?: FlowHandlerProp
  /**
   * Handler for when the Flow is dismissed.
   * If this function a promise that evaluates to `false`, the Flow will not be marked as dismissed.
   */
  onDismiss?: FlowHandlerProp
  /**
   * Handler for when primary button is clicked.
   * If this function a promise that evaluates to `false`, the step will not be automatically completed when clicked.
   */
  onPrimary?: StepHandlerProp
  /**
   * Handler for when secondary button is clicked.
   * If this function a promise that evaluates to `false`, the step will not be automatically completed when clicked.
   */
  onSecondary?: StepHandlerProp
  /**
   * Variables to pass to the Flow. You can use variables in the Flow configuration to customize copy.
   * For instance, you can use `title: Hello, ${name}!` in the Flow configuration and pass `variables={{name: 'John'}}` to customize the copy.
   */
  variables?: Record<string, unknown>

  /**
   * Optional component type to wrap the child components in. Use the`as={Box}` component for inline placement or the `as={Dialog}` component for modal placement.
   * If you want to wrap the Flow in a custom component (such as your own modal), you can pass the custom component here.
   */
  as?: React.ElementType
}

export interface FlowProps extends FlowPropsWithoutChildren {
  /**
   * Flow accepts a render function as its only child, whose props are described in FlowChildrenProps
   */
  children?: (props: FlowChildrenProps) => ReactNode
}

type ParentProps = {
  containerProps: Record<string, unknown>
  dismissible: boolean
  flowId: string
  variables: Record<string, unknown>
}

export interface FlowChildrenProps {
  flow: FlowType
  handleDismiss: DismissHandler
  handlePrimary: StepHandler
  handleSecondary: StepHandler
  parentProps: ParentProps
  step: FlowStep
}
