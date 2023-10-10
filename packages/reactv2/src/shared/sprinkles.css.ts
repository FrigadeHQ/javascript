import { layer } from '@vanilla-extract/css'
import { ConditionalValue, createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { tokens } from './tokens'
import { flattenObject } from './flattenObject'

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

const colorTokens: Record<string, unknown> = flattenObject(tokens.colors)

// TODO: Flatten theme.colors to make theme['colors.primary.background']: var(--onuthoneuthaoehd)
// Then point properties.color to that flattened map
// So then sprinkles values will point to live vars? MAYYYYBE?

const properties = defineProperties({
  // '@layer': frigadeCSSLayer,

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

    margin: tokens.space,
    marginTop: tokens.space,
    marginRight: tokens.space,
    marginBottom: tokens.space,
    marginLeft: tokens.space,

    padding: tokens.space,
    paddingTop: tokens.space,
    paddingRight: tokens.space,
    paddingBottom: tokens.space,
    paddingLeft: tokens.space,

    fontFamily: tokens.fontFamilies,
    fontSize: tokens.fontSizes,
    fontWeight: tokens.fontWeights,
    lineHeight: tokens.lineHeights,
  },

  shorthands: {
    bgColor: ['backgroundColor'],

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

export const sprinkles = createSprinkles(properties)

export type Sprinkles = Parameters<typeof sprinkles>[0]
