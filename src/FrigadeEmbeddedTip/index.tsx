import { DefaultFrigadeFlowProps, StepData } from '../types'
import React, { useEffect } from 'react'
import { useFlows } from '../api/flows'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'
import { useTheme } from '../hooks/useTheme'
import { COMPLETED_FLOW } from '../api/common'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import { CallToActionContainer, DismissButton, EmbeddedTipContainer, TextContainer } from './styled'
import { getClassName, mergeClasses } from '../shared/appearance'
import { Close } from '../components/Icons/Close'
import { TitleSubtitle } from '../components/TitleSubtitle/TitleSubtitle'
import { Button } from '../components/Button'

export interface FrigadeEmbeddedTipProps extends DefaultFrigadeFlowProps {}

export const FrigadeEmbeddedTip: React.FC<FrigadeEmbeddedTipProps> = ({
  flowId,
  title,
  subtitle,
  onDismiss,
  customVariables,
  onButtonClick,
  appearance,
  className,
  style,
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
  const { mergeAppearanceWithDefault } = useTheme()

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
      <EmbeddedTipContainer
        appearance={appearance}
        className={mergeClasses(getClassName('embeddedTipContainer', appearance), className)}
        style={style}
      >
        {metaData.dismissible && (
          <DismissButton
            onClick={() => {
              markFlowCompleted(flowId)
              if (onDismiss) {
                onDismiss()
              }
            }}
            className={getClassName('embeddedTipDismissButton', appearance)}
          >
            <Close />
          </DismissButton>
        )}
        <TextContainer>
          <TitleSubtitle size="small" appearance={appearance} title={title} subtitle={subtitle} />
        </TextContainer>
        {metaData.primaryButtonTitle && (
          <CallToActionContainer
            className={getClassName('embeddedTipCallToActionContainer', appearance)}
          >
            <Button
              title={metaData.primaryButtonTitle}
              appearance={appearance}
              onClick={() => {
                primaryCTAClickSideEffects(metaData)
                if (onButtonClick) {
                  onButtonClick(metaData, 0, 'primary')
                }
              }}
            />
          </CallToActionContainer>
        )}
      </EmbeddedTipContainer>
    </>
  )
}
