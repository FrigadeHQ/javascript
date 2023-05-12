import React, { FC } from 'react'
import { StepData } from '../types'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'

import { StyledCarouselCard, StyledCarouselCardImage, H4, Body } from './styled'

interface CarouselCardProps {
  stepData: StepData
}

export const CarouselCard: FC<CarouselCardProps> = ({ stepData }) => {
  const { primaryCTAClickSideEffects } = useCTAClickSideEffects()

  const { imageUri = null, subtitle = null, title = null, primaryButtonUri = null } = stepData

  const handleClick = () => {
    primaryCTAClickSideEffects(stepData)
  }

  return (
    <StyledCarouselCard onClick={handleClick}>
      {imageUri && <StyledCarouselCardImage src={imageUri} alt={title} />}
      {title && <H4 style={{ marginBottom: 4 }}>{title}</H4>}
      {subtitle && <Body.Quiet>{subtitle}</Body.Quiet>}
    </StyledCarouselCard>
  )
}
