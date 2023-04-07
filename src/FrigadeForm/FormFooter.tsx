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
  currentStep: number
}

export const FormFooter: FC<FormFooterProps> = ({
  step,
  canContinue,
  appearance,
  onPrimaryClick,
  onSecondaryClick,
  onBack,
  formType,
  steps,
  currentStep,
}) => {
  let Container = FormCTAContainer
  let buttonType =
    formType == 'corner-modal' || 'full-screen-modal' || 'modal' ? 'full-width' : 'inline'

  return (
    <Container className={getClassName('formCTAContainer', appearance)}>
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
      {/*{steps.length > 1 && currentStep != 0 && (*/}
      {/*  <Button*/}
      {/*    title="Back"*/}
      {/*    onClick={onBack}*/}
      {/*    secondary={true}*/}
      {/*    type={buttonType}*/}
      {/*    style={{*/}
      {/*      display: 'inline-block',*/}
      {/*      ...buttonStyleOverride,*/}
      {/*    }}*/}
      {/*    appearance={appearance}*/}
      {/*  />*/}
      {/*)}*/}
    </Container>
  )
}
