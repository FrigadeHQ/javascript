import { FrigadeConfig, InternalConfig, UserFlowState } from '../types'
import { fetcher, generateGuestId, resetAllLocalStorage } from '../shared/utils'
import Flow from './flow'
import { FlowDataRaw } from './types'
import { frigadeGlobalState, getGlobalStateKey } from '../shared/state'
import { Fetchable } from '../shared/Fetchable'

export class Frigade extends Fetchable {
  private apiKey?: string
  public config: FrigadeConfig
  private hasInitialized = false

  private flows: Flow[] = []

  constructor(apiKey: string, config?: FrigadeConfig) {
    super({
      apiKey,
      ...config,
    })

    this.init(apiKey, config)
  }

  private async init(apiKey: string, config?: FrigadeConfig): Promise<void> {
    this.config = {
      apiKey,
      ...this.config,
      ...config,
    }
    await this.refreshUserFlowStates()
    await this.refreshFlows()
    this.hasInitialized = true
  }

  public async identify(userId: string, properties?: Record<string, any>): Promise<void> {
    await this.initIfNeeded()
    this.config.userId = userId
    await this.fetch('/users', {
      method: 'POST',
      body: JSON.stringify({
        foreignId: this.config.userId,
        properties,
      }),
    })
    await this.refreshUserFlowStates()
  }

  public async group(organizationId: string, properties?: Record<string, any>): Promise<void> {
    await this.initIfNeeded()
    this.config.organizationId = organizationId
    await this.fetch('/userGroups', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.config.userId,
        foreignUserGroupId: this.config.organizationId,
        properties,
      }),
    })
    await this.refreshUserFlowStates()
  }

  public async track(event: string, properties?: Record<string, any>): Promise<void> {
    await this.initIfNeeded()
    await this.fetch('/track', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.config.userId,
        foreignUserGroupId: this.config.organizationId,
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
    this.config.userId = generateGuestId()
    this.config.organizationId = undefined
  }

  private async initIfNeeded() {
    if (!this.hasInitialized) {
      await this.init(this.apiKey, this.config)
    }
  }

  private async refreshUserFlowStates(): Promise<void> {
    const globalStateKey = getGlobalStateKey(this.config)
    frigadeGlobalState[globalStateKey] = {
      refreshUserFlowStates: async () => {},
      userFlowStates: {},
    }
    frigadeGlobalState[globalStateKey].refreshUserFlowStates = async () => {
      const userFlowStatesRaw = await this.fetch(
        `/userFlowStates?foreignUserId=${this.config.userId}${
          this.config.organizationId ? `&foreignUserGroupId=${this.config.organizationId}` : ''
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
    const flowDataRaw = await this.fetch('/flows')
    if (flowDataRaw && flowDataRaw.data) {
      let flowDatas = flowDataRaw.data as FlowDataRaw[]
      flowDatas.forEach((flowData) => {
        this.flows.push(new Flow(this.config, flowData))
      })
    }
  }
}
