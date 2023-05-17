import React, { FC } from 'react'
import { Appearance, StepData } from '../types'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'

import {
  Body,
  CompletedPill,
  H4,
  Small,
  StyledCarouselCard,
  StyledCarouselCardImage,
} from './styled'
import { useTheme } from '../hooks/useTheme'
import { getClassName } from '../shared/appearance'

interface CarouselCardProps {
  stepData: StepData
  style?: React.CSSProperties
  appearance?: Appearance
}

export const CarouselCard: FC<CarouselCardProps> = ({ stepData, style = {}, appearance }) => {
  const { mergeAppearanceWithDefault } = useTheme()
  const { primaryCTAClickSideEffects } = useCTAClickSideEffects()

  const { theme, styleOverrides } = mergeAppearanceWithDefault(appearance)

  const { imageUri = null, subtitle = null, title = null, complete = false } = stepData

  const handleClick = () => {
    primaryCTAClickSideEffects(stepData)
  }

  return (
    <StyledCarouselCard
      className={getClassName('carouselCard', appearance)}
      onClick={handleClick}
      style={style}
    >
      <div style={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'space-between' }}>
        {imageUri && (
          <StyledCarouselCardImage
            className={getClassName('carouselCardImage', appearance)}
            src={imageUri}
            alt={title}
            style={{ opacity: complete ? 0.6 : 1 }}
          />
        )}
        {complete && (
          <CompletedPill className={getClassName('carouselCompletedPill', appearance)}>
            <Small style={{ color: '#108E0B' }}>Complete</Small>
          </CompletedPill>
        )}
      </div>
      {title && (
        <H4
          style={{ marginBottom: 4, color: complete ? theme.colorTextDisabled : null }}
          className={getClassName('carouselTitle', appearance)}
        >
          {title}
        </H4>
      )}
      {subtitle && (
        <Body.Quiet
          style={{ color: complete ? theme.colorTextDisabled : null }}
          className={getClassName('carouselSubtitle', appearance)}
        >
          {subtitle}
        </Body.Quiet>
      )}
    </StyledCarouselCard>
  )
}
