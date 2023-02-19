import React, { CSSProperties, FC } from 'react'
import { CheckBox } from '../../components/CheckBox'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { StepData } from '../../types'

interface StepItemProps {
  data: StepData
  index: number
  listLength: number
  isSelected: boolean
  primaryColor: string
  style: CSSProperties
  onClick: () => void
}

const StepItemSelectedIndicator = styled.div`
  width: 4px;
  position: absolute;
  left: 0;
  top: 10%;
  height: 80%;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`

const ChecklistStepItem = styled.div`
  flex-direction: row;
  justify-content: flex-start;
`

export const StepChecklistItem: FC<StepItemProps> = ({
  data,
  index,
  listLength,
  isSelected,
  primaryColor,
  style,
  onClick,
}) => {
  return (
    <div
      style={{ position: 'relative', paddingLeft: '20px' }}
      onClick={() => {
        onClick()
      }}
    >
      {isSelected && (
        <StepItemSelectedIndicator
          as={motion.div}
          layoutId="checklis-step-selected"
          style={{ backgroundColor: primaryColor }}
        ></StepItemSelectedIndicator>
      )}
      <ChecklistStepItem key={`hero-checklist-step-${index}`} role="listitem">
        <CheckBox
          value={data.complete}
          labelPosition="left"
          label={data.stepName}
          index={index}
          length={listLength}
          style={style}
          primaryColor={primaryColor}
        />
      </ChecklistStepItem>
    </div>
  )
}
