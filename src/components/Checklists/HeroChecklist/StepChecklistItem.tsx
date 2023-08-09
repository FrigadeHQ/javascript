import React, { CSSProperties, FC } from 'react'
import { CheckBoxRow } from '../../CheckBoxRow'
import { Appearance, StepData } from '../../../types'
import { ChecklistStepItem, StepItemSelectedIndicator } from './styled'
import { getClassName } from '../../../shared/appearance'

interface StepItemProps {
  data: StepData
  index: number
  listLength: number
  isSelected: boolean
  primaryColor: string
  style: CSSProperties
  onClick: () => void
  appearance?: Appearance
}

export const StepChecklistItem: FC<StepItemProps> = ({
  data,
  index,
  isSelected,
  primaryColor,
  style,
  onClick,
  appearance,
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
          className={getClassName('checklistStepItemSelectedIndicator', appearance)}
          layoutId="checklis-step-selected"
          style={{ backgroundColor: appearance?.theme?.colorPrimary ?? primaryColor }}
        ></StepItemSelectedIndicator>
      )}
      <ChecklistStepItem
        className={getClassName('checklistStepItem', appearance)}
        key={`hero-checklist-step-${index}`}
        role="listitem"
      >
        <CheckBoxRow
          value={data.complete}
          labelPosition="left"
          label={data.stepName ?? data.title}
          style={style}
          primaryColor={appearance?.theme?.colorPrimary ?? primaryColor}
          appearance={appearance}
        />
      </ChecklistStepItem>
    </div>
  )
}
