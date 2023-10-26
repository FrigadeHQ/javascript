const colorVar = (colorName) => `var(--fr-colors-${colorName})`

// Semantic = Tokens that reference Scalars & contextualize them according to how they're used
export const semanticColors = {
  neutral: {
    background: colorVar('white'),
    border: colorVar('gray900'),
    foreground: colorVar('black'),
    surface: colorVar('gray700'),

    active: {
      background: colorVar('white'),
      border: colorVar('gray900'),
      foreground: colorVar('black'),
      surface: colorVar('gray700'),
    },
    focus: {
      background: colorVar('white'),
      border: colorVar('gray900'),
      foreground: colorVar('black'),
      surface: colorVar('gray700'),
    },
    hover: {
      background: colorVar('white'),
      border: colorVar('gray900'),
      foreground: colorVar('black'),
      surface: colorVar('gray700'),
    },
  },

  primary: {
    background: colorVar('blue500'),
    border: colorVar('blue500'),
    foreground: colorVar('white'),
    surface: colorVar('blue500'),

    active: {
      background: colorVar('blue400'),
      border: colorVar('blue400'),
      foreground: colorVar('white'),
      surface: colorVar('blue400'),
    },
    focus: {
      background: colorVar('blue500'),
      border: colorVar('blue500'),
      foreground: colorVar('white'),
      surface: colorVar('blue500'),
    },
    hover: {
      background: colorVar('blue400'),
      border: colorVar('blue400'),
      foreground: colorVar('white'),
      surface: colorVar('blue400'),
    },
  },

  secondary: {
    background: colorVar('gray900'),
    border: colorVar('gray900'),
    foreground: colorVar('black'),
    surface: colorVar('gray900'),

    active: {
      background: colorVar('gray800'),
      border: colorVar('gray800'),
      foreground: colorVar('black'),
      surface: colorVar('gray800'),
    },
    focus: {
      background: colorVar('gray900'),
      border: colorVar('gray900'),
      foreground: colorVar('black'),
      surface: colorVar('gray900'),
    },
    hover: {
      background: colorVar('gray800'),
      border: colorVar('gray800'),
      foreground: colorVar('black'),
      surface: colorVar('gray800'),
    },
  },
}
