import React, { useCallback, useContext, useEffect } from 'react'
import { FrigadeContext } from '../FrigadeProvider'
import { useCheckHasInitiatedAPI, useConfig, useGracefulFetch } from './common'
import { useUserFlowStates } from './user-flow-states'
import { EntityProperties } from '../FrigadeForm/types'
import { guestUserIdField } from '../components/DataFetcher'

interface AddPropertyToUserDTO {
  readonly foreignId: string
  readonly properties?: { [key: string]: string | boolean | number | null }
  readonly events?: UserEvent[]
  readonly linkGuestId?: string
}

interface UserEvent {
  readonly event: string
  readonly properties?: { [key: string]: string | boolean | number | null }
}

export const GUEST_PREFIX = 'guest_'

export function useUser(): {
  readonly userId: string | null
  readonly setUserId: React.Dispatch<React.SetStateAction<string | null>>
  readonly setUserIdWithProperties: (userId: string, properties?: EntityProperties) => Promise<void>
  readonly addPropertiesToUser: (properties: EntityProperties) => Promise<void>
  readonly trackEventForUser: (event: string, properties?: EntityProperties) => Promise<void>
  readonly linkExistingGuestSessionToUser: (userId: string) => Promise<void>
} {
  const {
    userId: userIdInternal,
    organizationId,
    setUserId,
    setUserProperties,
    shouldGracefullyDegrade,
  } = useContext(FrigadeContext)
  const { config, apiUrl } = useConfig()
  const { mutateUserFlowState } = useUserFlowStates()
  const gracefullyFetch = useGracefulFetch()
  const { verifySDKInitiated } = useCheckHasInitiatedAPI()

  function getUserIdKey(id?: string) {
    return `frigade-user-registered-${id}`
  }

  // Use local storage to mark if user has already been registered in frigade
  useEffect(() => {
    // Check if user is not a guest
    if (userIdInternal && !organizationId) {
      // Check if userid begins with the guest prefix
      if (userIdInternal.startsWith(GUEST_PREFIX)) {
        return
      }
      const userRegisteredKey = getUserIdKey(userIdInternal)
      // Check if user has already been registered in frigade
      if (!localStorage.getItem(userRegisteredKey)) {
        // Register user in frigade
        gracefullyFetch(`${apiUrl}users`, {
          ...config,
          method: 'POST',
          body: JSON.stringify({ foreignId: userIdInternal }),
        })
        // Mark user as registered in frigade
        localStorage.setItem(userRegisteredKey, 'true')
      }
    }
  }, [userIdInternal, shouldGracefullyDegrade, organizationId])

  const addPropertiesToUser = useCallback(
    async (properties: EntityProperties) => {
      if (!verifySDKInitiated()) {
        return
      }
      const data: AddPropertyToUserDTO = {
        foreignId: userIdInternal,
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
    [userIdInternal, config, shouldGracefullyDegrade, mutateUserFlowState]
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
        foreignId: userIdInternal,
        events: [eventData],
      }
      await gracefullyFetch(`${apiUrl}users`, {
        ...config,
        method: 'POST',
        body: JSON.stringify(data),
      })
      mutateUserFlowState()
    },
    [userIdInternal, config, mutateUserFlowState]
  )

  const setUserIdWithProperties = useCallback(
    async (userId: string, properties?: EntityProperties) => {
      if (!verifySDKInitiated()) {
        return
      }
      if (properties && Object.keys(properties).length > 0) {
        const userRegisteredKey = getUserIdKey(userId)
        localStorage.setItem(userRegisteredKey, 'true')
        setUserId(userId)
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
      } else {
        setUserId(userId)
      }
    },
    [config, shouldGracefullyDegrade, mutateUserFlowState]
  )

  const linkExistingGuestSessionToUser = useCallback(
    async (userId: string) => {
      if (!verifySDKInitiated()) {
        return
      }
      const existingGuestId =
        typeof window !== 'undefined' ? localStorage.getItem(guestUserIdField) : null

      if (!existingGuestId) {
        return
      }

      const data: AddPropertyToUserDTO = {
        foreignId: userId,
        linkGuestId: existingGuestId,
      }
      await gracefullyFetch(`${apiUrl}users`, {
        ...config,
        method: 'POST',
        body: JSON.stringify(data),
      })
      mutateUserFlowState()
    },
    [config, shouldGracefullyDegrade, mutateUserFlowState]
  )

  return {
    userId: userIdInternal,
    setUserId,
    setUserIdWithProperties,
    addPropertiesToUser,
    trackEventForUser,
    linkExistingGuestSessionToUser,
  }
}
