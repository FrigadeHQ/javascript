import { useCallback, useContext, useEffect } from 'react'
import {
  COMPLETED_FLOW,
  COMPLETED_STEP,
  fetchRetry,
  NOT_STARTED_FLOW,
  NOT_STARTED_STEP,
  SKIPPED_FLOW,
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
import { safeParse } from '../shared/parse'

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
    organizationId,
    publicApiKey,
    customVariables,
    setCustomVariables,
    hasActiveFullPageFlow,
    setHasActiveFullPageFlow,
    setFlowResponses,
    setShouldGracefullyDegrade,
    shouldGracefullyDegrade,
    readonly,
    flowDataOverrides,
    debug,
  } = useContext(FrigadeContext)

  const emptyResponse = {
    data: [],
  }
  const { verifySDKInitiated } = useCheckHasInitiatedAPI()
  const { addResponse, getFlowResponses } = useFlowResponses()
  const fetcher = (url) =>
    fetchRetry(url, 100, 2, config)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        console.log(
          `Error fetching ${url} (${response.status}): ${response.statusText}. Will gracefully degrade and hide Frigade`
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
    optimisticallyMarkFlowSkipped,
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
      if (debug) {
        console.log(`Flow with id ${flowId} not found`)
      }
      return null
    }
    if (flow && flowDataOverrides && flowDataOverrides[flowId]) {
      flow.data = flowDataOverrides[flowId]
    }
    if (flow?.active === false && !readonly) {
      return null
    }
    return flow
  }

  function getFlowSteps(flowId: string): StepData[] {
    if (!getFlow(flowId)) {
      return []
    }
    let flowData = getFlow(flowId)?.data
    if (!flowData) {
      return []
    }

    flowData = substituteVariables(flowData)

    const steps = safeParse<any>(flowData)?.data ?? safeParse<any>(flowData)?.steps ?? []

    return steps
      .map((step: StepData) => {
        const autoCalculatedProgress = getStepOptionalProgress(step)
        let returnData = {
          handleSecondaryButtonClick: () => {
            if (step.skippable === true) {
              markStepCompleted(flowId, step.id, { skipped: true })
            }
          },
          ...step,
          complete:
            getStepStatus(flowId, step.id) === COMPLETED_STEP || autoCalculatedProgress >= 1,
          started:
            getStepStatus(flowId, step.id) === STARTED_STEP ||
            getStepStatus(flowId, step.id) === COMPLETED_STEP,
          currentlyActive: userFlowStatesData?.some(
            (data) => data.flowId == flowId && data.lastStepId === step.id
          ),
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

        if (step.primaryButton && step.primaryButton.title) {
          returnData = {
            ...returnData,
            primaryButtonTitle: step.primaryButton.title,
          }
        }
        if (step.primaryButton && step.primaryButton.uri) {
          returnData = {
            ...returnData,
            primaryButtonUri: step.primaryButton.uri,
          }
        }
        if (step.primaryButton && step.primaryButton.target) {
          returnData = {
            ...returnData,
            primaryButtonUriTarget: step.primaryButton.target,
          }
        }

        if (step.secondaryButton && step.secondaryButton.title) {
          returnData = {
            ...returnData,
            secondaryButtonTitle: step.secondaryButton.title,
          }
        }
        if (step.secondaryButton && step.secondaryButton.uri) {
          returnData = {
            ...returnData,
            secondaryButtonUri: step.secondaryButton.uri,
          }
        }
        if (step.secondaryButton && step.secondaryButton.target) {
          returnData = {
            ...returnData,
            secondaryButtonUriTarget: step.secondaryButton.target,
          }
        }

        return returnData
      })
      .filter((step: StepData) => !(step.hidden === true))
  }

  function substituteVariables(flowData: string) {
    try {
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
    } catch (e) {
      console.debug('Error substituting variables', e)
      return flowData
    }
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
        foreignUserGroupId: organizationId ?? null,
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
    [userId, organizationId, userFlowStatesData]
  )

  const markStepNotStarted = useCallback(
    async (flowId: string, stepId: string, data?: any) => {
      if (!verifySDKInitiated()) {
        return
      }
      const flowResponse = {
        foreignUserId: userId,
        foreignUserGroupId: organizationId ?? null,
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
      await optimisticallyMarkStepNotStarted(flowId, stepId, flowResponse)
      addResponse(flowResponse)
    },
    [userId, organizationId, userFlowStatesData]
  )

  const markStepCompleted = useCallback(
    async (flowId: string, stepId: string, data?: any) => {
      if (!verifySDKInitiated()) {
        return
      }
      const flowResponse = {
        foreignUserId: userId,
        foreignUserGroupId: organizationId ?? null,
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
    [userId, organizationId, userFlowStatesData]
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
        foreignUserGroupId: organizationId ?? null,
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
    [userId, organizationId, userFlowStatesData]
  )

  const markFlowStarted = useCallback(
    async (flowId: string, data?: any) => {
      if (!verifySDKInitiated()) {
        return
      }
      const flowResponse = {
        foreignUserId: userId,
        foreignUserGroupId: organizationId ?? null,
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
    [userId, organizationId, userFlowStatesData]
  )

  const markFlowCompleted = useCallback(
    async (flowId: string, data?: any) => {
      if (!verifySDKInitiated()) {
        return
      }
      const flowResponse = {
        foreignUserId: userId,
        foreignUserGroupId: organizationId ?? null,
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
    [userId, organizationId, userFlowStatesData]
  )

  const markFlowSkipped = useCallback(
    async (flowId: string, data?: any) => {
      if (!verifySDKInitiated()) {
        return
      }
      const flowResponse = {
        foreignUserId: userId,
        foreignUserGroupId: organizationId ?? null,
        flowSlug: flowId,
        stepId: 'unknown',
        actionType: SKIPPED_FLOW,
        data: data ?? {},
        createdAt: new Date(),
        blocked: false,
        hidden: false,
      }
      if (!shouldSendServerSideCall(flowResponse)) {
        return
      }
      await optimisticallyMarkFlowSkipped(flowId)
      addResponse(flowResponse)
    },
    [userId, organizationId, userFlowStatesData]
  )

  function shouldSendServerSideCall(flowResponse: FlowResponse) {
    if (userFlowStatesData === undefined) {
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
        if (
          flowResponse.actionType === COMPLETED_STEP &&
          (!flowResponse.data || JSON.stringify(flowResponse.data) === JSON.stringify({}))
        ) {
          return false
        }
        // Sort flowState.stepDates by createdAt date
        const sortedStepStates = Object.keys(flowState.stepStates).sort((a, b) => {
          const aDate = new Date(flowState.stepStates[a].createdAt)
          const bDate = new Date(flowState.stepStates[b].createdAt)
          return aDate.getTime() - bDate.getTime()
        })

        // Only return false if the newest stepState is the same as the flowResponse
        if (
          flowState.stepStates[sortedStepStates[sortedStepStates.length - 1]].actionType ===
            flowResponse.actionType &&
          flowResponse.stepId === sortedStepStates[sortedStepStates.length - 1]
        ) {
          return false
        }
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
  const getStepStatus = useCallback(
    (flowId: string, stepId: string): StepActionType | null => {
      const maybeFlowResponse = getStepStateForFlow(flowId, stepId)

      if (isLoadingUserFlowStateData) {
        return null
      }

      return (maybeFlowResponse ? maybeFlowResponse.actionType : NOT_STARTED_STEP) as StepActionType
    },
    [userFlowStatesData, isLoadingUserFlowStateData]
  )
  const isStepBlocked = useCallback(
    (flowId: string, stepId: string): boolean => {
      const maybeFlowResponse = getStepStateForFlow(flowId, stepId)

      if (!maybeFlowResponse) {
        return false
      }

      return maybeFlowResponse.blocked
    },
    [userFlowStatesData, isLoadingUserFlowStateData]
  )

  const isStepHidden = useCallback(
    (flowId: string, stepId: string): boolean => {
      const maybeFlowResponse = getStepStateForFlow(flowId, stepId)

      if (!maybeFlowResponse) {
        return false
      }

      return maybeFlowResponse.hidden
    },
    [userFlowStatesData, isLoadingUserFlowStateData]
  )

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

  const getFlowStatus = useCallback(
    (flowId: string) => {
      const userFlowState = userFlowStatesData?.find((f) => f.flowId === flowId)
      if (!userFlowState) {
        return null
      }
      return userFlowState.flowState
    },
    [userFlowStatesData]
  )
  const getNumberOfStepsCompleted = useCallback(
    (flowId: string): number => {
      const steps = getFlowSteps(flowId)
      if (steps.length === 0) {
        return 0
      }

      const completedSteps = steps.filter((s) => getStepStatus(flowId, s.id) === COMPLETED_STEP)

      return completedSteps.length
    },
    [userFlowStatesData, isLoadingUserFlowStateData]
  )

  const getNumberOfSteps = useCallback(
    (flowId: string) => {
      return getFlowSteps(flowId).length
    },
    [userFlowStatesData, isLoadingUserFlowStateData]
  )

  /**
   * Generic method for getting the raw Flow data as a Javascript object.
   * For typescript, pass in T to get the correct type.
   * @param flowId
   */
  const getFlowData = useCallback(
    <T>(flowId: string): T | null => {
      const maybeFlow = flows.find((f) => f.slug === flowId)
      if (!maybeFlow) {
        return null
      }
      if (flowDataOverrides && flowDataOverrides[flowId]) {
        maybeFlow.data = flowDataOverrides[flowId]
      }
      return safeParse<T>(maybeFlow.data)
    },
    [flows, flowDataOverrides]
  )

  const targetingLogicShouldHideFlow = useCallback(
    (flow: Flow) => {
      if (readonly) {
        return false
      }
      if (isLoadingUserFlowStateData) {
        return true
      }
      if (shouldGracefullyDegrade) {
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
    },
    [readonly, isLoadingUserFlowStateData, shouldGracefullyDegrade, userFlowStatesData, userId]
  )

  const isFlowAvailableToUser = useCallback(
    (flowId: string) => {
      const flow = getFlow(flowId)
      if (!flow) {
        return false
      }
      if (flow.active === false) {
        return false
      }
      return !targetingLogicShouldHideFlow(getFlow(flowId))
    },
    [userId, organizationId, userFlowStatesData]
  )

  function refresh() {
    if (userId) {
      mutateUserFlowState()
    }
  }

  function getAllFlows() {
    return flows
  }

  return {
    getAllFlows,
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
    markFlowSkipped,
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
    isDegraded: shouldGracefullyDegrade,
  }
}
