import { DefaultFrigadeFlowProps } from '../types'
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
import { useFlowImpressions } from '../hooks/useFlowImpressions'

export interface FrigadeEmbeddedTipProps extends DefaultFrigadeFlowProps {
  dismissible?: boolean
}

export const FrigadeEmbeddedTip: React.FC<FrigadeEmbeddedTipProps> = ({
  flowId,
  onDismiss,
  customVariables,
  onButtonClick,
  appearance,
  className,
  style,
  dismissible,
}) => {
  const {
    getFlow,
    markFlowCompleted,
    markStepCompleted,
    isLoading,
    targetingLogicShouldHideFlow,
    updateCustomVariables,
    getFlowSteps,
    getFlowStatus,
    getCurrentStepIndex,
  } = useFlows()
  const { primaryCTAClickSideEffects } = useCTAClickSideEffects()
  const { mergeAppearanceWithDefault } = useTheme()
  useFlowImpressions(flowId)

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

  const currentStep = steps[getCurrentStepIndex(flowId)]

  return (
    <>
      <RenderInlineStyles appearance={appearance} />
      <EmbeddedTipContainer
        appearance={appearance}
        className={mergeClasses(getClassName('embeddedTipContainer', appearance), className)}
        style={style}
      >
        {(dismissible === true || currentStep.dismissible) && (
          <DismissButton
            onClick={async () => {
              await markFlowCompleted(flowId)
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
          <TitleSubtitle
            size="small"
            appearance={appearance}
            title={currentStep.title}
            subtitle={currentStep.subtitle}
          />
        </TextContainer>
        {currentStep.primaryButtonTitle && (
          <CallToActionContainer
            className={getClassName('embeddedTipCallToActionContainer', appearance)}
          >
            <Button
              classPrefix="embeddedTip"
              title={currentStep.primaryButtonTitle}
              appearance={appearance}
              withMargin={false}
              size="medium"
              type="inline"
              onClick={async () => {
                currentStep.handlePrimaryButtonClick()
                primaryCTAClickSideEffects(currentStep)
                if (onButtonClick) {
                  const result = onButtonClick(currentStep, getCurrentStepIndex(flowId), 'primary')
                  if (result === false) {
                    return
                  }
                }
                await markStepCompleted(flowId, currentStep.id)
                await markFlowCompleted(flowId)
              }}
            />
          </CallToActionContainer>
        )}
      </EmbeddedTipContainer>
    </>
  )
}
