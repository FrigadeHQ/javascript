import React, { useState, useEffect } from 'react'
import { CheckBox } from '../../components/CheckBox'
import {
  SelectListSplitContainer,
  SelectListSelectionContainer,
  SelectItem,
  SelectItemText,
  ItemIcon,
  SelectListSplitImageContainer,
  SelectListTitle,
  SelectListSubtitle,
  SelectItemLeft,
  SelectListSplitImageBackground,
  SelectListHeader
} from './styled'

export const SelectListStepType = ({
  stepData,
  setCanContinue,
  appearance
}) => {

  const [currentSelected, setCurrentSelected] = useState<number[]>([])

  const options = stepData?.props?.data as any[] ?? []
  
  const minChoiceCount = stepData.minChoices ?? 1;
  const maxChoiceCount = stepData.maxChoices ?? 1;

  const handleSelect = (idx: number) => {
    if(currentSelected.includes(idx)){
      const removed = [...currentSelected.filter(v => v !== idx)]
      setCurrentSelected(removed)
    }
    else if(currentSelected.length >= maxChoiceCount){
      return;
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
  },[currentSelected])

  return (
    <SelectListSplitContainer>
      <SelectListSelectionContainer>
        <SelectListHeader>
          <SelectListTitle>
            { stepData.title }
          </SelectListTitle>
          <SelectListSubtitle>
            { stepData.subtitle }
          </SelectListSubtitle>
        </SelectListHeader>
        {
          options.map((opt, idx) => {
            const isSelected = currentSelected.includes(idx);
            return (
              <SelectItem key={`select-item-${idx}`} onClick={() => handleSelect(idx)} hideBottomBorder={idx === options.length - 1}>
                <SelectItemLeft>
                  { opt.icon && <ItemIcon src={opt.icon} alt={`select-icon-${idx}`}/> }
                  <SelectItemText appearance={appearance}>{ opt.title }</SelectItemText>
                </SelectItemLeft>
                <CheckBox value={ isSelected } appearance={appearance} />
              </SelectItem>
            )
          })
        }
      </SelectListSelectionContainer>
      {
        stepData.image && (
          <SelectListSplitImageContainer appearance={appearance}>
            <img src={stepData.image} />
            <SelectListSplitImageBackground appearance={appearance}/>
          </SelectListSplitImageContainer>
        )
      }
    </SelectListSplitContainer>
  )
}