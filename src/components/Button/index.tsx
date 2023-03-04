import React, { CSSProperties, FC } from 'react'
import styled from 'styled-components'
import { Appearance, DefaultAppearance } from '../../types'

interface ButtonProps {
  onClick?: () => void
  title?: string
  style?: CSSProperties
  textStyle?: CSSProperties
  disabled?: boolean
  type?: 'full-width' | 'inline'
  isSecondary?: boolean
  appearance?: Appearance
}

const ButtonContainer = styled.button`
  background-color: ${(props) =>
    props.isSecondary
      ? props.appearance.theme.colorBackground
      : props.appearance.theme.colorPrimary};
  border-radius: 5px;
  width: 100%;
  padding: 8px 20px 8px 20px;
  margin: 16px 0px 16px 0px;
  display: flex;
  justify-content: center;
  align-content: center;
  border: 1px solid ${(props) => props.appearance.theme.colorPrimary};
  color: ${(props) =>
    props.isSecondary
      ? props.appearance.theme.colorPrimary
      : props.appearance.theme.colorTextOnPrimaryBackground};
  cursor: pointer;
  :hover {
    opacity: 0.95;
  }
  :disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const ButtonText = styled.span`
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: inherit;
`

export const MultipleButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  & > * {
    margin-right: 8px;
  }
`

export const Button: FC<ButtonProps> = ({
  onClick,
  title,
  style,
  disabled,
  textStyle = {},
  type = 'inline',
  isSecondary = false,
  appearance = DefaultAppearance,
}) => {
  return (
    <ButtonContainer
      isSecondary={isSecondary}
      appearance={appearance}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      <ButtonText style={textStyle}>{title}</ButtonText>
    </ButtonContainer>
  )
}
