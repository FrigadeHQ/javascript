import { MouseEvent, useCallback, useEffect, useRef } from 'react'

import { Flow } from '@frigade/js'

export type FlowHandler = (flow: Flow, event?: MouseEvent<unknown>) => boolean | void

export interface StepHandlers {
  onComplete?: FlowHandler
  onDismiss?: FlowHandler
}

export function useFlowHandlers(flow: Flow, { onComplete, onDismiss }: StepHandlers = {}) {
  const lastCompleted = useRef(null)

  useEffect(() => {
    if (flow == null) return

    if (flow.isCompleted && lastCompleted.current === false && onComplete) {
      onComplete(flow)
    }

    lastCompleted.current = flow?.isCompleted
  }, [flow?.isCompleted])

  return {
    handleDismiss: useCallback(
      async (e: MouseEvent<unknown>) => {
        const continueDefault = onDismiss?.(flow, e)

        if (continueDefault === false) {
          e.preventDefault()
          return false
        }

        await flow.skip()
      },
      [flow]
    ),
  }
}
