import { FlowStep, FrigadeConfig, StatefulFlow, StatefulStep } from './types'
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
import { RulesGraphRegistryCallback } from './rules-graph'

export class Flow extends Fetchable {
  /**
   * The Flow's ID.
   */
  public id: string
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
  public rawData: StatefulFlow
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
   * @ignore
   */
  private _isVisible: boolean = false
  /**
   * Whether the Flow is visible to the user based on the current user/group's state.
   */
  get isVisible() {
    if (this._isVisible === false) {
      return false
    }

    return this.getGlobalState().rulesGraph.isFlowVisible(this.id)
  }
  set isVisible(visible: boolean) {
    this._isVisible = visible
  }

  /**
   * @ignore
   */
  private lastStepUpdate: Map<(step: FlowStep, previousStep: FlowStep) => void, FlowStep> =
    new Map()

  constructor({ config, id }: { config: FrigadeConfig; id: string }) {
    super(config)
    this.id = id
    this.init()
  }

  /**
   * Reload the Flow data from the server
   */
  reload() {
    this.init()
  }

  /**
   * @ignore
   */
  resyncState(overrideStatefulFlow?: StatefulFlow) {
    const statefulFlow = overrideStatefulFlow ?? this.getStatefulFlow()

    this.rawData = statefulFlow
    this.title = statefulFlow?.data?.title
    this.subtitle = statefulFlow?.data?.subtitle

    this.isCompleted = statefulFlow.$state.completed
    this.isStarted = statefulFlow.$state.started
    this.isSkipped = statefulFlow.$state.skipped
    this._isVisible = statefulFlow.$state.visible

    statefulFlow.data.steps.forEach((step, index) => {
      const stepObj = this.initStepFromStatefulStep(step, index)

      const existingStep = this.steps?.get(step.id)
      if (existingStep) {
        existingStep.$state = stepObj.$state
      }
    })
  }

  /**
   * @ignore
   */
  private initStepFromStatefulStep(step: StatefulStep, index: number) {
    return {
      ...step,
      flow: this,
      $state: {
        ...step.$state,
        lastActionAt: step.$state.lastActionAt ? new Date(step.$state.lastActionAt) : undefined,
      },
      order: index,
    } as Partial<FlowStep>
  }

