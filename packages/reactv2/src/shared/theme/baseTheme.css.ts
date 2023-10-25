import { createGlobalTheme } from '@vanilla-extract/css'

import { theme } from './themeContract.css'
import { tokens } from '../tokens'

createGlobalTheme(':root', theme, tokens)
