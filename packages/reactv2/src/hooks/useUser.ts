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

  /**
   * Tracks an event for the current user
   * @param eventName
   * @param properties
   */
  async function track(eventName: string, properties?: Record<string, unknown>) {
    await frigade.track(eventName, properties)
  }

  return { userId, setProperties, track, isLoading: !Boolean(frigade?.isReady()) }
}
