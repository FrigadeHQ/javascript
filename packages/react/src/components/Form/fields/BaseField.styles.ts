export const box = {
  backgroundColor: 'neutral.background',
  borderColor: 'neutral.border',
  borderStyle: 'solid',
  borderWidth: 'md',
  borderRadius: 'md',
}

export const input = {
  ...box,
  px: '4',
  py: '2',
  display: 'block',
  outline: 'none',
  width: '100%',
}

export const checkContainer = {
  alignItems: 'center',
  bg: 'primary.surface',
  borderWidth: 'md',
  borderStyle: 'solid',
  borderColor: 'primary.border',
  borderRadius: '100%',
  display: 'flex',
  height: 'calc(100% + 2px)',
  justifyContent: 'center',
  left: '-1px',
  position: <const>'absolute',
  top: '-1px',
  width: 'calc(100% + 2px)',
  color: 'primary.foreground',
}
