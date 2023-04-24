import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  CustomFormTypeProps,
  FormInputProps,
  FormInputType,
  FormValidationError,
} from '../../../FrigadeForm/types'
import { TextField } from './form-components/TextField'
import { MultipleChoice } from './form-components/MultipleChoice'
import { MultipleChoiceList } from './form-components/MultipleChoiceList'
import { TitleSubtitle } from '../../TitleSubtitle/TitleSubtitle'
import { getClassName } from '../../../shared/appearance'

interface MultiInputStepProps {
  data?: FormInputType[]
}

const MultiInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 14px;
  overflow: visible;
`

const MultiInput = styled.div`
  padding-left: 1px;
  padding-right: 1px;
`

const DEFAULT_INPUT_TYPES: { [key: string]: (params: FormInputProps) => React.ReactNode } = {
  text: TextField,
  multipleChoice: MultipleChoice,
  multipleChoiceList: MultipleChoiceList,
}

export function MultiInputStepType({
  stepData,
  canContinue,
  setCanContinue,
  onSaveData,
  appearance,
}: CustomFormTypeProps) {
  const formElements = stepData.props as MultiInputStepProps
  // Create map storing data from individual stepids
  // use state
  const [allFormData, setAllFormData] = useState({})
  const [formValidationErrors, setFormValidationErrors] = useState<FormValidationError[]>([])

  useEffect(() => {
    setCanContinue(formValidationErrors.length === 0)
  }, [formValidationErrors, setCanContinue])

  function saveDataFromInputs(input: FormInputType, data: object) {
    const newData = { ...allFormData, [input.id]: data }
    setAllFormData(newData)
    onSaveData(newData)
  }

  return (
    <MultiInput className={getClassName('multiInput', appearance)}>
      <TitleSubtitle appearance={appearance} title={stepData.title} subtitle={stepData.subtitle} />
      <MultiInputContainer className={getClassName('multiInputContainer', appearance)}>
        {formElements.data?.map((input: FormInputType) =>
          DEFAULT_INPUT_TYPES[input.type] ? (
            <span key={input.id}>
              {DEFAULT_INPUT_TYPES[input.type]({
                formInput: input,
                customFormTypeProps: {
                  stepData,
                  canContinue,
                  setCanContinue,
                  onSaveData,
                  appearance,
                },
                onSaveInputData: (data) => {
                  saveDataFromInputs(input, data)
                },
                setFormValidationErrors: (errors) => {
                  setFormValidationErrors((prev) => {
                    if (errors.length === 0) {
                      return prev.filter((error) => error.id !== input.id)
                    }
                    return [...prev, ...errors]
                  })
                },
              })}
            </span>
          ) : null
        )}
      </MultiInputContainer>
    </MultiInput>
  )
}