  /**
   * @ignore
   */
  private init() {
    const statefulFlow = this.getStatefulFlow()

    this.resyncState()

    const newSteps = new Map<string, FlowStep>()

    statefulFlow.data.steps.forEach((step, index) => {
      const stepObj = this.initStepFromStatefulStep(step, index)

      stepObj.start = async (properties?: Record<string | number, any>) => {
        const thisStep = this.steps.get(step.id)

        if (this.getCurrentStep().id === thisStep.id && thisStep.$state.started) {
          return
        }

        const copy = clone(this.getGlobalState().flowStates[this.id])
        copy.data.steps[thisStep.order].$state.started = true
        copy.data.steps[thisStep.order].$state.lastActionAt = new Date()
        copy.$state.lastActionAt = new Date()
        copy.$state.currentStepId = thisStep.id
        copy.$state.currentStepIndex = thisStep.order

        this.getGlobalState().flowStates[this.id] = copy
        this.resyncState()

        if (!thisStep.$state.completed) {
          await this.fetch('/flowResponses', {
            method: 'POST',
            body: JSON.stringify({
              foreignUserId: this.config.userId,
              foreignUserGroupId: this.config.groupId,
              flowSlug: this.id,
              stepId: thisStep.id,
              data: properties ?? {},
              createdAt: properties?.createdAt ? new Date(properties.createdAt) : undefined,
              actionType: STARTED_STEP,
            }),
          })
          await this.refreshStateFromAPI()
        }
      }

      stepObj.complete = async (properties?: Record<string | number, any>) => {
        const thisStep = this.steps.get(step.id)

        if (thisStep.$state.completed) {
          return
        }

        const numberOfCompletedSteps = this.getNumberOfCompletedSteps()
        const isLastStep = numberOfCompletedSteps + 1 == this.steps.size
        const copy = clone(this.getGlobalState().flowStates[this.id])

        copy.$state.started = true
        copy.data.steps[thisStep.order].$state.completed = true
        copy.data.steps[thisStep.order].$state.started = true
        copy.data.steps[thisStep.order].$state.lastActionAt = new Date()
        if (isLastStep) {
          copy.$state.completed = true
        }

        const nextStepId = this.getStepByIndex(index + 1)?.id
        if (nextStepId) {
          copy.$state.currentStepId = nextStepId
          copy.data.steps[index + 1].$state.started = true
          copy.data.steps[index + 1].$state.lastActionAt = new Date()
        }

        this.getGlobalState().flowStates[this.id] = copy
        this.resyncState()

        if (isLastStep) {
          this.optimisticallyMarkFlowCompleted()
        }

        // if all steps are now completed, mark flow completed
        await this.fetch('/flowResponses', {
          method: 'POST',
          body: JSON.stringify({
            foreignUserId: this.config.userId,
            foreignUserGroupId: this.config.groupId,
            flowSlug: this.id,
            stepId: thisStep.id,
            data: properties ?? {},
            createdAt: properties?.createdAt ? new Date(properties.createdAt) : undefined,
            actionType: COMPLETED_STEP,
          }),
        })
        await this.refreshStateFromAPI()
      }

      stepObj.reset = async () => {
        const thisStep = this.steps.get(step.id)

        if (!thisStep.$state.completed) {
          return
        }

        const copy = clone(this.getGlobalState().flowStates[this.id])
        copy.data.steps[thisStep.order].$state.started = false
        copy.data.steps[thisStep.order].$state.completed = false
        copy.data.steps[thisStep.order].$state.lastActionAt = undefined

        this.getGlobalState().flowStates[this.id] = copy
        this.resyncState()

        await this.fetch('/flowResponses', {
          method: 'POST',
          body: JSON.stringify({
            foreignUserId: this.config.userId,
            foreignUserGroupId: this.config.groupId,
            flowSlug: this.id,
            stepId: thisStep.id,
            data: {},
            actionType: NOT_STARTED_STEP,
          }),
        })
        await this.refreshStateFromAPI()
      }

      stepObj.onStateChange = (handler: (step: FlowStep, previousStep: FlowStep) => void) => {
        const wrapperHandler = (flow: Flow) => {
          if (flow.id !== this.id) {
            return
          }
          const thisStep = flow.steps.get(step.id)
          const previousStep = this.lastStepUpdate.get(handler)

          if (
            thisStep.$state.completed !== previousStep?.$state.completed ||
            thisStep.$state.started !== previousStep?.$state.started ||
            thisStep.$state.visible !== previousStep?.$state.visible ||
            thisStep.$state.blocked !== previousStep?.$state.blocked
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

      newSteps.set(step.id, stepObj as FlowStep)
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
    const copy = clone(this.getGlobalState().flowStates[this.id])
    copy.$state.started = true
    this.getGlobalState().flowStates[this.id] = copy
    this.resyncState()

    await this.fetch('/flowResponses', {
      method: 'POST',
      body: JSON.stringify({
        foreignUserId: this.config.userId,
        foreignUserGroupId: this.config.groupId,
        flowSlug: this.id,
        stepId: this.getCurrentStep().id,
        data: properties ?? {},
        actionType: STARTED_FLOW,
      }),
    })
    await this.refreshStateFromAPI()
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
        createdAt: properties?.createdAt ? new Date(properties.createdAt) : undefined,
        actionType: COMPLETED_FLOW,
      }),
    })

    await this.refreshStateFromAPI()
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
        createdAt: properties?.createdAt ? new Date(properties.createdAt) : undefined,
        actionType: SKIPPED_FLOW,
      }),
    })
    await this.refreshStateFromAPI()
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
        actionType: NOT_STARTED_FLOW,
      }),
    })

    await this.refreshStateFromAPI()
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
      (key) =>
        this.steps.get(key).$state.completed === false &&
        this.steps.get(key).$state.visible !== false
    )
    Array.from(this.steps.keys()).forEach((key) => {
      if (
        this.steps.get(key).$state.started &&
        this.steps.get(key).$state.lastActionAt &&
        this.steps.get(key).$state.lastActionAt >
          (this.steps.get(maybeCurrentStepId)?.$state.lastActionAt ?? new Date(0))
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
    return Array.from(this.steps.values()).filter((step) => step.$state.completed).length
  }

  /**
   * Get the number of available steps for the current user in the current flow. This is the number of steps that are not hidden.
   */
  public getNumberOfAvailableSteps(): number {
    return Array.from(this.steps.values()).filter((step) => step.$state.visible).length
  }

  /**
   * @ignore
   */
  public onStateChange(handler: (flow: Flow, previousFlow: Flow) => void) {
    const wrapperHandler = (flow: Flow, previousFlow: Flow) => {
      if (flow.id === this.id) {
        if (
          flow.isCompleted !== previousFlow?.isCompleted ||
          flow.isStarted !== previousFlow?.isStarted ||
          flow.isSkipped !== previousFlow?.isSkipped ||
          flow.isVisible !== previousFlow?.isVisible ||
          JSON.stringify(flow.steps) !== JSON.stringify(previousFlow?.steps)
        ) {
          handler(flow, previousFlow)
        }
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
  private getStatefulFlow(): StatefulFlow {
    const userFlowStates = this.getGlobalState().flowStates
    return userFlowStates[this.id]
  }

  /**
   * @ignore
   */
  private async refreshStateFromAPI() {
    await this.getGlobalState().refreshStateFromAPI()
    this.resyncState()
  }

  /**
   * @ignore
   */
  private optimisticallyMarkFlowCompleted() {
    const copy = clone(this.getGlobalState().flowStates[this.id])
    copy.$state.completed = true
    copy.$state.started = true
    copy.$state.visible = false
    this.getGlobalState().flowStates[this.id] = copy
    this.resyncState()
  }

  /**
   * @ignore
   */
  private optimisticallyMarkFlowSkipped() {
    const copy = clone(this.getGlobalState().flowStates[this.id])
    copy.$state.skipped = true
    copy.$state.visible = false
    this.getGlobalState().flowStates[this.id] = copy
    this.resyncState()
  }

  public register(callback?: RulesGraphRegistryCallback) {
    this.getGlobalState().rulesGraph.register(this.id, callback)
  }

  public unregister() {
    this.getGlobalState().rulesGraph.unregister(this.id)
  }
}
