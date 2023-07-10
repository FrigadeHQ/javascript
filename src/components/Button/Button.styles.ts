import styled from 'styled-components'
import { compose, variant } from 'styled-system'

// import { BaseButton } from './TEMP_index'
import { Box } from '../Box'

/*
  variant: primary, secondary, link, plain
  size: small, large -- medium not used?
  width: full, inline (use width from styled-system?)
*/

export const buttonVariants = {
  Primary: {
    backgroundColor: 'primary.background',
    color: 'primary.foreground',

    '&:hover': {
      backgroundColor: 'blue400',
    },
  },
  Secondary: {
    backgroundColor: 'white',
    border: '1px solid',
    borderColor: 'gray800',
    color: 'neutral.foreground',

    '&:hover': {
      backgroundColor: 'blue900',
    },
  },
  Link: {
    backgroundColor: 'transparent',
    color: 'primary.inverted',
  },
  Plain: {
    backgroundColor: 'transparent',
    color: 'neutral.foreground',
  },
} as const

export const buttonSizes = {
  sm: {
    paddingX: 4,
    paddingY: 1,
  },
  md: {
    paddingX: 6,
    paddingY: 2,
  },
}

// export type ButtonVariant = keyof typeof buttonVariants
// export type ButtonSize = keyof typeof buttonSizes
