import React, { FC, useState } from 'react'
import { Button } from '../../components/Button'
import { CheckBox } from '../../components/CheckBox'
import { Chevron } from '../../components/Icons/Chevron'
import { StepData } from '../../types'
import { ProgressBar } from '../Checklist/Progress'
import { StepItemSelectedIndicator } from '../HeroChecklist/styled'
import { motion } from 'framer-motion'
import {
  ChecklistContainer,
  ChecklistSubtitle,
  ChecklistTitle,
  ContainerStyle,
  HeaderContent,
  MultipleButtonContainer,
  ProgressBarContainer,
  ScrollContainer,
  StepContainer,
  StepListContainer,
  StepListItem,
  StepListItemRight,
  StepListStepName,
  StepsBody,
  StepsContainer,
  StepsHeader,
  StepsTitle,
  StepSubtitle,
  StepTitle,
} from './styled'
import { CenterVertical } from '../../components/styled'
import { Modal } from '../../components/Modal'
import Guide, { GuideStepData } from '../../Guides/Guide'
import { getClassName } from '../../shared/appearance'
import { ChecklistProps } from '..'

export interface ChecklistWithGuideProps extends ChecklistProps {
  // Map from string to function with StepData returning React.ReactNode
  visible: boolean
  stepsTitle: string

  /**
   * @deprecated Use `appearance` instead
   */
  secondaryColor?: string

  guideData?: GuideStepData[]
  guideTitle?: string

  onGuideButtonClick?: (stepData: StepData) => void
}

