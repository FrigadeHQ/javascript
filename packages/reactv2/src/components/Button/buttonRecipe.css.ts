import { recipe, RecipeVariants } from '@vanilla-extract/recipes'

import { theme } from '../../shared/theme/themeContract.css'

const { colors, radii, space } = theme

export const buttonRecipe = recipe({
  base: {
    border: 0,
    borderRadius: radii.md,
    paddingTop: space[2],
    paddingRight: space[4],
    paddingBottom: space[2],
    paddingLeft: space[4],
  },
  variants: {
    variant: {
      Primary: {
        backgroundColor: colors.primary.surface,
        color: colors.primary.foreground,

        '&:hover': {
          backgroundColor: colors.primary.hover.surface,
        },
      },
      Secondary: {
        backgroundColor: colors.secondary.surface,
        color: colors.secondary.foreground,

        '&:hover': {
          backgroundColor: colors.secondary.hover.surface,
        },
      },
      Link: {
        backgroundColor: colors.transparent,
        color: colors.primary.surface,

        '&:hover': {
          color: colors.primary.hover.surface,
        },
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
