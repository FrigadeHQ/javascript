import { FlowStep } from '@frigade/js'
import { type UseControllerReturn, type ValidationRule, type Message } from 'react-hook-form'

import { type FlowComponentProps } from '@/shared/types'
import { useFlowComponent } from '@/hooks/useFlowComponent'

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

export interface ValidationRules {
  required?: Message | ValidationRule<boolean>
  min?: ValidationRule<number | string>
  max?: ValidationRule<number | string>
  maxLength?: ValidationRule<number>
  minLength?: ValidationRule<number>
  pattern?: ValidationRule<RegExp>
}

// TODO: We should get this interface from JS-API
export interface FormFlowStep extends FlowStep {
  fields: FormFieldData[]
}

// TODO: We should get this interface from JS-API
// TODO: Add validation properties to this type
export interface FormFieldData extends ValidationRules {
  id: string
  options?: { label: string; value: string }[]
  placeholder?: string
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

export interface FormProps extends FlowComponentProps {
  fieldTypes?: FieldTypes
}

export function Form({ fieldTypes = {}, ...props }: FormProps) {
  const { FlowComponent } = useFlowComponent(props)

  const mergedFieldTypes = Object.assign({}, defaultFieldTypes, fieldTypes)

  return (
    <FlowComponent>
      {({ step }) => <FormStep fieldTypes={mergedFieldTypes} step={step} {...props} />}
    </FlowComponent>
  )
}
