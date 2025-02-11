import type { ReactNode } from 'react'
import * as React from 'react'
import type { Flow as FlowType, FlowStep } from '@frigade/js'

import type { BoxProps } from '@/components/Box'

import type { DismissHandler, FlowHandlerProp } from '@/hooks/useFlowHandlers'
import type { StepHandler, StepHandlerProp } from '@/hooks/useStepHandlers'

export interface BoxPropsWithoutChildren extends Omit<BoxProps, 'children'> {}

export interface FlowPropsWithoutChildren extends BoxPropsWithoutChildren {
  /**
   * Whether to automatically mark the Flow started (i.e. in progress) when the Flow is eligible to be shown.
   * You will need to call `flow.start()` or `step.start()` from the parent component if you set this to `false`. Most components should not need to override this behavior.
   *
   * Defaults to `true`.
   */
  autoStart?: boolean
  /**
   * Optional component to wrap the child components in, e.g. `as={Dialog}` will render the Flow in a modal Dialog. Defaults to `Box`.
   */
  as?: React.ElementType
  /**
   * Emotion CSS prop to apply to the component. See [Theming documentation](https://docs.frigade.com/v2/sdk/styling/css-overrides) for more information.
   *
   * Example usage:
   * ```
   * <Frigade.Checklist css={{ backgroundColor: "pink", ".fr-button-primary": { backgroundColor: "fuchsia" } }} />
   * ```
   */
  css?: React.Attributes['css']
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
   * Register the Flow as a modal to prevent popup collisions (only one modal Flow will render at a time).
   */
  modal?: boolean
  /**
   * Handler for when the Flow is completed. This is event is fired immediately after the user completes the Flow.
   */
  onComplete?: FlowHandlerProp
  /**
   * Handler for when the Flow is dismissed (skipped). This is event is fired immediately after the user dismisses the Flow.
   */
  onDismiss?: FlowHandlerProp
  /**
   * Handler for when primary button is clicked.
   * If this function returns false or a promise that resolves to `false`, the step will not be automatically completed when clicked.
   */
  onPrimary?: StepHandlerProp
  /**
   * Handler for when secondary button is clicked.
   * If this function returns false or a promise that resolves to `false`, the step will not be automatically completed when clicked.
   */
  onSecondary?: StepHandlerProp
  /**
   * Variables to pass to the Flow. You can use variables in the Flow configuration to customize copy.
   * For instance, you can use `title: Hello, ${name}!` in the Flow configuration and pass `variables={{name: 'John'}}` to customize the copy.
   */
  variables?: Record<string, unknown>
}

export interface FlowProps extends FlowPropsWithoutChildren {
  /**
   * Flow accepts a render function as its only child, whose props are described in FlowChildrenProps
   */
  children?: (props: FlowChildrenProps) => ReactNode
}

type ParentProps = {
  as: FlowPropsWithoutChildren['as']
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
