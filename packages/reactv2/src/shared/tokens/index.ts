const SPACE_VALUE = 4
const SPACE_UNIT = 'px'

const spaceValue = (multiple) => `${SPACE_VALUE * multiple}${SPACE_UNIT}`

const spaceScale = {
  0: '0',
  0.5: spaceValue(0.5),
  1: spaceValue(1),
  2: spaceValue(2),
  3: spaceValue(3),
  4: spaceValue(4),
  5: spaceValue(5),
  6: spaceValue(6),
  7: spaceValue(7),
  8: spaceValue(8),
  9: spaceValue(9),
  10: spaceValue(10),
  11: spaceValue(11),
  12: spaceValue(12),
  13: spaceValue(13),
  14: spaceValue(14),
  15: spaceValue(15),
  16: spaceValue(16),
  17: spaceValue(17),
  18: spaceValue(18),
  19: spaceValue(19),
  20: spaceValue(20),
}

export const palette = {
  black: '#000000',
  gray100: '#14161A',
  gray200: '#181B20',
  gray300: '#1F2329',
  gray400: '#2E343D',
  gray500: '#4C5766',
  gray600: '#5A6472',
  gray700: '#C5CBD3',
  gray800: '#E2E5E9',
  gray900: '#F1F2F4',
  white: '#ffffff',
  blue400: '#015AC6',
  blue500: '#0171F8',
  blue800: '#DBECFF',
  blue900: '#F5F9FF',
  green400: '#009E37',
  green500: '#00D149',
  green800: '#DBFFE8',
  transparent: '#FFFFFF00',

  // This color isn't in the Design System yet, but it's used in old components
  red500: '#c00000',
}

export const tokens = {
  borders: {
    md: '1px solid',
  },
  borderWidths: {
    0: '0',
    md: '1px',
  },

  colors: {
    ...palette,

    neutral: {
      background: palette.white,
      border: palette.gray900,
      foreground: palette.black,
      surface: palette.gray700,

      active: {
        background: palette.white,
        border: palette.gray900,
        foreground: palette.black,
        surface: palette.gray700,
      },
      focus: {
        background: palette.white,
        border: palette.gray900,
        foreground: palette.black,
        surface: palette.gray700,
      },
      hover: {
        background: palette.white,
        border: palette.gray900,
        foreground: palette.black,
        surface: palette.gray700,
      },
    },

    primary: {
      background: palette.blue500,
      border: palette.blue500,
      foreground: palette.white,
      surface: palette.blue500,

      active: {
        background: palette.blue400,
        border: palette.blue400,
        foreground: palette.white,
        surface: palette.blue400,
      },
      focus: {
        background: palette.blue500,
        border: palette.blue500,
        foreground: palette.white,
        surface: palette.blue500,
      },
      hover: {
        background: palette.blue400,
        border: palette.blue400,
        foreground: palette.white,
        surface: palette.blue400,
      },
    },

    secondary: {
      background: palette.gray900,
      border: palette.gray900,
      foreground: palette.black,
      surface: palette.gray900,

      active: {
        background: palette.gray800,
        border: palette.gray800,
        foreground: palette.black,
        surface: palette.gray800,
      },
      focus: {
        background: palette.gray900,
        border: palette.gray900,
        foreground: palette.black,
        surface: palette.gray900,
      },
      hover: {
        background: palette.gray800,
        border: palette.gray800,
        foreground: palette.black,
        surface: palette.gray800,
      },
    },
  },
  fontFamilies: {
    default: 'TT Interphases Pro, sans-serif',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  fontWeights: {
    regular: '400',
    demibold: '600',
    bold: '700',
  },
  letterSpacings: {
    md: '0.02em',
  },
  lineHeights: {
    xs: '18px',
    sm: '22px',
    md: '24px',
    lg: '26px',
    xl: '30px',
    '2xl': '38px',
    '3xl': '46px',
    '4xl': '60px',
  },
  radii: {
    md: '8px',
    lg: '20px',
    round: '50%',
  },
  shadows: {
    md: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  },
  space: spaceScale,
  // components: {
  //   Button: buttonVariants,
  //   Text: textVariants,
  // },
}
