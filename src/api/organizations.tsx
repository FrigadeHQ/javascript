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

export function useOrganization() {
  const { organizationId, userId, setOrganizationId } = useContext(FrigadeContext)
  const { mutateUserFlowState } = useUserFlowStates()
  const { config, apiUrl } = useConfig()
  const gracefullyFetch = useGracefulFetch()
  const { verifySDKInitiated } = useCheckHasInitiatedAPI()

  useEffect(() => {
    // Check if user is not a guest

    if (userId && organizationId) {
      // Check if userid begins with the guest prefix
      if (userId.startsWith(GUEST_PREFIX)) {
        return
      }
      const userRegisteredKey = `frigade-user-group-registered-${userId}-${organizationId}`
      // Check if user has already been registered in frigade
      if (!localStorage.getItem(userRegisteredKey)) {
        // Register user in frigade
        gracefullyFetch(`${apiUrl}userGroups`, {
          ...config,
          method: 'POST',
          body: JSON.stringify({ foreignUserId: userId, foreignUserGroupId: organizationId }),
        })
        // Mark user as registered in frigade
        localStorage.setItem(userRegisteredKey, 'true')
      }
    }
  }, [userId, organizationId])

  const addPropertiesToOrganization = useCallback(
    async (properties: EntityProperties) => {
      if (!verifySDKInitiated()) {
        return
      }
      if (!organizationId || !userId) {
        console.error(
          'Cannot add properties to organization: Organization ID and User ID must both be set.',
          { organizationId, userId }
        )
        return
      }

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
    },
    [organizationId, userId, config, mutateUserFlowState]
  )

  const trackEventForOrganization = useCallback(
    async (event: string, properties?: EntityProperties) => {
      if (!verifySDKInitiated()) {
        return
      }
      if (!organizationId || !userId) {
        console.error(
          'Cannot track event for organization: Organization ID and User ID must both be set.',
          { organizationId, userId }
        )
        return
      }
      const eventData: OrganizationEvent = {
        event,
        properties,
      }
      const data: AddPropertyToOrganizationDTO = {
        foreignUserId: userId,
        foreignUserGroupId: organizationId,
        events: [eventData],
      }
      await gracefullyFetch(`${apiUrl}userGroups`, {
        ...config,
        method: 'POST',
        body: JSON.stringify(data),
      })
      mutateUserFlowState()
    },
    [organizationId, userId, config, mutateUserFlowState]
  )

  return {
    organizationId,
    setOrganizationId,
    addPropertiesToOrganization,
    trackEventForOrganization,
  }
}
