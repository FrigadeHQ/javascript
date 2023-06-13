import React, { useEffect } from 'react'

import { useFlows } from '../api/flows'
import { DefaultFrigadeFlowProps, StepData } from '../types'
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
import { Close } from '../components/Icons/Close'
import { getClassName } from '../shared/appearance'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'
import { TitleSubtitle } from '../components/TitleSubtitle/TitleSubtitle'
import { useTheme } from '../hooks/useTheme'

/**
 * Frigade Banners
 * full-width: Full width banner, useful in top of the page
 * square: Square sized banner, useful in sidebars
 *
 */
export type FrigadeBannerType = 'full-width' | 'square'

export interface FrigadeBannerProps extends DefaultFrigadeFlowProps {
  type?: FrigadeBannerType
  title?: string
  subtitle?: string
  onDismiss?: () => void
  icon?: React.ReactNode
}

export const FrigadeBanner: React.FC<FrigadeBannerProps> = ({
  flowId,
  title,
  subtitle,
  onDismiss,
  customVariables,
  onButtonClick,
  appearance,
  type = 'full-width',
  icon,
}) => {
  const {
    getFlow,
    markFlowCompleted,
    isLoading,
    targetingLogicShouldHideFlow,
    updateCustomVariables,
    getFlowMetadata,
    getFlowStatus,
    getFlowSteps,
    getCurrentStepIndex,
  } = useFlows()
  const { primaryCTAClickSideEffects } = useCTAClickSideEffects()
  const { mergeAppearanceWithDefault } = useTheme()

  appearance = mergeAppearanceWithDefault(appearance)

  useEffect(() => {
    updateCustomVariables(customVariables)
  }, [customVariables, isLoading])

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

  const steps = getFlowSteps(flowId)

  const metaData = (
    steps.length > 0 ? steps[getCurrentStepIndex(flowId)] : getFlowMetadata(flowId)
  ) as StepData

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
          <IconContainer className={getClassName('bannerIconContainer', appearance)}>
            {icon ? icon : <Info />}
          </IconContainer>
        )}
        {type === 'square' && metaData.dismissible && (
          <DismissButtonContainer
            type={type}
            className={getClassName('bannerDismissButtonContainer', appearance)}
          >
            <DismissButton
              type={type}
              onClick={async () => {
                await markFlowCompleted(flowId)
                if (onDismiss) {
                  onDismiss()
                }
              }}
              className={getClassName('bannerDismissButton', appearance)}
            >
              <Close />
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
              onClick={async () => {
                await markFlowCompleted(flowId)
                if (onDismiss) {
                  onDismiss()
                }
              }}
              className={getClassName('bannerDismissButton', appearance)}
            >
              <Close />
            </DismissButton>
          </DismissButtonContainer>
        )}
      </BannerContainer>
    </>
  )
}
