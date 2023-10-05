import { layer } from '@vanilla-extract/css'
import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles'

import { palette, tokens } from './tokens'

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

const properties = defineProperties({
  '@layer': frigadeCSSLayer,
  properties: {
    color: palette,
    backgroundColor: palette,

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
