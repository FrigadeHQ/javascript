import { Frigade } from '@frigade/js'
import { useContext, useRef } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useUser() {
  const { userId, setUserId: setUserIdValue, apiKey, getConfig } = useContext(FrigadeContext)

  const frigadeRef = useRef(new Frigade(apiKey, getConfig()))
  const frigade = frigadeRef.current

  async function setUserId(userId: string, properties?: Record<string, any>) {
    await frigade.identify(userId, properties)
    setUserIdValue(userId)
  }

  return { userId, setUserId }
}
