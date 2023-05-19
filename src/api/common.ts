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

export function useGracefulFetch() {
  return async (url: string, options: any) => {
    let response
    try {
      response = await fetch(url, options)
    } catch (error) {
      return getEmptyResponse(error)
    }

    if (!response) {
      return getEmptyResponse()
    }

    if (!response.ok) {
      return getEmptyResponse(response.statusText)
    }

    return response
  }
}

function getEmptyResponse(error?: any) {
  if (error) {
    console.log('Call to Frigade failed', error)
  } else {
    console.log('Call to Frigade failed')
  }

  // Create empty response that contains the .json method and returns an empty object
  return {
    json: () => ({}),
  }
}

export interface PaginatedResult<T> {
  data: T[]
  offset: number
  limit: number
}
