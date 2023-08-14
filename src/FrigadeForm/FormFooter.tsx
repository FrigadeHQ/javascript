import React, { FC } from 'react'
import { FrigadeFormType } from '.'
import { Button } from '../components/Button'
import { getClassName } from '../shared/appearance'
import { Appearance, StepData } from '../types'
import { CTAWrapper, FormCTAContainer, FormCTAError } from './styled'

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
  allowBackNavigation: boolean
  errorMessage?: string
}

export const FormFooter: FC<FormFooterProps> = ({
  step,
  canContinue,
  appearance,
  onPrimaryClick,
  onSecondaryClick,
  selectedStep,
  steps,
  onBack,
  allowBackNavigation,
  errorMessage,
}) => {
  const showBackButton = steps.length > 1 && selectedStep != 0 && allowBackNavigation
  const buttonType =
    (step.primaryButtonTitle && step.secondaryButtonTitle) || showBackButton
      ? 'inline'
      : 'full-width'

  return (
    <>
      {errorMessage !== null && errorMessage != undefined && (
        <FormCTAError appearance={appearance} className={getClassName('formCTAError', appearance)}>
          {errorMessage}
        </FormCTAError>
      )}
      <FormCTAContainer
        showBackButton={showBackButton}
        className={getClassName('formCTAContainer', appearance)}
      >
        {showBackButton && (
          <Button
            title={step.backButtonTitle ?? '←'}
            onClick={onBack}
            secondary={true}
            withMargin={false}
            type={buttonType}
            appearance={appearance}
            style={{ width: '90px', maxWidth: '90px' }}
            classPrefix="back"
          />
        )}
        <CTAWrapper className={getClassName('ctaWrapper', appearance)}>
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
        </CTAWrapper>
      </FormCTAContainer>
    </>
  )
}
