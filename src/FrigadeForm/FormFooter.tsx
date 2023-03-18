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
  formType: FrigadeFormType
}

export const FormFooter: FC<FormFooterProps> = ({
  step,
  canContinue,
  appearance,
  onPrimaryClick,
  onSecondaryClick,
  formType,
}) => {
  let Container = FormCTAContainer
  let buttonType = formType == 'corner-modal' || 'full-screen-modal' ? 'full-width' : 'inline'
  let buttonStyleOverride: any = {}

  return (
    <Container className={getClassName('formCTAContainer', appearance)}>
      {step.secondaryButtonTitle ? (
        <Button
          title={step.secondaryButtonTitle}
          onClick={onSecondaryClick}
          secondary={true}
          type={buttonType}
          style={{
            display: 'inline-block',
            marginRight: 12,
            marginBottom: 0,
            ...buttonStyleOverride,
          }}
          appearance={appearance}
        />
      ) : null}{' '}
      {step.primaryButtonTitle ? (
        <Button
          disabled={!canContinue}
          title={step.primaryButtonTitle}
          onClick={onPrimaryClick}
          type={buttonType}
          style={{
            display: 'inline-block',
            marginBottom: 0,
            ...buttonStyleOverride,
          }}
          appearance={appearance}
        />
      ) : null}
    </Container>
  )
}
