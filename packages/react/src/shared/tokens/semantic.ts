import type { ColorScaleDegrees } from './palette'

export interface SemanticColorUsage {
  background: string
  border: string
  foreground: string
  surface: string
}

export type SemanticColorScale = {
  [Degree in ColorScaleDegrees]: string
}

export type SemanticColorIntent = 'negative' | 'neutral' | 'positive' | 'primary' | 'secondary'

export type SemanticColorState = 'active' | 'focus' | 'hover'

export type SemanticColor = SemanticColorScale &
  SemanticColorUsage & {
    [State in SemanticColorState]: {
      [Usage in keyof SemanticColorUsage]: string
    }
  }

export type SemanticColors = {
  [Intent in SemanticColorIntent]: SemanticColor
}

const colorVar = (colorName: string) => `var(--fr-colors-${colorName})`

export const semantic: SemanticColors = {
  negative: {
    '100': colorVar('red-100'),
    '200': colorVar('red-200'),
    '300': colorVar('red-300'),
    '400': colorVar('red-400'),
    '500': colorVar('red-500'),
    '600': colorVar('red-600'),
    '700': colorVar('red-700'),
    '800': colorVar('red-800'),
    '900': colorVar('red-900'),

    background: colorVar('negative-500'),
    border: colorVar('negative-500'),
    foreground: colorVar('white'),
    surface: colorVar('negative-500'),

    active: {
      background: colorVar('negative-400'),
      border: colorVar('negative-400'),
      foreground: colorVar('white'),
      surface: colorVar('negative-400'),
    },
    focus: {
      background: colorVar('negative-500'),
      border: colorVar('negative-500'),
      foreground: colorVar('white'),
      surface: colorVar('negative-500'),
    },
    hover: {
      background: colorVar('negative-400'),
      border: colorVar('negative-400'),
      foreground: colorVar('white'),
      surface: colorVar('negative-400'),
    },
  },

  neutral: {
    '100': colorVar('gray-100'),
    '200': colorVar('gray-200'),
    '300': colorVar('gray-300'),
    '400': colorVar('gray-400'),
    '500': colorVar('gray-500'),
    '600': colorVar('gray-600'),
    '700': colorVar('gray-700'),
    '800': colorVar('gray-800'),
    '900': colorVar('gray-900'),

    background: colorVar('white'),
    border: colorVar('neutral-800'),
    foreground: colorVar('black'),
    surface: colorVar('neutral-700'),

    active: {
      background: colorVar('white'),
      border: colorVar('neutral-900'),
      foreground: colorVar('black'),
      surface: colorVar('neutral-700'),
    },
    focus: {
      background: colorVar('white'),
      border: colorVar('neutral-900'),
      foreground: colorVar('black'),
      surface: colorVar('neutral-700'),
    },
    hover: {
      background: colorVar('neutral-900'),
      border: colorVar('neutral-800'),
      foreground: colorVar('black'),
      surface: colorVar('neutral-700'),
    },
  },

  positive: {
    '100': colorVar('green-100'),
    '200': colorVar('green-200'),
    '300': colorVar('green-300'),
    '400': colorVar('green-400'),
    '500': colorVar('green-500'),
    '600': colorVar('green-600'),
    '700': colorVar('green-700'),
    '800': colorVar('green-800'),
    '900': colorVar('green-900'),

    background: colorVar('positive-500'),
    border: colorVar('positive-500'),
    foreground: colorVar('white'),
    surface: colorVar('positive-500'),

    active: {
      background: colorVar('positive-400'),
      border: colorVar('positive-400'),
      foreground: colorVar('white'),
      surface: colorVar('positive-400'),
    },
    focus: {
      background: colorVar('positive-500'),
      border: colorVar('positive-500'),
      foreground: colorVar('white'),
      surface: colorVar('positive-500'),
    },
    hover: {
      background: colorVar('positive-400'),
      border: colorVar('positive-400'),
      foreground: colorVar('white'),
      surface: colorVar('positive-400'),
    },
  },

  primary: {
    '100': colorVar('blue-100'),
    '200': colorVar('blue-200'),
    '300': colorVar('blue-300'),
    '400': colorVar('blue-400'),
    '500': colorVar('blue-500'),
    '600': colorVar('blue-600'),
    '700': colorVar('blue-700'),
    '800': colorVar('blue-800'),
    '900': colorVar('blue-900'),

    background: colorVar('primary-500'),
    border: colorVar('primary-500'),
    foreground: colorVar('white'),
    surface: colorVar('primary-500'),

    active: {
      background: colorVar('primary-400'),
      border: colorVar('primary-400'),
      foreground: colorVar('white'),
      surface: colorVar('primary-400'),
    },
    focus: {
      background: colorVar('primary-500'),
      border: colorVar('primary-500'),
      foreground: colorVar('white'),
      surface: colorVar('primary-500'),
    },
    hover: {
      background: colorVar('primary-400'),
      border: colorVar('primary-400'),
      foreground: colorVar('white'),
      surface: colorVar('primary-400'),
    },
  },

  secondary: {
    '100': colorVar('gray-100'),
    '200': colorVar('gray-200'),
    '300': colorVar('gray-300'),
    '400': colorVar('gray-400'),
    '500': colorVar('gray-500'),
    '600': colorVar('gray-600'),
    '700': colorVar('gray-700'),
    '800': colorVar('gray-800'),
    '900': colorVar('gray-900'),

    background: colorVar('white'),
    border: colorVar('secondary-800'),
    foreground: colorVar('black'),
    surface: colorVar('secondary-900'),

    active: {
      background: colorVar('secondary-900'),
      border: colorVar('secondary-800'),
      foreground: colorVar('black'),
      surface: colorVar('secondary-800'),
    },
    focus: {
      background: colorVar('secondary-900'),
      border: colorVar('secondary-800'),
      foreground: colorVar('black'),
      surface: colorVar('secondary-900'),
    },
    hover: {
      background: colorVar('secondary-900'),
      border: colorVar('secondary-800'),
      foreground: colorVar('black'),
      surface: colorVar('secondary-800'),
    },
  },
}
