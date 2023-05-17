import React, { useMemo } from 'react'
import { FrigadeContext } from '../FrigadeProvider'
import { useErrorBoundary } from 'react-error-boundary'

export const API_PREFIX = 'https://api.frigade.com/v1/public/'

export const NOT_STARTED_STEP = 'NOT_STARTED_STEP'
export const COMPLETED_FLOW = 'COMPLETED_FLOW'
export const ABORTED_FLOW = 'ABORTED_FLOW'
export const STARTED_FLOW = 'STARTED_FLOW'
export const NOT_STARTED_FLOW = 'NOT_STARTED_FLOW'
export const COMPLETED_STEP = 'COMPLETED_STEP'
export const STARTED_STEP = 'STARTED_STEP'
// Define a string type that is either STARTED_STEP or COMPLETED_STEP
export type StepActionType = 'STARTED_STEP' | 'COMPLETED_STEP' | 'NOT_STARTED_STEP'

export function useConfig() {
  const { publicApiKey, userId } = React.useContext(FrigadeContext)

  return {
    config: useMemo(
      () => ({
        headers: {
          Authorization: `Bearer ${publicApiKey}`,
          'Content-Type': 'application/json',
        },
      }),
      [publicApiKey, userId]
    ),
  }
}

export function useGracefulFetch() {
  const { showBoundary } = useErrorBoundary()

  return async (url: string, options: any) => {
    const response = await fetch(url, options).catch((error) => {
      showBoundary(error)
    })

    if (!response) {
      return
    }

    if (!response.ok) {
      showBoundary(new Error(`Failed to call Frigade: ${url}`))
    }

    return response
  }
}

export interface PaginatedResult<T> {
  data: T[]
  offset: number
  limit: number
}
