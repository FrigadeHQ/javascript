import React from 'react'
import { textRecipe, TextRecipeVariants, textVariantNames, textWeightNames } from './textRecipe.css'

type TextVariantName = (typeof textVariantNames)[number]
type TextWeightName = (typeof textWeightNames)[number]

export interface BaseTextProps extends TextRecipeVariants {
  children: React.ReactNode
}

const BaseText: React.FC<BaseTextProps> = ({ children, variant = 'Body1', weight = 'normal' }) => {
  return <span className={textRecipe({ variant, weight } as TextRecipeVariants)}>{children}</span>
}

const textVariants = Object.fromEntries(
  textVariantNames.map((variant) => {
    const component = (props: BaseTextProps) => (
      <BaseText {...props} variant={variant}>
        {props.children}
      </BaseText>
    )

    component.displayName = `Text.${variant}`

    return [variant, component]
  })
)

export const Text = Object.assign(BaseText, textVariants)
