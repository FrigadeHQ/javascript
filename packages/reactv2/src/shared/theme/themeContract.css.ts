import { createThemeContract } from '@vanilla-extract/css'

import { tokens } from '../tokens'

export const themeContract = createThemeContract(tokens)
