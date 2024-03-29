import { MultipleChoice } from './components/Forms/MultiInputStepType/form-components/MultipleChoice'

export { FrigadeProvider } from './FrigadeProvider'
export { FrigadeHeroChecklist } from './components/HeroChecklist'
export { FrigadeChecklist } from './FrigadeChecklist'
export { FrigadeProgressBadge } from './FrigadeProgressBadge'
export { FrigadeForm } from './FrigadeForm'
export { FrigadeGuide } from './FrigadeGuide'
export { FrigadeTour } from './FrigadeTour'
export { FrigadeSupportWidget } from './FrigadeSupportWidget'
export { FrigadeEmbeddedTip } from './FrigadeEmbeddedTip'
export { FrigadeBanner } from './FrigadeBanner'
export { FrigadeNPSSurvey } from './FrigadeNPSSurvey'
export { FrigadeAnnouncement } from './FrigadeAnnouncement'

export type { BaseTheme as FrigadeTheme } from './types'
export { DefaultAppearance as FrigadeDefaultAppearance } from './types'

export { useFlows, Flow, FlowType } from './api/flows'
export { useFlowOpens } from './api/flow-opens'
export { useFlowResponses, FlowResponse, PublicStepState } from './api/flow-responses'
export { useUser } from './api/users'
export { useOrganization } from './api/organizations'
export { useUserFlowStates } from './api/user-flow-states'

export type { StepData, Appearance } from './types'

export type {
  CustomFormTypeProps,
  FormInputType,
  FormInputProps,
  FormValidationError,
  StepContentProps,
  EntityProperties,
} from './FrigadeForm/types'

export { Label as FormLabel } from './components/Forms/MultiInputStepType/form-components/shared/Label'
export { TextField as FormTextField } from './components/Forms/MultiInputStepType/form-components/TextField'

export { Box } from './components/Box'
export { Button } from './components/Button/TEMP_index'
export { CheckBox } from './components/CheckBox'
export { ProgressRing } from './components/Progress/ProgressRing'
export { Text } from './components/Text'
export { ProgressBar } from './components/Checklists/Checklist/ProgressBar'

export { FrigadeBannerProps } from './FrigadeBanner'
export { FrigadeChecklistProps } from './FrigadeChecklist'
export { FrigadeEmbeddedTipProps } from './FrigadeEmbeddedTip'
export { FrigadeFormProps } from './FrigadeForm'
export { FrigadeTourProps } from './FrigadeTour'
export { FrigadeNPSSurveyProps } from './FrigadeNPSSurvey'
export { FrigadeAnnouncementProps } from './FrigadeAnnouncement'
export { FrigadeProgressBadgeProps } from './FrigadeProgressBadge'

export { MultipleChoice } from './components/Forms/MultiInputStepType/form-components/MultipleChoice'
export {
  MultipleChoiceOption,
  MultipleChoiceProps,
} from './components/Forms/MultiInputStepType/form-components/MultipleChoice'
export { tokens } from './shared/theme'

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str: any, newStr: any) {
    // If a regex pattern
    if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
      return this.replace(str, newStr)
    }

    // If a string
    return this.replace(new RegExp(str, 'g'), newStr)
  }
}
