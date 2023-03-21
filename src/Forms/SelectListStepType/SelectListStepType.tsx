import React, { useEffect, useState } from 'react'
import { CheckBox } from '../../components/CheckBox'
import { getClassName } from '../../shared/appearance'
import {
  ItemIcon,
  SelectItem,
  SelectItemLeft,
  SelectItemText,
  SelectListHeader,
  SelectListSelectionContainer,
  SelectListSubtitle,
  SelectListTitle,
} from './styled'
import { CustomFormTypeProps, MultipleChoiceProps } from '../../FrigadeForm/types'

export const SelectListStepType = ({
  stepData,
  canContinue,
  setCanContinue,
  onSaveData,
  appearance,
}: CustomFormTypeProps) => {
  const multipleChoiceProps = stepData.props as MultipleChoiceProps
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (selectedIds.length == 0 && !hasLoaded) {
      setHasLoaded(true)
      onSaveData({ choice: [] })
    }
  }, [hasLoaded])

  useEffect(() => {
    onSaveData({ choice: selectedIds })
    if (selectedIds.length >= multipleChoiceProps.minChoices) {
      setCanContinue(true)
    } else {
      setCanContinue(false)
    }
  }, [selectedIds])

  return (
    <SelectListSelectionContainer className={getClassName('selectListContainer', appearance)}>
      <SelectListHeader>
        <SelectListTitle className={getClassName('selectListTitle', appearance)}>
          {stepData.title}
        </SelectListTitle>
        <SelectListSubtitle className={getClassName('selectListSubtitle', appearance)}>
          {stepData.subtitle}
        </SelectListSubtitle>
      </SelectListHeader>
      {multipleChoiceProps.options.map((option, idx) => {
        const isSelected = selectedIds.includes(option.id)
        return (
          <SelectItem
            key={`select-item-${idx}`}
            onClick={() => {
              // If the option is already selected, remove it from the selectedIds
              if (selectedIds.includes(option.id)) {
                setSelectedIds(selectedIds.filter((id) => id !== option.id))
                return
              }
              // Select the input if we are still under maxChoices
              if (selectedIds.length < multipleChoiceProps.maxChoices) {
                setSelectedIds([...selectedIds, option.id])
              } else {
                if (selectedIds.length == 1 && multipleChoiceProps.maxChoices == 1) {
                  // deselect the input if we are at maxChoices and minChoices is 1
                  setSelectedIds([option.id])
                }
              }
            }}
            hideBottomBorder={idx === multipleChoiceProps.options.length - 1}
            className={getClassName('selectListSelectItem', appearance)}
          >
            <SelectItemLeft className={getClassName('selectListItemImage', appearance)}>
              {option.imageUri && <ItemIcon src={option.imageUri} alt={`select-icon-${idx}`} />}
              <SelectItemText
                appearance={appearance}
                className={getClassName('selectListSelectItemText', appearance)}
              >
                {option.title}
              </SelectItemText>
            </SelectItemLeft>
            <CheckBox
              appearance={appearance}
              value={isSelected}
              primaryColor={appearance.theme.colorPrimary}
            />
          </SelectItem>
        )
      })}
    </SelectListSelectionContainer>
  )
}
