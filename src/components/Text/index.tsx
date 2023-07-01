import React from 'react'
import { Box, BoxProps } from '../Box'

import { textRecipe, TextRecipeVariants, textVariantNames, textWeightNames } from './textRecipe.css'

// type TextVariantName = (typeof textVariantNames)[number]
// type TextWeightName = (typeof textWeightNames)[number]

export interface BaseTextProps extends BoxProps, TextRecipeVariants {}

const BaseText: React.FC<BaseTextProps> = ({ children, variant, weight, ...rest }) => {
  return (
    <Box className={textRecipe({ variant, weight })} {...rest}>
      {children}
    </Box>
  )
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
