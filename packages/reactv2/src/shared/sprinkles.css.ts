import { layer } from '@vanilla-extract/css'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { flattenObject } from './flattenObject'
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
    alignContent: [
      'center',
      'start',
      'end',
      'flex-start',
      'flex-end',
      'normal',
      'baseline',
      'first baseline',
      'last baseline',
      'space-between',
      'space-around',
      'space-evenly',
      'stretch',
      'safe center',
      'unsafe center',
      'inherit',
      'initial',
      'revert',
      'revert-layer',
      'unset',
    ],

    alignItems: [
      'normal',
      'stretch',
      'center',
      'start',
      'end',
      'flex-start',
      'flex-end',
      'self-start',
      'self-end',
      'baseline',
      'first baseline',
      'last baseline',
      'safe center',
      'unsafe center',
      'inherit',
      'initial',
      'revert',
      'revert-layer',
      'unset',
    ],

    alignSelf: [
      'auto',
      'normal',
      'center',
      'start',
      'end',
      'self-start',
      'self-end',
      'flex-start',
      'flex-end',
      'baseline',
      'first baseline',
      'last baseline',
      'stretch',
      'safe center',
      'unsafe center',
      'inherit',
      'initial',
      'revert',
      'revert-layer',
      'unset',
    ],

    flexDirection: [
      'row',
      'row-reverse',
      'column',
      'column-reverse',
      'inherit',
      'initial',
      'revert',
      'revert-layer',
      'unset',
    ],

    flexWrap: [
      'nowrap',
      'wrap',
      'wrap-reverse',
      'inherit',
      'initial',
      'revert',
      'revert-layer',
      'unset',
    ],

    justifyContent: [
      'center',
      'start',
      'end',
      'flex-start',
      'flex-end',
      'left',
      'right',
      'normal',
      'space-between',
      'space-around',
      'space-evenly',
      'stretch',
      'safe center',
      'unsafe center',
      'inherit',
      'initial',
      'revert',
      'revert-layer',
      'unset',
    ],

    justifyItems: [
      'normal',
      'stretch',
      'center',
      'start',
      'end',
      'flex-start',
      'flex-end',
      'self-start',
      'self-end',
      'left',
      'right',
      'baseline',
      'first baseline',
      'last baseline',
      'safe center',
      'unsafe center',
      'legacy right',
      'legacy left',
      'legacy center',
      'inherit',
      'initial',
      'revert',
      'revert-layer',
      'unset',
    ],

    border: theme.borders,
    borderRadius: theme.radii,
    borderWidth: theme.borderWidths,

    boxSizing: [
      'border-box',
      'content-box',
      'inherit',
      'initial',
      'revert',
      'revert-layer',
      'unset',
    ],

    display: [
      'block',
      'block flex',
      'block flow',
      'block flow-root',
      'block grid',
      'contents',
      'flex',
      'flow-root',
      'grid',
      'inherit',
      'initial',
      'inline',
      'inline flex',
      'inline flow',
      'inline flow-root',
      'inline grid',
      'inline-block',
      'inline-flex',
      'inline-grid',
      'list-item',
      'none',
      'revert',
      'revert-layer',
      'table',
      'table-row-group',
      'table-header-group',
      'table-footer-group',
      'table-row',
      'table-cell',
      'table-column-group',
      'table-column',
      'table-caption',
      'unset',
    ],

    fontFamily: theme.fontFamilies,
    fontSize: theme.fontSizes,
    fontWeight: theme.fontWeights,

    gap: theme.space,

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
