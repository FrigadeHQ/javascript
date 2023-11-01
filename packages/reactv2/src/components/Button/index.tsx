import { clsx } from 'clsx'

import { Box, BoxProps } from '../Box'
import { Text } from '../Text'

import { buttonRecipe, ButtonVariants } from './buttonRecipe.css'

export interface ButtonProps extends BoxProps, ButtonVariants {
  title?: string
}

function BaseButton({
  as,
  children,
  className,
  title,
  variant = 'Primary',
  ...props
}: ButtonProps) {
  return (
    <Box as={as ?? 'button'} className={clsx(buttonRecipe({ variant }), className)} {...props}>
      {children}
      {title && <Text.Body2 fontWeight="demibold">{title}</Text.Body2>}
    </Box>
  )
}

const buttonVariantNames = Object.keys(
  buttonRecipe.classNames.variants.variant
) as ButtonVariants['variant'][]

const buttonVariantComponents = Object.fromEntries(
  buttonVariantNames.map((variant) => {
    const component = (props: ButtonProps) => (
      <BaseButton {...props} variant={variant}>
        {props.children}
      </BaseButton>
    )

    component.displayName = `Text.${variant}`

    return [variant, component]
  })
)

export const Button = Object.assign(BaseButton, buttonVariantComponents)
