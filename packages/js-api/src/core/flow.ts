import { InternalConfig, UserFlowState } from '../types'
import { FlowDataRaw } from './types'
import {
  COMPLETED_FLOW,
  COMPLETED_STEP,
  fetcher,
  NOT_STARTED_FLOW,
  SKIPPED_FLOW,
  STARTED_FLOW,
  STARTED_STEP,
} from '../shared/utils'
import { FlowStep } from './flow-step'
import { frigadeGlobalState, getGlobalStateKey } from '../shared/state'

export default class Flow {
  /**
   * THe Flow ID / slug of the flow
   */
  public id: string
  /**
   * The raw data defined in `config.yml` as a JSON decoded object
   */
  public rawData: Record<any, any>
  /**
   * Ordered map from Step ID to step data. The `steps` array in `config.yml`
   */
  public steps: Record<string, FlowStep>
  /**
   * The user-facing title of the flow, if defined at the top level of `config.yml`
   */
  public title?: string
  /**
   * The user-facing description of the flow, if defined at the top level of `config.yml`
   */
  public subtitle?: string
  /**
   * The metadata of the flow.
   */
  public metadata: FlowDataRaw
  /**
   * Whether the flow is completed or not
   */
  public isCompleted: boolean
  /**
   * Whether the flow is started or not
   */
  public isStarted: boolean

  private flowDataRaw: FlowDataRaw

  private internalConfig: InternalConfig

  constructor(internalConfig: InternalConfig, flowDataRaw: FlowDataRaw) {
    this.internalConfig = internalConfig
    this.flowDataRaw = flowDataRaw
    this.initFromRawData(flowDataRaw)
  }

  private initFromRawData(flowDataRaw: FlowDataRaw) {
    const flowDataYml = JSON.parse(flowDataRaw.data)
    const steps = flowDataYml.steps ?? flowDataYml.data ?? []
    this.id = flowDataRaw.slug
    this.metadata = flowDataRaw
    this.rawData = flowDataYml
    this.title = this.rawData.title
    this.subtitle = this.rawData.subtitle

    const userFlowState = this.getUserFlowState()

    this.isCompleted = userFlowState.flowState == COMPLETED_FLOW
    this.isStarted = userFlowState.flowState == STARTED_FLOW
    this.steps = {}

    steps.forEach((step, index) => {
      const userFlowStateStep = userFlowState.stepStates[step.id]
      const stepObj = {
        ...step,
        isCompleted: userFlowStateStep.actionType == COMPLETED_STEP,
        isStarted: userFlowStateStep.actionType == STARTED_STEP,
        isHidden: userFlowStateStep.hidden,
        isBlocked: userFlowStateStep.blocked,
        order: index,
      } as FlowStep

      stepObj.start = async (properties?: Record<string | number, any>) => {
        stepObj.isCompleted = true
        await fetcher(this.internalConfig.apiKey, `/flowResponses`, {
          method: 'POST',
          body: JSON.stringify({
            foreignUserId: this.internalConfig.userId,
            flowSlug: this.id,
            stepId: step.id,
            data: properties ?? {},
            createdAt: new Date().toISOString(),
            actionType: STARTED_STEP,
          }),
        })
        await this.refreshUserFlowState()
        const updatedUserFlowState = this.getUserFlowState()
        stepObj.isCompleted = updatedUserFlowState.stepStates[step.id].actionType == COMPLETED_STEP
        stepObj.isStarted = updatedUserFlowState.stepStates[step.id].actionType == STARTED_STEP
      }

      stepObj.complete = async (properties?: Record<string | number, any>) => {
        stepObj.isCompleted = true
        await fetcher(this.internalConfig.apiKey, `/flowResponses`, {
          method: 'POST',
          body: JSON.stringify({
            foreignUserId: this.internalConfig.userId,
            flowSlug: this.id,
            stepId: step.id,
            data: properties ?? {},
            createdAt: new Date().toISOString(),
            actionType: COMPLETED_STEP,
          }),
        })
        await this.refreshUserFlowState()
        const updatedUserFlowState = this.getUserFlowState()
        stepObj.isCompleted = updatedUserFlowState.stepStates[step.id].actionType == COMPLETED_STEP
        stepObj.isStarted = updatedUserFlowState.stepStates[step.id].actionType == STARTED_STEP
      }

      this.steps[step.id] = stepObj
    })
  }

