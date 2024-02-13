import { useContext } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useGroup() {
  const { groupId, frigade } = useContext(FrigadeContext)

  /**
   * Sets properties for the current group
   * @param properties
   */
  async function setProperties(properties?: Record<string, unknown>) {
    await frigade.group(groupId, properties)
  }

  return { groupId, setProperties, isLoading: frigade.isReady() }
}
