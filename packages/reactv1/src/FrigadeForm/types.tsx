import React from 'react'
import { Appearance, StepData } from '../types'

export interface FormInputType {
  id: string
  title?: string
  subtitle?: string
  type: string
  required?: boolean
  validation?: InputValidation
  props?: Record<string, any>
}

export interface InputValidation {
  type:
    | 'number'
    | 'string'
    | 'email'
    | 'phone'
    | 'date'
    | 'time'
    | 'datetime'
    | 'url'
    | 'custom'
    | 'password'
  requiredError?: string
  invalidTypeError?: string
  props?: InputValidationRuleProps[]
}

export interface InputValidationRuleProps {
  requirement: string
  value?: string | number
  message?: string
}

export interface FormInputProps {
  formInput: FormInputType
  customFormTypeProps: CustomFormTypeProps
  /**
   * Input data specific to this input
   */
  inputData: any
  /**
   * All input data for the current step
   */
  allInputData: any
  onSaveInputData: (data: any) => void
  setFormValidationErrors: (errors: FormValidationError[]) => void
}

export interface FormValidationError {
  message: string
  id: string
  hidden?: boolean
}

export interface CustomFormTypeProps {
  flowId: string
  stepData: StepData
  canContinue: boolean
  setCanContinue: (canContinue: boolean) => void
  onSaveData: (data: object) => void
  appearance?: Appearance
  prefillData?: Record<string, any>
  customFormElements?: { [key: string]: (params: FormInputProps) => React.ReactNode }
}

export interface StepContentProps {
  stepData: StepData
  appearance?: Appearance
}

export interface MultipleChoiceListProps extends FormInputType {
  id: string
  title?: string
  props: MultipleChoiceProps
}
export interface MultipleChoiceProps {
  minChoices?: number
  maxChoices?: number
  options?: MultipleChoiceListOption[]
}

export interface MultipleChoiceListOption {
  id: string
  title: string
  imageUri?: string
}

export type EntityProperties = Record<string, string | boolean | number | null>
