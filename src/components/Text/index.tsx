import React from 'react'
import { FontProps } from 'styled-system'
import { BoxProps } from '../Box'
import { StyledText, textVariants } from './Text.styles'

type TextVariant = keyof typeof textVariants
export interface BaseTextProps extends BoxProps, Partial<Pick<FontProps, 'fontWeight'>> {
  variant?: TextVariant
}

const BaseText: React.FC<BaseTextProps> = ({ children, variant = 'Body1', ...rest }) => {
  return (
    <StyledText variant={variant} {...rest}>
      {children}
    </StyledText>
  )
}

const textVariantComponents = Object.fromEntries(
  Object.keys(textVariants).map((variant) => {
    const component = (props: BaseTextProps) => (
      <BaseText {...props} variant={variant as TextVariant}>
        {props.children}
      </BaseText>
    )

    component.displayName = `Text.${variant}`

    return [variant, component]
  })
)

export const Text = Object.assign(BaseText, textVariantComponents)
