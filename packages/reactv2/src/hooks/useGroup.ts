import { Frigade } from '@frigade/js'
import { useContext, useRef } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useGroup() {
  const { groupId, setGroupId: setGroupIdValue, apiKey, getConfig } = useContext(FrigadeContext)

  const frigadeRef = useRef(new Frigade(apiKey, getConfig()))
  const frigade = frigadeRef.current

  async function setGroupId(groupId: string, properties?: Record<string, any>) {
    await frigade.group(groupId, properties)
    setGroupIdValue(groupId)
  }

  return { groupId, setGroupId }
}
