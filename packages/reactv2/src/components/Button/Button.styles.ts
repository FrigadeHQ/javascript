export const base = ({ radii, space }) => ({
  borderWidth: 0,
  borderRadius: radii.md,
  padding: `${space[2]} ${space[4]}`,
})

export const Primary = ({ colors }) => [
  base,
  {
    backgroundColor: colors.primary.surface,
    color: colors.primary.foreground,

    '&:hover': {
      backgroundColor: colors.primary.hover.surface,
    },
  },
]

export const Secondary = ({ colors }) => [
  base,
  {
    backgroundColor: colors.secondary.surface,
    color: colors.secondary.foreground,

    '&:hover': {
      backgroundColor: colors.secondary.hover.surface,
    },
  },
]

export const Link = ({ colors }) => [
  base,
  {
    backgroundColor: colors.transparent,
    color: colors.primary.surface,

    '&:hover': {
      color: colors.primary.hover.surface,
    },
  },
]

export const Plain = ({ colors }) => [
  base,
  {
    backgroundColor: colors.transparent,
    color: colors.neutral.foreground,
  },
]
