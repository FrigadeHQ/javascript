import {
  FlowActionType,
  FlowStateDTO,
  FlowStates,
  FlowStep,
  FlowType,
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
  SKIPPED_STEP,
  STARTED_FLOW,
  STARTED_STEP,
} from '../shared/utils'
import { Fetchable } from '../shared/fetchable'
import { CollectionsRegistryCallback } from './collections'

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
   * The type of the Flow such as `TOUR` or `CHECKLIST`.
   */
  public type: FlowType
  /**
   * @ignore Internal use only.
   * Props to pass through to the Flow Component in the React SDK.
   */
  public props?: Record<string, unknown> = {}
  /**
   * The raw metadata of the Flow. Contains all properties defined in the Flow's YAML config as well as the current state of the Flow.
   * Generally this should only be used when building custom components to access custom high-level props on the Flow.
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
   * This function will return `false` if the user has already completed or dismissed the Flow or if the user
   * does not match the Flow's targeting/audience.
   */
  get isVisible() {
    return this._isVisible

    // if (this._isVisible === false) {
    //   return false
    // }

    // return this.getGlobalState().collections.isFlowVisible(this.id)
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
    const statefulFlow = clone(overrideStatefulFlow ?? this.getStatefulFlow())

    this.rawData = statefulFlow
    this.title = statefulFlow?.data?.title
    this.subtitle = statefulFlow?.data?.subtitle
    this.type = statefulFlow?.data?.type
    this.props = statefulFlow?.data?.props ?? {}

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

    if (this.getGlobalState().variables[this.id]) {
      this.applyVariablesInternal(this.getGlobalState().variables[this.id] ?? {})
    } else {
      this.applyVariablesInternal({})
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

      const internalComplete = async (
        eventType: 'complete' | 'skip',
        properties?: PropertyPayload,
        optimistic: boolean = true
      ) => {
        const thisStep = this.steps.get(step.id)

        if ((thisStep.$state.completed || thisStep.$state.skipped) && optimistic) {
          // mark the next step started to advance.
          let nextStep: FlowStep | undefined = this.getStepByIndex(thisStep.order + 1)
          while (nextStep && !nextStep.$state.visible) {
            if (nextStep.order === this.steps.size - 1) {
              break
            }
            nextStep = this.getStepByIndex(nextStep.order + 1)
          }
          if (nextStep) {
            // optimistically mark the next step as started
            const copy = clone(this.getGlobalState().flowStates[this.id])
            copy.$state.currentStepId = this.getStepByIndex(thisStep.order + 1).id
            copy.$state.currentStepIndex = thisStep.order + 1
            // mark the next step as started
            copy.data.steps[thisStep.order + 1].$state.started = true

            this.getGlobalState().flowStates[this.id] = copy

            await this.sendFlowStateToAPI(STARTED_STEP, undefined, nextStep.id)

            this.resyncState()
          }

          return
        }

        const isLastStep = this.getCurrentStepOrder() + 1 === this.getNumberOfAvailableSteps()
        const isLastIncompleteStep =
          Array.from(this.steps.values()).filter(
            (step) => step.$state.visible && !step.$state.completed && !step.$state.skipped
          ).length === 1 && isLastStep

        if (optimistic) {
          const copy = clone(this.getGlobalState().flowStates[this.id])

          copy.$state.started = true
          if (eventType == 'complete') {
            copy.data.steps[thisStep.order].$state.completed = true
          } else {
            copy.data.steps[thisStep.order].$state.skipped = true
          }
          copy.data.steps[thisStep.order].$state.started = true
          copy.data.steps[thisStep.order].$state.lastActionAt = new Date()

          if (!isLastStep) {
            const nextStepIndex = this.getNextVisibleStepIndexAfterIndex(thisStep.order)
            if (nextStepIndex !== -1) {
              copy.$state.currentStepId = this.getStepByIndex(nextStepIndex).id
              copy.$state.currentStepIndex = nextStepIndex
              copy.data.steps[nextStepIndex].$state.started = true
            }
          }
          if (isLastIncompleteStep) {
            copy.$state.completed = true
            copy.$state.visible = false
          }

          this.getGlobalState().flowStates[this.id] = copy
          this.resyncState()

          if (isLastIncompleteStep) {
            this.optimisticallyMarkFlowCompleted()
          }
        }

        await this.sendFlowStateToAPI(
          eventType == 'complete' ? COMPLETED_STEP : SKIPPED_STEP,
          properties,
          thisStep.id
        )
        if (isLastIncompleteStep) {
          await this.sendFlowStateToAPI(COMPLETED_FLOW, properties)
        }
      }

      stepObj.complete = async (properties?: PropertyPayload, optimistic: boolean = true) => {
        await internalComplete('complete', properties, optimistic)
      }

      stepObj.skip = async (properties?: PropertyPayload, optimistic: boolean = true) => {
        await internalComplete('skip', properties, optimistic)
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

    this.resyncState()
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
    const nextStep = this.getStepByIndex(
      this.getNextVisibleStepIndexAfterIndex(this.getCurrentStepIndex())
    )

    if (nextStep) {
      await nextStep.start(properties)
    }
  }

  /**
   * Navigates the flow to the previous step if one exists. This will mark that step started, but will not complete the previous step.
   */
  public async back(properties?: PropertyPayload) {
    // Continue back until a visible step is found
    let previousStep = this.getStepByIndex(this.getCurrentStepIndex() - 1)
    while (previousStep && !previousStep.$state.visible) {
      if (previousStep.order === 0) {
        break
      }
      previousStep = this.getStepByIndex(previousStep.order - 1)
    }

    if (previousStep) {
      await previousStep.start(properties)
    }
  }

  /**
   * Restarts the flow/marks it not started
   */
  public async restart() {
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
   * Gets current step. If the current step is not visible, it will return the first visible step after it.
   * If no steps are visible, it will return undefined.
   */
  public getCurrentStep(): FlowStep | undefined {
    let currentStep = this.steps.get(this.getStatefulFlow().$state.currentStepId)
    if (currentStep) {
      return currentStep
    }
    currentStep = this.getFirstVisibleStep()

    return currentStep
  }

  /**
   * @ignore
   */
  private getFirstVisibleStep() {
    return this.getStepByIndex(this.getNextVisibleStepIndexAfterIndex(-1))
  }

  /**
   * @ignore
   */
  private getNextVisibleStepIndexAfterIndex(index: number): number {
    const steps = Array.from(this.steps.values())
    for (let i = index + 1; i < steps.length; i++) {
      if (steps[i].$state.visible) {
        return i
      }
    }
    return -1
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
   * Returns the current step's order based on the number of available steps.
   * Works similar to getCurrentStepIndex but takes into account hidden steps due to visibilityCriteria.
   */
  public getCurrentStepOrder(): number {
    const currentStep = this.getCurrentStep()
    return Array.from(this.steps.values())
      .filter((step) => step.$state.visible)
      .indexOf(currentStep)
  }

  /**
   * Get the progress of the flow as a number between 0 and 1. Useful when rendering a progress bar.
   */
  public getProgress(): number {
    return (this.getNumberOfCompletedSteps() || 0) / (this.getNumberOfAvailableSteps() || 1)
  }

  /**
   * @ignore
   * @deprecated Use `frigade.on('flow.complete' | 'flow.skip' | 'flow.restart' | 'flow.start', handler)` instead.
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
    this.applyVariablesInternal(variables, true)
  }

  /**
   * @ignore
   */
  private applyVariablesInternal(variables: Record<string, any>, resyncState: boolean = false) {
    // Replace ${variable} with the value of the variable
    const replaceVariables = (str: string) => {
      const matches = str.match(/\${(.*?)}/g)
      if (matches) {
        matches.forEach((match) => {
          const variable = match.replace('${', '').replace('}', '')
          if (!variables[variable]) {
            // set the variable to blank string as it was not found
            str = str.replace(match, '')
            return
          }
          str = str.replace(match, variables[variable])
        })
      }
      return str
    }

    this.title = replaceVariables(this.title ?? '')
    this.subtitle = replaceVariables(this.subtitle ?? '')
    const applyVariablesToStep = (step: any) => {
      if (!step) {
        return
      }

      Object.keys(step).forEach((key) => {
        if (typeof step[key] === 'string') {
          // @ts-ignore
          step[key] = replaceVariables(step[key])
        } else if (typeof step[key] === 'object') {
          applyVariablesToStep(step[key])
        } else if (Array.isArray(step[key])) {
          step[key].forEach((item: any) => {
            applyVariablesToStep(item)
          })
        }
      })
    }

    if (this.steps) {
      this.steps.forEach((step) => {
        try {
          console
          applyVariablesToStep(step)
        } catch (e) {
          // ignore any failures
        }
      })
    }

    this.getGlobalState().variables[this.id] = {
      ...this.getGlobalState().variables[this.id],
      ...variables,
    }

    if (resyncState) {
      this.resyncState()
    }
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

  private async sendFlowStateToAPI(
    action: FlowActionType,
    data?: PropertyPayload,
    stepId?: string
  ) {
    const date = new Date()
    this.getGlobalState().lastFlowSyncDate[this.id] = date
    this.getGlobalState().pendingRequests[this.id] =
      (this.getGlobalState().pendingRequests[this.id] ?? 0) + 1
    const flowStatesRaw: FlowStates = await this.fetch('/v1/public/flowStates', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.getGlobalState().config.userId,
        groupId: this.getGlobalState().config.groupId,
        flowSlug: this.id,
        stepId: stepId,
        data: data ? data : {},
        actionType: action,
        createdAt: date,
        context: getContext(this.getGlobalState()),
      } as FlowStateDTO),
    })
    this.getGlobalState().pendingRequests[this.id] -= 1
    // if a newer request was sent, use that one.
    // except if there are other pending requests
    if (
      date < this.getGlobalState().lastFlowSyncDate[this.id] ||
      this.getGlobalState().pendingRequests[this.id] > 0
    ) {
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

  public register(callback?: CollectionsRegistryCallback) {
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
