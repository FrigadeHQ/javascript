import React, { CSSProperties, FC } from 'react'
import styled from 'styled-components'

interface ButtonProps {
  onClick?: () => void
  title?: string
  style?: CSSProperties
  disabled?: boolean
}

const BUTTON_PRIMARY_BG = '#000000'
const BUTTON_PRIMARY_TEXT_COLOR = '#FFFFFF'

const ButtonContainer = styled.button`
  background-color: ${BUTTON_PRIMARY_BG};
  border-radius: 5px;
  width: 100%;
  padding: 8px 20px 8px 20px;
  margin: 16px 0px 16px 0px;
  display: flex;
  justify-content: center;
  align-content: center;
  border: 1px solid ${BUTTON_PRIMARY_BG};
  color: ${BUTTON_PRIMARY_TEXT_COLOR};
  :disabled {
    opacity: 0.3;
  }
`

const ButtonText = styled.span`
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: inherit;
`

export const Button: FC<ButtonProps> = ({ onClick, title, style, disabled }) => {
  return (
    <ButtonContainer disabled={disabled} onClick={onClick} style={style}>
      <ButtonText>{title}</ButtonText>
    </ButtonContainer>
  )
}
