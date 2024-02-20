import { FlowStep } from '@frigade/js'
import { type ControllerFieldState, type Message, type ValidationRule } from 'react-hook-form'

import { Flow, type FlowProps } from '@/components/Flow'

import { FormStep } from './FormStep'
import { RadioField } from './fields/RadioField'
import { SelectField } from './fields/SelectField'
import { TextField } from './fields/TextField'
import { TextareaField } from './fields/TextareaField'

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
  field: any // eslint-disable-line @typescript-eslint/no-explicit-any
  fieldData: FormFieldData
  formState: any // eslint-disable-line @typescript-eslint/no-explicit-any
  fieldState: ControllerFieldState
}

export interface FormProps extends FlowProps {
  /**
   * Custom field types to be used in the Form.
   * You can use this to build your own custom form fields in a `Form`.
   */
  fieldTypes?: FieldTypes
}

export function Form({ fieldTypes = {}, ...props }: FormProps) {
  const mergedFieldTypes = Object.assign({}, defaultFieldTypes, fieldTypes)

  return (
    <Flow part="form" {...props}>
      {(childProps) => <FormStep fieldTypes={mergedFieldTypes} {...childProps} />}
    </Flow>
  )
}
