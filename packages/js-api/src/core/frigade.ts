import { FrigadeConfig, UserFlowState } from '../types'
import { generateGuestId, resetAllLocalStorage } from '../shared/utils'
import Flow from './flow'
import { FlowDataRaw } from './types'
import { frigadeGlobalState, getGlobalStateKey } from '../shared/state'
import { Fetchable } from '../shared/Fetchable'

export class Frigade extends Fetchable {
  private flows: Flow[] = []
  private initPromise: Promise<void>

  constructor(apiKey: string, config?: FrigadeConfig) {
    super({
      apiKey,
      ...config,
    })

    this.init(this.config)
  }

  private async init(config: FrigadeConfig): Promise<void> {
    this.config = {
      ...this.config,
      ...config,
    }

    this.initPromise = (async () => {
      await this.refreshUserFlowStates()
      await this.refreshFlows()
    })()

    return this.initPromise
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
    if (this.initPromise !== null) {
      return this.initPromise
    } else {
      return this.init(this.config)
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
