import { Box, type BoxProps } from '@/components/Box'
import { Text } from '@/components/Text'

import * as styles from './Button.styles'

export type ButtonVariant = 'Primary' | 'Secondary' | 'Link' | 'Plain'

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
          css={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          }}
          flexGrow="1"
          fontWeight="medium"
          part="button-title"
          textWrap="nowrap"
        >
          {title}
        </Text.Body2>
      )}
    </Box>
  )
}

export function Primary({ children, ...props }: ButtonProps) {
  return (
    <BaseButton {...props} variant="Primary">
      {children}
    </BaseButton>
  )
}

export function Secondary({ children, ...props }: ButtonProps) {
  return (
    <BaseButton {...props} variant="Secondary">
      {children}
    </BaseButton>
  )
}

export function Link({ children, ...props }: ButtonProps) {
  return (
    <BaseButton {...props} variant="Link">
      {children}
    </BaseButton>
  )
}

export function Plain({ children, ...props }: ButtonProps) {
  return (
    <BaseButton {...props} variant="Plain">
      {children}
    </BaseButton>
  )
}
