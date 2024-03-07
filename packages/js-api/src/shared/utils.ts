import { VERSION_NUMBER } from '../core/version'
import fetch from 'cross-fetch'
import { v4 as uuidv4 } from 'uuid'
import { Flow } from '../core/flow'
import { frigadeGlobalState } from './state'

export const NOT_STARTED_STEP = 'NOT_STARTED_STEP'
export const COMPLETED_FLOW = 'COMPLETED_FLOW'
export const SKIPPED_FLOW = 'SKIPPED_FLOW'
export const STARTED_FLOW = 'STARTED_FLOW'
export const NOT_STARTED_FLOW = 'NOT_STARTED_FLOW'
export const COMPLETED_STEP = 'COMPLETED_STEP'
export const STARTED_STEP = 'STARTED_STEP'
export type StepActionType = 'STARTED_STEP' | 'COMPLETED_STEP' | 'NOT_STARTED_STEP'
export type UserFlowStatus = 'NOT_STARTED_FLOW' | 'STARTED_FLOW' | 'COMPLETED_FLOW' | 'SKIPPED_FLOW'
const LAST_POST_CALL_AT = 'frigade-last-call-at-'
const LAST_POST_CALL_DATA = 'frigade-last-call-data-'
const GUEST_KEY = 'frigade-guest-key'
export const GUEST_PREFIX = 'guest_'
const GET_CACHE_PREFIX = 'get-cache-'
const GET_CACHE_TTL_MS = 1000
const POST_CACHE_TTL_MS = 1000
const LOCAL_STORAGE_PREFIX = 'fr-js-'

export function cloneFlow(flow: Flow): Flow {
  const newFlow = new Flow(flow.config, flow.rawData)
  newFlow.isCompleted = flow.isCompleted
  newFlow.isStarted = flow.isStarted
  newFlow.isSkipped = flow.isSkipped
  newFlow.isVisible = flow.isVisible
  newFlow.steps = flow.steps
  return newFlow
}

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function getHeaders(apiKey: string) {
  return {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Frigade-SDK-Version': VERSION_NUMBER,
      'X-Frigade-SDK-Platform': 'Javascript',
    },
  }
}

function getLocalStorage(key: string) {
  if (isWeb()) {
    return window.localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${key}`)
  }
  return null
}

function setLocalStorage(key: string, value: string) {
  if (isWeb()) {
    window.localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${key}`, value)
  }
}

function setGlobalState(key: string, value: any) {
  frigadeGlobalState[key] = value
}

function getGlobalState(key: string): any {
  return frigadeGlobalState[key]
}

export function clearCache() {
  Object.keys(frigadeGlobalState).forEach((key) => {
    if (key.startsWith(GET_CACHE_PREFIX)) {
      delete frigadeGlobalState[key]
    }
  })
}

export function resetAllLocalStorage() {
  if (isWeb()) {
    // Clear all local storage items that begin with `frigade-`
    Object.keys(window.localStorage).forEach((key) => {
      if (key.startsWith(LOCAL_STORAGE_PREFIX)) {
        window.localStorage.removeItem(key)
      }
    })
  }
}

export async function gracefulFetch(url: string, options: any) {
  const lastCallAtKey = LAST_POST_CALL_AT + url
  const lastCallDataKey = LAST_POST_CALL_DATA + url
  if (isWeb() && options && options.body && options.method === 'POST') {
    const lastCall = getLocalStorage(lastCallAtKey)
    const lastCallData = getLocalStorage(lastCallDataKey)
    if (lastCall && lastCallData && lastCallData == options.body) {
      const lastCallDate = new Date(lastCall)
      const now = new Date()
      const diff = now.getTime() - lastCallDate.getTime()
      // Throttle consecutive POST calls to 1 second
      if (diff < POST_CACHE_TTL_MS) {
        return getEmptyResponse()
      }
    }
    setLocalStorage(lastCallAtKey, new Date().toISOString())
    setLocalStorage(lastCallDataKey, options.body)
    clearCache()
  }

  let response
  try {
    response = fetch(url, options)
    response = await response
  } catch (error) {
    return getEmptyResponse(error)
  }

  if (!response) {
    return getEmptyResponse('Received an empty response')
  }

  if (response.status >= 400) {
    return getEmptyResponse(response.statusText)
  }

  try {
    if (response.status === 204 || response.status === 201) {
      return getEmptyResponse()
    }

    const body = await response.json()
    if (body.error) {
      return getEmptyResponse(body.error)
    }
    return body
  } catch (e) {
    return getEmptyResponse(e)
  }
}

export function getEmptyResponse(error?: any) {
  if (error) {
    console.log('Call to Frigade failed', error)
  }

  // Create empty response that contains the .json method and returns an empty object
  return {
    json: () => ({}),
  }
}

export function generateGuestId() {
  if (isWeb()) {
    let guestId = getLocalStorage(GUEST_KEY)
    if (!guestId) {
      guestId = `${GUEST_PREFIX}${uuidv4()}`
      setLocalStorage(GUEST_KEY, guestId)
    }
    return guestId
  }
}

export function fetcher(apiKey: string, path: string, options?: Record<any, any>) {
  return gracefulFetch(`//api.frigade.com/v1/public${path}`, {
    ...(options ?? {}),
    ...getHeaders(apiKey),
  })
}

export function isWeb() {
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.localStorage !== 'undefined'
  )
}
