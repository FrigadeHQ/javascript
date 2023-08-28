import { useContext, useState } from 'react'
import { FrigadeContext } from '../FrigadeProvider'

export function useDebug() {
  const { debug } = useContext(FrigadeContext)
  const [logMessages, setLogMessages] = useState<string[]>([])

  function logIfDebugMode(message) {
    if (!debug) {
      return
    }
    if (logMessages.find((m) => m === message)) {
      return
    }
    setLogMessages([...logMessages, message])
    console.log(message)
  }

  function logErrorIfDebugMode(message) {
    if (!debug) {
      return
    }
    if (logMessages.find((m) => m === message)) {
      return
    }
    setLogMessages([...logMessages, message])
    console.warn(message)
  }

  return {
    logIfDebugMode,
    logErrorIfDebugMode,
  }
}
