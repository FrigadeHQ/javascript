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

interface MultiInputStepProps {
  data?: FormInputType[]
}

// create flex that wraps if not enoug space
const MultiInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const MultiInput = styled.div`
  align-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 15px;
  padding: 20px;
  flex-basis: 255px;
  flex-shrink: 0;
`

const MultiInputIcon = styled.img`
  width: 78px;
  height: auto;
`

const MultiInputTitle = styled.button`
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;

  display: flex;
  align-items: center;
  text-align: center;
  border: 1px solid;
  border-radius: 100px;
  padding: 8px 12px;
  margin-top: 16px;
`

const HeaderTitle = styled.h1`
  font-style: normal;
  font-weight: 590;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  color: #434343;
`

const HeaderSubtitle = styled.h2`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #7e7e7e;
  margin-top: 12px;
  margin-bottom: 16px;
  max-width: 70%;
`
const DEFAULT_INPUT_TYPES: { [key: string]: (params: FormInputProps) => React.ReactNode } = {
  text: TextField,
  multipleChoice: MultipleChoice,
}

export function MultiInputStepType({
  stepData,
  primaryColor,
  canContinue,
  setCanContinue,
  onSaveData,
}: CustomFormTypeProps) {
  const formElements = stepData.props as MultiInputStepProps
  // Create map storing data from individual stepids
  // use state
  const [allFormData, setAllFormData] = useState({})
  const [formValidationErrors, setFormValidationErrors] = useState<FormValidationError[]>([])

  useEffect(() => {
    setCanContinue(formValidationErrors.length === 0)
    onSaveData(allFormData)
  }, [allFormData, formValidationErrors])

  function saveDataFromInputs(input: FormInputType, data: object) {
    setAllFormData((prev) => {
      return { ...prev, [input.id]: data }
    })
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
    </div>
  )
}
