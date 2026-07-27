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
    userId: generateGuestId(),
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
   * @ignore
   * True when `generateGuestId` is explicitly disabled and no real userId has been provided,
   * in which case no requests should be sent to the Frigade API.
   */
  protected isAnonymousWithGuestIdDisabled(): boolean {
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
