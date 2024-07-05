import { Card } from '@/components/Card'
import { Flow, FlowChildrenProps, type FlowProps } from '@/components/Flow'

import { CarouselEmblaWrapper } from '@/components/Checklist/CarouselEmblaWrapper'

export function Carousel({ ...props }: FlowProps) {
  return (
    <Flow as={Card} borderWidth={1} containerType="inline-size" p="4" part="carousel" {...props}>
      {(flowChildrenProps: FlowChildrenProps) => <CarouselEmblaWrapper {...flowChildrenProps} />}
    </Flow>
  )
}
