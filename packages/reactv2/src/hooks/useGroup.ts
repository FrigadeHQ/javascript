import { Frigade } from '@frigade/js'
import { useContext, useRef } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useGroup() {
  const { groupId, apiKey, getConfig } = useContext(FrigadeContext)

  const frigadeRef = useRef(new Frigade(apiKey, getConfig()))
  const frigade = frigadeRef.current

  async function setProperties(properties?: Record<string, any>) {
    await frigade.group(groupId, properties)
  }

  return { groupId, setProperties }
}
