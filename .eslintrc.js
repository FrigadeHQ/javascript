module.exports = {
  'parser': '@typescript-eslint/parser',
  'extends': [
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-native/all',
  ],
  'plugins': [
    'prettier',
    'react'
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    }
  },
  'rules': {
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
    'react-hooks/exhaustive-deps':          'warn',
    'react-hooks/rules-of-hooks':           'error',
    'react/jsx-filename-extension':         [1, { 'extensions': ['.ts', '.tsx'] }],
    'react/jsx-indent-props':               [2, 4],
    'react/jsx-indent':                     [2, 4],
    'react/jsx-one-expression-per-line':    [0],
    'react/prefer-stateless-function':      [1],
    'react/static-property-placement':      [1, 'property assignment'],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
  }
};
