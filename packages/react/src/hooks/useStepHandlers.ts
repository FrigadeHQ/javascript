import { type SyntheticEvent, useCallback, useContext } from 'react'

import type { FlowStep, PropertyPayload } from '@frigade/js'

import { FrigadeContext } from '@/components/Provider'

// TODO: Fix order of args
export type StepHandlerProp = (
  step: FlowStep,
  event?: SyntheticEvent<object, unknown>,
  properties?: PropertyPayload
) => Promise<boolean | void> | (boolean | void)

export interface StepHandlerProps {
  onPrimary?: StepHandlerProp
  onSecondary?: StepHandlerProp
}

export type StepHandler = (
  /**
   * The native event that triggered this handler.
   */
  event: SyntheticEvent<object, unknown>,
  /**
   * Additional properties to pass to the step.
   */
  properties?: PropertyPayload,
  /**
   * If true, the step will be marked as completed without waiting for the API and validation of any targeting rules.
   * @default true
   */
  optimistic?: boolean
) => Promise<boolean>

export function useStepHandlers(step: FlowStep, { onPrimary, onSecondary }: StepHandlerProps = {}) {
  const { navigate } = useContext(FrigadeContext)

  const stepActions = {
    'flow.back': (...args) => step.flow.back(...args),
    'flow.complete': (...args) => step.flow.complete(...args),
    'flow.forward': (...args) => step.flow.forward(...args),
    'flow.restart': () => step.flow.restart(),
    'flow.skip': (...args) => step.flow.skip(...args),
    'flow.start': (...args) => step.flow.start(...args),
    'step.complete': (...args) => step.complete(...args),
    'step.skip': (...args) => step.skip(...args),
    'step.reset': () => step.reset(),
    'step.start': (...args) => step.start(...args),
  }

  return {
    handlePrimary: useCallback<StepHandler>(
      async (e, properties, optimistic = true) => {
        const continueDefault = await onPrimary?.(step, e, properties)
        if (continueDefault === false) {
          e.preventDefault()
          return false
        }

        if (step.primaryButton != null) {
          const primaryAction =
            step.primaryButton.action === false ? false : stepActions[step.primaryButton.action]

          if (typeof primaryAction === 'function') {
            await primaryAction(properties, optimistic)
          } else if (primaryAction !== false) {
            await step.complete(properties, optimistic)
          }

          if (step.primaryButton.uri != null) {
            navigate(step.primaryButton.uri, step.primaryButton.target)
          }
        } else {
          await step.complete(properties, optimistic)

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
        const continueDefault = await onSecondary?.(step, e, properties)

        if (continueDefault === false) {
          e.preventDefault()
          return false
        }

        if (step.secondaryButton != null) {
          const secondaryAction =
            step.secondaryButton.action === false ? false : stepActions[step.secondaryButton.action]

          if (typeof secondaryAction === 'function') {
            secondaryAction()
          } else if (secondaryAction !== false) {
            step.complete(properties)
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
