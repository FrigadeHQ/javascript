import React, { useMemo } from 'react'
import { FrigadeContext } from '../FrigadeProvider'

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

// Create wrapper around fetch that fails gracefully if the response is not 200/201
export const gracefullyFetch = async (url: string, options: any) => {
  const response = await fetch(url, options)
  if (!response.ok) {
    const error = await response.json()
    console.log('Failed to call Frigade', error)
  }
  return response
}

export interface PaginatedResult<T> {
  data: T[]
  offset: number
  limit: number
}
