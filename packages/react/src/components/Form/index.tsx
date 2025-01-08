import { FlowStep } from '@frigade/js'
import type { ControllerFieldState, Message, UseFormReturn, ValidationRule } from 'react-hook-form'

import { Card } from '@/components/Card'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'

import { FormStep } from './FormStep'
import { RadioField } from './fields/RadioField'
import { SelectField } from './fields/SelectField'
import { TextField } from './fields/TextField'
import { TextareaField } from './fields/TextareaField'
import { CheckboxField } from '@/components/Form/fields/CheckboxField'

export type FieldTypes = Record<string, React.ComponentType<FormFieldProps>>

const defaultFieldTypes: FieldTypes = {
  checkbox: CheckboxField,
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
  value?: string
  multiple?: boolean
  props?: Record<string, string | number | boolean | undefined>
  // allow any other custom properties
  [key: string]: unknown
}

// TODO: Wire UseControllerReturn into this type
export interface FormFieldProps {
  /**
   * React Hook Form's controller for the field. Use field.onChange() to update the field value.
   * See https://react-hook-form.com/api/usecontroller for more.
   */
  field: any // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Form-specific data for decorating the field.
   */
  fieldData: FormFieldData
  /**
   * React Hook Form's form context. See https://react-hook-form.com/api/useformcontext for more.
   */
  formContext: UseFormReturn
  /**
   * Function for submitting the current field.
   * @ignore
   */
  fieldState: ControllerFieldState
  /**
   * Function for submitting the current step of the form.
   * @ignore
   */
  submit: () => void
}

export interface FormProps extends FlowPropsWithoutChildren {
  /**
   * Custom field types to be used in the Form.
   * You can use this to build your own custom form fields in a `Form`.
   *
   * For example, if you want to use a custom field type called `calendar`:
   *
   * ```tsx
   * import { Form, FormFieldProps } from '@frigade/react'
   *
   * function CalendarField({ field, submit }: FormFieldProps) {
   *   return (
   *    <div>
   *      <input type="date" onChange={field.onChange} value={field.value} />
   *    </div>
   *   )
   * }
   *
   *  // ...
   *
   *  <Form flowId="my-flow-id" fieldTypes={{ calendar: CalendarField }} />
   *
   *  ```
   *
   */
  fieldTypes?: FieldTypes
}

export function Form({ fieldTypes = {}, flowId, part, ...props }: FormProps) {
  const mergedFieldTypes = Object.assign({}, defaultFieldTypes, fieldTypes)

  return (
    <Flow as={Card} flowId={flowId} part={['form', part]} {...props}>
      {(childProps) => <FormStep fieldTypes={mergedFieldTypes} {...childProps} />}
    </Flow>
  )
}
