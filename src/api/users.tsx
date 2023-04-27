import React, { useCallback, useContext, useEffect } from 'react'
import { FrigadeContext } from '../FrigadeProvider'
import { API_PREFIX, useConfig } from './common'
import { useUserFlowStates } from './user-flow-states'
import { EntityProperties } from '../FrigadeForm/types'

interface AddPropertyToUserDTO {
  readonly foreignId: string
  readonly properties?: { [key: string]: string | boolean | number | null }
  readonly events?: UserEvent[]
}

interface UserEvent {
  readonly event: string
  readonly properties?: { [key: string]: string | boolean | number | null }
}

export const GUEST_PREFIX = 'guest_'

export function useUser() {
  const { userId, organizationId, setUserId, setUserProperties } = useContext(FrigadeContext)
  const { config } = useConfig()
  const { mutateUserFlowState } = useUserFlowStates()
  // Use local storage to mark if user has already been registered in frigade
  useEffect(() => {
    // Check if user is not a guest
    if (userId && !organizationId) {
      // Check if userid begins with the guest prefix
      if (userId.startsWith(GUEST_PREFIX)) {
        return
      }
      const userRegisteredKey = `frigade-user-registered-${userId}`
      // Check if user has already been registered in frigade
      if (!localStorage.getItem(userRegisteredKey)) {
        // Register user in frigade
        fetch(`${API_PREFIX}users`, {
          ...config,
          method: 'POST',
          body: JSON.stringify({ foreignId: userId }),
        })
        // Mark user as registered in frigade
        localStorage.setItem(userRegisteredKey, 'true')
      }
    }
  }, [userId, organizationId])

  const addPropertiesToUser = useCallback(
    async (properties: EntityProperties) => {
      const data: AddPropertyToUserDTO = {
        foreignId: userId,
        properties,
      }
      await fetch(`${API_PREFIX}users`, {
        ...config,
        method: 'POST',
        body: JSON.stringify(data),
      })
      setUserProperties((userProperties) => ({ ...userProperties, ...properties }))
      mutateUserFlowState()
    },
    [userId, config, mutateUserFlowState]
  )

  const trackEventForUser = useCallback(
    async (event: string, properties?: EntityProperties) => {
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
      mutateUserFlowState()
    },
    [userId, config, mutateUserFlowState]
  )

  return { userId, setUserId, addPropertiesToUser, trackEventForUser }
}
