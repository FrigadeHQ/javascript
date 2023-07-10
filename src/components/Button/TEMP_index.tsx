import * as React from 'react'
import styled from 'styled-components'
import { compose, variant } from 'styled-system'
// import { StyledButton } from './Button.styles'
import { Box, BoxProps } from '../Box'
import { Text } from '../Text'

import { buttonVariants, buttonSizes } from './Button.styles'

export interface ButtonProps extends BoxProps {}

const BaseButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  console.log('PROPS IN BASEBUTTON: ', rest)
  return (
    <Box as="button" {...rest}>
      <Text color={buttonVariants[variant]?.color}>{children}</Text>
    </Box>
  )
}

export const Button = styled(BaseButton)(
  (props) => {
    console.log('PROPS IN STYLED BUTTON: ', props)
    return {
      border: 'none',
      borderRadius: props.theme.radii.md,
    }
  },
  compose(
    variant({
      scale: 'components.Button',
      variants: 'components.Button',
    }),
    variant({
      prop: 'size',
      variants: buttonSizes,
    })
  )
)

Button.defaultProps = {
  variant: 'Primary',
  size: 'md',
}

const buttonVariantComponents = Object.fromEntries(
  Object.keys(buttonVariants).map((variant) => {
    const component = (props: ButtonProps) => (
      <Button {...props} variant={variant}>
        {props.children}
      </Button>
    )

    component.displayName = `Button.${variant}`

    return [variant, component]
  })
)

// Object.assign(Button, buttonVariantComponents)
