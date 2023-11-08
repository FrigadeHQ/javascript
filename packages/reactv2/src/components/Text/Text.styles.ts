export const base = ({ fontFamilies }) => ({
  fontFamily: fontFamilies.default,
  margin: 0,
})

export const Display1 = ({ fontSizes, fontWeights, lineHeights }) => [
  base,
  {
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['4xl'],
  },
]

export const Display2 = ({ fontSizes, fontWeights, lineHeights }) => [
  base,
  {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['3xl'],
  },
]

export const H1 = ({ fontSizes, fontWeights, lineHeights }) => [
  base,
  {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['2xl'],
  },
]

export const H2 = ({ fontSizes, fontWeights, lineHeights }) => [
  base,
  {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.xl,
  },
]

export const H3 = ({ fontSizes, fontWeights, lineHeights }) => [
  base,
  {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.lg,
  },
]

export const H4 = ({ fontSizes, fontWeights, lineHeights }) => [
  base,
  {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.md,
  },
]

export const Body1 = ({ fontSizes, fontWeights, lineHeights }) => [
  base,
  {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.md,
  },
]

export const Body2 = ({ fontSizes, fontWeights, lineHeights }) => [
  base,
  {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.md,
  },
]

export const Caption = ({ fontSizes, fontWeights, lineHeights }) => [
  base,
  {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.sm,
  },
]
