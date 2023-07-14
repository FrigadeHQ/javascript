import * as React from 'react'
import { StyledButton } from './Button.styles'
import { BoxProps } from '../Box'
import { Text } from '../Text'

import { buttonVariants, buttonSizes } from './Button.styles'

export interface ButtonProps extends BoxProps {}

const BaseButton: React.FC<ButtonProps> = ({
  as = 'button',
  children,
  size = 'md',
  variant = 'Primary',
  ...rest
}) => {
  return (
    <StyledButton forwardedAs={as} variant={variant} size={size} borderRadius="md" {...rest}>
      <Text color={buttonVariants[variant]?.color}>{children}</Text>
    </StyledButton>
  )
}

const buttonVariantComponents = Object.fromEntries(
  Object.keys(buttonVariants).map((variant) => {
    const component = (props: ButtonProps) => (
      <BaseButton {...props} variant={variant}>
        {props.children}
      </BaseButton>
    )

    component.displayName = `Button.${variant}`

    return [variant, component]
  })
)

export const Button = Object.assign(BaseButton, buttonVariantComponents)
