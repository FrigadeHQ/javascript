import * as React from 'react'
import { StyledButton } from './Button.styles'
import { BoxProps } from '../Box'
import { Text } from '../Text'

import { buttonVariants, ButtonSize, ButtonVariant } from './Button.styles'

export interface ButtonProps extends BoxProps {
  size?: ButtonSize
  variant?: ButtonVariant
}

const BaseButton: React.FC<ButtonProps> = ({
  children,
  size = 'md',
  variant = 'Primary',
  ...rest
}) => {
  return (
    <StyledButton as="button" variant={variant} size={size} {...rest}>
      <Text color={buttonVariants[variant].color}>{children}</Text>
    </StyledButton>
  )
}

const buttonVariantComponents = Object.fromEntries(
  Object.keys(buttonVariants).map((variant) => {
    const component = (props: ButtonProps) => (
      <BaseButton {...props} variant={variant as ButtonVariant}>
        {props.children}
      </BaseButton>
    )

    component.displayName = `Button.${variant}`

    return [variant, component]
  })
)

export const Button = Object.assign(BaseButton, buttonVariantComponents)
