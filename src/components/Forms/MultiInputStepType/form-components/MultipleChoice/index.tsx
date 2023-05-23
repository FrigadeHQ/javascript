import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { FormInputProps, FormInputType } from '../../../../../FrigadeForm/types'
import { getClassName, getCustomClassOverrides } from '../../../../../shared/appearance'
import { Label } from '../shared/Label'
import { TextInput } from '../TextField'

interface MultipleChoiceProps extends FormInputType {
  id: string
  title?: string
  placeholder?: string
  defaultValue?: string
  requireSelection?: boolean
  props: {
    options?: MultipleChoiceOption[]
  }
}

interface MultipleChoiceOption {
  id: string
  title: string
  isOpenEnded: boolean
  openEndedLabel?: string
}

const MultipleChoiceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
`

const MultipleChoiceSelect = styled.select`
  ${(props) => getCustomClassOverrides(props)} {
    // Anything inside this block will be ignored if the user provides a custom class
    border: 1px solid ${(props) => props.appearance?.theme?.colorBorder};
    font-size: 14px;
    ::placeholder {
      color: #c7c7c7;
      font-size: 14px;
    }
    border-radius: 6px;
  }
  width: 100%;
  height: 40px;
  box-sizing: border-box;

  padding: 0 10px;
  margin-bottom: 10px;

  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'><path stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/></svg>");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  -webkit-print-color-adjust: exact;
`

const NULL_VALUE = 'null'

export function MultipleChoice({
  formInput,
  customFormTypeProps,
  onSaveInputData,
  setFormValidationErrors,
}: FormInputProps) {
  const input = formInput as MultipleChoiceProps
  const [data, setData] = useState('')
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (data === '' && !hasLoaded) {
      setHasLoaded(true)
      if (input.requireSelection) {
        setData(NULL_VALUE)
        return
      }
      if (
        input.defaultValue &&
        input.props.options?.find((option) => option.id === input.defaultValue)
      ) {
        // Find input.props.options with id == defaultValue
        const defaultValue = input.props.options?.find((option) => option.id === input.defaultValue)
        setData(defaultValue.id)
        onSaveInputData({ choice: [defaultValue.id] })
      } else {
        setData(input.props.options?.[0].id || '')
        onSaveInputData({ choice: [input.props.options?.[0].id || ''] })
      }
    }
  }, [])

  useEffect(() => {
    if (input.requireSelection && data === NULL_VALUE) {
      setFormValidationErrors([
        {
          message: 'Please select an option',
          id: input.id,
        },
      ])
    } else {
      setFormValidationErrors([])
    }
  }, [data])

  return (
    <MultipleChoiceWrapper>
      <Label
        title={input.title}
        required={false} // MultipleChoice is always required as it has a default value
        appearance={customFormTypeProps.appearance}
      />
      <MultipleChoiceSelect
        value={data}
        onChange={(e) => {
          setData(e.target.value)
          onSaveInputData({ choice: [e.target.value] })
        }}
        placeholder={input.placeholder}
        appearance={customFormTypeProps.appearance}
        className={getClassName('multipleChoiceSelect', customFormTypeProps.appearance)}
      >
        {input.requireSelection && (
          <option key={NULL_VALUE} value={NULL_VALUE}>
            Select an option
          </option>
        )}
        {input.props.options?.map((option) => {
          return (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          )
        })}
      </MultipleChoiceSelect>
      {/*// If selected data is option.isOpenEnded is true, render an input field*/}
      {input.props.options?.find((option) => option.id === data)?.isOpenEnded && (
        <>
          <Label
            title={
              input.props.options?.find((option) => option.id === data)?.openEndedLabel ??
              `Please specify`
            }
            required={false}
            appearance={customFormTypeProps.appearance}
          />
          <TextInput
            type="text"
            placeholder="Enter your answer here"
            onChange={(e) => {
              onSaveInputData({ choice: [e.target.value] })
            }}
            appearance={customFormTypeProps.appearance}
          />
        </>
      )}
    </MultipleChoiceWrapper>
  )
}
