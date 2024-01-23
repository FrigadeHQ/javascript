import { FlowStep } from '@frigade/js'
import { type UseControllerReturn } from 'react-hook-form'

import { Box, type BoxProps } from '@/components/Box'

import { type FlowComponentProps } from '@/shared/types'
import { useFlow } from '@/hooks/useFlow'

import { FormStep } from './FormStep'
import { RadioField } from './fields/RadioField'
import { SelectField } from './fields/SelectField'
import { TextField } from './fields/TextField'
import { TextareaField } from './fields/TextareaField'

// stepComponent prop -> can make this global across the SDK

export type FieldTypes = Record<string, React.ComponentType<FormFieldProps>>

const defaultFieldTypes: FieldTypes = {
  radio: RadioField,
  select: SelectField,
  text: TextField,
  textarea: TextareaField,
}

// TODO: We should get this interface from JS-API
export interface FormFlowStep extends FlowStep {
  fields: FormFieldData[]
}

// TODO: We should get this interface from JS-API
// TODO: Add validation properties to this type
export interface FormFieldData {
  id: string
  options?: { label: string; value: string }[]
  placeholder?: string
  required?: boolean | string
  label?: string
  type: string
}

// TODO: Wire UseControllerReturn into this type
export interface FormFieldProps {
  field: any
  fieldData: FormFieldData
  formState: any
  fieldState: any
}

export interface FormProps extends FlowComponentProps, BoxProps {
  fieldTypes?: FieldTypes
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

  const mergedFieldTypes = Object.assign({}, defaultFieldTypes, fieldTypes)

  return (
    <Box {...props}>
      <FormStep fieldTypes={mergedFieldTypes} step={step} {...props} />
    </Box>
  )
}
