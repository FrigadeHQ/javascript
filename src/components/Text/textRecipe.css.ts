import { recipe, RecipeVariants } from '@vanilla-extract/recipes'

import { theme } from '../../shared/theme.css'

const textVariantStyles = {
  Display1: {
    fontSize: '48px',
    fontWeight: 'bold',
    letterSpacing: 'calc(48px * .02)',
    lineHeight: '60px',
  },
  Display2: {
    fontSize: '36px',
    fontWeight: 'bold',
    letterSpacing: 'calc(36px * .02)',
    lineHeight: '46px',
  },
  H1: {
    fontSize: '30px',
    fontWeight: 'bold',
    letterSpacing: 'calc(30px * .02)',
    lineHeight: '38px',
  },
  H2: {
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: 'calc(24px * .02)',
    lineHeight: '30px',
  },
  H3: {
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: 'calc(20px * .02)',
    lineHeight: '26px',
  },
  H4: {
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: 'calc(18px * .02)',
    lineHeight: '24px',
  },
  Body1: {
    fontSize: '16px',
    fontWeight: 'regular',
    letterSpacing: 'calc(16px * .02)',
    lineHeight: '24px',
  },
  Body2: {
    fontSize: '14px',
    fontWeight: 'regular',
    letterSpacing: 'calc(14px * .02)',
    lineHeight: '22px',
  },
  Caption: {
    fontSize: '12px',
    fontWeight: 'regular',
    letterSpacing: 'calc(12px * .02)',
    lineHeight: '18px',
  },
}

const textWeightStyles = {
  regular: {
    fontWeight: 400,
  },
  semibold: {
    fontWeight: 600,
  },
  bold: {
    fontWeight: 700,
  },
}

export const textRecipe = recipe({
  base: {
    color: theme.color.black,
    fontSize: '16px',
  },

  variants: {
    variant: theme.components.Text,
    weight: textWeightStyles,
  },

  defaultVariants: {
    variant: 'Body1',
  },
})

export type TextRecipeVariants = RecipeVariants<typeof textRecipe>

// Used internally for constructing variant components and Stories
export const textVariantNames = Object.keys(textVariantStyles) as TextRecipeVariants['variant'][]
export const textWeightNames = Object.keys(textWeightStyles) as TextRecipeVariants['weight'][]
