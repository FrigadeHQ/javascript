import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { FormInputProps, MultipleChoiceListProps } from '../../../../../FrigadeForm/types'
import { getCustomClassOverrides } from '../../../../../shared/appearance'
import { Label } from '../shared/Label'

const MultipleChoiceListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
`

const MultipleChoiceListItem = styled.button`
  ${(props) => getCustomClassOverrides(props)} {
    // Anything inside this block will be ignored if the user provides a custom class
    border: 1px solid ${(props) => props.appearance?.theme?.colorBorder};
    font-size: 14px;
    // Selector for when selected=true
    &[data-selected='true'] {
      border: 1px solid ${(props) => props.appearance.theme.colorPrimary};
      background-color: ${(props) => props.appearance.theme.colorPrimary}1a;
    }

    :hover {
      border: 1px solid ${(props) => props.appearance.theme.colorPrimary};
    }
    text-align: left;
    border-radius: 6px;
  }
  cursor: pointer;
  width: 100%;
  height: 60px;
  padding: 0 18px;
  margin-bottom: 10px;
`

export function MultipleChoiceList({
  formInput,
  customFormTypeProps,
  onSaveInputData,
  inputData,
}: FormInputProps) {
  const input = formInput as MultipleChoiceListProps
  const [selectedIds, setSelectedIds] = useState<string[]>(inputData.choice || [])
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (selectedIds.length == 0 && !hasLoaded) {
      setHasLoaded(true)
      onSaveInputData({ choice: [] })
    }
  }, [])

  useEffect(() => {
    onSaveInputData({ choice: selectedIds })
  }, [selectedIds])

  return (
    <MultipleChoiceListWrapper>
      <Label
        title={input.title}
        required={input.required}
        appearance={customFormTypeProps.appearance}
      />
      {input.props.options?.map((option) => {
        return (
          <MultipleChoiceListItem
            appearance={customFormTypeProps.appearance}
            key={option.id}
            value={option.id}
            data-selected={selectedIds.includes(option.id)}
            onClick={() => {
              // If the option is already selected, remove it from the selectedIds
              if (selectedIds.includes(option.id)) {
                setSelectedIds(selectedIds.filter((id) => id !== option.id))
                return
              }
              // Select the input if we are still under maxChoices
              if (selectedIds.length < input.props.maxChoices) {
                setSelectedIds([...selectedIds, option.id])
              } else {
                if (selectedIds.length == 1 && input.props.maxChoices == 1) {
                  // deselect the input if we are at maxChoices and minChoices is 1
                  setSelectedIds([option.id])
                }
              }
            }}
          >
            {option.title}
          </MultipleChoiceListItem>
        )
      })}
    </MultipleChoiceListWrapper>
  )
}
