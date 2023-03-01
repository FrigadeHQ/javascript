import React, { useState } from 'react'

import styled from 'styled-components'
import { FormInputProps, FormInputType } from '../../../FrigadeForm/types'
import { FormLabel, LabelWrapper, RequiredSymbol } from '../shared/styled'

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
  width: 100%;
  height: 40px;
  border: 1px solid #e5e5e5;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 0 10px;
  margin-bottom: 10px;
  font-size: 14px;
  ::placeholder {
    color: #c7c7c7;
    font-size: 14px;
  }
`
const TextArea = styled.textarea`
  width: 100%;
  min-height: 70px;
  border: 1px solid #e5e5e5;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 0 10px;
  margin-bottom: 10px;
  font-size: 14px;
  ::placeholder {
    padding-top: 6px;
    color: #c7c7c7;
    font-size: 14px;
  }
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
        <FormLabel>{input.title}</FormLabel>
      </LabelWrapper>
      <InputComponent
        value={data}
        onChange={(e) => {
          handleDataChange(e.target.value)
        }}
        placeholder={input.placeholder}
      ></InputComponent>
    </TextInputWrapper>
  )
}
