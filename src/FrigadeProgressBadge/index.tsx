import React, { CSSProperties } from 'react'
import { useFlows } from '../api/flows';
import { ProgressBadge } from "../Checklists/ProgressBadge";

interface FrigadeProgressBadgeProps {
  flowId: string
  title: string
  style?: CSSProperties
  primaryColor?: string
  secondaryColor?: string
  textStyle?: CSSProperties
  onClick?: () => void
}

export const FrigadeProgressBadge: React.FC<FrigadeProgressBadgeProps> = ({ flowId, primaryColor, title, style, textStyle, secondaryColor, onClick }) => {

  const {
    getFlow,
    getFlowSteps,
    getNumberOfStepsCompleted,
    isLoading,
  } = useFlows()

  if (isLoading) {
    return null
  }

  const flow = getFlow(flowId)
  if (!flow) {
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
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      textStyle={textStyle}
      onClick={onClick}
    />
  )
}