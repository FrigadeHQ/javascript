import React, { useMemo } from 'react'
import { FrigadeContext } from '../FrigadeProvider'
import { VERSION_NUMBER } from './version'

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
          'X-Frigade-SDK-Version': VERSION_NUMBER,
          'X-Frigade-SDK-Platform': 'React',
        },
      }),
      [publicApiKey, userId]
    ),
  }
}

export function useGracefulFetch() {
  const { shouldGracefullyDegrade } = React.useContext(FrigadeContext)

  return async (url: string, options: any) => {
    if (shouldGracefullyDegrade) {
      console.log(`Skipping ${url} call to Frigade due to error`)
      return getEmptyResponse()
    }
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

export function useCheckHasInitiatedAPI() {
  const { publicApiKey, shouldGracefullyDegrade } = React.useContext(FrigadeContext)

  function verifySDKInitiated() {
    if (shouldGracefullyDegrade) {
      console.error('Frigade hooks cannot be used when Frigade SDK has failed to initialize')
      return
    }
    if (!publicApiKey) {
      console.error('Frigade hooks cannot be used outside the scope of FrigadeProvider')
    }
  }

  return {
    verifySDKInitiated,
  }
}