  /**
   * Function that marks the flow started
   */
  public async start(properties?: Record<string | number, any>) {
    const currentStepIndex = this.getCurrentStepIndex()
    const currentStepId = currentStepIndex != -1 ? this.steps[currentStepIndex].id : 'unknown'
    await fetcher(this.internalConfig.apiKey, `/flowResponses`, {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.internalConfig.userId,
        flowSlug: this.id,
        stepId: currentStepId,
        data: properties ?? {},
        createdAt: new Date().toISOString(),
        actionType: STARTED_FLOW,
      }),
    })
    await this.refreshUserFlowState()
    this.initFromRawData(this.flowDataRaw)
  }

  /**
   * Function that marks the flow completed
   */
  public async complete(properties?: Record<string | number, any>) {
    const currentStepIndex = this.getCurrentStepIndex()
    const currentStepId =
      currentStepIndex != -1 ? this.getStepByIndex(currentStepIndex).id : 'unknown'
    await fetcher(this.internalConfig.apiKey, `/flowResponses`, {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.internalConfig.userId,
        flowSlug: this.id,
        stepId: currentStepId,
        data: properties ?? {},
        createdAt: new Date().toISOString(),
        actionType: COMPLETED_FLOW,
      }),
    })
    await this.refreshUserFlowState()
    this.initFromRawData(this.flowDataRaw)
  }

  /**
   * Function that marks the flow skipped
   */
  public async skip(properties?: Record<string | number, any>) {
    const currentStepIndex = this.getCurrentStepIndex()
    const currentStepId =
      currentStepIndex != -1 ? this.getStepByIndex(currentStepIndex).id : 'unknown'
    await fetcher(this.internalConfig.apiKey, `/flowResponses`, {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.internalConfig.userId,
        flowSlug: this.id,
        stepId: currentStepId,
        data: properties ?? {},
        createdAt: new Date().toISOString(),
        actionType: SKIPPED_FLOW,
      }),
    })
    await this.refreshUserFlowState()
    this.initFromRawData(this.flowDataRaw)
  }

  /**
   * Function that restarts the flow/marks it not started
   */
  public async restart() {
    await fetcher(this.internalConfig.apiKey, `/flowResponses`, {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.internalConfig.userId,
        flowSlug: this.id,
        stepId: 'unknown',
        data: {},
        createdAt: new Date().toISOString(),
        actionType: NOT_STARTED_FLOW,
      }),
    })
  }

  /**
   * Get a step by id
   */
  public getStep(id: string): FlowStep | undefined {
    return this.steps[id]
  }

  /**
   * Get a step by index
   * @param index
   */
  public getStepByIndex(index: number): FlowStep | undefined {
    return this.steps[Object.keys(this.steps)[index]]
  }

  /**
   * Function that gets current step index
   */
  public getCurrentStepIndex(): number {
    // Find the userFlowState with most recent timestamp
    const userFlowState = this.getUserFlowState()
    if (!userFlowState) {
      return 0
    }
    const currentStepId = userFlowState.lastStepId
    return this.steps[currentStepId]?.order ?? 0
  }

  private getUserFlowState(): UserFlowState {
    const userFlowStates = frigadeGlobalState[getGlobalStateKey(this.internalConfig)].userFlowStates
    return userFlowStates[this.id]
  }

  private async refreshUserFlowState() {
    await frigadeGlobalState[getGlobalStateKey(this.internalConfig)].refreshUserFlowStates()
  }
}
