import React, { FC } from 'react'
import { FrigadeFormType } from '.'
import { Button } from '../components/Button'
import { getClassName } from '../shared/appearance'
import { Appearance, StepData } from '../types'
import { FormCTAContainer } from './styled'

interface FormFooterProps {
  step: StepData
  canContinue: boolean
  appearance: Appearance
  onPrimaryClick: () => void
  onSecondaryClick: () => void
  onBack: () => void
  formType: FrigadeFormType
  steps: StepData[]
  selectedStep: number
}

export const FormFooter: FC<FormFooterProps> = ({
  step,
  canContinue,
  appearance,
  onPrimaryClick,
  onSecondaryClick,
  formType,
  selectedStep,
  steps,
  onBack,
}) => {
  const buttonType = formType === 'inline' ? 'inline' : 'full-width'

  return (
    <FormCTAContainer className={getClassName('formCTAContainer', appearance)}>
      {steps.length > 1 && selectedStep != 0 && (
        <Button
          title="←"
          onClick={onBack}
          secondary={true}
          type={buttonType}
          style={{
            display: 'inline-block',
          }}
          appearance={appearance}
        />
      )}
      {step.secondaryButtonTitle ? (
        <Button
          title={step.secondaryButtonTitle}
          onClick={onSecondaryClick}
          secondary={true}
          withMargin={false}
          type={buttonType}
          appearance={appearance}
        />
      ) : null}{' '}
      {step.primaryButtonTitle ? (
        <Button
          disabled={!canContinue}
          withMargin={false}
          title={step.primaryButtonTitle}
          onClick={onPrimaryClick}
          type={buttonType}
          appearance={appearance}
        />
      ) : null}
    </FormCTAContainer>
  )
}
