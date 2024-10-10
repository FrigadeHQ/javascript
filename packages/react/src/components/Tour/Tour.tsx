import { Box } from '@/components/Box'
import { ClientPortal, type ClientPortalProps } from '@/components/ClientPortal/ClientPortal'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import { AlignValue, SideValue, type HintProps } from '@/components/Hint'
import { TourStep } from '@/components/Tour/TourStep'

export interface TourProps extends FlowPropsWithoutChildren, Omit<HintProps, 'anchor'> {
  /**
   * The alignment of the tooltip relative to the anchor.
   * Possible values: `after`, `before`, `center`, `end`, `start`.
   */
  align?: AlignValue
  /**
   * The offset of the tooltip relative to the anchor along the alignment axis.
   */
  alignOffset?: number
  /**
   * Automatically scroll to the anchor element of the current Step
   */
  autoScroll?: boolean
  /**
   * Specify a container in the DOM render the Tour into
   */
  container?: ClientPortalProps['container']
  /**
   * Whether the tooltip should be open by default.
   */
  defaultOpen?: boolean
  /**
   * Whether to render a modal overlay behind the tooltip.
   */
  modal?: boolean
  /**
   * Callback function triggered when the open state of the tooltip changes.
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Controls the open state of the tooltip. Use this for controlled components.
   */
  open?: boolean
  /**
   * Whether the Tour should be completed by the end-user in sequential order.
   * If `false`, all steps will be rendered at once.
   * Defaults to `true`, which means only one step will be rendered at a time in sequential order.
   */
  sequential?: boolean
  /**
   * The preferred side of the anchor to render the tooltip.
   * Possible values: `top`, `right`, `bottom`, `left`.
   */
  side?: SideValue
  /**
   * The distance in pixels from the tooltip to the anchor element.
   */
  sideOffset?: number
  /**
   * Whether to highlight the anchor element with a spotlight/scrim effect.
   */
  spotlight?: boolean
}

function TourWrapper({ children, container, flowId, ...props }: Partial<TourProps>) {
  return (
    <ClientPortal container={container}>
      <Box data-flow-id={flowId} part="tour" {...props}>
        {children}
      </Box>
    </ClientPortal>
  )
}

export function Tour({ as, flowId, ...props }: TourProps) {
  const { onDismiss, onPrimary, onSecondary } = props

  return (
    <Flow as={null} flowId={flowId} {...props}>
      {({ flow, handleDismiss, parentProps, step }) => {
        const {
          align = 'after',
          alignOffset = 0,
          autoScroll = false,
          container = 'body',
          defaultOpen,
          modal,
          part,
          sequential = true,
          side = 'bottom',
          sideOffset = 0,
          spotlight,
          zIndex = 9999,
          ...containerProps
        } = parentProps.containerProps as Partial<TourProps>

        const { dismissible } = parentProps

        const sequentialStepProps = {
          align,
          alignOffset,
          autoScroll,
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
          zIndex,
          ...(step.props ?? {}),
        }

        if (sequential) {
          return (
            <TourWrapper
              as={as}
              container={container}
              flowId={flowId}
              part="tour"
              zIndex={zIndex}
              {...containerProps}
            >
              <TourStep defaultOpen={defaultOpen ?? true} key={step.id} {...sequentialStepProps} />
            </TourWrapper>
          )
        }

        // TODO: Only render spotlight if current step
        // TODO: Only render modal overlay once
        const tourSteps = Array.from(flow.steps.values())
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

            const currentStepZIndex = currentStep.props?.zIndex ?? zIndex

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

        return (
          <TourWrapper
            as={as}
            container={container}
            flowId={flowId}
            part="tour"
            zIndex={zIndex}
            {...containerProps}
          >
            {tourSteps}
          </TourWrapper>
        )
      }}
    </Flow>
  )
}
