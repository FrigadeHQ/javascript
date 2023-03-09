import React, { CSSProperties, FC } from 'react'
import { Appearance, StepData } from '../types'
import { motion } from 'framer-motion'

import {
  GuideContainer,
  GuideIcon,
  GuideIconWrapper,
  GuideItem,
  GuideItemLink,
  GuideItems,
  GuideItemSubtitle,
  GuideItemTitle,
  GuideTitle,
} from './styled'
import { getClassName } from '../shared/appearance'

export interface GuideStepData extends StepData {
  icon?: string
}

interface GuideProps {
  steps: GuideStepData[]
  title: string
  style?: CSSProperties
  primaryColor?: string
  appearance: Appearance
}

/**
 * A guide is essentially a list of links that does not have a state
 */
const Guide: FC<GuideProps> = ({ steps, style, title, primaryColor, appearance }) => {
  return (
    <GuideContainer style={style} className={getClassName('guideContainer', appearance)}>
      <GuideTitle className={getClassName('guideTitle', appearance)}>{title}</GuideTitle>
      <GuideItems>
        {steps.map((stepData: GuideStepData, idx) => {
          return (
            <GuideItem
              key={`guide-${stepData.id ?? idx}`}
              as={motion.div}
              whileHover={{
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
                transition: { duration: 0.25 },
              }}
              className={getClassName('guideItem', appearance)}
            >
              {stepData.icon && (
                <GuideIconWrapper className={getClassName('guideIcon', appearance)}>
                  <GuideIcon>{stepData.icon}</GuideIcon>
                </GuideIconWrapper>
              )}

              <GuideItemTitle className={getClassName('guideItemTitle', appearance)}>
                {stepData.title}
              </GuideItemTitle>

              <GuideItemSubtitle className={getClassName('guideItemSubtitle', appearance)}>
                {stepData.subtitle}
              </GuideItemSubtitle>

              <GuideItemLink
                className={getClassName('guideIteLink', appearance)}
                color={primaryColor}
                href={stepData.primaryButtonUri}
                target={stepData.primaryButtonUriTarget ?? '_self'}
              >
                {stepData.primaryButtonTitle}
              </GuideItemLink>
            </GuideItem>
          )
        })}
      </GuideItems>
    </GuideContainer>
  )
}

export default Guide
