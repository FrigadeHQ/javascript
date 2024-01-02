import kcp from 'known-css-properties'
import type { CSSProperties } from 'react'

import { theme } from '../../shared/theme'
import { flattenObject } from '../../shared/flattenObject'

const filteredCSSProperties = kcp.all
  .filter((prop) => prop.indexOf('-') != 0)
  .map((prop) => [prop.replace(/-([a-z])/g, (_, char) => char.toUpperCase()), null])

const defaultCSSProperties = Object.fromEntries(filteredCSSProperties)

// SEE: https://stackoverflow.com/a/47058976
type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>]
    }[Extract<keyof T, string>]

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string

type ColorName = Join<PathsToStringProps<typeof theme.colors>, '.'>

const colorTokens = flattenObject(theme.colors) as Record<ColorName, string>

const themedStyleProps = {
  color: colorTokens,
  backgroundColor: colorTokens,
  borderColor: colorTokens,

  border: theme.borders,
  borderRadius: theme.radii,
  borderWidth: theme.borderWidths,
  boxShadow: theme.shadows,

  fontFamily: theme.fontFamilies,
  fontSize: theme.fontSizes,
  fontWeight: theme.fontWeights,

  gap: theme.space,

  lineHeight: theme.lineHeights,

  margin: theme.space,
  marginBottom: theme.space,
  marginLeft: theme.space,
  marginRight: theme.space,
  marginTop: theme.space,

  padding: theme.space,
  paddingBottom: theme.space,
  paddingLeft: theme.space,
  paddingRight: theme.space,
  paddingTop: theme.space,
} as const

export const styleProps = {
  ...defaultCSSProperties,
  ...themedStyleProps,
}

export const stylePropShorthands = {
  m: ['margin'],
  mt: ['marginTop'],
  mr: ['marginRight'],
  mb: ['marginBottom'],
  ml: ['marginLeft'],
  mx: ['marginLeft', 'marginRight'],
  my: ['marginTop', 'marginBottom'],

  p: ['padding'],
  pt: ['paddingTop'],
  pr: ['paddingRight'],
  pb: ['paddingBottom'],
  pl: ['paddingLeft'],
  px: ['paddingLeft', 'paddingRight'],
  py: ['paddingTop', 'paddingBottom'],
}

type ThemedStyleProps = {
  [K in keyof typeof themedStyleProps]: keyof (typeof themedStyleProps)[K]
}

type FilteredCSSProps = Omit<
  {
    [key in keyof CSSProperties]: CSSProperties[key]
  },
  | `-${string}`
  | `Moz${string}`
  | `ms${string}`
  | `Webkit${string}`
  | `Khtml${string}`
  | `O${string}`
>

export type ThemedStyleProp<K extends keyof ThemedStyleProps> = ThemedStyleProps[K] | (string & {})

export interface StyleProps extends FilteredCSSProps {
  backgroundColor?: ThemedStyleProp<'backgroundColor'>
  border?: ThemedStyleProp<'border'>
  borderColor?: ThemedStyleProp<'borderColor'>
  borderRadius?: ThemedStyleProp<'borderRadius'>
  borderWidth?: ThemedStyleProp<'borderWidth'>
  boxShadow?: ThemedStyleProp<'boxShadow'>
  color?: ThemedStyleProp<'color'>
  fontFamily?: ThemedStyleProp<'fontFamily'>
  fontSize?: ThemedStyleProp<'fontSize'>
  fontWeight?: ThemedStyleProp<'fontWeight'>
  gap?: ThemedStyleProp<'gap'>
  lineHeight?: ThemedStyleProp<'lineHeight'>
  margin?: ThemedStyleProp<'margin'>
  marginBottom?: ThemedStyleProp<'marginBottom'>
  marginLeft?: ThemedStyleProp<'marginLeft'>
  marginRight?: ThemedStyleProp<'marginRight'>
  marginTop?: ThemedStyleProp<'marginTop'>
  padding?: ThemedStyleProp<'padding'>
  paddingBottom?: ThemedStyleProp<'paddingBottom'>
  paddingLeft?: ThemedStyleProp<'paddingLeft'>
  paddingRight?: ThemedStyleProp<'paddingRight'>
  paddingTop?: ThemedStyleProp<'paddingTop'>
}
