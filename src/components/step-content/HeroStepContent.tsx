import {StepData} from '../../types'
import {
  HeroChecklistStepContent,
  HeroChecklistStepSubtitle,
  HeroChecklistStepTitle,
} from '../../Checklists/HeroChecklist/styled'
import {VideoPlayer} from '../../Checklists/HeroChecklist/VideoPlayer'
import {Button, MultipleButtonContainer} from '../Button'
import React, {FC} from 'react'
import {StepContentProps} from '../../FrigadeForm/types'

export const VIDEO_CAROUSEL_TYPE = 'videoCarousel'

export const HeroStepContent: FC<StepContentProps> = ({stepData, appearance}) => {
  return (stepData: StepData) => {
    if (steps[selectedStepValue]?.StepContent) {
      const Content: React.ReactNode = steps[selectedStepValue].StepContent
      return <div>{Content}</div>
    }
    const currentStep = steps[selectedStepValue]

    const handlePrimaryButtonClick = () => {
      if (currentStep.handlePrimaryButtonClick) {
        currentStep.handlePrimaryButtonClick()
      }
    }

    const handleSecondaryButtonClick = () => {
      if (currentStep.handleSecondaryButtonClick) {
        currentStep.handleSecondaryButtonClick()
      }
    }

    return (
      <HeroChecklistStepContent>
        {stepData.imageUri ? <StepImage src={stepData.imageUri} style={stepData.imageStyle}/> : null}
        {stepData.videoUri ? <VideoPlayer videoUri={stepData.videoUri}/> : null}
        <HeroChecklistStepTitle>{stepData.title}</HeroChecklistStepTitle>
        <HeroChecklistStepSubtitle>{stepData.subtitle}</HeroChecklistStepSubtitle>
        <MultipleButtonContainer>
          <Button
            appearance={appearance}
            title={stepData.primaryButtonTitle}
            onClick={handlePrimaryButtonClick}
            style={{
              width: 'auto',
              marginRight: '12px',
            }}
          />
          {stepData.secondaryButtonTitle && (
            <Button
              appearance={appearance}
              secondary
              title={stepData.secondaryButtonTitle}
              onClick={handleSecondaryButtonClick}
            />
          )}
        </MultipleButtonContainer>
      </HeroChecklistStepContent>
    )
  }
