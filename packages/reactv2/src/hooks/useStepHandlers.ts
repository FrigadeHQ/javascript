import { MouseEvent, useCallback, useContext } from 'react'

import { FlowStep } from '@frigade/js/src'

import { FrigadeContext } from '../components/Provider'

export type StepHandler = (event: MouseEvent<unknown>, step: FlowStep) => boolean | void

export interface StepHandlersFromProps {
  onPrimary?: StepHandler
  onSecondary?: StepHandler
}

export function useStepHandlers(
  step: FlowStep,
  { onPrimary, onSecondary }: StepHandlersFromProps = {}
) {
  const { navigate } = useContext(FrigadeContext)

  return {
    handlePrimary: useCallback(
      async (e: MouseEvent<unknown>) => {
        const propReturnValue = onPrimary?.(e, step)

        if (propReturnValue === false) {
          e.preventDefault()
          return false
        }

        await step.complete()

        if (step.primaryButtonUri != null) {
          navigate(step.primaryButtonUri, step.primaryButtonUriTarget)
        }
      },
      [step]
    ),

    handleSecondary: useCallback(
      async (e: MouseEvent<unknown>) => {
        const propReturnValue = onSecondary?.(e, step)

        if (propReturnValue === false) {
          e.preventDefault()
          return false
        }

        // Should there be a step.skip method?
        await step.complete()

        if (step.secondaryButtonUri != null) {
          navigate(step.secondaryButtonUri, step.secondaryButtonUriTarget)
        }
      },
      [step]
    ),
  }
}
