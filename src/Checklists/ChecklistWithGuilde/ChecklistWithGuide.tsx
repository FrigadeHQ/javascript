import React, { useState, FC } from 'react'
import { Button } from '../../components/Button'
import { CheckBox } from '../../components/CheckBox'
import { Chevron } from '../../components/Icons/Chevron'
import { StepData } from '../../types'
import { ProgressBar } from '../Checklist/Progress'
import { HeroChecklistProps } from '../HeroChecklist'
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

  StepListItem,
  StepListStepName,
  StepListItemRight,
  ProgressBarContainer,
  ContainerStyle

} from './styled'
import { CenterVertical } from '../../components/styled'
import { Modal } from '../../components/Modal'


// TODO: Create common Checlist props interface to extend
interface ChecklistWithGuideProps extends HeroChecklistProps {
  
  // Map from string to function with StepData returning React.ReactNode
  // TODO: Move to common Checlist props interface
  customStepTypes?: Map<string, (stepData: StepData) => React.ReactNode>
  visible: boolean
  stepsTitle: string
  secondaryColor?: string

  onClose: () => void
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
  customStepTypes
}) => {

  const DefaultStepContent = ({ stepData, handleSecondaryCTAClick, handleCTAClick }) => {

    if(!stepData) return <></>

    return (
      <StepContainer>
        <StepTitle>{stepData.title}</StepTitle>
        <StepSubtitle>{stepData.subtitle}</StepSubtitle>
        <MultipleButtonContainer>
          {stepData.secondaryButtonTitle && (
            <Button
              title={stepData.secondaryButtonTitle}
              onClick={handleSecondaryCTAClick}
              style={{ borderColor: '#D9D9D9', width: 'auto', backgroundColor: '#FFFFFF', borderRadius: '30px' }}
              textStyle={{ color: '#434343' }}
            />
          )}
          <Button
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
    >
      <HeaderContent>
        <ChecklistTitle>{title}</ChecklistTitle>
        <ChecklistSubtitle>{subtitle}</ChecklistSubtitle>
      </HeaderContent>


      <StepsContainer>
        <StepsHeader>
          <div style={{flex: 3}}>
            <StepsTitle>{stepsTitle}</StepsTitle>
          </div>
          <ProgressBarContainer>
            <ProgressBar fillColor={primaryColor} style={{width: '100%'}} count={completeCount} total={steps.length} />
          </ProgressBarContainer>
        </StepsHeader>
        <StepsBody>
          <StepListContainer>
            {
                steps.map((stepData: StepData, idx: number) => {
                  const isSelected = selectedStepValue === idx;
                  return (
                    <StepListItem selected={isSelected}
                      onClick={() => {
                        setSelectedStepValue(idx)
                      }}>
                      {isSelected && (
                        <StepItemSelectedIndicator
                          as={motion.div}
                          layoutId="checklist-step-selected"
                          style={{ backgroundColor: primaryColor, borderRadius: 0 }}
                        ></StepItemSelectedIndicator>
                      )}
                      <StepListStepName selected={isSelected}>
                        {stepData.stepName}
                      </StepListStepName>
                      <StepListItemRight>
                        <CheckBox value={stepData.complete} type='round' primaryColor={primaryColor} secondaryColor={secondaryColor}/>
                        <CenterVertical>
                          <Chevron style={{ marginLeft: '10px' }} />
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
    </Modal>
  )
}

export default ChecklistWithGuide