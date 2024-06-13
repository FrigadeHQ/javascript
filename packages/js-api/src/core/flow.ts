import {
  FlowActionType,
  FlowStateDTO,
  FlowStates,
  FlowStep,
  FrigadeConfig,
  PropertyPayload,
  StatefulFlow,
  StatefulStep,
} from './types'
import {
  clone,
  cloneFlow,
  COMPLETED_FLOW,
  COMPLETED_STEP,
  getContext,
  NOT_STARTED_FLOW,
  NOT_STARTED_STEP,
  SKIPPED_FLOW,
  STARTED_FLOW,
  STARTED_STEP,
} from '../shared/utils'
import { Fetchable } from '../shared/fetchable'
import { RulesRegistryCallback } from './rules'

export class Flow extends Fetchable {
  /**
   * The Flow's ID.
   */
  public id: string
  /**
   * The Flow's component ID.
   */
  public componentId: string
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

    return this.getGlobalState().collections.isFlowVisible(this.id)
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
        Object.keys(stepObj).forEach((key) => {
          existingStep[key] = stepObj[key]
        })
      }
    })

    if (this.steps && this.steps.size > 0) {
      this.applyVariables(this.getGlobalState().variables[this.id] ?? {})
    }
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

      stepObj.start = async (properties?: PropertyPayload) => {
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

        await this.sendFlowStateToAPI(STARTED_STEP, properties, thisStep.id)
      }

      stepObj.complete = async (properties?: PropertyPayload, optimistic: boolean = true) => {
        const thisStep = this.steps.get(step.id)

        if (thisStep.$state.completed && optimistic) {
          // mark the next step started to advance.
          const nextStep = this.getStepByIndex(thisStep.order + 1)
          if (nextStep) {
            // optimistically mark the next step as started
            const copy = clone(this.getGlobalState().flowStates[this.id])
            copy.$state.currentStepId = this.getStepByIndex(thisStep.order + 1).id
            copy.$state.currentStepIndex = thisStep.order + 1
            // mark the next step as started
            copy.data.steps[thisStep.order + 1].$state.started = true

            this.getGlobalState().flowStates[this.id] = copy

            this.resyncState()
          }

          return
        }

        if (optimistic) {
          const isLastStep = thisStep.order + 1 === this.getNumberOfAvailableSteps()
          const copy = clone(this.getGlobalState().flowStates[this.id])

          copy.$state.started = true
          copy.data.steps[thisStep.order].$state.completed = true
          copy.data.steps[thisStep.order].$state.started = true
          copy.data.steps[thisStep.order].$state.lastActionAt = new Date()

          // If there are more index, advance current step
          if (!isLastStep) {
            copy.$state.currentStepId = this.getStepByIndex(thisStep.order + 1).id
            copy.$state.currentStepIndex = thisStep.order + 1
            // mark the next step as started
            copy.data.steps[thisStep.order + 1].$state.started = true
          }

          if (isLastStep) {
            copy.$state.completed = true
          }

          this.getGlobalState().flowStates[this.id] = copy
          this.resyncState()

          if (isLastStep) {
            this.optimisticallyMarkFlowCompleted()
          }
        }

        await this.sendFlowStateToAPI(COMPLETED_STEP, properties, thisStep.id)
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

        await this.sendFlowStateToAPI(NOT_STARTED_STEP, undefined, thisStep.id)
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
  public async start(properties?: PropertyPayload) {
    if (this.isStarted || this.isCompleted) {
      return
    }
    this.optimisticallyMarkFlowStarted()

    await this.sendFlowStateToAPI(STARTED_FLOW, properties)
  }

  /**
   * Marks the flow completed
   */
  public async complete(properties?: PropertyPayload) {
    if (this.isCompleted) {
      return
    }
    this.optimisticallyMarkFlowCompleted()
    await this.sendFlowStateToAPI(COMPLETED_FLOW, properties)
  }

  /**
   * Marks the flow skipped
   */
  public async skip(properties?: PropertyPayload) {
    if (this.isSkipped) {
      return
    }
    this.optimisticallyMarkFlowSkipped()
    await this.sendFlowStateToAPI(SKIPPED_FLOW, properties)
  }

  /**
   * Navigates the flow to the next step if one exists. This will mark that step started, but will not complete the previous step.
   */
  public async forward(properties?: PropertyPayload) {
    const nextStep = this.getStepByIndex(this.getCurrentStepIndex() + 1)
    if (nextStep) {
      await nextStep.start(properties)
    } else {
      await this.complete(properties)
    }
  }

  /**
   * Navigates the flow to the previous step if one exists. This will mark that step started, but will not complete the previous step.
   */
  public async back(properties?: PropertyPayload) {
    const previousStep = this.getStepByIndex(this.getCurrentStepIndex() - 1)
    if (previousStep) {
      await previousStep.start(properties)
    }
  }

  /**
   * Restarts the flow/marks it not started
   */
  public async restart() {
    this.optimisticallyMarkFlowNotStarted()
    await this.sendFlowStateToAPI(NOT_STARTED_FLOW)
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
    return (
      this.steps.get(this.getStatefulFlow().$state.currentStepId) ??
      this.steps.get(Array.from(this.steps.keys())[0])
    )
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
   * Apply variables to the flow. This will replace any `${variable}` in the title, subtitle, and step fields with the value of the variable.
   * @param variables A record of variables to apply to the flow.
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
  private optimisticallyMarkFlowStarted() {
    const copy = clone(this.getGlobalState().flowStates[this.id])
    copy.$state.started = true
    this.getGlobalState().flowStates[this.id] = copy
    this.resyncState()
  }

  /**
   * @ignore
   */
  private optimisticallyMarkFlowNotStarted() {
    const copy = clone(this.getGlobalState().flowStates[this.id])
    copy.$state.completed = false
    copy.$state.started = false
    copy.$state.visible = true
    copy.$state.currentStepIndex = 0
    copy.$state.currentStepId = this.getStepByIndex(0)?.id
    // clear all step states too
    copy.data.steps.forEach((step) => {
      step.$state = {
        completed: false,
        started: false,
        visible: true,
        blocked: false,
        lastActionAt: undefined,
      }
    })

    this.getGlobalState().flowStates[this.id] = copy
    this.resyncState()
  }

  private async sendFlowStateToAPI(
    action: FlowActionType,
    data?: PropertyPayload,
    stepId?: string
  ) {
    const date = new Date()
    this.getGlobalState().lastSyncDate = date
    this.getGlobalState().pendingRequests += 1
    const flowStatesRaw: FlowStates = await this.fetch('/v1/public/flowStates', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.getGlobalState().config.userId,
        groupId: this.getGlobalState().config.groupId,
        flowSlug: this.id,
        stepId: stepId ?? this.getCurrentStep().id,
        data: data ? data : {},
        actionType: action,
        createdAt: date,
        context: getContext(this.getGlobalState().currentUrl),
      } as FlowStateDTO),
    })
    this.getGlobalState().pendingRequests -= 1
    // if a newer request was sent, use that one.
    // except if there are other pending requests
    if (date < this.getGlobalState().lastSyncDate || this.getGlobalState().pendingRequests > 0) {
      return
    }
    await this.getGlobalState().refreshStateFromAPI(flowStatesRaw)
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

  public register(callback?: RulesRegistryCallback) {
    const globalState = this.getGlobalState()

    globalState.collections.register(this.id, (visible) => {
      const prevFlow = this.getGlobalState().previousFlows.get(this.id)

      if (prevFlow?._isVisible !== visible) {
        // TODO: Store these in a hash so we can grab this flow's handler and call it
        this.getGlobalState().onFlowStateChangeHandlers.forEach((handler) => {
          handler(this, prevFlow)
          this.getGlobalState().previousFlows.set(this.id, cloneFlow(this))
        })
      }

      callback?.(visible)
    })
  }

  public unregister() {
    if (!this.getGlobalState().collections) {
      return
    }
    this.getGlobalState().collections.unregister(this.id)
  }
}
