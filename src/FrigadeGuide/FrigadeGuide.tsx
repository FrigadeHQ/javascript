import React, { FC } from 'react'
import { useFlows } from '../api/flows'
import { Guide } from '../Guides'
import { DefaultFrigadeFlowProps } from '../types'

export interface FrigadeGuideProps extends DefaultFrigadeFlowProps {
  title: string
  primaryColor?: string
}

export const FrigadeGuide: FC<FrigadeGuideProps> = ({ flowId, style, ...props }) => {
  const { getFlow, targetingLogicShouldHideFlow, getFlowSteps } = useFlows()

  const flow = getFlow(flowId)
  if (!flow) {
    return null
  }

  if (targetingLogicShouldHideFlow(flow)) {
    return null
  }

  const steps = getFlowSteps(flowId)

  return <Guide steps={steps} style={style} {...props} />
}
