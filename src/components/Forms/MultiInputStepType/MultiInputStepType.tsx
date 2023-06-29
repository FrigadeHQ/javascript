import React, { useEffect, useState } from 'react'
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
import { AnimatePresence, motion } from 'framer-motion'

interface MultiInputStepProps {
  data?: FormInputType[]
}

const MultiInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 14px;
  overflow: visible;
`

const MultiInputValidationError = styled(motion.div)`
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

export function MultiInputStepType({
  flowId,
  stepData,
  canContinue,
  setCanContinue,
  onSaveData,
  appearance,
  customFormElements,
}: CustomFormTypeProps) {
  const formElements = stepData.props as MultiInputStepProps
  // Create map storing data from individual stepids
  // use state

  const [formValidationErrors, setFormValidationErrors] = useState<FormValidationError[]>([])
  // Create map of inputs that have been touched as to not show error messages until they have been touched
  const [touchedInputs, setTouchedInputs] = useState<string[]>([])
  const { userId } = useUser()
  const [allFormData, setAllFormData] = useState(loadFromLocalStorage() || {})

  // Merge DEFAULT_INPUT_TYPES and customFormElements
  const mergedInputTypes = { ...DEFAULT_INPUT_TYPES, ...customFormElements }

  useEffect(() => {
    setCanContinue(formValidationErrors.length === 0)
  }, [formValidationErrors, setCanContinue])

  function saveDataFromInputs(input: FormInputType, data: object) {
    const newData = { ...allFormData, [input.id]: data }
    setAllFormData(newData)
    onSaveData(newData)

    if (window && window.localStorage) {
      window.localStorage.setItem(getLocalStorageKey(), JSON.stringify(newData))
    }
  }

  function loadFromLocalStorage() {
    if (window && window.localStorage) {
      const data = window.localStorage.getItem(getLocalStorageKey())
      if (data) {
        return JSON.parse(data)
      }
    }
    return {}
  }

  function getLocalStorageKey() {
    return `frigade-multiInputStepTypeData-${flowId}-${stepData.id}-${userId}`
  }

  return (
    <MultiInput className={getClassName('multiInput', appearance)}>
      <TitleSubtitle appearance={appearance} title={stepData.title} subtitle={stepData.subtitle} />
      <MultiInputContainer className={getClassName('multiInputContainer', appearance)}>
        {formElements.data?.map((input: FormInputType) => {
          const err = formValidationErrors.reverse().find((error) => error.id === input.id)?.message
          return mergedInputTypes[input.type] ? (
            <span key={input.id}>
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
                  setFormValidationErrors((prev) => {
                    if (errors.length === 0) {
                      return prev.filter((error) => error.id !== input.id)
                    }
                    return [...prev, ...errors]
                  })
                },
              })}
              <AnimatePresence>
                {err && touchedInputs.includes(input.id) && (
                  <MultiInputValidationError
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    key={input.id}
                    style={{ overflow: 'hidden' }}
                    transition={{ duration: 0.1, ease: 'easeInOut' }}
                    appearance={appearance}
                    className={getClassName('multiInputValidationError', appearance)}
                  >
                    <MultiInputValidationErrorIcon
                      appearance={appearance}
                      className={getClassName('multiInputValidationErrorIcon', appearance)}
                    >
                      <Warning />
                    </MultiInputValidationErrorIcon>
                    {err}
                  </MultiInputValidationError>
                )}
              </AnimatePresence>
            </span>
          ) : null
        })}
      </MultiInputContainer>
    </MultiInput>
  )
}
