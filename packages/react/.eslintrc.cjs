/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended', 'prettier'],
  ignorePatterns: ['**/dist/*'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-refresh'],
  root: true,
  rules: {
    'react-refresh/only-export-components': 'warn',
  },
}
