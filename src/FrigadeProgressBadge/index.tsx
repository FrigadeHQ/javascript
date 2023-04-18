import React, { CSSProperties, useEffect } from 'react'
import { useFlows } from '../api/flows'
import { ProgressBadge, ProgressBadgeType } from '../components/Checklists/ProgressBadge'
import { useFlowOpens } from '../api/flow-opens'
import { DefaultFrigadeFlowProps } from '../types'
import { COMPLETED_FLOW } from '../api/common'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import { useTheme } from '../hooks/useTheme'

interface FrigadeProgressBadgeProps extends DefaultFrigadeFlowProps {
  title: string
  primaryColor?: string
  secondaryColor?: string
  textStyle?: CSSProperties
  onClick?: () => void
  hideOnFlowCompletion?: boolean
  type?: ProgressBadgeType
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
  type = 'default',
}) => {
  const {
    getFlow,
    getFlowSteps,
    getFlowStatus,
    getNumberOfStepsCompleted,
    isLoading,
    targetingLogicShouldHideFlow,
    setCustomVariable,
    customVariables: existingCustomVariables,
  } = useFlows()
  const { mergeAppearanceWithDefault } = useTheme()

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

  if (hideOnFlowCompletion === true && getFlowStatus(flowId) === COMPLETED_FLOW) {
    return null
  }

  const steps = getFlowSteps(flowId)
  const completedCount = getNumberOfStepsCompleted(flowId)

  return (
    <>
      <RenderInlineStyles appearance={appearance} />
      <ProgressBadge
        count={completedCount}
        total={steps.length}
        title={title}
        style={style}
        textStyle={textStyle}
        onClick={() => {
          setOpenFlowState(flowId, true)
          if (onClick) {
            onClick()
          }
        }}
        type={type}
        className={className}
        appearance={appearance}
      />
    </>
  )
}
