import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  CustomFormTypeProps,
  FormInputProps,
  FormInputType,
  FormValidationError,
} from '../../../FrigadeForm/types'
import { TextField } from './form-components/TextField'
import { MultipleChoice } from './form-components/MultipleChoice'
import { MultipleChoiceList } from './form-components/MultipleChoiceList'
import { TitleSubtitle } from '../../TitleSubtitle/TitleSubtitle'
import { getClassName } from '../../../shared/appearance'
import { useUser } from '../../../api/users'
import { Warning } from '../../Icons/Warning'
import { FrigadeContext } from '../../../FrigadeProvider'

interface MultiInputStepProps {
  data?: FormInputType[]
}

const MultiInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: visible;
  padding-top: 14px;
`

const MultiInputValidationError = styled.div`
  color: ${(props) => props.appearance?.theme?.colorTextError};
  font-size: 12px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`

const MultiInputValidationErrorIcon = styled.div`
  margin-right: 4px;
  display: inline-flex;
`

const MultiInput = styled.div`
  padding-left: 1px;
  padding-right: 1px;
`

const DEFAULT_INPUT_TYPES: { [key: string]: (params: FormInputProps) => React.ReactNode } = {
  text: TextField,
  multipleChoice: MultipleChoice,
  multipleChoiceList: MultipleChoiceList,
}

export const FORM_DATA_KEY_PREFIX = `frigade-multiInputStepTypeData`

export function MultiInputStepType({
  flowId,
  stepData,
  canContinue,
  setCanContinue,
  onSaveData,
  appearance,
  customFormElements,
  prefillData,
}: CustomFormTypeProps) {
  const formElements = stepData.props as MultiInputStepProps
  const [formValidationErrors, setFormValidationErrors] = useState<FormValidationError[]>([])
  const [touchedInputs, setTouchedInputs] = useState<string[]>([])
  const { userId } = useUser()
  const [allFormData, setAllFormData] = useState(
    loadFromLocalStorage() || (prefillData ? prefillData[stepData.id] : null) || {}
  )
  const { readonly } = useContext(FrigadeContext)
  const mergedInputTypes = { ...DEFAULT_INPUT_TYPES, ...customFormElements }

  useEffect(() => {
    setCanContinue(formValidationErrors.length === 0)
  }, [formValidationErrors, setCanContinue])

  useEffect(() => {
    onSaveData(allFormData)
  }, [allFormData])

  function saveDataFromInputs(input: FormInputType, data: object) {
    setAllFormData((prevData) => {
      const newData = { ...prevData, [input.id]: data }
      if (window && window.localStorage && !readonly) {
        window.localStorage.setItem(getLocalStorageKey(), JSON.stringify(newData))
      }
      return newData
    })
  }

  function loadFromLocalStorage() {
    if (window && window.localStorage) {
      const data = window.localStorage.getItem(getLocalStorageKey())
      if (data) {
        return JSON.parse(data)
      }
    }
    return null
  }

  function getLocalStorageKey() {
    return `${FORM_DATA_KEY_PREFIX}-${flowId}-${stepData.id}-${userId}`
  }

  return (
    <MultiInput className={getClassName('multiInput', appearance)}>
      <TitleSubtitle appearance={appearance} title={stepData.title} subtitle={stepData.subtitle} />
      <MultiInputContainer className={getClassName('multiInputContainer', appearance)}>
        {formElements?.data?.map((input: FormInputType) => {
          const err = formValidationErrors.reverse().find((error) => error.id === input.id)
          return mergedInputTypes[input.type] ? (
            <span
              key={input.id}
              data-field-id={input.id}
              className={getClassName('multiInputField', appearance)}
            >
              {mergedInputTypes[input.type]({
                formInput: input,
                customFormTypeProps: {
                  flowId,
                  stepData,
                  canContinue,
                  setCanContinue,
                  onSaveData,
                  appearance,
                },
                onSaveInputData: (data) => {
                  if (
                    !touchedInputs.includes(input.id) &&
                    // Ensure not empty string
                    data &&
                    data?.text !== ''
                  ) {
                    setTouchedInputs((prev) => [...prev, input.id])
                  }
                  saveDataFromInputs(input, data)
                },
                inputData: allFormData[input.id],
                setFormValidationErrors: (errors) => {
                  if (errors.length === 0 && formValidationErrors.length === 0) {
                    return
                  }
                  setFormValidationErrors((prev) => {
                    if (errors.length === 0) {
                      return prev.filter((error) => error.id !== input.id)
                    }
                    return [...prev, ...errors]
                  })
                },
              })}
              {err && err.message && touchedInputs.includes(input.id) && err.hidden !== true && (
                <MultiInputValidationError
                  key={input.id}
                  style={{ overflow: 'hidden' }}
                  appearance={appearance}
                  className={getClassName('multiInputValidationError', appearance)}
                >
                  <MultiInputValidationErrorIcon
                    appearance={appearance}
                    className={getClassName('multiInputValidationErrorIcon', appearance)}
                  >
                    <Warning />
                  </MultiInputValidationErrorIcon>
                  {err.message}
                </MultiInputValidationError>
              )}
            </span>
          ) : null
        })}
      </MultiInputContainer>
    </MultiInput>
  )
}
