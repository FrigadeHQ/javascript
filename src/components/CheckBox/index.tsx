import React, { CSSProperties, FC } from 'react'

const CheckIcon = ({ color = '#FFFFFF' }) => (
  <svg width={10} height={8} viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 4.34815L3.4618 7L3.4459 6.98287L9 1"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const BASE_CHECKBOX_STYLES_SQUARE: CSSProperties = {
  width: '22px',
  height: '22px',
  borderRadius: 8,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const BASE_CHECKBOX_STYLES_ROUND: CSSProperties = {
  width: '22px',
  height: '22px',
  borderRadius: 40,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const BASE_CHECKBOX_STYLES_SQUARE__CHECKED = {
  border: '1px solid #000000',
  color: '#FFFFFF',
}

const BASE_CHECKBOX_STYLES_SQUARE__UNCHECKED = {
  background: '#FFFFFF',
  border: '1px solid #E6E6E6',
}

const BASE_CHECKBOX_STYLES_ROUND__CHECKED = {
  border: '1px solid #000000',
  color: '#FFFFFF',
}

const BASE_CHECKBOX_STYLES_ROUND__UNCHECKED = {
  background: '#FFFFFF',
  border: '3px solid #D9D9D9',
}


const getBaseStyle = (type: CheckBoxType): CSSProperties => {
  if (type === 'square') return BASE_CHECKBOX_STYLES_SQUARE
  else return BASE_CHECKBOX_STYLES_ROUND
}

const getStateStyle = (type: CheckBoxType, checked: boolean): CSSProperties => {
  if (type === 'square') return checked ? BASE_CHECKBOX_STYLES_SQUARE__CHECKED : BASE_CHECKBOX_STYLES_SQUARE__UNCHECKED
  return checked ? BASE_CHECKBOX_STYLES_ROUND__CHECKED : BASE_CHECKBOX_STYLES_ROUND__UNCHECKED
}

export type CheckBoxType = 'square' | 'round'

export interface CheckBoxProps {
  value: boolean
  type: CheckBoxType
  primaryColor?: string
  secondaryColor?: string
}

export const CheckBox: FC<CheckBoxProps> = (
  {
    value,
    type = 'square',
    primaryColor = '#000000',
    secondaryColor = 'rgb(0,0,0, 0.3)' 
  }
) => {

  let checkBoxStyle = getBaseStyle(type)
  let stateStyle = getStateStyle(type, value)

  const checkColor = type === 'round' ? primaryColor : '#FFFFFF'
 
  if (value === true) {
    checkBoxStyle = {
      ...checkBoxStyle,
      ...stateStyle,
      backgroundColor: type === 'square' ? primaryColor : secondaryColor,
      borderColor: type === 'square' ? primaryColor : secondaryColor,
    }
  } else {
    checkBoxStyle = {
      ...checkBoxStyle,
      ...stateStyle,
    }
  }

  return (
    <div style={checkBoxStyle} role="checkbox">
      {value && <CheckIcon color={checkColor} />}
    </div>
  )
}