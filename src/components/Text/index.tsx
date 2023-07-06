import React from 'react'
import { FontProps } from 'styled-system'
import { BoxProps } from '../Box'
import { StyledText, textVariantStyles } from './styled'

type TextVariant = keyof typeof textVariantStyles
export interface BaseTextProps extends BoxProps, Partial<Pick<FontProps, 'fontWeight'>> {
  variant?: TextVariant
}

const BaseText: React.FC<BaseTextProps> = ({ children, ...rest }) => {
  return <StyledText {...rest}>{children}</StyledText>
}

const textVariants = Object.fromEntries(
  Object.keys(textVariantStyles).map((variant) => {
    const component = (props: BaseTextProps) => (
      <BaseText {...props} variant={variant as TextVariant}>
        {props.children}
      </BaseText>
    )

    component.displayName = `Text.${variant}`

    return [variant, component]
  })
)

export const Text = Object.assign(BaseText, textVariants)
