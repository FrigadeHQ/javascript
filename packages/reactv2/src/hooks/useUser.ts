import { useContext } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useUser() {
  const { userId, frigade } = useContext(FrigadeContext)

  /**
   * Sets properties for the current user
   * @param properties
   */
  async function setProperties(properties?: Record<string, unknown>) {
    await frigade.identify(userId, properties)
  }

  return { userId, setProperties, isLoading: frigade.isReady() }
}
