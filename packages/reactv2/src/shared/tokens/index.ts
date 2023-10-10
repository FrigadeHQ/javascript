const SPACE_VALUE = 4
const SPACE_UNIT = 'px'
const SPACE_SCALE_EXTENT = 20

// Fill an array with SPACE_SCALE_EXTENT multiples of SPACE_VALUE
const spaceScale = Object.fromEntries(
  Array.from(Array(SPACE_SCALE_EXTENT + 1), (_, i) => {
    // Just a cute lil' 0.5 space would you look at this tiny guy over here
    if (i === 0) {
      return [0.5, `${0.5 * SPACE_VALUE}${SPACE_UNIT}`]
    }

    return [i, `${i * SPACE_VALUE}${SPACE_UNIT}`]
  })
)

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
      border: palette.blue400,
      foreground: palette.white,
      surface: palette.blue500,

      active: {
        background: palette.blue500,
        border: palette.blue400,
        foreground: palette.white,
        surface: palette.blue500,
      },
      focus: {
        background: palette.blue500,
        border: palette.blue400,
        foreground: palette.white,
        surface: palette.blue500,
      },
      hover: {
        background: palette.blue800,
        border: palette.blue400,
        foreground: palette.white,
        surface: palette.blue500,
      },
    },
    // primary: {
    //   background: palette.blue500,
    //   foreground: palette.white,
    //   inverted: palette.blue500,
    // },
    // negative: {
    //   foreground: palette.red500,
    // },
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
    md: '0px 4px 20px rgba(0, 0, 0, 0.06)',
  },
  space: spaceScale,
  // components: {
  //   Button: buttonVariants,
  //   Text: textVariants,
  // },
}
