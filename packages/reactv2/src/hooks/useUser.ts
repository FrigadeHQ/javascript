import { useContext } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useUser() {
  const { userId, frigade } = useContext(FrigadeContext)

  async function setProperties(properties?: Record<string, any>) {
    await frigade.identify(userId, properties)
  }

  return { userId, setProperties }
}
