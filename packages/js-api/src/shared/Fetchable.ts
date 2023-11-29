import { generateGuestId, getHeaders, gracefulFetch } from './utils'
import { FrigadeConfig } from '../types'
import { frigadeGlobalState, FrigadeGlobalState, getGlobalStateKey } from './state'

export class Fetchable {
  public config: FrigadeConfig = {
    apiKey: '',
    apiUrl: '//api.frigade.com/v1/public',
    userId: generateGuestId(),
    __instanceId: Math.random().toString(36).substring(7),
  }

  constructor(config: FrigadeConfig) {
    this.config = {
      ...this.config,
      ...config,
    }
  }

  public async fetch(path: string, options?: Record<any, any>) {
    return gracefulFetch(`${this.config.apiUrl}${path}`, {
      ...(options ?? {}),
      ...getHeaders(this.config.apiKey),
    })
  }

  protected getGlobalState(): FrigadeGlobalState {
    const globalStateKey = getGlobalStateKey(this.config)
    if (!frigadeGlobalState[globalStateKey]) {
      throw new Error('Frigade not initialized')
    }
    return frigadeGlobalState[globalStateKey]
  }
}
