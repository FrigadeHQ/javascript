import React, { CSSProperties, FC } from 'react'
import styled from 'styled-components'
import { Appearance } from '../../types'
import {
  getClassName,
  getCustomClassOverrides,
  styleOverridesToCSS,
  ucFirst,
} from '../../shared/appearance'
import { Spinner } from '../Spinner'
import { sanitize } from '../../shared/sanitizer'

interface ButtonProps {
  onClick?: () => void
  title?: string
  style?: CSSProperties
  textStyle?: CSSProperties
  disabled?: boolean
  type?: 'full-width' | 'inline'
  secondary?: boolean
  appearance?: Appearance
  withMargin?: boolean
  size?: 'small' | 'medium' | 'large'
  classPrefix?: string
  loading?: boolean
  autoFocus?: boolean
}

const ButtonContainer = styled.button`
  justify-content: center;
  align-content: center;
  align-items: center;
  ${(props) => getCustomClassOverrides(props)} {
    display: flex;
    // Anything inside this block will be ignored if the user provides a custom class
    width: ${(props) => (props.type === 'full-width' ? '100%' : 'auto')};
    // Only add margin if prop withMargin is true
    ${(props) => (props.withMargin ? 'margin: 16px 0px 16px 0px;' : '')}

    border: 1px solid ${(props) =>
      props.secondary ? '#C5CBD3' : props?.appearance?.theme?.colorPrimary};
    color: ${(props) =>
      props.secondary
        ? props.appearance?.theme?.colorText
        : props.appearance?.theme?.colorTextOnPrimaryBackground};
    background-color: ${(props) =>
      props.secondary
        ? props.appearance?.theme?.colorBackground
        : props?.appearance?.theme?.colorPrimary};
    border-radius: ${(props) => props.appearance?.theme?.borderRadius}px;
    padding: ${(props) => (props.size == 'small' ? '6px 14px 6px 14px' : '8px 20px 8px 20px')};
    font-size: ${(props) => (props.size == 'small' ? '14px' : '15px')};
    line-height: 20px;
    font-weight: 500;
    ${(props) => styleOverridesToCSS(props)}
  }

  font-family: inherit;

  cursor: pointer;
  :hover {
    opacity: ${(props) => (props.loading == 'true' ? '1.0' : '0.8')};
  }

  :disabled {
    opacity: ${(props) => (props.loading == 'true' ? '1.0' : '0.3')};
    cursor: not-allowed;
  }
`

export const MultipleButtonContainer = styled.div`
  ${(props) => getCustomClassOverrides(props)} {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 8px;

    & > * {
      margin-right: 8px;
    }
  }
`

export const Button: FC<ButtonProps> = ({
  onClick,
  title,
  style,
  disabled,
  type = 'inline',
  size = 'medium',
  secondary = false,
  appearance,
  withMargin = true,
  classPrefix = '',
  loading = false,
}) => {
  function getClassNameWithPrefix() {
    const name = secondary ? 'buttonSecondary' : 'button'
    if (classPrefix === '') {
      return name
    }

    return `${classPrefix}${ucFirst(name)}`
  }

  const commonProps = {
    tabindex: secondary ? '0' : '1',
    secondary,
    appearance,
    disabled: disabled || loading,
    loading: loading?.toString() ?? '',
    onClick,
    styleOverrides: style,
    type,
    withMargin,
    size,
    className: getClassName(getClassNameWithPrefix(), appearance),
  }

  if (!loading) {
    return (
      <ButtonContainer {...commonProps} dangerouslySetInnerHTML={sanitize(title ?? `Continue`)} />
    )
  }

  return (
    <ButtonContainer {...commonProps}>
      <Spinner className={getClassName('buttonLoader', appearance)} />
    </ButtonContainer>
  )
}
