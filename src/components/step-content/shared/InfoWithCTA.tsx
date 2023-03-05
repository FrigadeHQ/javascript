import React, { FC } from 'react'

import {
  HeroChecklistStepSubtitle,
  HeroChecklistStepTitle,
} from '../../../Checklists/HeroChecklist/styled'
import { Button, MultipleButtonContainer } from '../../Button'
import { StepContentProps } from '../../../FrigadeForm/types'

export const InfoWithCTA: FC<StepContentProps> = ({ stepData, appearance }) => {
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
    <>
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
    </>
  )
}
