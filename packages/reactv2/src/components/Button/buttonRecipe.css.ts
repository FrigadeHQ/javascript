import { recipe, RecipeVariants } from '@vanilla-extract/recipes'

import { sprinkles } from '../../shared/sprinkles.css'

export const buttonRecipe = recipe({
  base: sprinkles({
    borderWidth: 0,
    borderRadius: 'md',
    py: 2,
    px: 4,
  }),

  variants: {
    variant: {
      Primary: sprinkles({
        backgroundColor: {
          default: 'primary.surface',
          hover: 'primary.hover.surface',
        },
        color: 'primary.foreground',
      }),
      Secondary: sprinkles({
        backgroundColor: {
          default: 'secondary.surface',
          hover: 'secondary.hover.surface',
        },
        color: 'secondary.foreground',
      }),
      Link: sprinkles({
        backgroundColor: 'transparent',
        color: {
          default: 'primary.surface',
          hover: 'primary.hover.surface',
        },
      }),
      Plain: sprinkles({
        backgroundColor: 'transparent',
        color: 'neutral.foreground',
      }),
    },
  },

  defaultVariants: {
    variant: 'Primary',
  },
})

export type ButtonVariants = RecipeVariants<typeof buttonRecipe>
