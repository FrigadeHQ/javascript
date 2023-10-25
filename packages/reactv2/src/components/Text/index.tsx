import { clsx } from 'clsx'

import { Box, BoxProps } from '../Box'

import { textRecipe, TextVariants } from './textRecipe.css'

export interface TextProps extends BoxProps, TextVariants {}

function BaseText({ as = 'span', children, className, variant = 'Body1', ...props }: TextProps) {
  return (
    <Box as={as} className={clsx(textRecipe({ variant }), className)} {...props}>
      {children}
    </Box>
  )
}

const textVariantNames = Object.keys(
  textRecipe.classNames.variants.variant
) as TextVariants['variant'][]

const textVariantComponents = Object.fromEntries(
  textVariantNames.map((variant) => {
    const asProp = ['H1', 'H2', 'H3', 'H4'].includes(variant)
      ? (variant.toLowerCase() as 'h1' | 'h2' | 'h3' | 'h4')
      : undefined
    const component = (props: TextProps) => (
      <BaseText as={asProp} {...props} variant={variant}>
        {props.children}
      </BaseText>
    )

    component.displayName = `Text.${variant}`

    return [variant, component]
  })
)

export const Text = Object.assign(BaseText, textVariantComponents)
