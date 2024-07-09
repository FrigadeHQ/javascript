import { Card } from '@/components/Card'
import { Flow, FlowChildrenProps, type FlowPropsWithoutChildren } from '@/components/Flow'

import { CarouselEmblaWrapper } from '@/components/Checklist/CarouselEmblaWrapper'

export interface CarouselProps extends FlowPropsWithoutChildren {
  /**
   * @ignore
   */
  children?: React.ReactNode
  /**
   * How to sort the default the completed steps of the carousel.
   * - `completed-last` will sort the completed/skips steps to the end of the carousel.
   * - `default` will keep the order of the steps as they are in the flow.
   */
  sort?: 'completed-last' | 'default'
}

export function Carousel({ ...props }: CarouselProps) {
  return (
    <Flow as={Card} borderWidth={1} containerType="inline-size" p="4" part="carousel" {...props}>
      {(flowChildrenProps: FlowChildrenProps) => (
        <CarouselEmblaWrapper {...props} {...flowChildrenProps} />
      )}
    </Flow>
  )
}
