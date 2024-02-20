import { useController, useForm } from 'react-hook-form'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'

import { type FlowComponentChildrenProps } from '@/hooks/useFlowComponent'

import type { FieldTypes, FormFieldData, ValidationRules } from '.'
import { SyntheticEvent } from 'react'

export interface FormStepProps extends FlowComponentChildrenProps {
  fieldTypes?: FieldTypes
}

// See: https://react-hook-form.com/get-started#Applyvalidation
// NOTE: "validate" is intentionally omitted
const ruleProps = new Set(['required', 'min', 'max', 'minLength', 'maxLength', 'pattern'])

function FieldWrapper({ fieldComponent: FieldComponent, control, fieldData }) {
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

  return <FieldComponent {...controller} fieldData={fieldData} />
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
  const fields = []

  // TODO: Type for data
  function onPrimarySubmit(
    data: Record<string | number, unknown>,
    e: SyntheticEvent<object, unknown>
  ) {
    handlePrimary(e, data)
  }

  function onSecondarySubmit(
    data: Record<string | number, unknown>,
    e: SyntheticEvent<object, unknown>
  ) {
    handleSecondary(e, data)
  }

  step.fields?.forEach((fieldData: FormFieldData) => {
    if (fieldTypes[fieldData.type] != null) {
      fields.push(
        <FieldWrapper
          key={fieldData.id}
          control={control}
          fieldComponent={fieldTypes[fieldData.type]}
          fieldData={fieldData}
        />
      )
    }
  })

  return (
    <Flex.Column gap={5}>
      <Flex.Row
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        justifyContent="space-between"
        part="form-header"
      >
        <Card.Title>{step.title}</Card.Title>
        {dismissible && <Card.Dismiss onClick={handleDismiss} />}
        <Card.Subtitle flexBasis="100%">{step.subtitle}</Card.Subtitle>
      </Flex.Row>

      {fields}

      <Flex.Row key="form-footer" part="form-footer" justifyContent="flex-end" gap={3}>
        {step.secondaryButtonTitle && (
          <Button.Secondary
            title={step.secondaryButtonTitle}
            onClick={handleSubmit(onSecondarySubmit)}
          />
        )}
        <Button.Primary
          title={step.primaryButtonTitle ?? 'Submit'}
          onClick={handleSubmit(onPrimarySubmit)}
        />
      </Flex.Row>
    </Flex.Column>
  )
}
