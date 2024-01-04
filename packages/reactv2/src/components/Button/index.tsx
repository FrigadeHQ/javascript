import { Interpolation } from '@emotion/react'
import { Box, BoxProps } from '../Box'
import { Text } from '../Text'

import * as styles from './Button.styles'

// TODO: Generate this type from buttonVariantNames
type ButtonVariant = 'Primary' | 'Secondary' | 'Link' | 'Plain'

export interface ButtonProps extends BoxProps {
  title?: string
  variant?: ButtonVariant
}

function BaseButton({ as, children, part, title, variant = 'Primary', ...props }: ButtonProps) {
  const variantPart = variant.toLocaleLowerCase()

  return (
    <Box
      as={as ?? 'button'}
      css={styles[variant] as Interpolation<any>}
      part={[`button-${variantPart}`, part]}
      {...props}
    >
      {children}
      {title && (
        <Text.Body2 fontWeight="demibold" color="inherit">
          {title}
        </Text.Body2>
      )}
    </Box>
  )
}

const buttonVariantNames: ButtonVariant[] = ['Primary', 'Secondary', 'Link', 'Plain']

const buttonVariantComponents = Object.fromEntries(
  buttonVariantNames.map((variant) => {
    const component = (props: ButtonProps) => {
      return (
        <BaseButton {...props} variant={variant}>
          {props.children}
        </BaseButton>
      )
    }

    component.displayName = `Text.${variant}`

    return [variant, component]
  })
)

export const Button = Object.assign(BaseButton, buttonVariantComponents)
