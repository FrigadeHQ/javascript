import { VERSION_NUMBER } from '../core/version'
import { v4 as uuidv4 } from 'uuid'
import { Flow } from '../core/flow'
import { FrigadeGlobalState, frigadeGlobalState } from './state'
import { FlowStateContext } from '../core/types'

export const NOT_STARTED_STEP = 'NOT_STARTED_STEP'
export const COMPLETED_FLOW = 'COMPLETED_FLOW'
export const SKIPPED_FLOW = 'SKIPPED_FLOW'
export const STARTED_FLOW = 'STARTED_FLOW'
export const NOT_STARTED_FLOW = 'NOT_STARTED_FLOW'
export const COMPLETED_STEP = 'COMPLETED_STEP'
export const SKIPPED_STEP = 'SKIPPED_STEP'
export const STARTED_STEP = 'STARTED_STEP'
const GUEST_KEY = 'frigade-guest-key'
export const GUEST_PREFIX = 'guest_'
const GET_CACHE_PREFIX = 'get-cache-'
const LOCAL_STORAGE_PREFIX = 'fr-js-'

export function cloneFlow(flow: Flow): Flow {
  const newFlow = new Flow({
    config: flow.config,
    id: flow.id,
  })
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

class CallQueue {
  private queue: {
    call: string
    time: number
    response?: Promise<Response>
  }[] = []
  private readonly ttlInMS = 250
  private readonly cacheSize = 5

  public push(call: string, response?: Promise<Response>) {
    const now = new Date()
    if (this.queue.length >= this.cacheSize) {
      this.queue.shift()
    }
    this.queue.push({
      call: call,
      time: now.getTime(),
      response: response ?? null,
    })
  }

  public hasIdenticalCall(call: string) {
    const now = new Date()
    this.queue = this.queue.filter((item) => now.getTime() - item.time < this.ttlInMS)
    return this.queue.find((item) => item.call === call)
  }
}

const callQueue = new CallQueue()

export async function gracefulFetch(url: string, options: any) {
  if (typeof globalThis.fetch !== 'function') {
    return getEmptyResponse(
      "- Attempted to call fetch() in an environment that doesn't support it."
    )
  }

  const lastCallDataKey = `${url}${JSON.stringify(options.body ?? {})}`
  let response

  const isWebPostRequest = isWeb() && options && options.body && options.method === 'POST'

  if (isWebPostRequest) {
    const cachedCall = callQueue.hasIdenticalCall(lastCallDataKey)

    if (cachedCall != null && cachedCall.response != null) {
      const cachedResponse = await cachedCall.response

      response = cachedResponse.clone()
    }
  }

  if (!response) {
    try {
      const pendingResponse = fetch(url, options)

      if (isWebPostRequest) {
        callQueue.push(
          lastCallDataKey,
          pendingResponse.then((res) => res.clone())
        )
      }

      response = await pendingResponse
    } catch (error) {
      return getEmptyResponse(error)
    }
  }

  if (!response) {
    return getEmptyResponse('Received an empty response')
  }

  if (response.status >= 400) {
    return getEmptyResponse(response.statusText)
  }

  try {
    if (response.status === 204) {
      return getEmptyResponse()
    }

    let body
    try {
      body = await response.json()
    } catch (e) {
      return getEmptyResponse()
    }

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
  } else {
    return `${GUEST_PREFIX}${uuidv4()}`
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

export function getContext(state: FrigadeGlobalState): FlowStateContext {
  let context: FlowStateContext = {
    registeredCollectionIds: Array.from(state.registeredCollectionIds),
  }

  if (!isWeb()) {
    return context
  }

  return {
    url: state.currentUrl,
    userAgent: navigator.userAgent,
    ...context,
  }
}
