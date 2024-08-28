import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import { type HintProps } from '@/components/Hint'
import { TourV2Step } from '@/components/Tour/TourV2Step'

import { useClientPortal } from '@/hooks/useClientPortal'

export interface TourProps extends FlowPropsWithoutChildren, Omit<HintProps, 'anchor'> {
  sequential?: boolean
}

export function TourV2({
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
  ...props
}: TourProps) {
  const { onDismiss, onPrimary, onSecondary } = props

  const hideProgressStyle = {
    '.fr-progress-fraction': {
      display: 'none',
    },
  }

  return useClientPortal(
    <Flow
      as={as}
      css={{
        '.fr-hint': {
          zIndex: 1,
        },
        '.fr-hint:has([aria-expanded=true])': {
          zIndex: 3,
        },
        '.fr-overlay': {
          zIndex: 2,
        },
        ...(!sequential ? hideProgressStyle : {}),
      }}
      flowId={flowId}
      part="tour"
      {...props}
    >
      {({ flow, handleDismiss, step }) => {
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
          ...(step.props ?? {}),
        }

        if (sequential) {
          return <TourV2Step defaultOpen={defaultOpen ?? true} {...sequentialStepProps} />
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

              ...(currentStep.props ?? {}),
            }

            return (
              <TourV2Step
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
