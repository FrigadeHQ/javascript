import React, { useContext } from 'react'
import { FrigadeContext } from '../FrigadeProvider'
import { API_PREFIX, useConfig } from './common'
import { useUserFlowStates } from './user-flow-states'

interface AddPropertyToUserDTO {
  readonly foreignId: string
  readonly properties?: { [key: string]: string | boolean | number | null }
  readonly events?: UserEvent[]
}

interface UserEvent {
  readonly event: string
  readonly properties?: { [key: string]: string | boolean | number | null }
}

export function useUser() {
  const { userId, setUserId, setUserProperties, userProperties } = useContext(FrigadeContext)
  const { config } = useConfig()
  const { mutateUserFlowState } = useUserFlowStates()

  async function addPropertiesToUser(properties: {
    [key: string]: string | boolean | number | null
  }) {
    const data: AddPropertyToUserDTO = {
      foreignId: userId,
      properties,
    }
    await fetch(`${API_PREFIX}users`, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    })
    setUserProperties({ ...userProperties, ...properties })
    mutateUserFlowState()
  }

  async function trackEventForUser(
    event: string,
    properties?: { [key: string]: string | boolean | number | null }
  ) {
    const eventData: UserEvent = {
      event,
      properties,
    }
    const data: AddPropertyToUserDTO = {
      foreignId: userId,
      events: [eventData],
    }
    await fetch(`${API_PREFIX}users`, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  return { userId, setUserId, addPropertiesToUser, trackEventForUser }
}
