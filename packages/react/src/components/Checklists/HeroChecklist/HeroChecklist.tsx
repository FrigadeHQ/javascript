import React, { FC, useState } from 'react'

import styled from 'styled-components'
import { StepChecklistItem } from './StepChecklistItem'
import { ProgressBar } from '../Checklist/ProgressBar'
import { Appearance, DefaultFrigadeFlowProps, StepData } from '../../../types'
import {
  HERO_STEP_CONTENT_TYPE,
  HeroStepContent,
} from '../../checklist-step-content/HeroStepContent'
import { VIDEO_CAROUSEL_TYPE, VideoCarousel } from '../../checklist-step-content/VideoCarousel'
import {
  CODE_SNIPPET_CONTENT_TYPE,
  CodeSnippetContent,
} from '../../checklist-step-content/CodeSnippetContent'
import { useTheme } from '../../../hooks/useTheme'
import { FrigadeChecklistProps } from '../../../FrigadeChecklist'
import { getClassName, styleOverridesToCSS } from '../../../shared/appearance'

export interface HeroChecklistProps extends Omit<DefaultFrigadeFlowProps, 'flowId'> {
  title?: string
  subtitle?: string
  /**
   * @deprecated Use `appearance` instead
   * @ignore
   */
  primaryColor?: string
  /** @ignore */
  steps?: StepData[]

  /** @ignore */
  selectedStep?: number
  /** @ignore */
  setSelectedStep?: (index: number) => void

  /**
   * Map of custom step types that the checklist supports. To use a custom steps in your checklist, see [Component Customization](/component/customization#customizing-frigade-components)
   */
  customStepTypes?: Record<
    string,
    ((stepData: StepData, appearance: Appearance) => React.ReactNode) | React.ReactNode
  >
}

const HeroChecklistContainer = styled.div<{ appearance }>`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  min-width: ${(props) => (props.type != 'modal' ? '600px' : '100%')};
  background: ${(props) => props.appearance?.theme.colorBackground};
  border-radius: ${(props) => props.appearance?.theme.borderRadius}px;
  ${(props) => styleOverridesToCSS(props)}
`

const HeroChecklistTitle = styled.h1<{ appearance }>`
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.36px;
  color: ${(props) => props.appearance?.theme?.colorText};
`

const HeroChecklistSubtitle = styled.h2`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0.28px;
  color: ${(props) => props.appearance?.theme?.colorTextSecondary};
  margin: 10px 0px 0px 0px;
`

const ChecklistHeader = styled.div``

const ChecklistStepsContainer = styled.div`
  list-style: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  min-width: 300px;
`

const Divider = styled.div`
  width: 1px;
  margin-right: 40px;
  background: ${(props) => props.appearance?.theme?.colorBorder};
`

const HeroChecklistStepContentContainer = styled.div`
  flex: 2;
  padding: 40px 40px 40px 0px;
`

const HeroChecklist: FC<FrigadeChecklistProps> = ({
  title,
  subtitle,
  steps = [],
  style = {},
  selectedStep,
  setSelectedStep,
  className = '',
  customStepTypes = new Map(),
  appearance,
  type,
}) => {
  const { mergeAppearanceWithDefault } = useTheme()
  appearance = mergeAppearanceWithDefault(appearance)

  const DEFAULT_CUSTOM_STEP_TYPES = {
    [HERO_STEP_CONTENT_TYPE]: HeroStepContent,
    [VIDEO_CAROUSEL_TYPE]: VideoCarousel,
    [CODE_SNIPPET_CONTENT_TYPE]: CodeSnippetContent,
  }

  const mergedCustomStepTypes = {
    ...DEFAULT_CUSTOM_STEP_TYPES,
    ...customStepTypes,
  }

  const [selectedStepInternal, setSelectedStepInternal] = useState(0)

  const selectedStepValue = selectedStep ?? selectedStepInternal
  const setSelectedStepValue = setSelectedStep ?? setSelectedStepInternal

  const completeCount = steps.filter((s) => s.complete === true).length

  const StepContent = () => {
    if (!steps[selectedStepValue]?.type || !mergedCustomStepTypes[steps[selectedStepValue].type]) {
      return mergedCustomStepTypes[HERO_STEP_CONTENT_TYPE]({
        stepData: steps[selectedStepValue],
        appearance: appearance,
      })
    }

    // Check if the custom step type is a functional component or a React component
    if (typeof mergedCustomStepTypes[steps[selectedStepValue].type] !== 'function') {
      return mergedCustomStepTypes[steps[selectedStepValue].type]
    }

    return mergedCustomStepTypes[steps[selectedStepValue].type]({
      stepData: steps[selectedStepValue],
      appearance: appearance,
    })
  }

  return (
    <HeroChecklistContainer
      type={type}
      styleOverrides={style}
      className={className}
      appearance={appearance}
    >
      <ChecklistHeader style={{ flex: 1 }}>
        <ChecklistHeader
          style={{ padding: '28px 0px 28px 28px', borderBottom: '1px solid #E5E5E5' }}
        >
          <HeroChecklistTitle
            className={getClassName('checklistTitle', appearance)}
            appearance={appearance}
          >
            {title}
          </HeroChecklistTitle>
          <HeroChecklistSubtitle
            className={getClassName('checklistSubtitle', appearance)}
            appearance={appearance}
          >
            {subtitle}
          </HeroChecklistSubtitle>
          <ProgressBar
            total={steps.length}
            count={completeCount}
            style={{ marginTop: '24px', paddingRight: `40px` }}
            appearance={appearance}
          />
        </ChecklistHeader>
        <ChecklistStepsContainer className={getClassName('checklistStepsContainer', appearance)}>
          {steps.map((s: StepData, idx: number) => {
            return (
              <StepChecklistItem
                data={s}
                index={idx}
                key={idx}
                listLength={steps.length}
                isSelected={idx === selectedStepValue}
                primaryColor={appearance.theme.colorPrimary}
                style={{ justifyContent: 'space-between' }}
                onClick={() => {
                  setSelectedStepValue(idx)
                }}
                appearance={appearance}
              />
            )
          })}
        </ChecklistStepsContainer>
      </ChecklistHeader>
      <Divider appearance={appearance} className={getClassName('checklistDivider', appearance)} />
      <HeroChecklistStepContentContainer>
        <StepContent />
      </HeroChecklistStepContentContainer>
    </HeroChecklistContainer>
  )
}

export default HeroChecklist
