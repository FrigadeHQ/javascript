import { theme } from './theme/themeContract.css'

/*
  Given a theme contract that tells us which CSS variable to use:
  themeContract = {
    colors: {
      blue500: 'var(--fr-blue-500)'
    }
  }
  
  And a theme override prop that tells us which value to assign to that CSS variable:
  theme = {
    colors: {
      blue500: 'teal'
    }
  }

  Assign the override to the css variable like so:
  {
    'var(--fr-blue-500)': 'teal'
  }
*/
export function mapThemePropToThemeVars(themeLevel, contractLevel = theme) {
  return Object.keys(themeLevel).reduce((acc, key) => {
    const currentValue = themeLevel[key]

    if (
      typeof currentValue === 'object' &&
      currentValue !== null &&
      !Array.isArray(currentValue) &&
      key in themeLevel
    ) {
      Object.assign(acc, mapThemePropToThemeVars(currentValue, contractLevel[key]))
    } else {
      acc[contractLevel[key]] = themeLevel[key]
    }
    return acc
  }, {})
}
