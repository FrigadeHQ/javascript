import { theme } from '@/shared/theme'

import { styleProps } from './styleProps'
import { stylePropsToCss } from './stylePropsToCss'

function mockAllStyleProps() {
  return Object.fromEntries(Object.keys(styleProps).map((key) => [key, key]))
}

describe('styleProps', () => {
  it('matches all valid style props', () => {
    const props = mockAllStyleProps()

    const { cssFromProps, unmatchedProps } = stylePropsToCss(props)

    expect(cssFromProps).toEqual(props)
    expect(unmatchedProps).toEqual({})
  })

  it('does not modify non-style props', () => {
    const props = {
      color: 'fuchsia',
      alt: 'alt',
      size: 'size',
      src: 'src',
      className: 'foo',
      dir: 'rtl',
      'data-lore-lal': 'noonien',
    }

    const { unmatchedProps } = stylePropsToCss(props)

    expect(unmatchedProps).toEqual({
      alt: 'alt',
      size: 'size',
      src: 'src',
      className: 'foo',
      dir: 'rtl',
      'data-lore-lal': 'noonien',
    })
  })

  it('does not alter the original props object', () => {
    const props = {
      color: 'fuchsia',
      alt: 'alt',
      size: 'size',
      src: 'src',
    }

    stylePropsToCss(props)

    expect(props).toEqual({
      color: 'fuchsia',
      alt: 'alt',
      size: 'size',
      src: 'src',
    })
  })

  it('replaces design tokens with their values', () => {
    const props = {
      color: 'blue500',
      backgroundColor: 'primary.background',
      padding: 3,
    }

    const { cssFromProps } = stylePropsToCss(props)

    expect(cssFromProps).toEqual({
      color: theme.colors.blue500,
      backgroundColor: theme.colors.primary.background,
      padding: theme.space[3],
    })
  })

  it('replaces space-separated design tokens', () => {
    const props = {
      padding: '7 3em 2 100%',
    }

    const { cssFromProps } = stylePropsToCss(props)

    expect(cssFromProps).toEqual({
      padding: `${theme.space[7]} 3em ${theme.space[2]} 100%`,
    })
  })

  it('passes non-token values through', () => {
    const props = {
      color: 'fuchsia',
    }

    const { cssFromProps } = stylePropsToCss(props)

    expect(cssFromProps).toEqual(props)
  })

  it('converts shorthand props', () => {
    const props = {
      px: 4,
    }

    const { cssFromProps, unmatchedProps } = stylePropsToCss(props)

    expect(cssFromProps).toEqual({
      paddingLeft: theme.space[4],
      paddingRight: theme.space[4],
    })
    expect(unmatchedProps).toEqual({})
  })

  it('supports pseudo-classes', () => {
    const props = {
      color: 'blue500',
      'color:active': 'fuchsia',
      'color:focus': 'chartreuse',
      'color:focusVisible': '#C0FFEE',
      'color:focusWithin': 'neutral.background',
      'color:hover': 'gray100',
    }

    const { cssFromProps, unmatchedProps } = stylePropsToCss(props)

    expect(cssFromProps).toEqual({
      color: theme.colors.blue500,

      '&:active': {
        color: 'fuchsia',
      },
      '&:focus': {
        color: 'chartreuse',
      },
      '&:focus-visible': {
        color: '#C0FFEE',
      },
      '&:focus-within': {
        color: theme.colors.neutral.background,
      },
      '&:hover': {
        color: theme.colors.gray100,
      },
    })
    expect(unmatchedProps).toEqual({})
  })

  it('preserves width & height attrs on replaced elements', () => {
    const props = {
      height: '1vh',
      width: '100%',
    }

    const { cssFromProps, unmatchedProps } = stylePropsToCss(props, 'img')

    expect(cssFromProps).toEqual(props)
    expect(unmatchedProps).toEqual(props)
  })

  it('skips and removes prefix from underscored style props', () => {
    const props = {
      _color: 'blue500',
    }

    const { cssFromProps, unmatchedProps } = stylePropsToCss(props)

    expect(cssFromProps).toEqual({})
    expect(unmatchedProps).toEqual({
      color: 'blue500',
    })
  })
})
