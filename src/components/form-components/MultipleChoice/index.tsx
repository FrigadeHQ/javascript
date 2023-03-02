import React, { useState } from 'react'

import styled from 'styled-components'
import { FormInputProps, FormInputType } from '../../../FrigadeForm/types'
import { FormLabel, LabelWrapper, RequiredSymbol } from '../shared/styled'

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
        <FormLabel>{input.title}</FormLabel>
      </LabelWrapper>
      <MultipleChoiceSelect
        value={data}
        onChange={(e) => {
          setData(e.target.value)
          onSaveInputData({ choice: [e.target.value] })
        }}
        placeholder={input.placeholder}
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
