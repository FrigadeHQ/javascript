import { type BoxProps } from '@/components/Box'

import { type FlowHandlerProp } from '@/hooks/useFlowHandlers'
import { type StepHandlerProp } from '@/hooks/useStepHandlers'

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export interface FlowComponentProps extends Omit<BoxProps, 'container'> {
  /**
   * The type of container to render the Flow in. `dialog` will spawn a modal with the component in it.
   * `none` will render the component in the current context/inline.
   *
   * Defaults to 'none'.
   */
  container?: 'dialog' | 'none'
  /**
   * Whether the container is dismissible by clicking outside of it or pressing escape.
   *
   * Defaults to `true`.
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
