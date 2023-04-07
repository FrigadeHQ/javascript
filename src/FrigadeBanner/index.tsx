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
  DismissButtonContainer,
  IconContainer,
  TextContainer,
} from './styled'
import { Info } from '../components/Icons/Info'
import { Button } from '../components/Button'
import { CloseIcon } from '../components/CloseIcon'
import { getClassName } from '../shared/appearance'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'
import { TitleSubtitle } from '../components/TitleSubtitle/TitleSubtitle'

/**
 * Frigade Banners
 * full-width: Full width banner, useful in top of the page
 * square: Square sized banner, useful in sidebars
 *
 */
export type FrigadeBannerType = 'full-width' | 'square'

export interface FrigadeBannerProps extends DefaultFrigadeFlowProps {
  type: FrigadeBannerType
}

export const FrigadeBanner: React.FC<FrigadeBannerProps> = ({
  flowId,
  title,
  subtitle,
  onDismiss,
  customVariables,
  onButtonClick,
  appearance = DefaultAppearance,
  type = 'full-width',
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
  const { primaryCTAClickSideEffects } = useCTAClickSideEffects()
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
        type={type}
        appearance={appearance}
        className={getClassName('bannerContainer', appearance)}
      >
        {type != 'square' && (
          <IconContainer>
            <Info />
          </IconContainer>
        )}
        {type === 'square' && metaData.dismissible && (
          <DismissButtonContainer
            type={type}
            className={getClassName('bannerDismissButtonContainer', appearance)}
          >
            <DismissButton
              type={type}
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
          </DismissButtonContainer>
        )}
        <TextContainer type={type}>
          <TitleSubtitle appearance={appearance} title={title} subtitle={subtitle} />
        </TextContainer>
        <CallToActionContainer
          type={type}
          className={getClassName('bannerCallToActionContainer', appearance)}
        >
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
        {type !== 'square' && metaData.dismissible && (
          <DismissButtonContainer
            type={type}
            className={getClassName('bannerDismissButtonContainer', appearance)}
          >
            <DismissButton
              type={type}
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
          </DismissButtonContainer>
        )}
      </BannerContainer>
    </>
  )
}
