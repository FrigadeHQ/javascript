export const floatingTransitionCSS = {
  '&[data-status="open"]': {
    opacity: 1,
    zIndex: 1,
  },
  '&[data-status="close"]': {
    opacity: 0,
    zIndex: 0,

    '& [data-status="close"]': {
      display: 'none',
    },
  },
  '&[data-status="initial"]': {
    opacity: 0.8,
  },
  '&[data-status="open"], &[data-status="close"]': {
    transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
  },
  '&[data-status="initial"] .fr-popover-transition-container': {
    transform: 'scale(0.8)',
  },
  '&[data-status="close"] .fr-popover-transition-container': {
    transform: 'scale(0.3)',
  },
  '&[data-status="open"] .fr-popover-transition-container': {
    transform: 'scale(1)',
  },
  '& .fr-popover-transition-container': {
    transformOrigin: 'left',
    transition: 'transform 0.2s ease-out',
  },
}
