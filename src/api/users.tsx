import React, { useCallback, useContext, useEffect } from 'react'
import { FrigadeContext } from '../FrigadeProvider'
import { useCheckHasInitiatedAPI, useConfig, useGracefulFetch } from './common'
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

export function useUser(): {
  readonly userId: string | null
  readonly setUserId: React.Dispatch<React.SetStateAction<string | null>>
  readonly addPropertiesToUser: (properties: EntityProperties) => Promise<void>
  readonly trackEventForUser: (event: string, properties?: EntityProperties) => Promise<void>
} {
  const { userId, organizationId, setUserId, setUserProperties, shouldGracefullyDegrade } =
    useContext(FrigadeContext)
  const { config, apiUrl } = useConfig()
  const { mutateUserFlowState } = useUserFlowStates()
  const gracefullyFetch = useGracefulFetch()
  const { verifySDKInitiated } = useCheckHasInitiatedAPI()
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
        gracefullyFetch(`${apiUrl}users`, {
          ...config,
          method: 'POST',
          body: JSON.stringify({ foreignId: userId }),
        })
        // Mark user as registered in frigade
        localStorage.setItem(userRegisteredKey, 'true')
      }
    }
  }, [userId, shouldGracefullyDegrade, organizationId])

  const addPropertiesToUser = useCallback(
    async (properties: EntityProperties) => {
      if (!verifySDKInitiated()) {
        return
      }
      const data: AddPropertyToUserDTO = {
        foreignId: userId,
        properties,
      }
      await gracefullyFetch(`${apiUrl}users`, {
        ...config,
        method: 'POST',
        body: JSON.stringify(data),
      })
      setUserProperties((userProperties) => ({ ...userProperties, ...properties }))
      mutateUserFlowState()
    },
    [userId, config, shouldGracefullyDegrade, mutateUserFlowState]
  )

  const trackEventForUser = useCallback(
    async (event: string, properties?: EntityProperties) => {
      if (!verifySDKInitiated()) {
        return
      }
      const eventData: UserEvent = {
        event,
        properties,
      }
      const data: AddPropertyToUserDTO = {
        foreignId: userId,
        events: [eventData],
      }
      await gracefullyFetch(`${apiUrl}users`, {
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
