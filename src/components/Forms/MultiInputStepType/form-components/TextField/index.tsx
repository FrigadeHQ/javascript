import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { FormInputProps, FormInputType } from '../../../../../FrigadeForm/types'
import { getClassName, getCustomClassOverrides } from '../../../../../shared/appearance'
import { Label } from '../shared/Label'
import { SubLabel } from '../shared/SubLabel'
import { getErrorsFromValidationResult } from '../shared/validation'

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

export const TextInput = styled.input`
  ${(props) => getCustomClassOverrides(props)} {
    // Anything inside this block will be ignored if the user provides a custom class
    border: 1px solid ${(props) => props.appearance?.theme?.colorBorder};
    font-size: 14px;
    ::placeholder {
      color: ${(props) => props.appearance?.theme?.colorTextDisabled};
      font-size: 14px;
    }
    border-radius: 6px;
  }
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  padding: 0 10px;
  margin-bottom: 10px;
`
const TextArea = styled.textarea`
  ${(props) => getCustomClassOverrides(props)} {
    // Anything inside this block will be ignored if the user provides a custom class
    border: 1px solid ${(props) => props.appearance?.theme?.colorBorder};
    font-size: 14px;
    padding: 10px;
    ::placeholder {
      color: #c7c7c7;
      font-size: 14px;
    }
    border-radius: 6px;
  }
  width: 100%;
  min-height: 70px;
  box-sizing: border-box;
  margin-bottom: 10px;
`

export function TextField({
  formInput,
  customFormTypeProps,
  onSaveInputData,
  setFormValidationErrors,
  inputData,
}: FormInputProps) {
  const input = formInput as TextFieldProps
  const [data, setData] = useState(inputData?.text || '')
  const [hasLoaded, setHasLoaded] = useState(false)
  const [hasGivenFocus, setHasGivenFocus] = useState(false)
  let InputComponent = TextInput
  useEffect(() => {
    if (data === '' && !hasLoaded) {
      setHasLoaded(true)
      handleDataChange('')
    }
  }, [])

  useEffect(() => {
    if (hasGivenFocus) {
      handleDataChange(data)
      return
    }
  }, [hasGivenFocus])

  function handleDataChange(value: string) {
    setData(value)
    onSaveInputData({ text: value })
    if (input.required === true && value.trim() === '' && hasGivenFocus) {
      setFormValidationErrors([
        {
          id: input.id,
          message: `${input.title ?? `Field`} is required`,
        },
      ])
      return
    }
    const validationError = getErrorsFromValidationResult(value, input.validation)
    if (validationError && hasGivenFocus) {
      setFormValidationErrors([
        {
          id: input.id,
          message: validationError,
        },
      ])
      return
    }
    setFormValidationErrors([])
  }

  if (input.multiline) {
    InputComponent = TextArea
  }

  function getType() {
    switch (input?.validation?.type) {
      case 'email':
        return 'email'
      case 'number':
        return 'number'
      case 'password':
        return 'password'
    }

    return null
  }

  return (
    <TextInputWrapper>
      <Label
        title={input.title}
        required={input.required}
        appearance={customFormTypeProps.appearance}
      />
      <InputComponent
        className={getClassName('inputComponent', customFormTypeProps.appearance)}
        value={data}
        onChange={(e) => {
          handleDataChange(e.target.value)
        }}
        appearance={customFormTypeProps.appearance}
        placeholder={input.placeholder}
        type={getType()}
        onBlur={() => {
          setHasGivenFocus(true)
        }}
      ></InputComponent>
      <SubLabel title={input.subtitle} appearance={customFormTypeProps.appearance} />
    </TextInputWrapper>
  )
}
