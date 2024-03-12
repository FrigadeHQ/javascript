import { FlowDataRaw, FlowStep, FrigadeConfig, UserFlowState } from './types'
import {
  clone,
  COMPLETED_FLOW,
  COMPLETED_STEP,
  NOT_STARTED_FLOW,
  NOT_STARTED_STEP,
  SKIPPED_FLOW,
  STARTED_FLOW,
  STARTED_STEP,
} from '../shared/utils'
import { Fetchable } from '../shared/fetchable'

export class Flow extends Fetchable {
  /**
   * The Flow's ID.
   */
  public id: string
  /**
   * The raw data defined in `config.yml` as a JSON decoded object.
   * @ignore
   */
  public configYmlAsJson: any
  /**
   * Ordered map of the Steps in the Flow.
   * See [Flow Step Definition](https://docs.frigade.com/v2/sdk/js/step) for more information.
   */
  public steps: Map<string, FlowStep>
  /**
   * The user-facing title of the Flow, if defined at the top level of the YAML config.
   */
  public title?: string
  /**
   * The user-facing description of the Flow, if defined at the top level of the YAML config.
   */
  public subtitle?: string
  /**
   * The metadata of the Flow.
   * @ignore
   */
  public rawData: FlowDataRaw
  /**
   * Whether the Flow is completed or not.
   */
  public isCompleted: boolean
  /**
   * Whether the Flow is started or not.
   */
  public isStarted: boolean
  /**
   * Whether the Flow has been skipped or not.
   */
  public isSkipped: boolean
  /**
   * Whether the Flow is visible to the user based on the current user/group's state.
   */
  public isVisible: boolean = false
  /**
   * Whether the Flow targeting logic/audience matches the current user/group.
   */
  public isTargeted: boolean = false
  /**
   * @ignore
   */
  private readonly flowDataRaw: FlowDataRaw
  /**
   * @ignore
   */
  private userFlowStateRaw?: UserFlowState
  /**
   * @ignore
   */
  private lastStepUpdate: Map<(step: FlowStep, previousStep: FlowStep) => void, FlowStep> =
    new Map()

  constructor(config: FrigadeConfig, flowDataRaw: FlowDataRaw) {
    super(config)
    this.flowDataRaw = flowDataRaw
    this.initFromRawData(flowDataRaw)
  }

  /**
   * Reload the Flow data from the server
   */
  reload() {
    this.initFromRawData(this.flowDataRaw)
  }

