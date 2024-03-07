import { type SyntheticEvent, useCallback, useContext } from 'react'

import type { FlowStep } from '@frigade/js'

import { FrigadeContext } from '../components/Provider'

// TODO: Fix order of args
export type StepHandlerProp = (
  step: FlowStep,
  event?: SyntheticEvent<object, unknown>
) => Promise<boolean | void> | (boolean | void)

export interface StepHandlerProps {
  onPrimary?: StepHandlerProp
  onSecondary?: StepHandlerProp
}

export type StepHandler = (
  event: SyntheticEvent<object, unknown>,
  properties?: Record<string | number, unknown>
) => Promise<boolean>

export function useStepHandlers(step: FlowStep, { onPrimary, onSecondary }: StepHandlerProps = {}) {
  const { navigate } = useContext(FrigadeContext)

  return {
    handlePrimary: useCallback<StepHandler>(
      async (e, properties) => {
        const continueDefault = await onPrimary?.(step, e)

        if (continueDefault === false) {
          e.preventDefault()
          return false
        }

        step.complete(properties)

        if (step.primaryButtonUri != null) {
          navigate(step.primaryButtonUri, step.primaryButtonUriTarget)
        }

        return true
      },
      [step]
    ),

    handleSecondary: useCallback<StepHandler>(
      async (e, properties) => {
        const continueDefault = await onSecondary?.(step, e)

        if (continueDefault === false) {
          e.preventDefault()
          return false
        }

        // Should there be a step.skip method?
        step.complete(properties)

        if (step.secondaryButtonUri != null) {
          navigate(step.secondaryButtonUri, step.secondaryButtonUriTarget)
        }

        return true
      },
      [step]
    ),
  }
}
