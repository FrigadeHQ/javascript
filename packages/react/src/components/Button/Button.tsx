import * as React from 'react'

import { Box, type BoxProps } from '@/components/Box'
import { Text } from '@/components/Text'

import * as styles from './Button.styles'
import { loadingCSSStyle } from './Button.styles'

export type ButtonVariant = 'Primary' | 'Secondary' | 'Link' | 'Plain'

export interface ButtonProps extends BoxProps {
  title?: string
  variant?: ButtonVariant
  loading?: boolean
}

const BaseButton = React.forwardRef(function BaseButtonWithRef(
  { as, children, part, title, variant = 'Primary', ...props }: ButtonProps,
  ref
) {
  const variantPart = variant.toLocaleLowerCase()

  return (
    <Box
      as={as ?? 'button'}
      css={{
        ...(props.css ?? {}),
        ...(props.loading ? loadingCSSStyle : {}),
      }}
      loading={undefined}
      part={[`button-${variantPart}`, part]}
      ref={ref}
      {...styles[variant]}
      {...props}
    >
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
          lineHeight="20px"
          part="button-title"
          textWrap="nowrap"
        >
          {title}
        </Text.Body2>
      )}
    </Box>
  )
})

export const Primary = React.forwardRef(function PrimaryWithRef(
  { children, ...props }: ButtonProps,
  ref
) {
  return (
    <BaseButton {...props} ref={ref} variant="Primary">
      {children}
    </BaseButton>
  )
})
Primary.displayName = 'Button.Primary'

export const Secondary = React.forwardRef(function SecondaryWithRef(
  { children, ...props }: ButtonProps,
  ref
) {
  return (
    <BaseButton {...props} ref={ref} variant="Secondary">
      {children}
    </BaseButton>
  )
})
Secondary.displayName = 'Button.Secondary'

export const Link = React.forwardRef(function LinkWithRef(
  { children, ...props }: ButtonProps,
  ref
) {
  return (
    <BaseButton {...props} ref={ref} variant="Link">
      {children}
    </BaseButton>
  )
})
Link.displayName = 'Button.Link'

export const Plain = React.forwardRef(function PlainWithRef(
  { children, ...props }: ButtonProps,
  ref
) {
  return (
    <BaseButton {...props} ref={ref} variant="Plain">
      {children}
    </BaseButton>
  )
})
Plain.displayName = 'Button.Plain'
