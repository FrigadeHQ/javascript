import { generateGuestId, getEmptyResponse, getHeaders, gracefulFetch } from './utils'
import { FrigadeConfig } from '../core/types'
import { frigadeGlobalState, FrigadeGlobalState, getGlobalStateKey } from './state'

export class Fetchable {
  public config: FrigadeConfig = {
    apiKey: '',
    apiUrl: 'https://api.frigade.com',
    userId: generateGuestId(),
    __instanceId: Math.random().toString(12).substring(4),
    generateGuestId: true,
    __refreshIntervalInMS: 100,
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
    if (this.config.__readOnly) {
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
   */
  protected getGlobalState(): FrigadeGlobalState {
    const globalStateKey = getGlobalStateKey(this.config)
    if (!frigadeGlobalState[globalStateKey]) {
      throw new Error('Frigade has not yet been initialized')
    }
    return frigadeGlobalState[globalStateKey]
  }
}
