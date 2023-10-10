import { recipe, RecipeVariants } from '@vanilla-extract/recipes'
import { style } from '@vanilla-extract/css'

import { flattenObject } from '../../shared/flattenObject'
import { sprinkles } from '../../shared/sprinkles.css'
import { themeContract } from '../../shared/theme/themeContract.css'

export const theme = themeContract

export const testSprinklesThings = {}

Object.keys(theme).forEach((k) => {
  testSprinklesThings[k] = typeof theme[k] === 'object' ? flattenObject(theme[k]) : theme[k]
})

// TEST: Run a recipe with theme directly before routing it through sprinkles
export const buttonRecipe = recipe({
  variants: {
    variant: {
      // Display1: sprinkles({
      //   fontSize: '5xl',
      //   fontWeight: 'bold',
      //   lineHeight: '4xl',
      // }),
      // Primary: sprinkles({
      //   backgroundColor: {
      //     default: 'blue500',
      //     hover: 'primary.hover.background',
      //   },
      //   color: 'primary.foreground',
      // }),
      Primary: {
        backgroundColor: theme.colors.primary.background,
        color: 'primary.foreground',
      },
      Secondary: {
        backgroundColor: 'white',
        border: '1px solid',
        borderColor: 'gray800',
        color: 'neutral.foreground',

        '&:hover': {
          backgroundColor: 'blue900',
        },
      },
      Link: {
        backgroundColor: 'transparent',
        color: 'primary.inverted',
      },
      Plain: {
        backgroundColor: 'transparent',
        color: 'neutral.foreground',
      },
    },
  },

  defaultVariants: {
    variant: 'Primary',
  },
})

export type ButtonVariants = RecipeVariants<typeof buttonRecipe>
