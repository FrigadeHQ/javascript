import { FrigadeConfig, UserFlowState } from '../types'
import { FlowDataRaw } from './types'
import {
  COMPLETED_FLOW,
  COMPLETED_STEP,
  NOT_STARTED_FLOW,
  SKIPPED_FLOW,
  STARTED_FLOW,
  STARTED_STEP,
} from '../shared/utils'
import { FlowStep } from './flow-step'
import { frigadeGlobalState, getGlobalStateKey } from '../shared/state'
import { Fetchable } from '../shared/Fetchable'

export default class Flow extends Fetchable {
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
  public steps: Map<string, FlowStep>
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
  /**
   * Whether the flow has been skipped or not
   */
  public isSkipped: boolean

  private flowDataRaw: FlowDataRaw

  constructor(config: FrigadeConfig, flowDataRaw: FlowDataRaw) {
    super(config)
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
    this.isSkipped = userFlowState.flowState == SKIPPED_FLOW
    this.steps = new Map()

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
        const currentStep = this.steps.get(step.id)

        if (currentStep.isStarted || currentStep.isCompleted) {
          return
        }

        currentStep.isStarted = true

        await this.fetch('/flowResponses', {
          method: 'POST',
          body: JSON.stringify({
            foreignUserId: this.config.userId,
            flowSlug: this.id,
            stepId: currentStep.id,
            data: properties ?? {},
            createdAt: new Date().toISOString(),
            actionType: STARTED_STEP,
          }),
        })

        await this.refreshUserFlowState()

        const updatedUserFlowState = this.getUserFlowState()
        currentStep.isCompleted =
          updatedUserFlowState.stepStates[currentStep.id].actionType == COMPLETED_STEP
        currentStep.isStarted =
          updatedUserFlowState.stepStates[currentStep.id].actionType == STARTED_STEP
      }

      stepObj.complete = async (properties?: Record<string | number, any>) => {
        const currentStep = this.steps.get(step.id)

        if (currentStep.isCompleted) {
          return
        }

        currentStep.isCompleted = true

        await this.fetch('/flowResponses', {
          method: 'POST',
          body: JSON.stringify({
            foreignUserId: this.config.userId,
            flowSlug: this.id,
            stepId: currentStep.id,
            data: properties ?? {},
            createdAt: new Date().toISOString(),
            actionType: COMPLETED_STEP,
          }),
        })

        await this.refreshUserFlowState()

        const updatedUserFlowState = this.getUserFlowState()
        currentStep.isCompleted =
          updatedUserFlowState.stepStates[currentStep.id].actionType == COMPLETED_STEP
        currentStep.isStarted =
          updatedUserFlowState.stepStates[currentStep.id].actionType == STARTED_STEP
      }

      this.steps.set(step.id, stepObj)
    })
  }

  /**
   * Function that marks the flow started
   */
  public async start(properties?: Record<string | number, any>) {
    if (this.isStarted || this.isCompleted) {
      return
    }

    await this.fetch('/flowResponses', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.config.userId,
        flowSlug: this.id,
        stepId: this.getCurrentStep().id,
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
    if (this.isCompleted) {
      return
    }

    await this.fetch('/flowResponses', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.config.userId,
        flowSlug: this.id,
        stepId: this.getCurrentStep().id,
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
    await this.fetch('/flowResponses', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.config.userId,
        flowSlug: this.id,
        stepId: this.getCurrentStep().id,
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
    // TODO: Reset internal flow responses / steps / isStarted / isCompleted
    await this.fetch('/flowResponses', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.config.userId,
        flowSlug: this.id,
        stepId: 'unknown',
        data: {},
        createdAt: new Date().toISOString(),
        actionType: NOT_STARTED_FLOW,
      }),
    })
  }

  /**
   * Get a step by index
   * @param index
   */
  public getStepByIndex(index: number): FlowStep | undefined {
    return this.steps.get(Array.from(this.steps.keys())[index])
  }

  /**
   * Function that gets current step
   */
  public getCurrentStep(): FlowStep {
    // Find the userFlowState with most recent timestamp
    const userFlowState = this.getUserFlowState()

    // TEMP: lastStepId appears to be the last step that a flowState event was recorded for?
    // const lastStepId =
    //   userFlowState?.lastStepId?.length > 0 && userFlowState?.lastStepId !== 'unknown'
    //     ? userFlowState?.lastStepId
    //     : undefined

    // TEMP: Return the lowest-ordered incomplete step in the flow
    const lastStepId = Array.from(this.steps.keys()).find(
      (key) => this.steps.get(key).isCompleted === false
    )

    const currentStepId = lastStepId ?? Array.from(this.steps.keys())[0]
    return this.steps.get(currentStepId)
  }

  /**
   * Get the number of completed steps for the current user in the current flow
   */
  public getNumberOfCompletedSteps(): number {
    return Array.from(this.steps.values()).filter((step) => step.isCompleted).length
  }

  private getUserFlowState(): UserFlowState {
    const userFlowStates = frigadeGlobalState[getGlobalStateKey(this.config)].userFlowStates
    return userFlowStates[this.id]
  }

  private async refreshUserFlowState() {
    await frigadeGlobalState[getGlobalStateKey(this.config)].refreshUserFlowStates()
  }
}
