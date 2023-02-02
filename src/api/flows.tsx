import React, { useContext } from 'react'
import { API_PREFIX, PaginatedResult, useConfig } from './common'
import { FrigadeContext } from '../FrigadeProvider'

export interface Flow {
  id: number
  name: string
  description: string
  data: string
  createdAt: string
  modifiedAt: string
  slug: string
}

export function useFlows(): {
  getFlows: () => Promise<PaginatedResult<Flow> | null>
  getFlow(slug: string): Flow | null
  getFlowData(slug: string): object | null
  hasLoadedData: boolean
} {
  const { config } = useConfig()
  const { flows, hasLoadedData, setHasLoadedData } = useContext(FrigadeContext)

  function getFlows() {
    return fetch(`${API_PREFIX}flows`, config).then((r) => r.json())
  }

  function getFlow(slug: string): Flow {
    return flows.find((f) => f.slug === slug)
  }

  function getFlowData(slug: string): Flow {
    return JSON.parse(flows.find((f) => f.slug === slug).data)
  }

  return { getFlows, getFlow, getFlowData, hasLoadedData }
}
