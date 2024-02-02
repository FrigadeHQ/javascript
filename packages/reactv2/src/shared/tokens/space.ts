const SPACE_VALUE = 4
const SPACE_UNIT = 'px'

const spaceValue = (key: SpaceKeys[number]) =>
  typeof key === 'number' ? `${SPACE_VALUE * key}${SPACE_UNIT}` : key

const spaceKeys = [
  -20,
  -19,
  -18,
  -17,
  -16,
  -15,
  -14,
  -13,
  -12,
  -11,
  -10,
  -9,
  -8,
  -7,
  -6,
  -5,
  -4,
  -3,
  -2,
  -1,
  -0.5,
  0,
  0.5,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  'auto',
] as const

type SpaceKeys = typeof spaceKeys

type SpaceTokens = {
  [K in SpaceKeys[number]]: string
}
export const space = Object.fromEntries(
  spaceKeys.map((key) => [key, spaceValue(key)])
) as SpaceTokens
