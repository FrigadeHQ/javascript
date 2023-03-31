import React, { useContext, useEffect } from 'react'
import { FrigadeContext } from '../FrigadeProvider'
import { API_PREFIX, useConfig } from './common'
import { useUserFlowStates } from './user-flow-states'
import { GUEST_PREFIX } from './users'

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
  const { config } = useConfig()

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
        fetch(`${API_PREFIX}userGroups`, {
          ...config,
          method: 'POST',
          body: JSON.stringify({ foreignUserId: userId, foreignUserGroupId: organizationId }),
        })
        // Mark user as registered in frigade
        localStorage.setItem(userRegisteredKey, 'true')
      }
    }
  }, [userId, organizationId])

  async function addPropertiesToOrganization(properties: {
    [key: string]: string | boolean | number | null
  }) {
    if (!organizationId || !userId) {
      console.error(
        'Cannot add properties to organization: Organization ID and User ID must both be set.'
      )
      return
    }

    const data: AddPropertyToOrganizationDTO = {
      foreignUserId: userId,
      foreignUserGroupId: organizationId,
      properties,
    }
    await fetch(`${API_PREFIX}userGroups`, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    })
    mutateUserFlowState()
  }

  async function trackEventForOrganization(
    event: string,
    properties?: { [key: string]: string | boolean | number | null }
  ) {
    if (!organizationId || !userId) {
      console.error(
        'Cannot track event for organization: Organization ID and User ID must both be set.'
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
    await fetch(`${API_PREFIX}userGroups`, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    })
    mutateUserFlowState()
  }

  return {
    organizationId,
    setOrganizationId,
    addPropertiesToOrganization,
    trackEventForOrganization,
  }
}