  /**
   * @ignore
   */
  private initFromRawData(flowDataRaw: FlowDataRaw) {
    const flowDataYml = JSON.parse(flowDataRaw.data)
    const steps = flowDataYml.steps ?? flowDataYml.data ?? []
    this.id = flowDataRaw.slug
    this.rawData = flowDataRaw
    this.configYmlAsJson = flowDataYml
    this.title = this.configYmlAsJson.title
    this.subtitle = this.configYmlAsJson.subtitle

    const userFlowState = this.getUserFlowState()
    if (!userFlowState) {
      return
    }
    this.userFlowStateRaw = userFlowState

    this.isCompleted = userFlowState.flowState == COMPLETED_FLOW
    this.isStarted = userFlowState.flowState == STARTED_FLOW
    this.isSkipped = userFlowState.flowState == SKIPPED_FLOW
    const hasCompleted = this.isCompleted || this.isSkipped
    const targetingShouldHideFlow =
      flowDataRaw.targetingLogic && userFlowState.shouldTrigger === false
    this.isVisible = !hasCompleted && !targetingShouldHideFlow
    if (this.flowDataRaw.active === false) {
      this.isVisible = false
    }
    this.isTargeted = !flowDataRaw.targetingLogic ? true : targetingShouldHideFlow === false

    const newSteps = new Map<string, FlowStep>()

    steps.forEach((step, index) => {
      const userFlowStateStep = userFlowState.stepStates[step.id]
      const stepObj = {
        ...step,
        isCompleted: userFlowStateStep.actionType == COMPLETED_STEP,
        isStarted: userFlowStateStep.actionType == STARTED_STEP,
        isHidden: userFlowStateStep.hidden,
        isBlocked: userFlowStateStep.blocked,
        lastActionAt: userFlowStateStep.lastActionAt
          ? new Date(userFlowStateStep.lastActionAt)
          : undefined,
        order: index,
      } as FlowStep

      stepObj.start = async (properties?: Record<string | number, any>) => {
        const thisStep = this.steps.get(step.id)

        if (this.getCurrentStep().id === thisStep.id && thisStep.isStarted) {
          return
        }

        thisStep.isStarted = true
        const copy = clone(this.getGlobalState().userFlowStates[this.id])
        copy.stepStates[thisStep.id].actionType = STARTED_STEP
        copy.stepStates[thisStep.id].lastActionAt = new Date().toISOString()
        copy.lastStepId = thisStep.id

        this.getGlobalState().userFlowStates[this.id] = copy

        if (!thisStep.isCompleted) {
          await this.fetch('/flowResponses', {
            method: 'POST',
            body: JSON.stringify({
              foreignUserId: this.config.userId,
              foreignUserGroupId: this.config.groupId,
              flowSlug: this.id,
              stepId: thisStep.id,
              data: properties ?? {},
              createdAt: new Date().toISOString(),
              actionType: STARTED_STEP,
            }),
          })
          await this.refreshUserFlowState()
        }

        const updatedUserFlowState = this.getUserFlowState()
        thisStep.isCompleted =
          updatedUserFlowState.stepStates[thisStep.id].actionType == COMPLETED_STEP
        thisStep.isStarted = updatedUserFlowState.stepStates[thisStep.id].actionType == STARTED_STEP
        thisStep.lastActionAt = new Date()
      }

      stepObj.complete = async (properties?: Record<string | number, any>) => {
        const thisStep = this.steps.get(step.id)

        if (thisStep.isCompleted) {
          return
        }

        const numberOfCompletedSteps = this.getNumberOfCompletedSteps()
        const isLastStep = numberOfCompletedSteps + 1 == this.steps.size

        thisStep.isCompleted = true
        this.isStarted = true
        const copy = clone(this.getGlobalState().userFlowStates[this.id])

        copy.stepStates[thisStep.id].actionType = COMPLETED_STEP
        copy.stepStates[thisStep.id].lastActionAt = new Date().toISOString()
        copy.flowState = isLastStep ? COMPLETED_FLOW : STARTED_FLOW

        const nextStepId = Array.from(this.steps.keys())[index + 1]
        if (nextStepId) {
          copy.lastStepId = nextStepId
          copy.stepStates[nextStepId].actionType = STARTED_STEP
          const lastAction = new Date()
          copy.stepStates[nextStepId].lastActionAt = lastAction.toISOString()
          this.steps.get(nextStepId).isStarted = true
          this.steps.get(nextStepId).lastActionAt = lastAction
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
            foreignUserGroupId: this.config.groupId,
            flowSlug: this.id,
            stepId: thisStep.id,
            data: properties ?? {},
            createdAt: new Date().toISOString(),
            actionType: COMPLETED_STEP,
          }),
        })

        await this.refreshUserFlowState()

        const updatedUserFlowState = this.getUserFlowState()
        thisStep.isCompleted =
          updatedUserFlowState.stepStates[thisStep.id].actionType == COMPLETED_STEP
        thisStep.isStarted = updatedUserFlowState.stepStates[thisStep.id].actionType == STARTED_STEP
        thisStep.lastActionAt = new Date()
      }

      stepObj.reset = async () => {
        const thisStep = this.steps.get(step.id)

        if (!thisStep.isCompleted) {
          return
        }

        thisStep.isCompleted = false
        thisStep.isStarted = false
        thisStep.lastActionAt = undefined
        const copy = clone(this.getGlobalState().userFlowStates[this.id])
        copy.stepStates[thisStep.id].actionType = NOT_STARTED_STEP
        copy.stepStates[thisStep.id].lastActionAt = undefined
        copy.flowState = STARTED_FLOW
        this.getGlobalState().userFlowStates[this.id] = copy

        await this.fetch('/flowResponses', {
          method: 'POST',
          body: JSON.stringify({
            foreignUserId: this.config.userId,
            foreignUserGroupId: this.config.groupId,
            flowSlug: this.id,
            stepId: thisStep.id,
            data: {},
            createdAt: new Date().toISOString(),
            actionType: NOT_STARTED_STEP,
          }),
        })

        await this.refreshUserFlowState()

        const updatedUserFlowState = this.getUserFlowState()
        thisStep.isCompleted =
          updatedUserFlowState.stepStates[thisStep.id].actionType == COMPLETED_STEP
        thisStep.isStarted = updatedUserFlowState.stepStates[thisStep.id].actionType == STARTED_STEP
        thisStep.lastActionAt = undefined
      }

