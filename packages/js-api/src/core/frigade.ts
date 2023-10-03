import { FrigadeConfig, InternalConfig, UserFlowState } from '../types'
import { fetcher, generateGuestId, resetAllLocalStorage } from '../shared/utils'
import Flow from './flow'
import { FlowDataRaw } from './types'
import { frigadeGlobalState, getGlobalStateKey } from '../shared/state'

export class Frigade {
  private apiKey?: string
  private userId: string = generateGuestId()
  private organizationId?: string
  private config?: FrigadeConfig
  private hasInitialized = false
  private internalConfig?: InternalConfig
  private __instanceId = ''

  private flows: Flow[] = []

  constructor(apiKey: string, config?: FrigadeConfig) {
    this.__instanceId = Math.random().toString(36).substring(7)
    this.init(apiKey, config)
  }

  private async init(apiKey: string, config?: FrigadeConfig): Promise<void> {
    this.apiKey = apiKey
    this.config = config
    if (config?.userId) {
      this.userId = config.userId
    }
    if (config?.organizationId) {
      this.organizationId = config.organizationId
    }
    this.refreshInternalConfig()
    await this.refreshUserFlowStates()
    await this.refreshFlows()
    this.hasInitialized = true
  }

  public async identify(userId: string, properties?: Record<string, any>): Promise<void> {
    await this.initIfNeeded()
    this.userId = userId
    this.refreshInternalConfig()
    await fetcher(this.apiKey, '/users', {
      method: 'POST',
      body: JSON.stringify({
        foreignId: this.userId,
        properties,
      }),
    })
    await this.refreshUserFlowStates()
  }

  public async group(organizationId: string, properties?: Record<string, any>): Promise<void> {
    await this.initIfNeeded()
    this.organizationId = organizationId
    this.refreshInternalConfig()
    await fetcher(this.apiKey, '/userGroups', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.userId,
        foreignUserGroupId: this.organizationId,
        properties,
      }),
    })
    await this.refreshUserFlowStates()
  }

  public async track(event: string, properties?: Record<string, any>): Promise<void> {
    await this.initIfNeeded()
    await fetcher(this.apiKey, '/track', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.userId,
        foreignUserGroupId: this.organizationId,
        event,
        properties,
      }),
    })
  }

  public async getFlow(flowId: string) {
    await this.initIfNeeded()
    return this.flows.find((flow) => flow.id == flowId)
  }

  public async getFlows() {
    await this.initIfNeeded()
    return this.flows
  }

  public async reset() {
    resetAllLocalStorage()
    this.userId = generateGuestId()
    this.organizationId = undefined
  }

  private async initIfNeeded() {
    if (!this.hasInitialized) {
      await this.init(this.apiKey, this.config)
    }
  }

  private async refreshUserFlowStates(): Promise<void> {
    const globalStateKey = getGlobalStateKey(this.internalConfig)
    frigadeGlobalState[globalStateKey] = {
      refreshUserFlowStates: async () => {},
      userFlowStates: {},
    }
    frigadeGlobalState[globalStateKey].refreshUserFlowStates = async () => {
      const userFlowStatesRaw = await fetcher(
        this.apiKey,
        `/userFlowStates?foreignUserId=${this.userId}${
          this.organizationId ? `&foreignUserGroupId=${this.organizationId}` : ''
        }`
      )
      if (userFlowStatesRaw && userFlowStatesRaw.data) {
        let userFlowStates = userFlowStatesRaw.data as UserFlowState[]
        userFlowStates.forEach((userFlowState) => {
          frigadeGlobalState[globalStateKey].userFlowStates[userFlowState.flowId] = userFlowState
        })
      }
    }
    await frigadeGlobalState[globalStateKey].refreshUserFlowStates()
  }

  private async refreshFlows() {
    this.flows = []
    const flowDataRaw = await fetcher(this.apiKey, '/flows')
    if (flowDataRaw && flowDataRaw.data) {
      let flowDatas = flowDataRaw.data as FlowDataRaw[]
      flowDatas.forEach((flowData) => {
        this.flows.push(new Flow(this.internalConfig, flowData))
      })
    }
  }

  private refreshInternalConfig() {
    this.internalConfig = {
      apiKey: this.apiKey,
      userId: this.userId,
      organizationId: this.organizationId,
      __instanceId: this.__instanceId,
    }
  }
}
