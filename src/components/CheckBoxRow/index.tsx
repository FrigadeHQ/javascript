import React, { CSSProperties, FC } from 'react'
import styled from 'styled-components'
import { CheckBox, CheckBoxType } from '../CheckBox'

interface CheckBoxProps {
  label?: string
  value: boolean
  labelStyle?: CSSProperties
  labelPosition?: 'left' | 'right'
  style?: CSSProperties
  primaryColor?: string
  secondaryColor?: string
  checkBoxType?: CheckBoxType
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

const CheckBoxRowContainer = styled.div`
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 1px solid #e6e6e6;
  width: 100%;
`

export const CheckBoxRow: FC<CheckBoxProps> = ({
  label,
  value,
  labelStyle = {},
  labelPosition = 'right',
  style,
  primaryColor = '#000000',
  checkBoxType = 'square',
  secondaryColor
}) => {

  return (
    <CheckBoxRowContainer style={{ ...style }}>
      {labelPosition === 'left' && label && <Label style={labelStyle}>{label}</Label>}
      <CheckBox value={value} type={checkBoxType} primaryColor={primaryColor} secondaryColor={secondaryColor} />
      {labelPosition === 'right' && label && <Label style={labelStyle}>{label}</Label>}
    </CheckBoxRowContainer>
  )
}
