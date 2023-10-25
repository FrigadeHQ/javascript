import { keyframes, style } from '@vanilla-extract/css'

const pulse = keyframes({
  '0%': {
    opacity: 0.5,
    transform: 'scale(0.5)',
  },
  '50%': {
    opacity: 0,
    transform: 'scale(1)',
  },
  '100%': {
    opacity: 0,
    transform: 'scale(1)',
  },
})

// or interpolate as a shorthand:
export const animationPulse = style({
  animation: `2s ease-out infinite ${pulse}`,
})
