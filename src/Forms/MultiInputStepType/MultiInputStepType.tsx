import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  CustomFormTypeProps,
  FormInputProps,
  FormInputType,
  FormValidationError,
} from '../../FrigadeForm/types'
import { TextField } from '../../components/form-components/TextField'
import { MultipleChoice } from '../../components/form-components/MultipleChoice'
import { MultipleChoiceList } from '../../components/form-components/MultipleChoiceList'

interface MultiInputStepProps {
  data?: FormInputType[]
}

// create flex that wraps if not enoug space
const MultiInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const HeaderTitle = styled.h1`
  font-style: normal;
  font-weight: 590;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
`

const HeaderSubtitle = styled.h2`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-top: 12px;
  margin-bottom: 16px;
`
const DEFAULT_INPUT_TYPES: { [key: string]: (params: FormInputProps) => React.ReactNode } = {
  text: TextField,
  multipleChoice: MultipleChoice,
  multipleChoiceList: MultipleChoiceList,
}

export function MultiInputStepType({
  stepData,
  primaryColor,
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
    <div>
      <HeaderTitle>{stepData.title}</HeaderTitle>
      <HeaderSubtitle>{stepData.subtitle}</HeaderSubtitle>
      <MultiInputContainer>
        {formElements.data?.map((input: FormInputType) =>
          DEFAULT_INPUT_TYPES[input.type] ? (
            <span key={input.id}>
              {DEFAULT_INPUT_TYPES[input.type]({
                formInput: input,
                customFormTypeProps: {
                  stepData,
                  primaryColor,
                  canContinue,
                  setCanContinue,
                  onSaveData,
                  appearance,
                },
                onSaveInputData: (data) => {
                  console.log(data)
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
    </div>
  )
}
