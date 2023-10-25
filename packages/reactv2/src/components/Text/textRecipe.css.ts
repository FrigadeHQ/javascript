import { recipe, RecipeVariants } from '@vanilla-extract/recipes'

import { theme } from '../../shared/theme/themeContract.css'

const { fontFamilies, fontSizes, fontWeights, lineHeights } = theme

export const textRecipe = recipe({
  base: {
    fontFamily: fontFamilies.default,
    margin: 0,
  },
  variants: {
    variant: {
      Display1: {
        fontSize: fontSizes['5xl'],
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights['4xl'],
      },
      Display2: {
        fontSize: fontSizes['4xl'],
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights['3xl'],
      },
      H1: {
        fontSize: fontSizes['3xl'],
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights['2xl'],
      },
      H2: {
        fontSize: fontSizes['2xl'],
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.xl,
      },
      H3: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.lg,
      },
      H4: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.md,
      },
      Body1: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.regular,
        lineHeight: lineHeights.md,
      },
      Body2: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.regular,
        lineHeight: lineHeights.md,
      },
      Caption: {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.regular,
        lineHeight: lineHeights.sm,
      },
    },
  },

  defaultVariants: {
    variant: 'Body1',
  },
})

export type TextVariants = RecipeVariants<typeof textRecipe>
