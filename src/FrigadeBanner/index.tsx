import React, { useEffect, useState } from 'react'

import { useFlows } from '../api/flows'
import { DefaultFrigadeFlowProps, mergeAppearanceWithDefault, StepData } from '../types'
import { COMPLETED_FLOW } from '../api/common'
import { useFlowOpens } from '../api/flow-opens'
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
  primaryColor,
  secondaryColor,
  style,
  initialSelectedStep,
  className,
  type,
  onDismiss,
  visible,
  customVariables,
  onStepCompletion,
  onButtonClick,
  appearance,
  setVisible,
}) => {
  const {
    getFlow,
    getFlowSteps,
    markStepCompleted,
    getStepStatus,
    getNumberOfStepsCompleted,
    markFlowCompleted,
    isLoading,
    targetingLogicShouldHideFlow,
    setCustomVariable,
    customVariables: existingCustomVariables,
    getStepOptionalProgress,
    getFlowMetadata,
    isStepBlocked,
    getFlowStatus,
    hasActiveFullPageFlow,
    setHasActiveFullPageFlow,
  } = useFlows()
  const { getOpenFlowState, setOpenFlowState } = useFlowOpens()
  const [selectedStep, setSelectedStep] = useState(initialSelectedStep || 0)
  const [finishedInitialLoad, setFinishedInitialLoad] = useState(false)
  const showModal = visible === undefined ? getOpenFlowState(flowId) : visible
  const isModal = type === 'modal' || type === 'withGuide'
  appearance = mergeAppearanceWithDefault(appearance)

  // TODO: Remove once primary and secondary colors are deprecated + removed
  if (primaryColor) {
    appearance.theme.colorPrimary = primaryColor
  }
  if (secondaryColor) {
    appearance.theme.colorSecondary = secondaryColor
  }

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
              onButtonClick(selectedStep, 0, 'primary')
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
  )
}
