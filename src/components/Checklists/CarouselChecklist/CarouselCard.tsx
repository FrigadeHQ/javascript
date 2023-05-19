import React, { FC } from 'react'
import { Appearance, StepData } from '../../../types'
import { useCTAClickSideEffects } from '../../../hooks/useCTAClickSideEffects'

import {
  Body,
  CardTitle,
  CompletedPill,
  Small,
  StyledCarouselCard,
  StyledCarouselCardImage,
} from './styled'
import { useTheme } from '../../../hooks/useTheme'
import { getClassName } from '../../../shared/appearance'

interface CarouselCardProps {
  stepData: StepData
  style?: React.CSSProperties
  appearance?: Appearance
}

export const CarouselCard: FC<CarouselCardProps> = ({ stepData, style = {}, appearance }) => {
  const { mergeAppearanceWithDefault } = useTheme()
  const { primaryCTAClickSideEffects } = useCTAClickSideEffects()

  const { theme, styleOverrides } = mergeAppearanceWithDefault(appearance)

  const {
    imageUri = null,
    subtitle = null,
    title = null,
    complete = false,
    blocked = false,
  } = stepData

  const handleClick = () => {
    primaryCTAClickSideEffects(stepData)
  }

  return (
    <StyledCarouselCard
      className={getClassName('carouselCard', appearance)}
      onClick={blocked ? null : handleClick}
      style={style}
      blocked={blocked}
      complete={complete}
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
        <CardTitle
          blocked={blocked}
          complete={complete}
          className={getClassName('carouselCardTitle', appearance)}
        >
          {title}
        </CardTitle>
      )}
      {subtitle && (
        <Body.Quiet
          blocked={blocked}
          complete={complete}
          className={getClassName('carouselCardSubtitle', appearance)}
        >
          {subtitle}
        </Body.Quiet>
      )}
    </StyledCarouselCard>
  )
}
