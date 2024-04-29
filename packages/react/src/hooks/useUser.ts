import { useContext } from 'react'

import { FrigadeContext } from '@/components/Provider'

export function useUser() {
  const { userId, frigade } = useContext(FrigadeContext)

  /**
   * Adds properties for the current user
   * @param properties
   */
  async function addProperties(properties: Record<string, unknown>) {
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

  return { userId, addProperties, track }
}
