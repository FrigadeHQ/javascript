import React from 'react'
import { textRecipe, TextRecipeVariants, textVariantNames } from './textRecipe.css'

type TextVariantName = (typeof textVariantNames)[number]

export interface BaseTextProps {
  children: React.ReactNode
  variant?: TextVariantName
}

const BaseText: React.FC<BaseTextProps> = ({ children, variant = 'Body1' }) => {
  return <span className={textRecipe({ variant } as TextRecipeVariants)}>{children}</span>
}

const textVariants = Object.fromEntries(
  textVariantNames.map((variant) => {
    return [
      variant,
      ({ children }) => <BaseText variant={variant as TextVariantName}>{children}</BaseText>,
    ]
  })
)

export const Text = Object.assign(BaseText, textVariants)
