import React, { useState, FC } from 'react'
import { Button } from '../../components/Button'
import { CheckBox } from '../../components/CheckBox'
import { Chevron } from '../../components/Icons/Chevron'
import { StepData } from '../../types'
import { ProgressBar } from '../Checklist/Progress'
import { ModalChecklistProps } from '../ModalChecklist/ModalChecklist'
import { StepItemSelectedIndicator } from '../HeroChecklist/styled'
import { motion } from 'framer-motion'
import { 
  ChecklistSubtitle,
  ChecklistTitle,
  HeaderContent,
  StepsContainer,
  StepsHeader,
  StepsTitle,
  StepContainer,
  StepsBody,
  StepListContainer,
  StepTitle,
  StepSubtitle,
  MultipleButtonContainer,
  ScrollContainer,

  StepListItem,
  StepListStepName,
  StepListItemRight,
  ProgressBarContainer,
  ContainerStyle

} from './styled'
import { CenterVertical } from '../../components/styled'
import { Modal } from '../../components/Modal'
import Guide, { GuideStepData } from '../../Guides/Guide'
import { getClassName } from '../../shared/appearance'


// TODO: Create common Checlist props interface to extend
export interface ChecklistWithGuideProps extends ModalChecklistProps {
  
  // Map from string to function with StepData returning React.ReactNode
  // TODO: Move to common Checlist props interface
  customStepTypes?: Map<string, (stepData: StepData) => React.ReactNode>
  visible: boolean
  stepsTitle: string
  secondaryColor?: string

  guideData?: GuideStepData[]
  guideTitle?: string
}


const ChecklistWithGuide: FC<ChecklistWithGuideProps> = ({
  steps,
  title,
  subtitle,
  stepsTitle,
  primaryColor,
  secondaryColor,

  visible,
  onClose,

  selectedStep,
  setSelectedStep,
  customStepTypes,

  appearance,

  guideData,
  guideTitle,
}) => {

  const DefaultStepContent = ({ stepData, handleSecondaryCTAClick, handleCTAClick }) => {

    if(!stepData) return <></>

    return (
      <StepContainer className={getClassName('checklistStepContainer', appearance)} data-testid='checklistStepContainer'>
        <StepTitle className={getClassName('checklistStepTitle', appearance)}>{stepData.title}</StepTitle>
        <StepSubtitle className={getClassName('checklistStepSubtitle', appearance)}>{stepData.subtitle}</StepSubtitle>
        <MultipleButtonContainer>
          {stepData.secondaryButtonTitle && (
            <Button
              className={getClassName('checklistStepSecondaryButton', appearance)}
              title={stepData.secondaryButtonTitle}
              onClick={handleSecondaryCTAClick}
              style={{ borderColor: '#D9D9D9', width: 'auto', backgroundColor: '#FFFFFF', borderRadius: '30px' }}
              textStyle={{ color: '#434343' }}
            />
          )}
          <Button
            className={getClassName('checklistStepPrimaryButton', appearance)}
            title={stepData.primaryButtonTitle}
            onClick={handleCTAClick}
            style={{
              backgroundColor: primaryColor,
              borderColor: primaryColor,
              borderRadius: '30px',
              width: 'auto',
              marginLeft: '12px',
            }}
          />
        </MultipleButtonContainer>
      </StepContainer>
    )
  }

  const DEFAULT_CUSTOM_STEP_TYPES = {
    'default':
    (stepData: StepData) => {
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
        <DefaultStepContent stepData={stepData} handleCTAClick={handleCTAClick} handleSecondaryCTAClick={handleSecondaryCTAClick} />
      )
    },
  }

  const mergedCustomStepTypes = { ...DEFAULT_CUSTOM_STEP_TYPES, ...customStepTypes }

  const [selectedStepInternal, setSelectedStepInternal] = useState(0)

  const selectedStepValue = selectedStep ?? selectedStepInternal
  const setSelectedStepValue = setSelectedStep ?? setSelectedStepInternal

  const StepContent = () => {
    if(!steps) return <></>
    if (!steps[selectedStepValue]?.type || !mergedCustomStepTypes[steps[selectedStepValue].type]) {
      return mergedCustomStepTypes['default'](steps[selectedStepValue])
    }
    return mergedCustomStepTypes[steps[selectedStepValue].type]({
      stepData: steps[selectedStepValue],
      primaryColor: primaryColor,
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
      <HeaderContent>
        <ChecklistTitle className={getClassName('checklistTitle', appearance)}>{title}</ChecklistTitle>
        <ChecklistSubtitle className={getClassName('checklistSubtitle', appearance)}>{subtitle}</ChecklistSubtitle>
      </HeaderContent>

      <ScrollContainer>
        <StepsContainer className={getClassName('stepsContainer', appearance)}>
          <StepsHeader>
            <div style={{flex: 3}}>
              <StepsTitle>{stepsTitle}</StepsTitle>
            </div>
            <ProgressBarContainer>
              <ProgressBar fillColor={primaryColor} style={{ width: '100%' }} count={completeCount} total={steps.length} />
            </ProgressBarContainer>
          </StepsHeader>
          <StepsBody>
            <StepListContainer className={getClassName('checklistStepListContainer', appearance)}>
              {
                  steps.map((stepData: StepData, idx: number) => {
                    const isSelected = selectedStepValue === idx;
                    return (
                      <StepListItem selected={isSelected}
                        className={getClassName(`checklistStepListItem${isSelected ? 'Selected' : ''}`, appearance)}
                        key={`checklist-guide-step-${stepData.id ?? idx}`}
                        onClick={() => {
                          setSelectedStepValue(idx)
                        }}>
                        {isSelected && (
                          <StepItemSelectedIndicator
                            className={getClassName('checklistStepItemSelectedIndicator', appearance)}
                            as={motion.div}
                            layoutId="checklist-step-selected"
                            style={{ backgroundColor: primaryColor, borderRadius: 0, height: '100%', top: '0%', width: '2px'}}
                          ></StepItemSelectedIndicator>
                        )}
                        <StepListStepName
                          selected={isSelected} 
                          className={getClassName(`checklistStepListStepName${isSelected ? 'Selected' : ''}`, appearance)}>
                          {stepData.stepName}
                        </StepListStepName>
                        <StepListItemRight>
                          <CheckBox
                            value={stepData.complete}
                            type='round'
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            progress={stepData.progress}
                          />
                          <CenterVertical>
                            <Chevron style={{ marginLeft: '10px' }} color={appearance?.styleOverrides?.iconColor}/>
                          </CenterVertical>
                        </StepListItemRight>
                      </StepListItem>
                    )
                  })
                }
            </StepListContainer>
            
            <StepContent />
          </StepsBody>
        </StepsContainer>
        {
            guideData && guideData.length > 0 && (
              <Guide
                steps={guideData}
                title={guideTitle}
                primaryColor={primaryColor}
                style={{
                  border: 'none',
                  boxShadow: 'none'
                }}
                appearance={appearance}
              />
            )
          }
      </ScrollContainer>
    </Modal>
  )
}

export default ChecklistWithGuide