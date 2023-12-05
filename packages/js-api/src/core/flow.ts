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
import { Fetchable } from '../shared/Fetchable'

export class Flow extends Fetchable {
  /**
   * THe Flow ID / slug of the flow
   */
  public id: string
  /**
   * The raw data defined in `config.yml` as a JSON decoded object
   */
  public configYmlAsJson: any
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
  public rawData: FlowDataRaw
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

  private readonly flowDataRaw: FlowDataRaw

  private lastStepUpdate: Map<(step: FlowStep, previousStep: FlowStep) => void, FlowStep> =
    new Map()

  private lastUsedVariables = {}

  constructor(config: FrigadeConfig, flowDataRaw: FlowDataRaw) {
    super(config)
    this.flowDataRaw = flowDataRaw
    this.initFromRawData(flowDataRaw)
  }

  private initFromRawData(flowDataRaw: FlowDataRaw) {
    const flowDataYml = JSON.parse(flowDataRaw.data)
    const steps = flowDataYml.steps ?? flowDataYml.data ?? []
    this.id = flowDataRaw.slug
    this.rawData = flowDataRaw
    this.configYmlAsJson = flowDataYml
    this.title = this.configYmlAsJson.title
    this.subtitle = this.configYmlAsJson.subtitle

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
        const copy = clone(this.getGlobalState().userFlowStates[this.id])
        copy.stepStates[currentStep.id].actionType = STARTED_STEP
        copy.lastStepId = currentStep.id
        this.getGlobalState().userFlowStates[this.id] = copy

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
        const copy = clone(this.getGlobalState().userFlowStates[this.id])

        copy.stepStates[currentStep.id].actionType = COMPLETED_STEP
        copy.flowState = isLastStep ? COMPLETED_FLOW : STARTED_FLOW

        const nextStepId = Array.from(this.steps.keys())[index + 1]
        if (nextStepId) {
          copy.lastStepId = nextStepId
        }

        if (isLastStep) {
          this.optimisticallyMarkFlowCompleted()
        }

        this.getGlobalState().userFlowStates[this.id] = copy

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

      stepObj.onStateChange = (handler: (step: FlowStep, previousStep: FlowStep) => void) => {
        const wrapperHandler = (flow: Flow) => {
          if (flow.id !== this.id) {
            return
          }
          const currentStep = flow.steps.get(step.id)
          const previousStep = this.lastStepUpdate.get(handler)

          if (
            currentStep.isCompleted !== previousStep?.isCompleted ||
            currentStep.isStarted !== previousStep?.isStarted ||
            currentStep.isHidden !== previousStep?.isHidden ||
            currentStep.isBlocked !== previousStep?.isBlocked
          ) {
            handler(currentStep, previousStep ?? clone(currentStep))
            this.lastStepUpdate.set(handler, clone(currentStep))
          }
        }
        this.getGlobalState().onStepStateChangeHandlerWrappers.set(handler, wrapperHandler)
        this.getGlobalState().onFlowStateChangeHandlers.push(wrapperHandler)
      }

      stepObj.removeStateChangeHandler = (
        handler: (step: FlowStep, previousStep: FlowStep) => void
      ) => {
        const wrapperHandler = this.getGlobalState().onStepStateChangeHandlerWrappers.get(handler)
        if (wrapperHandler) {
          this.getGlobalState().onFlowStateChangeHandlers =
            this.getGlobalState().onFlowStateChangeHandlers.filter((h) => h !== wrapperHandler)
        }
      }

      newSteps.set(step.id, stepObj)
    })
    this.steps = newSteps
    // Check if empty object
    if (Object.keys(this.lastUsedVariables).length > 0) {
      this.applyVariables(this.lastUsedVariables)
    }
  }

  /**
   * Function that marks the flow started
   */
  public async start(properties?: Record<string | number, any>) {
    if (this.isStarted || this.isCompleted) {
      return
    }

    this.isStarted = true
    const copy = clone(this.getGlobalState().userFlowStates[this.id])
    copy.flowState = STARTED_FLOW
    this.getGlobalState().userFlowStates[this.id] = copy

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
    const copy = clone(this.getGlobalState().userFlowStates[this.id])
    copy.flowState = COMPLETED_FLOW
    this.getGlobalState().userFlowStates[this.id] = copy
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
    this.getGlobalState().userFlowStates[this.id] = null
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
      (key) => this.steps.get(key).isCompleted === false && this.steps.get(key).isHidden === false
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

  /**
   * Get the number of available steps for the current user in the current flow. This is the number of steps that are not hidden.
   */
  public getNumberOfAvailableSteps(): number {
    return Array.from(this.steps.values()).filter((step) => !step.isHidden).length
  }

  public onStateChange(handler: (flow: Flow, previousFlow: Flow) => void) {
    const wrapperHandler = (flow: Flow, previousFlow: Flow) => {
      if (
        (flow.id === this.id &&
          (flow.isCompleted !== previousFlow.isCompleted ||
            flow.isStarted !== previousFlow.isStarted ||
            flow.isSkipped !== previousFlow.isSkipped ||
            flow.isVisible !== previousFlow.isVisible)) ||
        JSON.stringify(flow.steps) !== JSON.stringify(previousFlow.steps)
      ) {
        handler(flow, previousFlow)
      }
    }
    this.getGlobalState().onFlowStateChangeHandlerWrappers.set(handler, wrapperHandler)
    this.getGlobalState().onFlowStateChangeHandlers.push(wrapperHandler)
  }

  public removeStateChangeHandler(handler: (flow: Flow, previousFlow: Flow) => void) {
    const wrapperHandler = this.getGlobalState().onFlowStateChangeHandlerWrappers.get(handler)
    if (wrapperHandler) {
      this.getGlobalState().onFlowStateChangeHandlers =
        this.getGlobalState().onFlowStateChangeHandlers.filter((h) => h !== wrapperHandler)
    }
  }

  public applyVariables(variables: Record<string, any>) {
    // Replace ${variable} with the value of the variable
    const replaceVariables = (str: string) => {
      const matches = str.match(/\${(.*?)}/g)
      if (matches) {
        matches.forEach((match) => {
          const variable = match.replace('${', '').replace('}', '')
          str = str.replace(match, variables[variable] ?? '')
        })
      }
      return str
    }

    this.title = replaceVariables(this.title ?? '')
    this.subtitle = replaceVariables(this.subtitle ?? '')
    this.steps.forEach((step) => {
      // Iterate over every string field in the step and replace variables
      Object.keys(step).forEach((key) => {
        if (typeof step[key] === 'string') {
          // @ts-ignore
          step[key] = replaceVariables(step[key])
        }
      })
    })

    this.lastUsedVariables = variables
  }

  private getUserFlowState(): UserFlowState {
    const userFlowStates = this.getGlobalState().userFlowStates
    return userFlowStates[this.id]
  }

  private async refreshUserFlowState() {
    await this.getGlobalState().refreshUserFlowStates()
  }
}
