import React, { useContext } from 'react'
import { FrigadeContext } from '../FrigadeProvider'
import { API_PREFIX, useConfig } from './common'
import { useUserFlowStates } from './user-flow-states'

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
