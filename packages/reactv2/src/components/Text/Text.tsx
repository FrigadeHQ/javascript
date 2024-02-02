import * as React from 'react'

import { Box, BoxProps } from '../Box'

import * as styles from './Text.styles'

const textVariantNames = [
  'Display1',
  'Display2',
  'H1',
  'H2',
  'H3',
  'H4',
  'Body1',
  'Body2',
  'Caption',
] as const

export interface TextProps extends BoxProps {}

const textVariants = Object.fromEntries(
  textVariantNames.map((variant) => {
    const defaultAs = ['H1', 'H2', 'H3', 'H4'].includes(variant)
      ? (variant.toLowerCase() as 'h1' | 'h2' | 'h3' | 'h4')
      : 'span'

    const component = React.forwardRef(
      (
        { as = defaultAs, children, ...props }: BoxProps,
        ref: React.ForwardedRef<HTMLDivElement>
      ) => (
        <Box as={as} {...styles[variant]} {...props} ref={ref}>
          {children}
        </Box>
      )
    ) as React.ForwardRefExoticComponent<BoxProps>

    component.displayName = `Text.${variant}`

    return [variant, component]
  })
)

export const Display1 = textVariants['Display1']
export const Display2 = textVariants['Display2']
export const H1 = textVariants['H1']
export const H2 = textVariants['H2']
export const H3 = textVariants['H3']
export const H4 = textVariants['H4']
export const Body1 = textVariants['Body1']
export const Body2 = textVariants['Body2']
export const Caption = textVariants['Caption']
