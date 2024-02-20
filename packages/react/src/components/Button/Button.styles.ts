const base = {
  borderWidth: '0',
  borderRadius: 'md',
  display: 'flex',
  gap: '2',
  padding: '2 4',
}

export const Primary = {
  ...base,
  backgroundColor: 'primary.surface',
  color: 'primary.foreground',

  'backgroundColor:hover': 'primary.hover.surface',
}

export const Secondary = {
  ...base,

  backgroundColor: 'secondary.background',
  borderColor: 'secondary.border',
  borderStyle: 'solid',
  borderWidth: '1px',
  color: 'secondary.foreground',

  'backgroundColor:hover': 'secondary.hover.background',
}

export const Link = {
  ...base,

  backgroundColor: 'transparent',
  color: 'primary.surface',

  'color:hover': 'primary.hover.surface',
}

export const Plain = {
  ...base,

  backgroundColor: 'transparent',
  color: 'neutral.foreground',
}
