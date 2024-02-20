import { borders } from './borders'
import { palette } from './palette'
import { radii } from './radii'
import { semantic } from './semantic'
import { shadows } from './shadows'
import { space } from './space'
import { typography } from './typography'

// Package up everything everywhere all at once for convenience
export const tokens = {
  ...borders,

  colors: {
    ...palette,
    ...semantic,
  },

  ...typography,

  radii,
  shadows,
  space,
}

export type Tokens = typeof tokens