const ChecklistWithGuide: FC<ChecklistWithGuideProps> = ({
  steps,
  title,
  subtitle,
  stepsTitle,

  visible,
  onClose,

  selectedStep,
  setSelectedStep,
  customStepTypes,

  appearance,

  guideData,
  guideTitle,

  onGuideButtonClick,
}) => {
  const DefaultStepContent = ({ stepData, handleSecondaryCTAClick, handleCTAClick }) => {
    if (!stepData) return <></>

    return (
      <StepContainer
        className={getClassName('checklistStepContainer', appearance)}
        data-testid="checklistStepContainer"
      >
        <StepTitle className={getClassName('checklistStepTitle', appearance)}>
          {stepData.title}
        </StepTitle>
        <StepSubtitle className={getClassName('checklistStepSubtitle', appearance)}>
          {stepData.subtitle}
        </StepSubtitle>
        <MultipleButtonContainer className={getClassName('checklistCTAContainer', appearance)}>
          {stepData.secondaryButtonTitle && (
            <Button
              title={stepData.secondaryButtonTitle}
              onClick={handleSecondaryCTAClick}
              appearance={appearance}
              secondary
            />
          )}
          <Button
            title={stepData.primaryButtonTitle}
            onClick={handleCTAClick}
            appearance={appearance}
          />
        </MultipleButtonContainer>
      </StepContainer>
    )
  }

  const DEFAULT_CUSTOM_STEP_TYPES = {
    default: (stepData: StepData) => {
      if (steps[selectedStepValue]?.StepContent) {
        const Content: React.ReactNode = steps[selectedStepValue].StepContent
        return <div>{Content}</div>
      }
      const currentStep = steps[selectedStepValue]

      const handleCTAClick = () => {
        if (currentStep.handlePrimaryButtonClick) {
          currentStep.handlePrimaryButtonClick()
        }
      }

      const handleSecondaryCTAClick = () => {
        if (currentStep.handleSecondaryButtonClick) {
          currentStep.handleSecondaryButtonClick()
        }
      }

      return (
        <DefaultStepContent
          stepData={stepData}
          handleCTAClick={handleCTAClick}
          handleSecondaryCTAClick={handleSecondaryCTAClick}
        />
      )
    },
  }

  const mergedCustomStepTypes = { ...DEFAULT_CUSTOM_STEP_TYPES, ...customStepTypes }

  const [selectedStepInternal, setSelectedStepInternal] = useState(0)

  const selectedStepValue = selectedStep ?? selectedStepInternal
  const setSelectedStepValue = setSelectedStep ?? setSelectedStepInternal

  const StepContent = () => {
    if (!steps) return <></>
    if (!steps[selectedStepValue]?.type || !mergedCustomStepTypes[steps[selectedStepValue].type]) {
      return mergedCustomStepTypes['default'](steps[selectedStepValue])
    }
    return mergedCustomStepTypes[steps[selectedStepValue].type]({
      stepData: steps[selectedStepValue],
      primaryColor: appearance.theme.colorPrimary,
    })
  }

  const completeCount = steps.filter((s) => s.complete).length

  if (!visible) return <></>

  return (
    <Modal
      onClose={onClose}
      visible={visible}
      style={ContainerStyle}
      closeTint={appearance?.styleOverrides?.iconColor ?? '#8C8C8C'}
      appearance={appearance}
    >
      <ChecklistContainer>
        <HeaderContent>
          <ChecklistTitle
            appearance={appearance}
            className={getClassName('checklistTitle', appearance)}
          >
            {title}
          </ChecklistTitle>
          <ChecklistSubtitle
            appearance={appearance}
            className={getClassName('checklistSubtitle', appearance)}
          >
            {subtitle}
          </ChecklistSubtitle>
        </HeaderContent>

        <ScrollContainer>
          <StepsContainer className={getClassName('stepsContainer', appearance)}>
            <StepsHeader>
              <div style={{ flex: 3 }}>
                <StepsTitle>{stepsTitle}</StepsTitle>
              </div>
              <ProgressBarContainer>
                <ProgressBar
                  fillColor={appearance.theme.colorPrimary}
                  style={{ width: '100%' }}
                  count={completeCount}
                  total={steps.length}
                  appearance={appearance}
                />
              </ProgressBarContainer>
            </StepsHeader>
            <StepsBody>
              <StepListContainer
                className={getClassName('checklistStepListContainer', appearance)}
                appearance={appearance}
              >
                {steps.map((stepData: StepData, idx: number) => {
                  const isSelected = selectedStepValue === idx
                  return (
                    <StepListItem
                      selected={isSelected}
                      className={getClassName(
                        `checklistStepListItem${isSelected ? 'Selected' : ''}`,
                        appearance
                      )}
                      key={`checklist-guide-step-${stepData.id ?? idx}`}
                      disabled={stepData.blocked}
                      onClick={() => {
                        if (stepData.blocked) {
                          return
                        }
                        setSelectedStepValue(idx)
                      }}
                      title={stepData.blocked ? 'Finish remaining steps to continue' : undefined}
                    >
                      {isSelected && (
                        <StepItemSelectedIndicator
                          className={getClassName('checklistStepItemSelectedIndicator', appearance)}
                          as={motion.div}
                          layoutId="checklist-step-selected"
                          style={{
                            backgroundColor: appearance.theme.colorPrimary,
                            borderRadius: 0,
                            height: '100%',
                            top: '0%',
                            width: '2px',
                          }}
                        ></StepItemSelectedIndicator>
                      )}
                      <StepListStepName
                        selected={isSelected}
                        className={getClassName(
                          `checklistStepListStepName${isSelected ? 'Selected' : ''}`,
                          appearance
                        )}
                      >
                        {stepData.stepName}
                      </StepListStepName>
                      <StepListItemRight>
                        <CheckBox
                          value={stepData.complete}
                          type="round"
                          primaryColor={appearance.theme.colorPrimary}
                          progress={stepData.progress}
                        />
                        <CenterVertical>
                          <Chevron
                            style={{ marginLeft: '10px' }}
                            color={appearance.theme.colorBackgroundSecondary}
                          />
                        </CenterVertical>
                      </StepListItemRight>
                    </StepListItem>
                  )
                })}
              </StepListContainer>

              <StepContent />
            </StepsBody>
          </StepsContainer>
          {guideData && guideData.length > 0 && (
            <Guide
              steps={guideData}
              title={guideTitle}
              primaryColor={appearance.theme.colorPrimary}
              style={{
                border: 'none',
                boxShadow: 'none',
              }}
              appearance={appearance}
              onButtonClick={(step) => {
                if (onGuideButtonClick) {
                  onGuideButtonClick(step)
                }
              }}
            />
          )}
        </ScrollContainer>
      </ChecklistContainer>
    </Modal>
  )
}

export default ChecklistWithGuide
