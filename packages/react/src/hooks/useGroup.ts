import { useContext } from 'react'

import { FrigadeContext } from '@/components/Provider'
import { logOnce } from '../shared/log'

export function useGroup() {
  const context = useContext(FrigadeContext)
  if (!context || !context.frigade) {
    logOnce('useGroup() must be used in a child of the Frigade Provider', 'warn')
  }
  const { frigade } = context ?? {}
  const groupId = frigade?.getConfig()?.groupId

  /**
   * Sets properties for the current group
   * @param properties
   */
  async function addProperties(properties: Record<string, unknown>) {
    if (!frigade.config.groupId) {
      console.error('No Group ID is set. Cannot set properties without a Group ID.')
      return
    }
    await frigade.group(frigade.config.groupId, properties)
  }

  /**
   * Tracks an event for the current group
   * @param eventName
   * @param properties
   */
  async function track(eventName: string, properties?: Record<string, unknown>) {
    await frigade.track(eventName, properties)
  }

  /**
   * Sets the current group. Note that this can cause issues if separately setting the group in the FrigadeProvider.
   * @param groupId
   * @param properties Optional properties to set for the group
   */
  async function setGroupId(groupId: string, properties?: Record<string, unknown>) {
    await frigade.group(groupId, properties)
  }

  return {
    groupId,
    setGroupId,
    addProperties,
    track,
    isLoading: !frigade?.isReady(),
  }
}
