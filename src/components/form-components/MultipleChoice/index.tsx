import React, { useState } from 'react'

import styled from 'styled-components'
import { FormInputProps, FormInputType } from '../../../FrigadeForm/types'

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
`

const FormLabel = styled.label`
  font-size: 12px;
  line-height: 20px;
  color: #434343;
  display: flex;
`

const RequiredSymbol = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #f5222d;
  display: flex;
  margin-right: 5px;
`

const LabelWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: left;
  margin-bottom: 10px;
`

export function MultipleChoice({
  formInput,
  customFormTypeProps,
  onSaveInputData,
}: FormInputProps) {
  const input = formInput as MultipleChoiceProps
  const [data, setData] = useState('')

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
          onSaveInputData({ text: e.target.value })
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
