import { useCallback, useEffect, useRef } from 'react'

import { Flow } from '@frigade/js'

/**
 * A function that handles a Flow event.
 * If the function returns a promise that evaluates to `false`, the Flow's state will not be updated for the current user (e.g. a Flow will not be marked as completed or dismissed).
 */
export type FlowHandlerProp = (
  /**
   * The Flow that the handler is being called on
   */
  flow: Flow,
  /**
   * The event that triggered the handler
   */
  event?: MouseEvent | KeyboardEvent
) => Promise<boolean | void> | (boolean | void)

export interface FlowHandlerProps {
  onComplete?: FlowHandlerProp
  onDismiss?: FlowHandlerProp
}

export type DismissHandler = (e: MouseEvent | KeyboardEvent) => Promise<boolean | void>

export function useFlowHandlers(flow: Flow, { onComplete, onDismiss }: FlowHandlerProps = {}) {
  const lastCompleted = useRef(null)

  useEffect(() => {
    if (flow == null) return

    async function callHandler() {
      if (flow.isCompleted && lastCompleted.current === false) {
        lastCompleted.current = true
        await onComplete?.(flow)
      }
    }

    callHandler()
    lastCompleted.current = flow?.isCompleted
    return () => {
      callHandler()
    }
  }, [flow?.isCompleted])

  return {
    handleDismiss: useCallback<DismissHandler>(
      async (e: MouseEvent | KeyboardEvent) => {
        const continueDefault = await onDismiss?.(flow, e)

        if (continueDefault === false) {
          e.preventDefault()
          return false
        }

        flow.skip()
      },
      [flow, onDismiss]
    ),
  }
}
