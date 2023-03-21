import React, { useEffect } from 'react'

import { useFlows } from '../api/flows'
import {
  DefaultAppearance,
  DefaultFrigadeFlowProps,
  mergeAppearanceWithDefault,
  StepData,
} from '../types'
import { COMPLETED_FLOW } from '../api/common'
import {
  BannerContainer,
  CallToActionContainer,
  DismissButton,
  IconContainer,
  TextContainer,
  TextSubtitle,
  TextTitle,
} from './styled'
import { Info } from '../components/Icons/Info'
import { Button } from '../components/Button'
import { CloseIcon } from '../components/CloseIcon'
import { primaryCTAClickSideEffects } from '../shared/cta-util'
import { getClassName } from '../shared/appearance'
import { RenderInlineStyles } from '../components/RenderInlineStyles'

/**
 * Frigade Banners
 * inline: Renders as an on-page element
 * modal: Display above other content with a shadowed background
 * withGuide: A modal banner with a Guide included beneath the modal content
 *
 */
export type FrigadeBannerType = 'inline' | 'modal' | 'withGuide'

export interface FrigadeBannerProps extends DefaultFrigadeFlowProps {}

export const FrigadeBanner: React.FC<FrigadeBannerProps> = ({
  flowId,
  title,
  subtitle,
  onDismiss,
  customVariables,
  onButtonClick,
  appearance = DefaultAppearance,
}) => {
  const {
    getFlow,
    markFlowCompleted,
    isLoading,
    targetingLogicShouldHideFlow,
    setCustomVariable,
    customVariables: existingCustomVariables,
    getFlowMetadata,
    getFlowStatus,
  } = useFlows()
  appearance = mergeAppearanceWithDefault(appearance)

  useEffect(() => {
    if (
      !isLoading &&
      customVariables &&
      JSON.stringify(existingCustomVariables) !=
        JSON.stringify({ ...existingCustomVariables, ...customVariables })
    ) {
      Object.keys(customVariables).forEach((key) => {
        setCustomVariable(key, customVariables[key])
      })
    }
  }, [isLoading, customVariables, setCustomVariable, existingCustomVariables])

  if (isLoading) {
    return null
  }

  const flow = getFlow(flowId)
  if (!flow) {
    return null
  }

  if (targetingLogicShouldHideFlow(flow)) {
    return null
  }

  if (getFlowStatus(flowId) === COMPLETED_FLOW) {
    return null
  }

  const metaData = getFlowMetadata(flowId) as StepData
  if (metaData?.title) {
    title = metaData.title
  }
  if (metaData?.subtitle) {
    subtitle = metaData.subtitle
  }

  return (
    <>
      <RenderInlineStyles appearance={appearance} />
      <BannerContainer
        appearance={appearance}
        className={getClassName('bannerContainer', appearance)}
      >
        <IconContainer>
          <Info />
        </IconContainer>
        <TextContainer>
          <TextTitle className={getClassName('bannerTitle', appearance)}>{title}</TextTitle>
          <TextSubtitle className={getClassName('bannerSubtitle', appearance)}>
            {subtitle}
          </TextSubtitle>
        </TextContainer>
        <CallToActionContainer className={getClassName('bannerCallToActionContainer', appearance)}>
          <Button
            title={metaData?.primaryButtonTitle ?? 'Get started'}
            appearance={appearance}
            onClick={() => {
              primaryCTAClickSideEffects(metaData)
              if (onButtonClick) {
                onButtonClick(metaData, 0, 'primary')
              }
            }}
          />
        </CallToActionContainer>
        {metaData.dismissible === true && (
          <DismissButton
            onClick={() => {
              markFlowCompleted(flowId)
              if (onDismiss) {
                onDismiss()
              }
            }}
            className={getClassName('bannerDismissButton', appearance)}
          >
            <CloseIcon />
          </DismissButton>
        )}
      </BannerContainer>
    </>
  )
}
