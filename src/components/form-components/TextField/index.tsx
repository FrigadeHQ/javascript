import React, { useState } from 'react'

import styled from 'styled-components'
import { FormInputProps, FormInputType } from '../../../FrigadeForm/types'
import { FormLabel, LabelWrapper, RequiredSymbol } from '../shared/styled'
import { getClassName, getCustomClasOverrides } from '../../../shared/appearance'

interface TextFieldProps extends FormInputType {
  id: string
  title?: string
  placeholder?: string
  multiline?: boolean
}

const TextInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const TextInput = styled.input`
  :not(${(props) => getCustomClasOverrides(props)}) {
    // Anything inside this block will be ignored if the user provides a custom class
    border: 1px solid #e5e5e5;
    font-size: 14px;
    ::placeholder {
      color: #c7c7c7;
      font-size: 14px;
    }
  }
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 0 10px;
  margin-bottom: 10px;
`
const TextArea = styled.textarea`
  :not(${(props) => getCustomClasOverrides(props)}) {
    // Anything inside this block will be ignored if the user provides a custom class
    border: 1px solid #e5e5e5;
    font-size: 14px;
    padding-top: 10px;
    ::placeholder {
      color: #c7c7c7;
      font-size: 14px;
    }
  }
  width: 100%;
  min-height: 70px;
  box-sizing: border-box;
  border-radius: 4px;
  margin-bottom: 10px;
`

export function TextField({
  formInput,
  customFormTypeProps,
  onSaveInputData,
  setFormValidationErrors,
}: FormInputProps) {
  const input = formInput as TextFieldProps
  const [data, setData] = useState('')
  const [hasLoaded, setHasLoaded] = useState(false)

  if (data === '' && !hasLoaded) {
    setHasLoaded(true)
    handleDataChange('')
  }

  let InputComponent = TextInput
  if (input.multiline) {
    InputComponent = TextArea
  }

  function handleDataChange(value: string) {
    setData(value)
    if (input.required === true && value.trim() === '') {
      setFormValidationErrors([
        {
          id: input.id,
          message: `${input.title} is required`,
        },
      ])
      return
    }
    setFormValidationErrors([])
    onSaveInputData({ text: value })
  }

  return (
    <TextInputWrapper>
      <LabelWrapper>
        <RequiredSymbol>*</RequiredSymbol>
        <FormLabel className={getClassName('formLabel', customFormTypeProps.appearance)}>
          {input.title}
        </FormLabel>
      </LabelWrapper>
      <InputComponent
        className={getClassName('inputComponent', customFormTypeProps.appearance)}
        value={data}
        onChange={(e) => {
          handleDataChange(e.target.value)
        }}
        placeholder={input.placeholder}
      ></InputComponent>
    </TextInputWrapper>
  )
}
