import React from 'react'
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
} from './styled'

export const SelectListStepType = ({
  stepData,
  appearance
}) => {

  const options = stepData?.props?.data as any[] ?? []

  return (
    <SelectListSplitContainer>
      <SelectListSelectionContainer>
      <SelectListTitle>
          { stepData.title }
        </SelectListTitle>
        <SelectListSubtitle>
          { stepData.subtitle }
        </SelectListSubtitle>
        {
          options.map((opt) => {
            
            // TODO: Handle selection for single and multi select
            const isSelected = false;
            
            return (
              <SelectItem>
                <SelectItemLeft>
                  { opt.icon && <ItemIcon src={opt.icon}/> }
                  <SelectItemText>{ opt.title }</SelectItemText>
                </SelectItemLeft>
                <CheckBox value={ isSelected }/>
              </SelectItem>
            )
          })
        }
      </SelectListSelectionContainer>
      {
        stepData.image && (
          <SelectListSplitImageContainer appearance={appearance}>
            <img src={stepData.image} />
          </SelectListSplitImageContainer>
        )
      }
    </SelectListSplitContainer>
  )
}