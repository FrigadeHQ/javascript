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

export const SelectListStepType = ({ stepData, setCanContinue, appearance }) => {
  const [currentSelected, setCurrentSelected] = useState<number[]>([])

  const options = (stepData?.props?.data as any[]) ?? []

  const minChoiceCount = stepData.minChoices ?? 1
  const maxChoiceCount = stepData.maxChoices ?? 1

  const handleSelect = (idx: number) => {
    if (currentSelected.includes(idx)) {
      const removed = [...currentSelected.filter((v) => v !== idx)]
      setCurrentSelected(removed)
    } else if (currentSelected.length >= maxChoiceCount) {
      return
    } else {
      setCurrentSelected([...currentSelected, idx])
    }
  }

  useEffect(() => {
    if (currentSelected.length >= minChoiceCount && currentSelected.length <= maxChoiceCount) {
      setCanContinue(true)
    } else {
      setCanContinue(false)
    }
  }, [currentSelected])

  return (
    <SelectListSelectionContainer>
      <SelectListHeader>
        <SelectListTitle>{stepData.title}</SelectListTitle>
        <SelectListSubtitle>{stepData.subtitle}</SelectListSubtitle>
      </SelectListHeader>
      {options.map((opt, idx) => {
        const isSelected = currentSelected.includes(idx)
        return (
          <SelectItem
            key={`select-item-${idx}`}
            onClick={() => handleSelect(idx)}
            hideBottomBorder={idx === options.length - 1}
            className={getClassName('selectListSelectItem', appearance)}
          >
            <SelectItemLeft>
              {opt.icon && <ItemIcon src={opt.icon} alt={`select-icon-${idx}`} />}
              <SelectItemText
                appearance={appearance}
                className={getClassName('selectListSelectItemText', appearance)}
              >
                {opt.title}
              </SelectItemText>
            </SelectItemLeft>
            <CheckBox value={isSelected} primaryColor={appearance.theme.colorPrimary} />
          </SelectItem>
        )
      })}
    </SelectListSelectionContainer>
  )
}
