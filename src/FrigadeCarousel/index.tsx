import * as React from 'react'

import { Body, Body2, CarouselCard, CarouselContainer, CarouselFade, CarouselItems, CarouselScroll, H3, H4 } from './styled'
import { Placeholder } from './Placeholder'

// Modes - 2 up, 3 up, 3 with overflow

const PlaceholderCard = () => (
  <CarouselCard>
    <Placeholder />
    <H4 style={{ marginBottom: "4px" }}>Action title</H4>
    <Body2>Copy about the action, why a user should take the time to complete it and what value it adds to the product. In this larger size card leverage the space and provide more explanation.</Body2>
  </CarouselCard>
)

export const FrigadeCarousel: React.FC<{}> = () => {
  const cards = [1, 2, 3, 4, 5, 6];

  return <CarouselContainer>
    <H3 style={{ marginBottom: "4px" }}>Checklist title</H3>
    <Body style={{ marginBottom: "20px" }}>Checklist supplementary body copy</Body>

    <div style={{ position: "relative" }}>
    <CarouselFade style={{ top: 0, bottom: 0, left: -20, transform: "rotate(180deg)" }} />
      <CarouselFade style={{ top: 0, bottom: 0, right: -20 }} />
      <CarouselScroll>
        <CarouselItems style={{ width: `calc(33% * ${cards.length} - 40px)` }}>
          {[1, 2, 3, 4, 5, 6].map((_, i) => <PlaceholderCard key={i} />)}
          </CarouselItems>
      </CarouselScroll>
    </div>
  </CarouselContainer>
}