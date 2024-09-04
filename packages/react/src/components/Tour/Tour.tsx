import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import { type HintProps } from '@/components/Hint'
import { TourStep } from '@/components/Tour/TourStep'

import { useClientPortal } from '@/hooks/useClientPortal'

export interface TourProps extends FlowPropsWithoutChildren, Omit<HintProps, 'anchor'> {
  /**
   * Whether the tour should be completed by the end-user in sequential order.
   * If `false`, all steps will be rendered at once.
   * Defaults to `true`, which means only one step will be rendered at a time in sequential order.
   */
  sequential?: boolean
}

export function Tour({
  align = 'after',
  alignOffset = 0,
  as,
  defaultOpen,
  dismissible = false,
  flowId,
  modal,
  part,
  sequential = true,
  side = 'bottom',
  sideOffset = 0,
  spotlight,
  zIndex = 9999,
  ...props
}: TourProps) {
  const { onDismiss, onPrimary, onSecondary } = props

  return useClientPortal(
    <Flow as={as} flowId={flowId} part="tour" {...props}>
      {({ flow, handleDismiss, parentProps: { containerProps }, step }) => {
        const sequentialStepProps = {
          align,
          alignOffset,
          dismissible,
          flow,
          handleDismiss,
          modal,
          onPrimary,
          onSecondary,
          part,
          side,
          sideOffset,
          spotlight,
          step,
          zIndex: step.props?.zIndex ?? containerProps?.zIndex ?? zIndex,
          ...(step.props ?? {}),
        }

        if (sequential) {
          return <TourStep defaultOpen={defaultOpen ?? true} {...sequentialStepProps} />
        }

        // TODO: Only render spotlight if current step
        // TODO: Only render modal overlay once
        return Array.from(flow.steps.values())
          .filter((currentStep) => {
            const { blocked, completed, skipped, visible } = currentStep.$state

            return !blocked && !completed && !skipped && visible
          })
          .map((currentStep) => {
            /*
             * Bit of a weird case here:
             * When sequential == false, we're only dismissing currentStep, not the whole Flow
             */
            async function handleDismissStep(e: MouseEvent | KeyboardEvent) {
              const continueDefault = await onDismiss?.(flow, e)

              if (continueDefault === false) {
                e.preventDefault()
                return false
              }

              currentStep.skip()

              return true
            }

            const shouldShowSpotlight = spotlight && currentStep.id === step.id

            const currentStepZIndex = currentStep.props?.zIndex ?? containerProps?.zIndex ?? zIndex

            const nonSequentialStepProps = {
              align,
              alignOffset,
              dismissible,
              flow,
              handleDismiss: handleDismissStep,
              onPrimary,
              onSecondary,
              part,
              side,
              sideOffset,
              spotlight,
              zIndex: currentStepZIndex,
              ...(currentStep.props ?? {}),
            }

            return (
              <TourStep
                css={{
                  '&:has([aria-expanded=true])': {
                    zIndex: Number(currentStepZIndex) + 2,
                  },

                  // NOTE: Selector does not currently apply due to rearranged component structure
                  '.fr-overlay': {
                    zIndex: Number(currentStepZIndex) + 1,
                  },

                  '.fr-progress-fraction': {
                    display: 'none',
                  },
                }}
                defaultOpen={(defaultOpen || shouldShowSpotlight) ?? false}
                key={`${currentStep.id}-${shouldShowSpotlight}`}
                step={currentStep}
                {...nonSequentialStepProps}
              />
            )
          })
      }}
    </Flow>,
    'body'
  )
}
