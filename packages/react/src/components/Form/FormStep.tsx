import { SyntheticEvent, useState } from 'react'
import { useController, useForm } from 'react-hook-form'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'

import { type FlowChildrenProps } from '@/components/Flow'
import type { FieldTypes, FormFieldData, ValidationRules } from '@/components/Form'
import { PropertyPayload } from '@frigade/js'

export interface FormStepProps extends FlowChildrenProps {
  fieldTypes?: FieldTypes
}

// See: https://react-hook-form.com/get-started#Applyvalidation
// NOTE: "validate" is intentionally omitted
const ruleProps = new Set(['required', 'min', 'max', 'minLength', 'maxLength', 'pattern'])

function FieldWrapper({ fieldComponent: FieldComponent, control, fieldData, submit }) {
  // pattern validator comes as a string from YAML, convert it to RegExp
  if (fieldData.pattern != null) {
    if (typeof fieldData.pattern === 'string') {
      fieldData.pattern = new RegExp(fieldData.pattern.replace(/^\/|\/$/g, ''))
    } else if (
      typeof fieldData.pattern === 'object' &&
      typeof fieldData.pattern.value === 'string'
    ) {
      fieldData.pattern.value = new RegExp(fieldData.pattern.value.replace(/^\/|\/$/g, ''))
    }
  }

  const rules = Object.fromEntries(
    Object.entries(fieldData).filter(([key]) => ruleProps.has(key))
  ) as ValidationRules

  const controller = useController({
    name: fieldData.id,
    control,
    rules,
  })

  return <FieldComponent {...controller} fieldData={fieldData} submit={submit} />
}

export function FormStep({
  fieldTypes,
  handleDismiss,
  handlePrimary,
  handleSecondary,
  parentProps: { dismissible },
  step,
}: FormStepProps) {
  const { control, handleSubmit } = useForm({
    delayError: 2000,
    mode: 'onChange',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fields = []

  const stepProps = step.props ?? {}

  function onPrimarySubmit(properties: PropertyPayload, e: SyntheticEvent<object, unknown>) {
    setIsSubmitting(true)
    handlePrimary(e, properties, false).then(() => setIsSubmitting(false))
  }

  // @ts-expect-error TODO: Add type to step.fields
  step.fields?.forEach((fieldData: FormFieldData) => {
    if (fieldTypes[fieldData.type] != null) {
      fields.push(
        <FieldWrapper
          key={`${step.flow.id}-${fieldData.id}`}
          control={control}
          fieldComponent={fieldTypes[fieldData.type]}
          fieldData={fieldData}
          submit={handleSubmit(onPrimarySubmit)}
        />
      )
    }
  })

  const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
  const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle

  return (
    <Flex.Column gap={5} part="form-step" {...stepProps}>
      <Card.Header
        dismissible={dismissible}
        handleDismiss={handleDismiss}
        part="form-step-header"
        subtitle={step.subtitle}
        title={step.title}
      />

      {fields}

      <Flex.Row key="form-footer" part="form-step-footer" justifyContent="flex-end" gap={3}>
        {secondaryButtonTitle && (
          <Button.Secondary title={secondaryButtonTitle} onClick={handleSecondary} />
        )}
        <Button.Primary
          title={primaryButtonTitle ?? 'Submit'}
          onClick={handleSubmit(onPrimarySubmit)}
          disabled={isSubmitting}
        />
      </Flex.Row>
    </Flex.Column>
  )
}
