import React, { FC } from 'react'
import { Appearance, StepData } from '../../../types'
import { useCTAClickSideEffects } from '../../../hooks/useCTAClickSideEffects'
import { CTA } from '../../checklist-step-content/shared/CTA'

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

  appearance = mergeAppearanceWithDefault(appearance)

  const {
    imageUri = null,
    subtitle = null,
    title = null,
    complete = false,
    blocked = false,
  } = stepData

  const hasCTA = stepData.primaryButtonTitle || stepData.secondaryButtonTitle

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
      {imageUri && (
        <StyledCarouselCardImage
          className={getClassName('carouselCardImage', appearance)}
          src={imageUri}
          alt={title}
          style={{ opacity: complete || blocked ? 0.4 : 1 }}
        />
      )}
      {(complete || true) && (
        <CompletedPill className={getClassName('carouselCompletedPill', appearance)}>
          <Small style={{ color: '#108E0B' }}>Complete</Small>
        </CompletedPill>
      )}
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
      {/* !(complete || blocked) && hasCTA && <CTA stepData={stepData} appearance={appearance} /> */}
    </StyledCarouselCard>
  )
}
