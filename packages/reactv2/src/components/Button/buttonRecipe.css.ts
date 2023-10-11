import { recipe, RecipeVariants } from '@vanilla-extract/recipes'

import { theme } from '../../shared/theme/themeContract.css'

const { colors, radii } = theme

export const buttonRecipe = recipe({
  base: {
    border: 0,
  },
  variants: {
    variant: {
      // Primary: sprinkles({
      //   backgroundColor: {
      //     default: 'blue500',
      //     hover: 'primary.hover.background',
      //   },
      //   color: 'primary.foreground',
      // }),
      Primary: {
        backgroundColor: colors.primary.background,
        borderRadius: radii.md,
        color: colors.primary.foreground,

        '&:hover': {
          backgroundColor: colors.primary.hover.background,
        },
      },
      Secondary: {
        backgroundColor: colors.secondary.background,
        color: colors.secondary.foreground,

        '&:hover': {
          backgroundColor: colors.secondary.hover.background,
        },
      },
      Link: {
        backgroundColor: colors.transparent,
        color: colors.primary.background,
      },
      Plain: {
        backgroundColor: colors.transparent,
        color: colors.neutral.foreground,
      },
    },
  },

  defaultVariants: {
    variant: 'Primary',
  },
})

export type ButtonVariants = RecipeVariants<typeof buttonRecipe>
