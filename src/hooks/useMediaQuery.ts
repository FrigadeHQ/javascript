import { useEffect, useState } from 'react'

export const useMediaQuery = () => {
  const queries = {
    isSmall: '(max-width: 480px)',
    isMedium: '(min-width: 481px) AND (max-width: 1023px)',
    isLarge: '(min-width: 1025px)',
  }

  const defaultMatches = Object.fromEntries(Object.entries(queries).map(([key]) => [key, false]))

  const [matches, setMatches] = useState(defaultMatches)

  let updateTimeout = null
  const throttledUpdate = () => {
    if (updateTimeout !== null) {
      clearTimeout(updateTimeout)
    } else {
      updateMatches()
    }

    updateTimeout = setTimeout(() => {
      updateMatches()
    }, 16)
  }

  const updateMatches = () => {
    const freshMatches = Object.fromEntries(
      Object.entries(queries).map(([key, query]) => {
        if (!window) {
          return [key, false]
        }

        const mediaQuery = window.matchMedia(query)

        mediaQuery.addEventListener('change', throttledUpdate)

        return [key, mediaQuery.matches]
      })
    )

    setMatches(freshMatches)
  }

  useEffect(() => {
    updateMatches()
  }, [])

  return matches
}
