import { DefaultFrigadeFlowProps } from '../types'
import React, { useEffect } from 'react'
import { useFlows } from '../api/flows'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'
import { useTheme } from '../hooks/useTheme'
import { COMPLETED_FLOW } from '../api/common'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import { Portal } from 'react-portal'
import {
  DismissButton,
  NPSCTAContainer,
  NPSLabel,
  NPSLabelContainer,
  NPSNumberButton,
  NPSNumberButtonContainer,
  NPSSurveyContainer,
  TextArea,
  TextContainer,
} from './styled'
import { getClassName, mergeClasses } from '../shared/appearance'
import { Close } from '../components/Icons/Close'
import { TitleSubtitle } from '../components/TitleSubtitle/TitleSubtitle'
import { useFlowOpens } from '../api/flow-opens'
import { Button } from '../components/Button'
import { useFlowImpressions } from '../hooks/useFlowImpressions'
import { removeHTMLChars } from '../shared/sanitizer'

export interface FrigadeNPSSurveyProps extends DefaultFrigadeFlowProps {
  dismissible?: boolean
  type?: 'inline' | 'modal'
}

export const FrigadeNPSSurvey: React.FC<FrigadeNPSSurveyProps> = ({
  flowId,
  onDismiss,
  customVariables,
  onButtonClick,
  appearance,
  className,
  style,
  type = 'modal',
}) => {
  const {
    getFlow,
    markFlowCompleted,
    markFlowSkipped,
    markStepCompleted,
    getNumberOfStepsCompleted,
    isLoading,
    targetingLogicShouldHideFlow,
    updateCustomVariables,
    getFlowSteps,
    getFlowStatus,
    getFlowMetadata,
    markStepNotStarted,
  } = useFlows()
  const { primaryCTAClickSideEffects } = useCTAClickSideEffects()
  const { mergeAppearanceWithDefault } = useTheme()
  const [score, setScore] = React.useState<number | null>(null)
  const [feedbackText, setFeedbackText] = React.useState<string>('')
  const metadata = getFlowMetadata(flowId)
  const numberOfStepsCompleted = getNumberOfStepsCompleted(flowId)
  const {
    hasOpenModals,
    setKeepCompletedFlowOpenDuringSession,
    shouldKeepCompletedFlowOpenDuringSession,
  } = useFlowOpens()
  useFlowImpressions(flowId)

  appearance = mergeAppearanceWithDefault(appearance)

  useEffect(() => {
    updateCustomVariables(customVariables)
  }, [customVariables, isLoading])

  useEffect(() => {
    if (
      numberOfStepsCompleted === 1 &&
      !shouldKeepCompletedFlowOpenDuringSession(flowId) &&
      getFlowStatus(flowId) !== COMPLETED_FLOW
    ) {
      markFlowSkipped(flowId)
    }
  }, [numberOfStepsCompleted])

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

  if (
    getNumberOfStepsCompleted(flowId) === 1 &&
    !shouldKeepCompletedFlowOpenDuringSession(flowId)
  ) {
    return null
  }

  if (hasOpenModals()) {
    return null
  }

  const steps = getFlowSteps(flowId)

  const currentStep = steps[getNumberOfStepsCompleted(flowId)]

  function getScoreChooser() {
    return (
      <>
        <TextContainer>
          <TitleSubtitle
            size="large"
            appearance={appearance}
            title={currentStep.title}
            subtitle={currentStep.subtitle}
          />
        </TextContainer>
        <NPSNumberButtonContainer
          className={getClassName('npsNumberButtonContainer', appearance)}
          appearance={appearance}
        >
          {Array.from(Array(11).keys()).map((i) => (
            <NPSNumberButton
              className={getClassName('npsNumberButton', appearance)}
              selected={score === i}
              key={i}
              onClick={async () => {
                setKeepCompletedFlowOpenDuringSession(flowId)
                setScore(i)
                await markStepCompleted(flowId, currentStep.id, { score: i })
              }}
              appearance={appearance}
            >
              {i}
            </NPSNumberButton>
          ))}
        </NPSNumberButtonContainer>
        <NPSLabelContainer appearance={appearance}>
          <NPSLabel appearance={appearance}>
            {metadata?.negativeLabel ?? `Not likely at all`}
          </NPSLabel>
          <NPSLabel appearance={appearance}>
            {metadata?.positiveLabel ?? `Extremely likely`}
          </NPSLabel>
        </NPSLabelContainer>
      </>
    )
  }

  function getScoreReason() {
    return (
      <>
        <TextContainer>
          <TitleSubtitle
            appearance={appearance}
            title={currentStep.title ?? `Why did you choose this score?`}
            subtitle={currentStep.subtitle ?? undefined}
            size="large"
          />
        </TextContainer>
        <TextArea
          appearance={appearance}
          value={feedbackText}
          onChange={(e) => {
            setFeedbackText(e.target.value)
          }}
          placeholder={
            removeHTMLChars(currentStep.placeholder) ?? 'Add your optional feedback here...'
          }
        ></TextArea>
        <NPSNumberButtonContainer
          appearance={appearance}
          className={getClassName('npsNumberButtonContainer', appearance)}
        >
          {currentStep.backButtonTitle && (
            <Button
              size={'large'}
              withMargin={false}
              onClick={async () => {
                markStepNotStarted(flowId, steps[0].id)
                markStepNotStarted(flowId, currentStep.id)
              }}
              appearance={appearance}
              title={currentStep.backButtonTitle}
              secondary
            />
          )}
          <NPSCTAContainer
            appearance={appearance}
            className={getClassName('npsCTAContainer', appearance)}
          >
            <Button
              size={'large'}
              withMargin={false}
              onClick={async () => {
                await markFlowCompleted(flowId)
                if (onButtonClick) {
                  onButtonClick(currentStep, 1, 'primary')
                }
              }}
              appearance={appearance}
              title={currentStep.secondaryButtonTitle || 'Skip'}
              secondary
            />
            <Button
              size={'large'}
              withMargin={false}
              onClick={async () => {
                await markStepCompleted(flowId, currentStep.id, { feedbackText })
                await markFlowCompleted(flowId)
                if (onButtonClick) {
                  onButtonClick(currentStep, 1, 'primary')
                }
              }}
              appearance={appearance}
              title={currentStep.primaryButtonTitle || 'Submit'}
            />
          </NPSCTAContainer>
        </NPSNumberButtonContainer>
      </>
    )
  }

  function getContent() {
    if (getNumberOfStepsCompleted(flowId) >= 2) {
      return null
    }

    return (
      <>
        <RenderInlineStyles appearance={appearance} />
        <NPSSurveyContainer
          appearance={appearance}
          className={mergeClasses(getClassName('npsSurveyContainer', appearance), className)}
          style={style}
          type={type}
        >
          <DismissButton
            onClick={async () => {
              await markFlowSkipped(flowId)
              if (onDismiss) {
                onDismiss()
              }
            }}
            className={getClassName('npsSurveyDismissButton', appearance)}
          >
            <Close />
          </DismissButton>
          {getNumberOfStepsCompleted(flowId) == 0 && getScoreChooser()}
          {getNumberOfStepsCompleted(flowId) == 1 && getScoreReason()}
        </NPSSurveyContainer>
      </>
    )
  }

  if (type === 'inline') {
    return getContent()
  }

  return <Portal>{getContent()}</Portal>
}
