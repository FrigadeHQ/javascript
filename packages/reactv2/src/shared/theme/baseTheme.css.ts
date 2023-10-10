import { createTheme } from '@vanilla-extract/css'

import { themeContract } from './themeContract.css'
import { tokens } from '../tokens'

export const baseTheme = createTheme(themeContract, tokens)
