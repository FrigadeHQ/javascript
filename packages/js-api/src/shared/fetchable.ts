import {
  generateGuestId,
  getEmptyResponse,
  getHeaders,
  gracefulFetch,
  GUEST_PREFIX,
} from './utils'
import { DEFAULT_REFRESH_INTERVAL_IN_MS, FrigadeConfig } from '../core/types'
import { frigadeGlobalState, FrigadeGlobalState, getGlobalStateKey } from './state'

export class Fetchable {
  public config: FrigadeConfig = {
    apiKey: '',
    apiUrl: 'https://api.frigade.com',
    __instanceId: Math.random().toString(12).substring(4),
    generateGuestId: true,
    __refreshIntervalInMS: DEFAULT_REFRESH_INTERVAL_IN_MS,
  }

  constructor(config: FrigadeConfig) {
    const filteredConfig = Object.fromEntries(Object.entries(config).filter(([_, v]) => v != null))
    this.config = {
      ...this.config,
      ...filteredConfig,
    }

    // Only generate (and persist) a guest ID when guest IDs are enabled.
    // When generateGuestId is explicitly false, the userId stays undefined
    // until the consumer provides one.
    if (!this.config.userId && this.config.generateGuestId !== false) {
      this.config.userId = generateGuestId()
    }
  }

  /**
   * @ignore
   */
  public async fetch(path: string, options?: Record<any, any>) {
    if (this.config.__readOnly || this.isAnonymousWithGuestIdDisabled()) {
      return getEmptyResponse()
    }

    return gracefulFetch(this.getAPIUrl(path), {
      keepalive: true,
      ...(options ?? {}),
      ...getHeaders(this.config),
    })
  }

  private getAPIUrl(path: string) {
    return `${this.config.apiUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
  }

  /**
   * True when `generateGuestId` is explicitly disabled and no real userId has been provided,
   * in which case no requests are sent to the Frigade API and no Flows are returned.
   */
  public isAnonymousWithGuestIdDisabled(): boolean {
    return (
      this.config.generateGuestId === false &&
      (!this.config.userId || this.config.userId.startsWith(GUEST_PREFIX))
    )
  }

  /**
   * @ignore
   */
  protected getGlobalState(): FrigadeGlobalState {
    const globalStateKey = getGlobalStateKey(this.config)
    if (!frigadeGlobalState[globalStateKey]) {
      throw new Error('Frigade has not yet been initialized')
    }
    return frigadeGlobalState[globalStateKey]
  }
}
