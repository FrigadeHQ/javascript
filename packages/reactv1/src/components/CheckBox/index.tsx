import React, { CSSProperties, FC } from 'react'
import { ProgressRing } from '../Progress/ProgressRing'
import { getClassName, mergeClasses, styleOverridesToCSS } from '../../shared/appearance'
import { Appearance, DefaultAppearance } from '../../types'
import styled from 'styled-components'

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
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const BASE_CHECKBOX_STYLES_ROUND: CSSProperties = {
  width: '22px',
  height: '22px',
  borderRadius: '40px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const BASE_CHECKBOX_STYLES_SQUARE__CHECKED = {
  border: '1px solid #000000',
  color: '#FFFFFF',
}

const BASE_CHECKBOX_STYLES_SQUARE__UNCHECKED = {
  border: '1px solid #C5CBD3',
}

const BASE_CHECKBOX_STYLES_ROUND__CHECKED = {
  color: '#FFFFFF',
}

const BASE_CHECKBOX_STYLES_ROUND__UNCHECKED = {
  border: '1px solid #C5CBD3',
}

const getBaseStyle = (type: CheckBoxType): CSSProperties => {
  if (type === 'square') return BASE_CHECKBOX_STYLES_SQUARE
  else return BASE_CHECKBOX_STYLES_ROUND
}

const getStateStyle = (type: CheckBoxType, checked: boolean): CSSProperties => {
  if (type === 'square')
    return checked ? BASE_CHECKBOX_STYLES_SQUARE__CHECKED : BASE_CHECKBOX_STYLES_SQUARE__UNCHECKED
  return checked ? BASE_CHECKBOX_STYLES_ROUND__CHECKED : BASE_CHECKBOX_STYLES_ROUND__UNCHECKED
}

export type CheckBoxType = 'square' | 'round'

export interface CheckBoxProps {
  value: boolean
  type?: CheckBoxType
  primaryColor?: string
  progress?: number // progress percentage our of 1. e.g. 0.5
  appearance?: Appearance
  className?: string
  style?: React.CSSProperties
  label?: string
}

const CheckIconContainer = styled.div`
  ${(props) => styleOverridesToCSS(props)}
  flex-shrink: 0;
`

export const CheckBox: FC<CheckBoxProps> = ({
  value,
  type = 'round',
  primaryColor = '#000000',
  progress,
  appearance = DefaultAppearance,
  style,
  className,
  label,
}) => {
  let checkBoxStyle = getBaseStyle(type as CheckBoxType)
  let stateStyle = getStateStyle(type as CheckBoxType, value)

  if (value === true) {
    checkBoxStyle = {
      ...checkBoxStyle,
      ...stateStyle,
      backgroundColor: appearance.theme.colorTextSuccess,
      borderColor: type === 'square' ? primaryColor : 'none',
    }
  } else {
    checkBoxStyle = {
      ...checkBoxStyle,
      ...stateStyle,
    }
  }

  if (value !== true && type === 'round' && progress !== undefined && progress !== 1) {
    return <ProgressRing fillColor={primaryColor} percentage={progress} size={22} />
  }

  return (
    <CheckIconContainer
      styleOverrides={checkBoxStyle}
      style={style}
      role="checkbox"
      aria-checked={value === true}
      aria-label={label}
      className={mergeClasses(
        getClassName('checkIconContainer', appearance),
        getClassName(
          value ? 'checkIconContainerChecked' : 'checkIconContainerUnchecked',
          appearance
        ),
        value ? 'checkIconContainerChecked' : 'checkIconContainerUnchecked',
        className
      )}
    >
      {value && <CheckIcon color={'#FFFFFF'} />}
    </CheckIconContainer>
  )
}
