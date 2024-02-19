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
    <Box as={as ?? 'button'} part={[`button-${variantPart}`, part]} {...styles[variant]} {...props}>
      {children}
      {title && (
        <Text.Body2
          color="inherit"
          flexGrow="1"
          fontWeight="demibold"
          transform="translateY(1px)"
          css={{
            '-webkit-font-smoothing': 'antialiased',
            '-moz-osx-font-smoothing': 'grayscale',
          }}
        >
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

    component.displayName = `Button.${variant}`

    return [variant, component]
  })
)

export const Button = Object.assign(BaseButton, buttonVariantComponents)
