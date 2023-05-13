import React, { FC } from 'react'
import { StepData } from '../types'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'

import {
  CompletedPill,
  StyledCarouselCard,
  StyledCarouselCardImage,
  H4,
  Body,
  Small,
} from './styled'

interface CarouselCardProps {
  stepData: StepData
  style?: React.CSSProperties
}

export const CarouselCard: FC<CarouselCardProps> = ({ stepData, style = {} }) => {
  const { primaryCTAClickSideEffects } = useCTAClickSideEffects()

  const { imageUri = null, subtitle = null, title = null, complete = false } = stepData

  const handleClick = () => {
    primaryCTAClickSideEffects(stepData)
  }

  return (
    <StyledCarouselCard onClick={handleClick} style={style}>
      <div style={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'space-between' }}>
        {imageUri && (
          <StyledCarouselCardImage
            src={imageUri}
            alt={title}
            style={{ opacity: complete ? 0.6 : 1 }}
          />
        )}
        {complete && (
          <CompletedPill>
            <Small style={{ color: '#108E0B' }}>Complete</Small>
          </CompletedPill>
        )}
      </div>
      {title && <H4 style={{ marginBottom: 4, color: complete ? '#999' : null }}>{title}</H4>}
      {subtitle && <Body.Quiet style={{ color: complete ? '#999' : null }}>{subtitle}</Body.Quiet>}
    </StyledCarouselCard>
  )
}
