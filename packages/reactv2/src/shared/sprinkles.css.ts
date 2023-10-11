import { layer } from '@vanilla-extract/css'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { flattenObject } from './flattenObject'
import { tokens } from './tokens'
import { theme } from './theme/themeContract.css'

export const frigadeCSSLayer = layer()

// height / width
// display -- make flex / grid components
// gap columnGap rowGap
// color
// background
// margin / padding
// p pt pr pb pl px py
// m mt mr mb mr mx my
// position
// top left bottom right
// border
// borderRadius
// r

const colorTokens: Record<string, unknown> = flattenObject(theme.colors)

const colorProperties = defineProperties({
  conditions: {
    default: {},
    active: { selector: '&:active' },
    hover: { selector: '&:hover' },
    focus: { selector: '&:focus' },
  },
  defaultCondition: ['default', 'active', 'hover', 'focus'],

  properties: {
    color: colorTokens,
    backgroundColor: colorTokens,
    borderColor: colorTokens,
  },

  shorthands: {
    bgColor: ['backgroundColor'],
  },
})

const properties = defineProperties({
  // '@layer': frigadeCSSLayer,

  properties: {
    border: theme.borders,
    borderRadius: theme.radii,
    borderWidth: theme.borderWidths,

    fontFamily: theme.fontFamilies,
    fontSize: theme.fontSizes,
    fontWeight: theme.fontWeights,
    lineHeight: theme.lineHeights,

    margin: theme.space,
    marginTop: theme.space,
    marginRight: theme.space,
    marginBottom: theme.space,
    marginLeft: theme.space,

    padding: theme.space,
    paddingTop: theme.space,
    paddingRight: theme.space,
    paddingBottom: theme.space,
    paddingLeft: theme.space,
  },

  shorthands: {
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
  },
})

export const sprinkles = createSprinkles(colorProperties, properties)

export type Sprinkles = Parameters<typeof sprinkles>[0]
