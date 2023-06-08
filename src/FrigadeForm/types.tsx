import React from 'react'
import { Appearance, StepData } from '../types'

export interface FormInputType {
  id: string
  title?: string
  type: string
  required?: boolean
}

export interface FormInputProps {
  formInput: FormInputType
  customFormTypeProps: CustomFormTypeProps
  onSaveInputData: (data: object) => void
  setFormValidationErrors: (errors: FormValidationError[]) => void
}

export interface FormValidationError {
  message: string
  id: string
}

export interface CustomFormTypeProps {
  stepData: StepData
  canContinue: boolean
  setCanContinue: (canContinue: boolean) => void
  onSaveData: (data: object) => void
  appearance?: Appearance
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
