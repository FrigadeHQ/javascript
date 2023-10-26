const SPACE_VALUE = 4
const SPACE_UNIT = 'px'

const spaceValue = (multiple: number) => `${SPACE_VALUE * multiple}${SPACE_UNIT}`

const spaceKeys = [
  -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, -0.5,
  0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
] as const

type SpaceKeys = typeof spaceKeys

type SpaceScale = {
  [K in SpaceKeys[number]]: string
}
const spaceScale = Object.fromEntries(spaceKeys.map((key) => [key, spaceValue(key)])) as SpaceScale

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

// Scalar = Tokens with literal values
export const scalarTokens = {
  borders: {
    md: '1px solid',
  },
  borderWidths: {
    0: '0',
    md: '1px',
  },

  colors: {
    ...palette,
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
}
