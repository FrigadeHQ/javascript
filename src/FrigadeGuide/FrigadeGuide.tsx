import React, { CSSProperties, FC } from 'react'
import { useFlows } from '../api/flows'
import { Guide } from '../Guides'

export interface FrigadeGuideProps {
  flowId: string
  title: string
  primaryColor?: string
  style?: CSSProperties
}

export const FrigadeGuide: FC<FrigadeGuideProps> = ({ flowId, style, ...props }) => {

  const {
    getFlow,
    targetingLogicShouldHideFlow,
    getFlowSteps
  } = useFlows()

  const flow = getFlow(flowId)
  if (!flow) {
    return null
  }

  if (targetingLogicShouldHideFlow(flow)) {
    return null
  }

  const steps = getFlowSteps(flowId)

  return (
    <Guide steps={steps} style={style} {...props} />
  )
}