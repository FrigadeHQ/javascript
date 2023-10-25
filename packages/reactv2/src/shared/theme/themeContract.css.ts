import { createGlobalThemeContract } from '@vanilla-extract/css'

import { tokens } from '../tokens'

export const theme = createGlobalThemeContract(
  tokens,
  (_, path) => `fr-${path.map((p) => p.replaceAll('.', '-')).join('-')}`
)
