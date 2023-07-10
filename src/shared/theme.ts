import { buttonVariants } from '../components/Button/Button.styles'
import { textVariants } from '../components/Text/styled'

const SPACE_VALUE = 4
const SPACE_UNIT = 'px'
const SPACE_SCALE_EXTENT = 20

// Fill an array with SPACE_SCALE_EXTENT multiples of BASE_SPACE_VALUE
const spaceScale = Object.fromEntries(
  Array.from(Array(SPACE_SCALE_EXTENT + 1), (_, i) => {
    // Just a cute lil' 0.5 space would you look at this tiny guy over here
    if (i === 0) {
      return [0.5, `${0.5 * SPACE_VALUE}${SPACE_UNIT}`]
    }

    return [i, `${i * SPACE_VALUE}${SPACE_UNIT}`]
  })
)

const palette = {
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
}

export const tokens = {
  colors: {
    ...palette,

    neutral: {
      foreground: palette.gray300,
    },
    primary: {
      background: palette.blue500,
      foreground: palette.white,
      inverted: palette.blue500,
    },
  },
  fontWeights: {
    regular: 400,
    semibold: 600,
    bold: 700,
  },
  radii: {
    md: '8px',
  },
  space: spaceScale,
  components: {
    Button: buttonVariants,
    Text: textVariants,
  },
}
