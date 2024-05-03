import { keyframes } from '@emotion/react'

const base = {
  borderWidth: 'md',
  borderRadius: 'md',
  borderStyle: 'solid',
  display: 'flex',
  gap: '2',
  padding: '2 4',
  fontFamily: 'inherit',
}

export const Primary = {
  ...base,
  backgroundColor: 'primary.surface',
  borderColor: 'primary.border',
  color: 'primary.foreground',

  'backgroundColor:hover': 'primary.hover.surface',

  'backgroundColor:disabled': 'primary.surface',
  'opacity:disabled': '0.7',
}

export const Secondary = {
  ...base,

  backgroundColor: 'secondary.background',
  borderColor: 'secondary.border',
  color: 'secondary.foreground',

  'backgroundColor:hover': 'secondary.hover.background',

  'backgroundColor:disabled': 'secondary.background',
  'opacity:disabled': '0.7',
}

export const Link = {
  ...base,

  backgroundColor: 'transparent',
  borderColor: 'transparent',
  color: 'primary.surface',

  'color:hover': 'primary.hover.surface',
}

export const Plain = {
  ...base,

  backgroundColor: 'transparent',
  borderColor: 'transparent',
  color: 'neutral.foreground',
}

const rotate = keyframes({
  from: {
    transform: 'rotate(0turn)',
  },
  to: {
    transform: 'rotate(1turn)',
  },
})

export const loadingCSSStyle = {
  position: 'relative',
  color: 'transparent',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '16px',
    height: '16px',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
    border: '4px solid transparent',
    borderTopColor: 'var(--fr-colors-primary-foreground)',
    borderRadius: '50%',
    animation: rotate + ' 1s ease infinite',
  },
}
