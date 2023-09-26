import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { FormInputProps, FormInputType } from '../../../../../FrigadeForm/types'
import { getClassName, getCustomClassOverrides } from '../../../../../shared/appearance'
import { Label } from '../shared/Label'
import { TextInput } from '../TextField'
import { SubLabel } from '../shared/SubLabel'

const NULL_VALUE = ''

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
    border-radius: 6px;
  }
  width: 100%;
  height: 40px;
  box-sizing: border-box;

  padding: 0 10px;
  margin-bottom: 10px;
  color: ${(props) =>
    props.value == ''
      ? props.appearance?.theme?.colorTextDisabled
      : props.appearance?.theme?.colorText};

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
  inputData,
  setFormValidationErrors,
}: FormInputProps) {
  const input = formInput as MultipleChoiceProps
  const [hasLoaded, setHasLoaded] = useState(false)
  const [hasSelected, setHasSelected] = useState(false)

  useEffect(() => {
    if (!inputData?.choice?.[0] && !hasLoaded) {
      setHasLoaded(true)
      if (input.requireSelection) {
        onSaveInputData({ choice: [NULL_VALUE] })
        return
      }
      if (
        input.defaultValue &&
        input.props.options?.find((option) => option.id === input.defaultValue)
      ) {
        // Find input.props.options with id == defaultValue
        const defaultValue = input.props.options?.find((option) => option.id === input.defaultValue)
        onSaveInputData({ choice: [defaultValue.id] })
      } else {
        onSaveInputData({ choice: [input.props.options?.[0].id || ''] })
      }
    }
  }, [])

  useEffect(() => {
    if (!hasSelected) {
      return
    }
    if (input.requireSelection && inputData?.choice?.[0] === NULL_VALUE) {
      setFormValidationErrors([
        {
          message: 'Please select an option',
          id: input.id,
        },
      ])
    } else {
      setFormValidationErrors([])
    }
  }, [inputData?.choice?.[0], hasSelected])

  return (
    <MultipleChoiceWrapper>
      <Label
        title={input.title}
        required={false} // MultipleChoice is always required as it has a default value
        appearance={customFormTypeProps.appearance}
      />
      <MultipleChoiceSelect
        value={inputData?.choice?.[0]}
        onChange={(e) => {
          setHasSelected(true)
          onSaveInputData({ choice: [e.target.value] })
        }}
        placeholder={input.placeholder}
        appearance={customFormTypeProps.appearance}
        className={getClassName('multipleChoiceSelect', customFormTypeProps.appearance)}
      >
        {input.requireSelection && (
          <option key="null-value" value={NULL_VALUE} disabled>
            {input.placeholder ?? `Select an option`}
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
      {input.props.options?.find((option) => option.id === inputData?.choice?.[0])?.isOpenEnded && (
        <>
          <Label
            title={
              input.props.options?.find((option) => option.id === inputData?.choice?.[0])
                ?.openEndedLabel ?? `Please specify`
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
      <SubLabel title={input.subtitle} appearance={customFormTypeProps.appearance} />
    </MultipleChoiceWrapper>
  )
}
