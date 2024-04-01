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

  const stepActions = {
    'flow.back': () => step.flow.back(),
    'flow.complete': () => step.flow.complete(),
    'flow.forward': () => step.flow.forward(),
    'flow.restart': () => step.flow.restart(),
    'flow.skip': () => step.flow.skip(),
    'flow.start': () => step.flow.start(),
    'step.complete': () => step.complete(),
    'step.reset': () => step.reset(),
    'step.start': () => step.start(),
  }

  return {
    handlePrimary: useCallback<StepHandler>(
      async (e, properties) => {
        const continueDefault = await onPrimary?.(step, e)

        if (continueDefault === false) {
          e.preventDefault()
          return false
        }

        if (step.primaryButton != null) {
          const primaryAction = stepActions[step.primaryButton.action]

          if (primaryAction != null) {
            primaryAction()
          }

          if (step.primaryButton.uri != null) {
            navigate(step.primaryButton.uri, step.primaryButton.target)
          }
        } else {
          step.complete(properties)

          if (step.primaryButtonUri != null) {
            navigate(step.primaryButtonUri, step.primaryButtonUriTarget)
          }
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

        if (step.secondaryButton != null) {
          const secondaryAction = stepActions[step.secondaryButton.action]

          if (secondaryAction != null) {
            secondaryAction()
          }

          if (step.secondaryButton.uri != null) {
            navigate(step.secondaryButton.uri, step.secondaryButton.target)
          }
        } else {
          // Should there be a step.skip method?
          step.complete(properties)

          if (step.secondaryButtonUri != null) {
            navigate(step.secondaryButtonUri, step.secondaryButtonUriTarget)
          }
        }

        return true
      },
      [step]
    ),
  }
}
