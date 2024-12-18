import { useContext } from 'react'

import { FrigadeContext } from '@/components/Provider'
import { logOnce } from '../shared/log'

export function useUser() {
  const context = useContext(FrigadeContext)
  if (!context || !context.frigade) {
    logOnce('useUser() must be used in a child of the Frigade Provider', 'warn')
  }
  const { frigade } = context ?? {}
  const userId = frigade?.config.userId

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

  return { userId, addProperties, track, isLoading: !frigade?.isReady() }
}
