import React, { FC } from 'react'

import { Placeholder } from './Placeholder'
import { StyledCarouselCard, H4, Body } from './styled'

interface CarouselCardProps {
  title: string
  subtitle: string
}

export const CarouselCard: FC<CarouselCardProps> = ({ title, subtitle }) => {
  return (
    <StyledCarouselCard>
      <Placeholder />
      <H4 style={{ marginBottom: 4 }}>{title}</H4>
      <Body.Quiet>{subtitle}</Body.Quiet>
    </StyledCarouselCard>
  )
}