      stepObj.onStateChange = (handler: (step: FlowStep, previousStep: FlowStep) => void) => {
        const wrapperHandler = (flow: Flow) => {
          if (flow.id !== this.id) {
            return
          }
          const thisStep = flow.steps.get(step.id)
          const previousStep = this.lastStepUpdate.get(handler)

          if (
            thisStep.isCompleted !== previousStep?.isCompleted ||
            thisStep.isStarted !== previousStep?.isStarted ||
            thisStep.isHidden !== previousStep?.isHidden ||
            thisStep.isBlocked !== previousStep?.isBlocked
          ) {
            handler(thisStep, previousStep ?? clone(thisStep))
            this.lastStepUpdate.set(handler, clone(thisStep))
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
    if (
      this.getGlobalState().variables &&
      this.getGlobalState().variables[this.id] &&
      Object.keys(this.getGlobalState().variables[this.id]).length > 0
    ) {
      this.applyVariables(this.getGlobalState().variables[this.id])
    }
  }

  /**
   * Marks the flow started
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
        foreignUserGroupId: this.config.groupId,
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
   * Marks the flow completed
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
        foreignUserGroupId: this.config.groupId,
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
   * @ignore
   */
  private optimisticallyMarkFlowCompleted() {
    this.isStarted = true
    this.isCompleted = true
    const copy = clone(this.getGlobalState().userFlowStates[this.id])
    copy.flowState = COMPLETED_FLOW
    this.getGlobalState().userFlowStates[this.id] = copy
    this.isVisible = false
  }

  /**
   * @ignore
   */
  private optimisticallyMarkFlowSkipped() {
    this.isSkipped = true
    const copy = clone(this.getGlobalState().userFlowStates[this.id])
    copy.flowState = SKIPPED_FLOW
    this.getGlobalState().userFlowStates[this.id] = copy
    this.isVisible = false
  }

  /**
   * Marks the flow skipped
   */
  public async skip(properties?: Record<string | number, any>) {
    if (this.isSkipped) {
      return
    }

    this.optimisticallyMarkFlowSkipped()

    await this.fetch('/flowResponses', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.config.userId,
        foreignUserGroupId: this.config.groupId,
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
   * Navigates the flow to the next step if one exists. This will mark that step started, but will not complete the previous step.
   */
  public async forward(properties?: Record<string | number, any>) {
    const nextStep = this.getStepByIndex(this.getCurrentStepIndex() + 1)
    if (nextStep) {
      await nextStep.start(properties)
    }
  }

  /**
   * Navigates the flow to the previous step if one exists. This will mark that step started, but will not complete the previous step.
   */
  public async back(properties?: Record<string | number, any>) {
    const previousStep = this.getStepByIndex(this.getCurrentStepIndex() - 1)
    if (previousStep) {
      await previousStep.start(properties)
    }
  }

  /**
   * Restarts the flow/marks it not started
   */
  public async restart() {
    await this.fetch('/flowResponses', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.config.userId,
        foreignUserGroupId: this.config.groupId,
        flowSlug: this.id,
        stepId: 'unknown',
        data: {},
        createdAt: new Date().toISOString(),
        actionType: NOT_STARTED_FLOW,
      }),
    })

    await this.refreshUserFlowState()
    this.initFromRawData(this.flowDataRaw)
  }

  /**
   * Get a step by index
   * @param index
   */
  public getStepByIndex(index: number): FlowStep | undefined {
    return this.steps.get(Array.from(this.steps.keys())[index])
  }

  /**
   * Gets current step
   */
  public getCurrentStep(): FlowStep {
    let maybeCurrentStepId = Array.from(this.steps.keys()).find(
      (key) => this.steps.get(key).isCompleted === false && this.steps.get(key).isHidden === false
    )
    Array.from(this.steps.keys()).forEach((key) => {
      if (
        this.steps.get(key).isStarted &&
        this.steps.get(key).lastActionAt &&
        this.steps.get(key).lastActionAt >
          (this.steps.get(maybeCurrentStepId)?.lastActionAt ?? new Date(0))
      ) {
        maybeCurrentStepId = key
      }
    })

    const currentStepId = maybeCurrentStepId ?? Array.from(this.steps.keys())[0]
    return this.steps.get(currentStepId)
  }

  /**
   * Get the index of the current step. Starts at 0
   */
  public getCurrentStepIndex(): number {
    const currentStep = this.getCurrentStep()
    return Array.from(this.steps.keys()).indexOf(currentStep.id)
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

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
  public removeStateChangeHandler(handler: (flow: Flow, previousFlow: Flow) => void) {
    const wrapperHandler = this.getGlobalState().onFlowStateChangeHandlerWrappers.get(handler)
    if (wrapperHandler) {
      this.getGlobalState().onFlowStateChangeHandlers =
        this.getGlobalState().onFlowStateChangeHandlers.filter((h) => h !== wrapperHandler)
    }
  }

  /**
   * @ignore
   */
  public applyVariables(variables: Record<string, any>) {
    // Replace ${variable} with the value of the variable
    const replaceVariables = (str: string) => {
      const matches = str.match(/\${(.*?)}/g)
      if (matches) {
        matches.forEach((match) => {
          const variable = match.replace('${', '').replace('}', '')
          if (!variables[variable]) {
            return
          }
          str = str.replace(match, variables[variable])
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

    this.getGlobalState().variables = {}
    this.getGlobalState().variables[this.id] = variables
  }

  /**
   * @ignore
   */
  private getUserFlowState(): UserFlowState {
    const userFlowStates = this.getGlobalState().userFlowStates
    return userFlowStates[this.id]
  }

  /**
   * @ignore
   */
  private async refreshUserFlowState() {
    await this.getGlobalState().refreshUserFlowStates()
  }
}
