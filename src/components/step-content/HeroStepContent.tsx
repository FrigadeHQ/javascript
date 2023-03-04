import {
  HeroChecklistStepContent,
  HeroChecklistStepSubtitle,
  HeroChecklistStepTitle,
} from '../../Checklists/HeroChecklist/styled'
import { VideoPlayer } from '../../Checklists/HeroChecklist/VideoPlayer'
import { Button, MultipleButtonContainer } from '../Button'
import React, { FC } from 'react'
import { StepContentProps } from '../../FrigadeForm/types'
import styled from 'styled-components'

export const HERO_STEP_CONTENT_TYPE = 'default'
const StepImage = styled.img`
  border-radius: 4px;
  max-height: 260px;
  min-height: 200px;
`
export const HeroStepContent: FC<StepContentProps> = ({ stepData, appearance }) => {
  if (stepData?.StepContent) {
    const Content: React.ReactNode = stepData.StepContent
    return <div>{Content}</div>
  }

  const handlePrimaryButtonClick = () => {
    if (stepData.handlePrimaryButtonClick) {
      stepData.handlePrimaryButtonClick()
    }
  }

  const handleSecondaryButtonClick = () => {
    if (stepData.handleSecondaryButtonClick) {
      stepData.handleSecondaryButtonClick()
    }
  }

  return (
    <HeroChecklistStepContent>
      {stepData.imageUri ? <StepImage src={stepData.imageUri} style={stepData.imageStyle} /> : null}
      {stepData.videoUri ? <VideoPlayer videoUri={stepData.videoUri} /> : null}
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
