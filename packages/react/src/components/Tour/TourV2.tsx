import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import { type HintProps } from '@/components/Hint'

import { TourV2Step } from '@/components/Tour/TourV2Step'

export interface TourProps extends FlowPropsWithoutChildren, Omit<HintProps, 'anchor'> {
  sequential?: boolean
}

export function TourV2({
  align = 'after',
  alignOffset = 0,
  as = null,
  defaultOpen,
  dismissible = true,
  flowId,
  part,
  sequential = true,
  side = 'bottom',
  sideOffset = 0,
  spotlight,
  ...props
}: TourProps) {
  return (
    <Flow as={as} flowId={flowId} {...props}>
      {({ flow, handleDismiss, handlePrimary, handleSecondary, step }) => {
        // const stepProps = step.props ?? {}

        if (sequential) {
          return (
            <TourV2Step
              defaultOpen={defaultOpen ?? true}
              {...{
                align,
                alignOffset,
                dismissible,
                flow,
                handleDismiss,
                handlePrimary,
                handleSecondary,
                part,
                side,
                sideOffset,
                spotlight,
                step,
              }}
            />
          )
        }

        return Array.from(flow.steps.values())
          .filter((currentStep) => {
            const { blocked, completed, visible } = currentStep.$state

            return !blocked && !completed && visible
          })
          .map((currentStep) => {
            console.log('CURRENT STEP: ', currentStep)
            return (
              <TourV2Step
                defaultOpen={defaultOpen ?? false}
                key={currentStep.id}
                step={currentStep}
                {...{
                  align,
                  alignOffset,
                  dismissible,
                  flow,
                  handleDismiss,
                  handlePrimary,
                  handleSecondary,
                  part,
                  side,
                  sideOffset,
                  spotlight,
                }}
              />
            )
          })
      }}
    </Flow>
  )
}
