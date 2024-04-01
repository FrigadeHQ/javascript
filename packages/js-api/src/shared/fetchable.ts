import { generateGuestId, getEmptyResponse, getHeaders, gracefulFetch } from './utils'
import { FrigadeConfig } from '../core/types'
import { frigadeGlobalState, FrigadeGlobalState, getGlobalStateKey } from './state'

export class Fetchable {
  public config: FrigadeConfig = {
    apiKey: '',
    apiUrl: 'https://api.frigade.com/v1/public',
    userId: generateGuestId(),
    __instanceId: Math.random().toString(36).substring(7),
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
      ...getHeaders(this.config.apiKey),
    })
  }

  private getAPIUrl(path: string) {
    const pathPrefix = '/v1/public'
    const apiUrl = new URL(
      `${pathPrefix}${path}`,
      this.config.apiUrl.replace(pathPrefix, '')
    ).toString()

    return apiUrl
  }

  /**
   * @ignore
   */
  protected getGlobalState(): FrigadeGlobalState {
    const globalStateKey = getGlobalStateKey(this.config)
    if (!frigadeGlobalState[globalStateKey]) {
      throw new Error('Frigade not initialized')
    }
    return frigadeGlobalState[globalStateKey]
  }
}
