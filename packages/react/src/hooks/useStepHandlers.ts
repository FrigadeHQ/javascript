import { type SyntheticEvent, useCallback, useContext, useMemo } from 'react'

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

export interface ButtonLinkProps {
  as?: 'a'
  href?: string
  target?: string
  rel?: string
}

function getPrimaryUri(step: FlowStep): { uri?: string; target?: string } {
  if (step == null) return {}
  if (step.primaryButton != null) {
    return { uri: step.primaryButton.uri, target: step.primaryButton.target }
  }
  return { uri: step.primaryButtonUri, target: step.primaryButtonUriTarget }
}

function getSecondaryUri(step: FlowStep): { uri?: string; target?: string } {
  if (step == null) return {}
  if (step.secondaryButton != null) {
    return { uri: step.secondaryButton.uri, target: step.secondaryButton.target }
  }
  return { uri: step.secondaryButtonUri, target: step.secondaryButtonUriTarget }
}

// When the step exposes a URI and the consumer hasn't overridden `navigate`,
// render the button as a native anchor. Mobile browsers (Safari iOS, Chrome
// Android) only allow `window.open(_, '_blank')` when it runs synchronously in
// a user gesture — the awaited step.complete call breaks that gesture chain
// and the new tab is silently blocked. A real <a href target="_blank"> click
// is never popup-blocked.
function getLinkProps(uri: string | undefined, target: string | undefined): ButtonLinkProps {
  if (uri == null) return {}
  const linkProps: ButtonLinkProps = { as: 'a', href: uri }
  if (target != null) {
    linkProps.target = target
    if (target === '_blank') {
      linkProps.rel = 'noopener noreferrer'
    }
  }
  return linkProps
}

export function useStepHandlers(step: FlowStep, { onPrimary, onSecondary }: StepHandlerProps = {}) {
  const { navigate, hasCustomNavigate } = useContext(FrigadeContext)

  const stepActions = useMemo(
    () =>
      step == null
        ? {}
        : {
            'flow.back': (properties?: PropertyPayload) => step.flow.back(properties),
            'flow.complete': (properties?: PropertyPayload) => step.flow.complete(properties),
            'flow.forward': (properties?: PropertyPayload) => step.flow.forward(properties),
            'flow.restart': () => step.flow.restart(),
            'flow.skip': (properties?: PropertyPayload) => step.flow.skip(properties),
            'flow.start': (properties?: PropertyPayload) => step.flow.start(properties),
            'step.complete': (properties?: PropertyPayload, optimistic?: boolean) =>
              step.complete(properties, optimistic),
            'step.skip': (properties?: PropertyPayload, optimistic?: boolean) =>
              step.skip(properties, optimistic),
            'step.reset': () => step.reset(),
            'step.start': (properties?: PropertyPayload) => step.start(properties),
          },
    [step]
  )

  const { uri: primaryUri, target: primaryTarget } = getPrimaryUri(step)
  const { uri: secondaryUri, target: secondaryTarget } = getSecondaryUri(step)

  // Render as anchor only when we own the navigation. If the consumer passed a
  // custom `navigate` (e.g. next/router.push), they expect that callback to
  // run — fall back to the legacy button + onClick path so their behavior is
  // preserved.
  const renderPrimaryAsLink = primaryUri != null && !hasCustomNavigate
  const renderSecondaryAsLink = secondaryUri != null && !hasCustomNavigate

  const handlePrimary = useCallback<StepHandler>(
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

        if (step.primaryButton.uri != null && !renderPrimaryAsLink) {
          navigate(step.primaryButton.uri, step.primaryButton.target)
        }
      } else {
        await step.complete(properties, optimistic)

        if (step.primaryButtonUri != null && !renderPrimaryAsLink) {
          navigate(step.primaryButtonUri, step.primaryButtonUriTarget)
        }
      }

      return true
    },
    [navigate, onPrimary, renderPrimaryAsLink, step, stepActions]
  )

  const handleSecondary = useCallback<StepHandler>(
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

        if (step.secondaryButton.uri != null && !renderSecondaryAsLink) {
          navigate(step.secondaryButton.uri, step.secondaryButton.target)
        }
      } else {
        // Should there be a step.skip method?
        step.complete(properties)

        if (step.secondaryButtonUri != null && !renderSecondaryAsLink) {
          navigate(step.secondaryButtonUri, step.secondaryButtonUriTarget)
        }
      }

      return true
    },
    [navigate, onSecondary, renderSecondaryAsLink, step, stepActions]
  )

  const primaryButtonProps = useMemo(
    () => ({
      onClick: handlePrimary,
      ...(renderPrimaryAsLink ? getLinkProps(primaryUri, primaryTarget) : {}),
    }),
    [handlePrimary, primaryTarget, primaryUri, renderPrimaryAsLink]
  )

  const secondaryButtonProps = useMemo(
    () => ({
      onClick: handleSecondary,
      ...(renderSecondaryAsLink ? getLinkProps(secondaryUri, secondaryTarget) : {}),
    }),
    [handleSecondary, renderSecondaryAsLink, secondaryTarget, secondaryUri]
  )

  return {
    handlePrimary,
    handleSecondary,
    primaryButtonProps,
    secondaryButtonProps,
  }
}
