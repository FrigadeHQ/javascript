const base = {
  borderWidth: 'md',
  borderRadius: 'md',
  borderStyle: 'solid',
  display: 'flex',
  gap: '2',
  padding: '1 3',
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
