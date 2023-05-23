import React, { CSSProperties, useEffect } from 'react'
import { useFlows } from '../api/flows'
import { MiniProgressBadge, ProgressBadgeType } from '../components/Checklists/MiniProgressBadge'
import { useFlowOpens } from '../api/flow-opens'
import { DefaultFrigadeFlowProps } from '../types'
import { COMPLETED_FLOW } from '../api/common'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import { useTheme } from '../hooks/useTheme'
import { FullWidthProgressBadge } from '../components/Checklists/FullWidthProgressBadge'

interface FrigadeProgressBadgeProps extends DefaultFrigadeFlowProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  textStyle?: CSSProperties
  onClick?: () => void
  hideOnFlowCompletion?: boolean
  type?: ProgressBadgeType
}

export const FrigadeProgressBadge: React.FC<FrigadeProgressBadgeProps> = ({
  flowId,
  title,
  subtitle,
  icon,
  style,
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
    updateCustomVariables,
  } = useFlows()
  const { mergeAppearanceWithDefault } = useTheme()

  appearance = mergeAppearanceWithDefault(appearance)

  const { setOpenFlowState, getOpenFlowState } = useFlowOpens()

  useEffect(() => {
    updateCustomVariables(customVariables)
  }, [customVariables, isLoading])

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

  if (type === 'full-width') {
    return (
      <>
        <RenderInlineStyles appearance={appearance} />
        <FullWidthProgressBadge
          title={title}
          subtitle={subtitle}
          count={completedCount}
          total={steps.length}
          style={style}
          className={className}
          appearance={appearance}
          icon={icon}
          onClick={() => {}}
        />
      </>
    )
  }

  return (
    <>
      <RenderInlineStyles appearance={appearance} />
      <MiniProgressBadge
        count={completedCount}
        total={steps.length}
        title={title}
        style={style}
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
