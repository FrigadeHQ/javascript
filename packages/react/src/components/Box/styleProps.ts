import kcp from 'known-css-properties'
import type { CSSProperties } from 'react'

import { theme } from '../../shared/theme'
import { flattenObject } from '../../shared/flattenObject'

// Don't use these as CSS props, pass them through to HTML
const omittedCSSProperties = new Set([
  'alt', // Mozilla doesn't have this listed as a valid CSS property ¯\_(ツ)_/¯
  'size', // Only applies to @page, not used for styling components. Breaks <input>
  'src', // Only applies to @font-face, not used for styling components. Breaks <img>, <video>, et al
])

const filteredCSSProperties = kcp.all
  .filter((prop) => prop.indexOf('-') != 0 && !omittedCSSProperties.has(prop))
  .map((prop) => [prop.replace(/-([a-z])/g, (_, char) => char.toUpperCase()), null])

const defaultCSSProperties: Record<string, null> = Object.fromEntries(filteredCSSProperties)

// Recursive type for flattened color names
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

  border: { ...theme.borderWidths, ...colorTokens },
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
  bg: ['backgroundColor'],

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
} as const

export const pseudoStyleProps = new Set([
  'active',
  'disabled',
  'focus',
  'focusVisible',
  'focusWithin',
  'hover',
])

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

// eslint-disable-next-line @typescript-eslint/ban-types -- the (string & {}) type is intentionally fucky to assist with IDE prop completion
export type ThemedStyleProp<K extends keyof ThemedStyleProps> = ThemedStyleProps[K] | (string & {})

export type StylePropShorthands = {
  [K in keyof typeof stylePropShorthands]?: ThemedStyleProp<(typeof stylePropShorthands)[K][0]>
}

export interface StyleProps extends FilteredCSSProps, StylePropShorthands {
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
