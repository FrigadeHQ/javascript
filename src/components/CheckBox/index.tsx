import React, { CSSProperties, FC } from 'react'
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

interface CheckBoxProps {
  label?: string
  value: boolean
  labelStyle?: CSSProperties
  index?: number
  length?: number
  labelPosition?: 'left' | 'right'
  style?: CSSProperties
  primaryColor?: string
}

const BASE_CHECKBOX_STYLES: CSSProperties = {
  width: '22px',
  height: '22px',
  borderRadius: 8,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const BASE_CHECKBOX_STYLES__CHECKED = {
  border: '1px solid #000000',
  color: '#FFFFFF',
}

const BASE_CHECKBOX_STYLES__UNCHECKED = {
  background: '#FFFFFF',
  border: '1px solid #E6E6E6',
}

const Label = styled.span`
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  color: #4d4d4d;
  display: inline-block;
  vertical-align: middle;
  margin-left: 12px;
`

const CheckBoxRow = styled.div`
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 1px solid #e6e6e6;
  width: 100%;
`

export const CheckBox: FC<CheckBoxProps> = ({
  label,
  value,
  labelStyle = {},
  index,
  length,
  labelPosition = 'right',
  style,
  primaryColor = '#000000',
}) => {
  let checkBoxStyle = {
    ...BASE_CHECKBOX_STYLES,
  }

  if (value === true) {
    checkBoxStyle = {
      ...checkBoxStyle,
      ...BASE_CHECKBOX_STYLES__CHECKED,
      backgroundColor: primaryColor,
      borderColor: primaryColor,
    }
  } else {
    checkBoxStyle = {
      ...checkBoxStyle,
      ...BASE_CHECKBOX_STYLES__UNCHECKED,
    }
  }

  return (
    <CheckBoxRow style={{ ...style }}>
      {labelPosition === 'left' && label && <Label style={labelStyle}>{label}</Label>}
      <div style={checkBoxStyle} role="checkbox">
        {value && <CheckIcon />}
      </div>
      {labelPosition === 'right' && label && <Label style={labelStyle}>{label}</Label>}
    </CheckBoxRow>
  )
}
