import React, { FC } from 'react'
import { Button, MultipleButtonContainer } from '../../Button'
import { StepContentProps } from '../../../FrigadeForm/types'
import { getClassName } from '../../../shared/appearance'

export const CTA: FC<StepContentProps> = ({ stepData, appearance }) => {
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
    <MultipleButtonContainer className={getClassName('ctaContainer', appearance)}>
      <Button
        appearance={appearance}
        title={stepData.primaryButtonTitle}
        onClick={handlePrimaryButtonClick}
      />
      {stepData.secondaryButtonTitle && (
        <Button
          appearance={appearance}
          secondary
          title={stepData.secondaryButtonTitle}
          onClick={handleSecondaryButtonClick}
          style={{
            width: 'auto',
            marginRight: '12px',
          }}
        />
      )}
    </MultipleButtonContainer>
  )
}
