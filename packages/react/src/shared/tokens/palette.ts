const defaultScale = [5, 10, 20, 35, 50, 65, 80, 95, 98]
const coolScale = [...defaultScale]
const warmScale = [...defaultScale]

coolScale[4] = 40
warmScale[4] = 60

const hues = {
  blue: {
    h: 213,
    s: 100,
    l: defaultScale,
  },
  gray: {
    h: 220,
    s: 10,
    l: defaultScale,
  },
  green: {
    h: 141,
    s: 90,
    l: coolScale,
  },
  red: {
    h: 9,
    s: 90,
    l: warmScale,
  },
  yellow: {
    h: 50,
    s: 90,
    l: warmScale,
  },
} as const

export const colorScaleDegrees = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
] as const

export type ColorNames = keyof typeof hues
export type ColorScaleDegrees = (typeof colorScaleDegrees)[number]

export type ScaledColors = {
  [K in ColorNames]: {
    [L in ColorScaleDegrees]: string
  }
}

const scaledColors = {} as ScaledColors

for (const [name, { h, s, l: scale }] of Object.entries(hues)) {
  scaledColors[name] = Object.fromEntries(
    scale.map((l, i) => [`${(i + 1) * 100}`, `hsl(${h} ${s} ${l})`])
  )
}

export const palette = {
  black: 'hsl(0 0 0)',
  white: 'hsl(0 0 100%)',

  ...(scaledColors as ScaledColors),

  // TEMP: Backwards compat for existing colors
  gray100: scaledColors.gray['100'],
  gray200: scaledColors.gray['200'],
  gray300: scaledColors.gray['300'],
  gray400: scaledColors.gray['400'],
  gray500: scaledColors.gray['500'],
  gray600: scaledColors.gray['600'],
  gray700: scaledColors.gray['700'],
  gray800: scaledColors.gray['800'],
  gray900: scaledColors.gray['900'],
  blue400: scaledColors.blue['400'],
  blue500: scaledColors.blue['500'],
  blue800: scaledColors.blue['800'],
  blue900: scaledColors.blue['900'],
  green400: scaledColors.blue['400'],
  green500: scaledColors.green['500'],
  green800: scaledColors.green['800'],
  red500: scaledColors.red['500'],

  // TODO: Remove these, they were only needed when style props didn't have the ability to fall back to CSS values
  transparent: '#FFFFFF00',
  inherit: 'inherit',
}
