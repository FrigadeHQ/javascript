import { recipe, RecipeVariants } from '@vanilla-extract/recipes'

import { sprinkles } from '../../shared/sprinkles.css'

export const textRecipe = recipe({
  variants: {
    variant: {
      Display1: sprinkles({
        fontSize: '5xl',
        fontWeight: 'bold',
        lineHeight: '4xl',
      }),
      Display2: sprinkles({
        fontSize: '4xl',
        fontWeight: 'bold',
        lineHeight: '3xl',
      }),
      H1: sprinkles({
        fontSize: '3xl',
        fontWeight: 'bold',
        lineHeight: '2xl',
      }),
      H2: sprinkles({
        fontSize: '2xl',
        fontWeight: 'bold',
        lineHeight: 'xl',
      }),
      H3: sprinkles({
        fontSize: 'xl',
        fontWeight: 'bold',
        lineHeight: 'lg',
      }),
      H4: sprinkles({
        fontSize: 'lg',
        fontWeight: 'bold',
        lineHeight: 'md',
      }),
      Body1: sprinkles({
        fontSize: 'md',
        fontWeight: 'regular',
        lineHeight: 'md',
      }),
      Body2: sprinkles({
        fontSize: 'sm',
        fontWeight: 'regular',
        lineHeight: 'md',
      }),
      Caption: sprinkles({
        fontSize: 'xs',
        fontWeight: 'regular',
        lineHeight: 'sm',
      }),
    },
  },

  defaultVariants: {
    variant: 'Body1',
  },
})

export type TextVariants = RecipeVariants<typeof textRecipe>
