import { FrigadeConfig, UserFlowState } from '../types'
import { FlowDataRaw } from './types'
import {
  clone,
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
import { Frigade } from './frigade'

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
  /**
   * Whether the flow is visible to the user based on the current user/group's state
   */
  public isVisible: boolean = false

  private flowDataRaw: FlowDataRaw

  private frigadeInstance: Frigade

  private onFlowStateChangeHandlerWrappers: Map<
    (flow: Flow, previousFlow?: Flow) => void,
    (flow: Flow, previousFlow?: Flow) => void
  > = new Map()

  private onStepStateChangeHandlerWrappers: Map<
    (step: FlowStep, previousStep?: FlowStep) => void,
    (flow: Flow, previousFlow?: Flow) => void
  > = new Map()

  constructor(config: FrigadeConfig, flowDataRaw: FlowDataRaw, frigadeInstance: Frigade) {
    super(config)
    this.flowDataRaw = flowDataRaw
    this.frigadeInstance = frigadeInstance
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
    const hasCompleted = this.isCompleted || this.isSkipped
    const targetingShouldHideFlow =
      flowDataRaw.targetingLogic && userFlowState.shouldTrigger === false
    this.isVisible = !hasCompleted && !targetingShouldHideFlow
    const newSteps = new Map<string, FlowStep>()

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
        const copy = clone(
          frigadeGlobalState[getGlobalStateKey(this.config)].userFlowStates[this.id]
        )
        copy.stepStates[currentStep.id].actionType = STARTED_STEP
        copy.lastStepId = currentStep.id
        frigadeGlobalState[getGlobalStateKey(this.config)].userFlowStates[this.id] = copy

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

        const numberOfCompletedSteps = this.getNumberOfCompletedSteps()
        const isLastStep = numberOfCompletedSteps + 1 == this.steps.size

        currentStep.isCompleted = true
        this.isStarted = true
        const copy = clone(
          frigadeGlobalState[getGlobalStateKey(this.config)].userFlowStates[this.id]
        )

        copy.stepStates[currentStep.id].actionType = COMPLETED_STEP
        copy.flowState = isLastStep ? COMPLETED_FLOW : STARTED_FLOW

        const nextStepId = Array.from(this.steps.keys())[index + 1]
        if (nextStepId) {
          copy.lastStepId = nextStepId
        }

        if (isLastStep) {
          this.optimisticallyMarkFlowCompleted()
        }

        frigadeGlobalState[getGlobalStateKey(this.config)].userFlowStates[this.id] = copy

        // if all steps are now completed, mark flow completed
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

        if (isLastStep) {
          await this.complete()
        } else {
          await this.refreshUserFlowState()
        }

        const updatedUserFlowState = this.getUserFlowState()
        currentStep.isCompleted =
          updatedUserFlowState.stepStates[currentStep.id].actionType == COMPLETED_STEP
        currentStep.isStarted =
          updatedUserFlowState.stepStates[currentStep.id].actionType == STARTED_STEP
      }

      stepObj.onStepStateChange = (handler: (step: FlowStep, previousStep?: FlowStep) => void) => {
        const wrapperHandler = (flow: Flow, previousFlow?: Flow) => {
          if (flow.id === this.id && flow.steps.has(stepObj.id)) {
            const newStep = flow.steps.get(stepObj.id)
            const previousStep = previousFlow?.steps?.get(stepObj.id)
            if (JSON.stringify(newStep) === JSON.stringify(previousStep)) {
              return
            }
            handler(newStep, previousStep)
          }
        }
        this.onStepStateChangeHandlerWrappers.set(handler, wrapperHandler)
        this.frigadeInstance.onFlowStateChange(wrapperHandler)
      }

      stepObj.removeOnStepStateChangeHandler = (
        handler: (step: FlowStep, previousStep?: FlowStep) => void
      ) => {
        const wrapperHandler = this.onStepStateChangeHandlerWrappers.get(handler)
        if (wrapperHandler) {
          this.frigadeInstance.removeOnFlowStateChangeHandler(wrapperHandler)
        }
      }

      newSteps.set(step.id, stepObj)
    })
    this.steps = newSteps
  }

  /**
   * Function that marks the flow started
   */
  public async start(properties?: Record<string | number, any>) {
    if (this.isStarted || this.isCompleted) {
      return
    }

    this.isStarted = true
    const copy = clone(frigadeGlobalState[getGlobalStateKey(this.config)].userFlowStates[this.id])
    copy.flowState = STARTED_FLOW
    frigadeGlobalState[getGlobalStateKey(this.config)].userFlowStates[this.id] = copy

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
    this.optimisticallyMarkFlowCompleted()

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

  private optimisticallyMarkFlowCompleted() {
    this.isStarted = true
    this.isCompleted = true
    const copy = clone(frigadeGlobalState[getGlobalStateKey(this.config)].userFlowStates[this.id])
    copy.flowState = COMPLETED_FLOW
    frigadeGlobalState[getGlobalStateKey(this.config)].userFlowStates[this.id] = copy
    this.isVisible = false
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
    this.isCompleted = false
    this.isCompleted = true
    frigadeGlobalState[getGlobalStateKey(this.config)].userFlowStates[this.id] = null
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
    await this.refreshUserFlowState()
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

  public onStateChange(handler: (flow: Flow, previousFlow?: Flow) => void) {
    const wrapperHandler = (flow: Flow, previousFlow?: Flow) => {
      if (flow.id === this.id) {
        handler(flow, previousFlow)
      }
    }
    this.onFlowStateChangeHandlerWrappers.set(handler, wrapperHandler)
    this.frigadeInstance.onFlowStateChange(wrapperHandler)
  }

  public removeOnStateChangeHandler(handler: (flow: Flow, previousFlow?: Flow) => void) {
    const wrapperHandler = this.onFlowStateChangeHandlerWrappers.get(handler)
    if (wrapperHandler) {
      this.frigadeInstance.removeOnFlowStateChangeHandler(wrapperHandler)
    }
  }

  private getUserFlowState(): UserFlowState {
    const userFlowStates = frigadeGlobalState[getGlobalStateKey(this.config)].userFlowStates
    return userFlowStates[this.id]
  }

  private async refreshUserFlowState() {
    await frigadeGlobalState[getGlobalStateKey(this.config)].refreshUserFlowStates()
  }
}
