import { useContext } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useDebug() {
  const { debug } = useContext(FrigadeContext)

  return {
    debug,
    debugLog: (message: string) => {
      if (debug) {
        console.log(message)
      }
    },
  }
}
