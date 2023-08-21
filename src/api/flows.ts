import { useCallback, useContext, useEffect } from 'react'
import {
  ABORTED_FLOW,
  COMPLETED_FLOW,
  COMPLETED_STEP,
  NOT_STARTED_FLOW,
  NOT_STARTED_STEP,
  STARTED_FLOW,
  STARTED_STEP,
  StepActionType,
  useCheckHasInitiatedAPI,
  useConfig,
} from './common'
import { FrigadeContext } from '../FrigadeProvider'
import { FlowResponse, useFlowResponses } from './flow-responses'
import useSWR from 'swr'
import { useUserFlowStates } from './user-flow-states'
import { StepData } from '../types'
import { getSubFlowFromCompletionCriteria } from '../shared/completion-util'

export interface Flow {
  id: number
  name: string
  description: string
  data: string
  createdAt: string
  modifiedAt: string
  slug: string
  type: FlowType
  triggerType: TriggerType
  targetingLogic?: string
  active: boolean
}

export enum FlowType {
  CHECKLIST = 'CHECKLIST',
  FORM = 'FORM',
  TOUR = 'TOUR',
  SUPPORT = 'SUPPORT',
  CUSTOM = 'CUSTOM',
  BANNER = 'BANNER',
  EMBEDDED_TIP = 'EMBEDDED_TIP',
  NPS_SURVEY = 'NPS_SURVEY',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
}

export enum TriggerType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export function useFlows() {
  const { config, apiUrl } = useConfig()
  const {
    flows,
    setFlows,
    userId,
    publicApiKey,
    customVariables,
    setCustomVariables,
    hasActiveFullPageFlow,
    setHasActiveFullPageFlow,
    setFlowResponses,
    setShouldGracefullyDegrade,
    readonly,
  } = useContext(FrigadeContext)

