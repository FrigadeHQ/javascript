import React, { CSSProperties, FC } from "react"
import { StepData } from "../types"
import { motion } from "framer-motion";

import {
  GuideContainer,
  GuideItems,
  GuideItem,
  GuideTitle,

  GuideIconWrapper,
  GuideIcon,

  GuideItemTitle,
  GuideItemSubtitle,
  GuideItemLink
} from './styled'


export interface GuideStepData extends StepData {
  icon?: string
}

interface GuideProps {
  steps: GuideStepData[]
  title: string
  style?: CSSProperties
  primaryColor?: string
}

/**
 * A guide is essentially a list of links that does not have a state
 */
const Guide: FC<GuideProps> = ({ steps, style, title, primaryColor }) => {

  return (
    <GuideContainer style={style}>
      <GuideTitle>{title}</GuideTitle>
      <GuideItems>
        {
        steps.map((stepData: GuideStepData, idx) => {
          return (
            <GuideItem
              key={`guide-${stepData.id ?? idx}`}
              as={motion.div}
              whileHover={{
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
                transition: { duration: 0.25 },
              }}
            >
              {
                stepData.icon && (
                  <GuideIconWrapper>
                    <GuideIcon>
                      {stepData.icon}
                    </GuideIcon>
                  </GuideIconWrapper>
                )
              }

              <GuideItemTitle>
                {stepData.title}
              </GuideItemTitle>

              <GuideItemSubtitle>
                {stepData.subtitle}
              </GuideItemSubtitle>

              <GuideItemLink color={primaryColor} href={stepData.primaryButtonUri} target={stepData.primaryButtonUriTarget ?? '_self'}>
                {stepData.primaryButtonTitle}
              </GuideItemLink>
            </GuideItem>
          )
        })
      }
      </GuideItems>
    </GuideContainer>
  )
}

export default Guide