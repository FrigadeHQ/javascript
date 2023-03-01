import React from 'react'
import { StepData } from '../types'

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
  primaryColor?: string
  canContinue: boolean
  setCanContinue: (canContinue: boolean) => void
  onSaveData: (data: object) => void
}
