import React from 'react'
import { StepData } from '../types'

export interface FormInputType {
  id: string
  title?: string
  type: string
}

export interface FormInputProps {
  formInput: FormInputType
  customFormTypeProps: CustomFormTypeProps
  onSaveInputData: (data: object) => void
}

export interface CustomFormTypeProps {
  stepData: StepData
  primaryColor?: string
  canContinue: boolean
  setCanContinue: (canContinue: boolean) => void
  onSaveData: (data: object) => void
}
