import { useContext } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useGroup() {
  const { groupId, frigade } = useContext(FrigadeContext)

  /**
   * Sets properties for the current group
   * @param properties
   */
  async function setProperties(properties?: Record<string, unknown>) {
    if (!groupId) {
      console.error('No Group ID is set. Cannot set properties without a Group ID.')
      return
    }
    await frigade.group(groupId, properties)
  }

  /**
   * Tracks an event for the current group
   * @param eventName
   * @param properties
   */
  async function track(eventName: string, properties?: Record<string, unknown>) {
    await frigade.track(eventName, properties)
  }

  return { groupId, setProperties, track }
}
