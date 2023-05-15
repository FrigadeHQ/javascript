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
import { useTheme } from '../hooks/useTheme'

interface CarouselCardProps {
  stepData: StepData
  style?: React.CSSProperties
}

export const CarouselCard: FC<CarouselCardProps> = ({ stepData, style = {} }) => {
  const { mergeAppearanceWithDefault } = useTheme()
  const { primaryCTAClickSideEffects } = useCTAClickSideEffects()

  const { theme } = mergeAppearanceWithDefault({})

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
      {title && (
        <H4 style={{ marginBottom: 4, color: complete ? theme.colorTextDisabled : null }}>
          {title}
        </H4>
      )}
      {subtitle && (
        <Body.Quiet style={{ color: complete ? theme.colorTextDisabled : null }}>
          {subtitle}
        </Body.Quiet>
      )}
    </StyledCarouselCard>
  )
}
