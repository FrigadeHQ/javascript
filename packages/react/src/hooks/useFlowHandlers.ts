import { useCallback, useEffect, useRef } from 'react'

import { Flow } from '@frigade/js'

export type FlowHandlerProp = (
  flow: Flow,
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

    if (flow.isCompleted && lastCompleted.current === false) {
      ;(async () => {
        await onComplete?.(flow)
      })()
    }

    lastCompleted.current = flow?.isCompleted
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
      [flow]
    ),
  }
}
