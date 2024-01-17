import { FlowStep } from '@frigade/js'

import { Box, type BoxProps } from '@/components/Box'
import { Button } from '@/components/Button'
import { Flex } from '@/components/Flex/Flex'
import { Text } from '@/components/Text'
import { type FlowComponentProps } from '@/shared/types'
import { useFlow } from '@/hooks/useFlow'

import { baseFieldStyle, baseInputStyle } from './fields/BaseField.styles'
import { SelectField } from './fields/SelectField'

// stepComponent prop -> can make this global across the SDK

// Should these render funcs be specific to React Hook Form Controller?
const defaultFieldTypes = {
  select: (field: FormField) => <SelectField key={field.id} {...field} />,
  text: (field: FormField) => <TextField key={field.id} {...field} />,
  textarea: (field: FormField) => <TextareaField key={field.id} {...field} />,
}

// TODO: We should get this interface from JS-API
export interface FormFlowStep extends FlowStep {
  fields: FormField[]
}

// TODO: We should get this interface from JS-API
export interface FormField {
  id: string
  options?: { label: string; value: string }[]
  placeholder?: string
  required?: boolean
  title?: string
  type: string
}

export interface FormProps extends FlowComponentProps, BoxProps {
  fieldTypes?: Record<string, (field: FormField) => React.ReactNode>
}

export function Form({ fieldTypes = {}, flowId, variables, ...props }: FormProps) {
  const { flow } = useFlow(flowId, {
    variables,
  })

  if (flow == null || flow.isVisible === false) {
    return null
  }

  flow.start()

  const step = flow.getCurrentStep() as FormFlowStep
  step?.start()

  console.log(flow, step)

  const mergedFieldTypes = Object.assign({}, defaultFieldTypes, fieldTypes)

  return (
    <Box {...props}>
      <FormStep fieldTypes={mergedFieldTypes} step={step} {...props} />
    </Box>
  )
}

export function FormStep({ fieldTypes, step }: Omit<FormProps, 'flowId'>) {
  // Build array of fields
  const fields = []

  step.fields?.forEach((field) => {
    if (fieldTypes[field.type] != null) {
      fields.push(fieldTypes[field.type](field))
    }
  })

  return (
    <>
      {fields}
      <Flex.Row key="form-footer" justifyContent="flex-end">
        <Button.Primary title={step.primaryButtonTitle ?? 'Submit'} />
      </Flex.Row>
    </>
  )
}

export function TextField({ id, placeholder, title }: FormField) {
  return (
    <Box {...baseFieldStyle}>
      <Text.Body2 as="label" htmlFor={id} fontWeight="demibold">
        {title}
      </Text.Body2>
      <Text.Body2 as="input" name={id} type="text" placeholder={placeholder} {...baseInputStyle} />
    </Box>
  )
}

export function TextareaField({ id, placeholder, title }: FormField) {
  return (
    <Box {...baseFieldStyle}>
      <Text.Body2 as="label" htmlFor={id} fontWeight="demibold">
        {title}
      </Text.Body2>
      <Text.Body2
        as="textarea"
        name={id}
        placeholder={placeholder}
        {...baseInputStyle}
      ></Text.Body2>
    </Box>
  )
}