  const emptyResponse = {
    data: [],
  }
  const { verifySDKInitiated } = useCheckHasInitiatedAPI()
  const { addResponse, getFlowResponses } = useFlowResponses()
  const fetcher = (url) =>
    fetch(url, config)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        console.log(
          `Error fetching ${url} (${response.status}): ${response.statusText}. .Will gracefully degrade and hide Frigade`
        )
        setShouldGracefullyDegrade(true)
        return emptyResponse
      })
      .catch((error) => {
        console.log(`Error fetching ${url}: ${error}. Will gracefully degrade and hide Frigade`)
        setShouldGracefullyDegrade(true)
        return emptyResponse
      })
  const {
    mutateUserFlowState,
    userFlowStatesData,
    isLoadingUserFlowStateData,
    optimisticallyMarkFlowCompleted,
    optimisticallyMarkFlowNotStarted,
    optimisticallyMarkStepCompleted,
    optimisticallyMarkStepNotStarted,
    optimisticallyMarkStepStarted,
  } = useUserFlowStates()

  const {
    data: flowData,
    error,
    isLoading: isLoadingFlows,
  } = useSWR(publicApiKey ? `${apiUrl}flows${readonly ? `?readonly=true` : ''}` : null, fetcher, {
    keepPreviousData: true,
  })

  useEffect(() => {
    if (error) {
      console.error(error)
      return
    }
    if (flowData && flowData.data) {
      setFlows(flowData.data)
    }
  }, [flowData, error])

  function getFlow(flowId: string): Flow {
    if (isLoadingFlows) {
      return null
    }
    const flow = flows.find((f) => f.slug === flowId)
    if (!flow && flows.length > 0 && !isLoadingUserFlowStateData && !isLoadingFlows) {
      console.log(`Flow with id ${flowId} not found`)
      return null
    }
    if (flow?.active === false) {
      return null
    }
    return flow
  }

  function getFlowSteps(flowId: string): StepData[] {
    if (!getFlow(flowId)) {
      return []
    }
    let flowData = getFlow(flowId).data
    if (!flowData) {
      return []
    }

    flowData = substituteVariables(flowData)

    const steps = JSON.parse(flowData)?.data ?? []

    return steps
      .map((step: StepData) => {
        const autoCalculatedProgress = getStepOptionalProgress(step)
        return {
          handleSecondaryButtonClick: () => {
            if (step.skippable === true) {
              markStepCompleted(flowId, step.id, { skipped: true })
            }
          },
          ...step,
          complete:
            getStepStatus(flowId, step.id) === COMPLETED_STEP || autoCalculatedProgress >= 1,
          blocked: isStepBlocked(flowId, step.id),
          hidden: isStepHidden(flowId, step.id),
          handlePrimaryButtonClick: () => {
            if (
              (!step.completionCriteria &&
                (step.autoMarkCompleted || step.autoMarkCompleted === undefined)) ||
              (step.completionCriteria && step.autoMarkCompleted === true)
            ) {
              markStepCompleted(flowId, step.id)
            }
          },
          progress: autoCalculatedProgress,
        }
      })
      .filter((step: StepData) => !(step.hidden === true))
  }

  function substituteVariables(flowData: string) {
    return flowData.replaceAll(/\${(.*?)}/g, (_, variableName) => {
      if (customVariables[variableName] === undefined) {
        return ''
      }

      return String(customVariables[variableName])
        .replace(/[\u00A0-\u9999<>\&]/g, function (i) {
          return '&#' + i.charCodeAt(0) + ';'
        })
        .replaceAll(/[\\]/g, '\\\\')
        .replaceAll(/[\"]/g, '\\"')
        .replaceAll(/[\/]/g, '\\/')
        .replaceAll(/[\b]/g, '\\b')
        .replaceAll(/[\f]/g, '\\f')
        .replaceAll(/[\n]/g, '\\n')
        .replaceAll(/[\r]/g, '\\r')
        .replaceAll(/[\t]/g, '\\t')
    })
  }

  /**
   * Get high-level props for a flow such as title and subtitle
   * @param slug
   */
  function getFlowMetadata(slug: string): any {
    if (!getFlow(slug)) {
      return []
    }
    let flowData = getFlow(slug).data
    if (!flowData) {
      return []
    }

    flowData = substituteVariables(flowData)

    return JSON.parse(flowData) ?? {}
  }

  function setCustomVariable(key: string, value: string | number | boolean) {
    setCustomVariables((prev) => ({ ...prev, [key]: value }))
  }

  function updateCustomVariables(newCustomVariables?: {
    [key: string]: string | number | boolean
  }) {
    if (
      !isLoadingUserFlowStateData &&
      !isLoadingFlows &&
      newCustomVariables &&
      JSON.stringify(customVariables) !=
      JSON.stringify({ ...customVariables, ...newCustomVariables })
    ) {
      Object.keys(newCustomVariables).forEach((key) => {
        setCustomVariable(key, newCustomVariables[key])
      })
    }
  }

  const markStepStarted = useCallback(
    async (flowId: string, stepId: string, data?: any) => {
      if (!verifySDKInitiated()) {
        return
      }
      const flowResponse = {
        foreignUserId: userId,
        flowSlug: flowId,
        stepId,
        actionType: STARTED_STEP,
        data: data ?? {},
        createdAt: new Date(),
        blocked: false,
        hidden: false,
      }
      if (!shouldSendServerSideCall(flowResponse)) {
        return
      }

      await optimisticallyMarkStepStarted(flowId, stepId, flowResponse)
      addResponse(flowResponse)
    },
    [userId, userFlowStatesData]
  )

  const markStepNotStarted = useCallback(
    async (flowId: string, stepId: string, data?: any) => {
      if (!verifySDKInitiated()) {
        return
      }
      const flowResponse = {
        foreignUserId: userId,
        flowSlug: flowId,
        stepId,
        actionType: NOT_STARTED_STEP,
        data: data ?? {},
        createdAt: new Date(),
        blocked: false,
        hidden: false,
      }

      if (!shouldSendServerSideCall(flowResponse)) {
        return
      }
      await optimisticallyMarkStepNotStarted(flowId, stepId)
      addResponse(flowResponse)
    },
    [userId, userFlowStatesData]
  )

  const markStepCompleted = useCallback(
    async (flowId: string, stepId: string, data?: any) => {
      if (!verifySDKInitiated()) {
        return
      }
      const flowResponse = {
        foreignUserId: userId,
        flowSlug: flowId,
        stepId,
        actionType: COMPLETED_STEP,
        data: data ?? {},
        createdAt: new Date(),
        blocked: false,
        hidden: false,
      }
      if (!shouldSendServerSideCall(flowResponse)) {
        return
      }
      await optimisticallyMarkStepCompleted(flowId, stepId, flowResponse)
      addResponse(flowResponse)
    },
    [userId, userFlowStatesData]
  )

  const markFlowNotStarted = useCallback(
    async (flowId: string, data?: any) => {
      if (!verifySDKInitiated()) {
        return
      }
      if (getFlowStatus(flowId) === NOT_STARTED_FLOW) {
        return
      }
      const flowResponse = {
        foreignUserId: userId,
        flowSlug: flowId,
        stepId: 'unknown',
        actionType: NOT_STARTED_FLOW,
        data: data ?? {},
        createdAt: new Date(),
        blocked: false,
        hidden: false,
      }

      await optimisticallyMarkFlowNotStarted(flowId)

      if (!shouldSendServerSideCall(flowResponse)) {
        return
      }
      addResponse(flowResponse)
    },
    [userId, userFlowStatesData]
  )

  const markFlowStarted = useCallback(
    async (flowId: string, data?: any) => {
      if (!verifySDKInitiated()) {
        return
      }
      const flowResponse = {
        foreignUserId: userId,
        flowSlug: flowId,
        stepId: 'unknown',
        actionType: STARTED_FLOW,
        data: data ?? {},
        createdAt: new Date(),
        blocked: false,
        hidden: false,
      }
      if (!shouldSendServerSideCall(flowResponse)) {
        return
      }
      addResponse(flowResponse)
    },
    [userId, userFlowStatesData]
  )

  const markFlowCompleted = useCallback(
    async (flowId: string, data?: any) => {
      if (!verifySDKInitiated()) {
        return
      }
      const flowResponse = {
        foreignUserId: userId,
        flowSlug: flowId,
        stepId: 'unknown',
        actionType: COMPLETED_FLOW,
        data: data ?? {},
        createdAt: new Date(),
        blocked: false,
        hidden: false,
      }
      if (!shouldSendServerSideCall(flowResponse)) {
        return
      }

      await optimisticallyMarkFlowCompleted(flowId)
      addResponse(flowResponse)
    },
    [userId, userFlowStatesData]
  )

  const markFlowAborted = useCallback(
    async (flowId: string, data?: any) => {
      if (!verifySDKInitiated()) {
        return
      }
      const flowResponse = {
        foreignUserId: userId,
        flowSlug: flowId,
        stepId: 'unknown',
        actionType: ABORTED_FLOW,
        data: data ?? {},
        createdAt: new Date(),
        blocked: false,
        hidden: false,
      }
      if (!shouldSendServerSideCall(flowResponse)) {
        return
      }
      await optimisticallyMarkFlowCompleted(flowId)
      addResponse(flowResponse)
    },
    [userId, userFlowStatesData]
  )

  function shouldSendServerSideCall(flowResponse: FlowResponse) {
    if (!userFlowStatesData && flowResponse.actionType === NOT_STARTED_STEP) {
      return false
    }
    if (userFlowStatesData) {
      const flowState = userFlowStatesData.find((state) => state.flowId === flowResponse.flowSlug)
      if (
        flowResponse.actionType === NOT_STARTED_STEP &&
        (!flowState?.stepStates[flowResponse.stepId] ||
          flowState.stepStates[flowResponse.stepId].actionType === NOT_STARTED_STEP)
      ) {
        return false
      }
      if (
        flowState &&
        flowState.stepStates[flowResponse.stepId]?.actionType === flowResponse.actionType
      ) {
        return false
      }
      if (
        flowState &&
        flowState.flowState === COMPLETED_FLOW &&
        flowResponse.actionType === COMPLETED_FLOW
      ) {
        return false
      }
    }

    return true
  }

  function getStepStatus(flowId: string, stepId: string): StepActionType | null {
    const maybeFlowResponse = getStepStateForFlow(flowId, stepId)

    if (isLoadingUserFlowStateData) {
      return null
    }

    return (maybeFlowResponse ? maybeFlowResponse.actionType : NOT_STARTED_STEP) as StepActionType
  }

  function isStepBlocked(flowId: string, stepId: string): boolean {
    const maybeFlowResponse = getStepStateForFlow(flowId, stepId)

    if (!maybeFlowResponse) {
      return false
    }

    return maybeFlowResponse.blocked
  }

  function isStepHidden(flowId: string, stepId: string): boolean {
    const maybeFlowResponse = getStepStateForFlow(flowId, stepId)

    if (!maybeFlowResponse) {
      return false
    }

    return maybeFlowResponse.hidden
  }

  function getStepStateForFlow(flowId: string, stepId: string): FlowResponse | null {
    if (isLoadingUserFlowStateData) {
      return null
    }

    const flowState = userFlowStatesData?.find((state) => state.flowId === flowId)
    if (!flowState || !flowState.stepStates[stepId]) {
      return null
    }

    return flowState.stepStates[stepId] ?? null
  }

  function getCurrentStep(flowId: string): StepData | null {
    if (isLoadingUserFlowStateData || !userFlowStatesData) {
      return null
    }
    if (getFlowStatus(flowId) === NOT_STARTED_FLOW) {
      return getFlowSteps(flowId)[0] ?? null
    }

    const lastStep = userFlowStatesData.find((f) => f.flowId === flowId)?.lastStepId
    if (lastStep) {
      return getFlowSteps(flowId).find((s) => s.id === lastStep)
    }
    return null
  }

  function getCurrentStepIndex(flowId: string): number {
    const currentStep = getCurrentStep(flowId)
    if (!currentStep) {
      return 0
    }
    const index = getFlowSteps(flowId).findIndex((s) => s.id === currentStep.id) ?? 0
    if (
      getStepStatus(flowId, currentStep.id) === COMPLETED_STEP &&
      index < getFlowSteps(flowId).length - 1
    ) {
      return index + 1
    }
    return index
  }

  function getStepOptionalProgress(step: StepData) {
    if (!step.completionCriteria) return undefined

    const stepSubFlowSlug = getSubFlowFromCompletionCriteria(step.completionCriteria)
    if (stepSubFlowSlug === null) return undefined

    const completed = getNumberOfStepsCompleted(stepSubFlowSlug)
    const total = getNumberOfSteps(stepSubFlowSlug)

    return total === 0 ? undefined : completed / total
  }

  function getFlowStatus(flowId: string) {
    const userFlowState = userFlowStatesData?.find((f) => f.flowId === flowId)
    if (!userFlowState) {
      return null
    }
    return userFlowState.flowState
  }

  function getNumberOfStepsCompleted(flowId: string): number {
    const steps = getFlowSteps(flowId)
    if (steps.length === 0) {
      return 0
    }

    const completedSteps = steps.filter((s) => getStepStatus(flowId, s.id) === COMPLETED_STEP)

    return completedSteps.length
  }

  function getNumberOfSteps(flowId: string) {
    return getFlowSteps(flowId).length
  }

  function getFlowData(flowId: string): any {
    const maybeFlow = flows.find((f) => f.slug === flowId)
    if (!maybeFlow) {
      return null
    }
    return JSON.parse(maybeFlow.data)
  }

  function targetingLogicShouldHideFlow(flow: Flow) {
    if (readonly) {
      return false
    }
    if (isLoadingUserFlowStateData) {
      return true
    }
    if (flow?.targetingLogic && userFlowStatesData) {
      // Iterate through matching userFlowState for the flow and if shouldTrigger is true, return false
      const matchingUserFlowState = userFlowStatesData.find((ufs) => ufs.flowId === flow.slug)
      if (matchingUserFlowState) {
        return matchingUserFlowState.shouldTrigger === false
      }
    }
    if (flow?.targetingLogic && userId && userId.startsWith('guest_')) {
      return true
    }

    return false
  }

  function isFlowAvailableToUser(flowId: string) {
    return !targetingLogicShouldHideFlow(getFlow(flowId))
  }

  function refresh() {
    if (userId) {
      mutateUserFlowState()
    }
  }

  return {
    getFlow,
    getFlowData,
    isLoading: isLoadingUserFlowStateData || isLoadingFlows,
    getStepStatus,
    getFlowSteps,
    getCurrentStepIndex,
    markStepStarted,
    markStepCompleted,
    markFlowNotStarted,
    markFlowStarted,
    markFlowCompleted,
    markFlowAborted,
    markStepNotStarted,
    getFlowStatus,
    getNumberOfStepsCompleted,
    getNumberOfSteps,
    targetingLogicShouldHideFlow,
    setCustomVariable,
    updateCustomVariables,
    customVariables,
    getStepOptionalProgress,
    getFlowMetadata,
    isStepBlocked,
    isStepHidden,
    hasActiveFullPageFlow,
    setHasActiveFullPageFlow,
    isFlowAvailableToUser,
    refresh,
  }
}
