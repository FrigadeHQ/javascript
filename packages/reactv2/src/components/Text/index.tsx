import { Box, BoxProps } from '../Box'

import * as styles from './Text.styles'
import { sanitize } from '../../shared/sanitize'

type TextVariant =
  | 'Display1'
  | 'Display2'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'Body1'
  | 'Body2'
  | 'Caption'

export interface TextProps extends BoxProps {
  variant?: TextVariant
}

function BaseText({ as = 'span', children, variant = 'Body1', ...props }: TextProps) {
  if (typeof children === 'string') {
    return (
      <Box as={as} {...styles[variant]} {...props} dangerouslySetInnerHTML={sanitize(children)} />
    )
  }

  return (
    <Box as={as} {...styles[variant]} {...props}>
      {children}
    </Box>
  )
}

const textVariantNames: TextVariant[] = [
  'Display1',
  'Display2',
  'H1',
  'H2',
  'H3',
  'H4',
  'Body1',
  'Body2',
  'Caption',
]

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
