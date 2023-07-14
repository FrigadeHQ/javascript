import React from 'react'
import { FontProps } from 'styled-system'
import { BoxProps } from '../Box'
import { StyledText, textVariants } from './Text.styles'

type TextVariant = keyof typeof textVariants
export interface BaseTextProps extends BoxProps, Partial<Pick<FontProps, 'fontWeight'>> {
  variant?: TextVariant
}

const BaseText: React.FC<BaseTextProps> = ({
  as = 'span',
  children,
  variant = 'Body1',
  ...rest
}) => {
  return (
    <StyledText
      color="neutral.foreground"
      fontFamily="default"
      forwardedAs={as}
      variant={variant}
      {...rest}
    >
      {children}
    </StyledText>
  )
}

const textVariantComponents = Object.fromEntries(
  Object.keys(textVariants).map((variant) => {
    const asProp = ['H1', 'H2', 'H3', 'H4'].includes(variant) ? variant.toLowerCase() : undefined
    const component = (props: BaseTextProps) => (
      <BaseText as={asProp} {...props} variant={variant as TextVariant}>
        {props.children}
      </BaseText>
    )

    component.displayName = `Text.${variant}`

    return [variant, component]
  })
)

export const Text = Object.assign(BaseText, textVariantComponents)
