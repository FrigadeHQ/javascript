import React, { CSSProperties, useEffect } from 'react'
import { useFlows } from '../api/flows'
import { ProgressBadge } from '../Checklists/ProgressBadge'
import { useFlowOpens } from '../api/flow-opens'
import { DefaultFrigadeFlowProps, mergeAppearanceWithDefault } from '../types'

interface FrigadeProgressBadgeProps extends DefaultFrigadeFlowProps {
  title: string
  primaryColor?: string
  secondaryColor?: string
  textStyle?: CSSProperties
  onClick?: () => void
  hideOnFlowCompletion?: boolean
}

export const FrigadeProgressBadge: React.FC<FrigadeProgressBadgeProps> = ({
  flowId,
  /**
   * @deprecated Use `appearance` instead
   */
  primaryColor,
  title,
  style,
  /**
   * @deprecated Use `appearance` instead
   */
  textStyle,
  /**
   * @deprecated Use `appearance` instead
   */
  secondaryColor,
  onClick,
  className,
  customVariables,
  hideOnFlowCompletion,
  appearance,
}) => {
  const {
    getFlow,
    getFlowSteps,
    getNumberOfStepsCompleted,
    isLoading,
    targetingLogicShouldHideFlow,
    setCustomVariable,
    customVariables: existingCustomVariables,
  } = useFlows()
  appearance = mergeAppearanceWithDefault(appearance)

  // TODO: Remove onces fields are deleted
  if (primaryColor) {
    appearance.theme.colorPrimary = primaryColor
  }
  if (secondaryColor) {
    appearance.theme.colorSecondary = secondaryColor
  }
  const { setOpenFlowState, getOpenFlowState } = useFlowOpens()

  useEffect(() => {
    if (
      !isLoading &&
      customVariables &&
      JSON.stringify(existingCustomVariables) !=
        JSON.stringify({ ...existingCustomVariables, ...customVariables })
    ) {
      Object.keys(customVariables).forEach((key) => {
        setCustomVariable(key, customVariables[key])
      })
    }
  }, [isLoading, customVariables, setCustomVariable, existingCustomVariables])

  if (isLoading) {
    return null
  }

  const flow = getFlow(flowId)
  if (!flow) {
    return null
  }

  if (targetingLogicShouldHideFlow(flow)) {
    return null
  }

  if (
    hideOnFlowCompletion === true &&
    getNumberOfStepsCompleted(flowId) === getFlowSteps(flowId).length
  ) {
    return null
  }

  const steps = getFlowSteps(flowId)
  const completedCount = getNumberOfStepsCompleted(flowId)

  return (
    <ProgressBadge
      count={completedCount}
      total={steps.length}
      title={title}
      style={style}
      primaryColor={appearance.theme.colorPrimary}
      secondaryColor={appearance.theme.colorSecondary}
      textStyle={textStyle}
      onClick={() => {
        setOpenFlowState(flowId, true)
        if (onClick) {
          onClick()
        }
      }}
      className={className}
    />
  )
}
