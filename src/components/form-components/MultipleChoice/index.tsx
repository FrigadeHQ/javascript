import React, { useState } from 'react'

import styled from 'styled-components'
import { FormInputProps, FormInputType } from '../../../FrigadeForm/types'
import { FormLabel, LabelWrapper, RequiredSymbol } from '../shared/styled'
import { getClassName, getCustomClasOverrides } from '../../../shared/appearance'

interface MultipleChoiceProps extends FormInputType {
  id: string
  title?: string
  placeholder?: string
  props: {
    options?: MultipleChoiceOption[]
  }
}

interface MultipleChoiceOption {
  id: string
  title: string
}

const MultipleChoiceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
`

const MultipleChoiceSelect = styled.select`
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

  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'><path stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/></svg>");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  -webkit-print-color-adjust: exact;
`

export function MultipleChoice({
  formInput,
  customFormTypeProps,
  onSaveInputData,
}: FormInputProps) {
  const input = formInput as MultipleChoiceProps
  const [data, setData] = useState('')
  const [hasLoaded, setHasLoaded] = useState(false)

  if (data === '' && !hasLoaded) {
    setHasLoaded(true)
    setData(input.props.options?.[0].id || '')
    onSaveInputData({ choice: [input.props.options?.[0].id || ''] })
  }

  return (
    <MultipleChoiceWrapper>
      <LabelWrapper>
        <RequiredSymbol>*</RequiredSymbol>
        <FormLabel className={getClassName('formLabel', customFormTypeProps.appearance)}>
          {input.title}
        </FormLabel>
      </LabelWrapper>
      <MultipleChoiceSelect
        value={data}
        onChange={(e) => {
          setData(e.target.value)
          onSaveInputData({ choice: [e.target.value] })
        }}
        placeholder={input.placeholder}
        className={getClassName('multipleChoiceSelect', customFormTypeProps.appearance)}
      >
        {input.props.options?.map((option) => {
          return (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          )
        })}
      </MultipleChoiceSelect>
    </MultipleChoiceWrapper>
  )
}
