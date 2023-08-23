import React, { useCallback, useContext, useEffect } from 'react'
import { FrigadeContext } from '../FrigadeProvider'
import { useCheckHasInitiatedAPI, useConfig, useGracefulFetch } from './common'
import { useUserFlowStates } from './user-flow-states'
import { GUEST_PREFIX } from './users'
import { EntityProperties } from '../FrigadeForm/types'

interface AddPropertyToOrganizationDTO {
  readonly foreignUserId: string
  readonly foreignUserGroupId: string
  readonly properties?: { [key: string]: string | boolean | number | null }
  readonly events?: OrganizationEvent[]
}

interface OrganizationEvent {
  readonly event: string
  readonly properties?: { [key: string]: string | boolean | number | null }
}

export function useOrganization(): {
  readonly organizationId: string | null
  readonly setOrganizationId: React.Dispatch<React.SetStateAction<string | null>>
  readonly setOrganizationIdWithProperties: (
    organizationId: string,
    properties?: EntityProperties
  ) => void
  readonly addPropertiesToOrganization: (properties: EntityProperties) => Promise<void>
  readonly trackEventForOrganization: (
    event: string,
    properties?: EntityProperties
  ) => Promise<void>
} {
  const {
    organizationId: organizationIdInternal,
    userId,
    setOrganizationId,
  } = useContext(FrigadeContext)
  const { mutateUserFlowState } = useUserFlowStates()
  const { config, apiUrl } = useConfig()
  const gracefullyFetch = useGracefulFetch()
  const { verifySDKInitiated } = useCheckHasInitiatedAPI()

  function getUserGroupKey(uId?: string, oId?: string) {
    return `frigade-user-group-registered-${uId}-${oId}`
  }

  useEffect(() => {
    // Check if user is not a guest

    if (userId && organizationIdInternal) {
      // Check if userid begins with the guest prefix
      if (userId.startsWith(GUEST_PREFIX)) {
        return
      }
      const userRegisteredKey = getUserGroupKey(userId, organizationIdInternal)
      // Check if user has already been registered in frigade
      if (!localStorage.getItem(userRegisteredKey)) {
        // Register user in frigade
        gracefullyFetch(`${apiUrl}userGroups`, {
          ...config,
          method: 'POST',
          body: JSON.stringify({
            foreignUserId: userId,
            foreignUserGroupId: organizationIdInternal,
          }),
        })
        // Mark user as registered in frigade
        localStorage.setItem(userRegisteredKey, 'true')
      }
    }
  }, [userId, organizationIdInternal])

  const addPropertiesToOrganization = useCallback(
    async (properties: EntityProperties) => {
      if (!verifySDKInitiated()) {
        return
      }
      if (!organizationIdInternal || !userId) {
        console.error(
          'Cannot add properties to organization: Organization ID and User ID must both be set.',
          { organizationIdInternal, userId }
        )
        return
      }

      const data: AddPropertyToOrganizationDTO = {
        foreignUserId: userId,
        foreignUserGroupId: organizationIdInternal,
        properties,
      }
      await gracefullyFetch(`${apiUrl}userGroups`, {
        ...config,
        method: 'POST',
        body: JSON.stringify(data),
      })
      mutateUserFlowState()
    },
    [organizationIdInternal, userId, config, mutateUserFlowState]
  )

  const trackEventForOrganization = useCallback(
    async (event: string, properties?: EntityProperties) => {
      if (!verifySDKInitiated()) {
        return
      }
      if (!organizationIdInternal || !userId) {
        console.error(
          'Cannot track event for organization: Organization ID and User ID must both be set.',
          { organizationIdInternal, userId }
        )
        return
      }
      const eventData: OrganizationEvent = {
        event,
        properties,
      }
      const data: AddPropertyToOrganizationDTO = {
        foreignUserId: userId,
        foreignUserGroupId: organizationIdInternal,
        events: [eventData],
      }
      await gracefullyFetch(`${apiUrl}userGroups`, {
        ...config,
        method: 'POST',
        body: JSON.stringify(data),
      })
      mutateUserFlowState()
    },
    [organizationIdInternal, userId, config, mutateUserFlowState]
  )

  const setOrganizationIdWithProperties = useCallback(
    async (organizationId: string, properties?: EntityProperties) => {
      if (!verifySDKInitiated()) {
        return
      }
      if (properties) {
        const userRegisteredKey = getUserGroupKey(userId, organizationId)
        localStorage.setItem(userRegisteredKey, 'true')
        setOrganizationId(organizationId)
        const data: AddPropertyToOrganizationDTO = {
          foreignUserId: userId,
          foreignUserGroupId: organizationId,
          properties,
        }
        await gracefullyFetch(`${apiUrl}userGroups`, {
          ...config,
          method: 'POST',
          body: JSON.stringify(data),
        })
        mutateUserFlowState()
      } else {
        setOrganizationId(organizationId)
      }
    },
    [userId, config, mutateUserFlowState]
  )

  return {
    organizationId: organizationIdInternal,
    setOrganizationId,
    setOrganizationIdWithProperties,
    addPropertiesToOrganization,
    trackEventForOrganization,
  }
}
