import * as React from 'react'
import { StyledButton } from './Button.styles'
import { BoxProps } from '../Box'
import { Text } from '../Text'

import { buttonVariants, buttonSizes } from './Button.styles'

export interface ButtonProps extends BoxProps {
  title: string
}

const BaseButton: React.FC<ButtonProps> = ({
  as = 'button',
  className,
  size = 'md',
  title,
  variant = 'Primary',
  ...rest
}) => {
  return (
    <StyledButton
      className={`fr-button-${variant.toLowerCase()}${className ? ` ${className}` : ''}`}
      forwardedAs={as}
      variant={variant}
      size={size}
      borderRadius="md"
      {...rest}
    >
      <Text color={buttonVariants[variant]?.color} fontWeight="semibold">
        {title}
      </Text>
    </StyledButton>
  )
}

const buttonVariantComponents = Object.fromEntries(
  Object.keys(buttonVariants).map((variant) => {
    const component = (props: ButtonProps) => <BaseButton {...props} variant={variant} />

    component.displayName = `Button.${variant}`

    return [variant, component]
  })
)

export const Button = Object.assign(BaseButton, buttonVariantComponents)
