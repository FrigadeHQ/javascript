import * as React from 'react';
import React__default, { CSSProperties, FC, ElementType, ReactNode, ComponentPropsWithoutRef } from 'react';
import { BorderProps, ColorProps, LayoutProps, ShadowProps, SpaceProps, TypographyProps, FontProps } from 'styled-system';
export { useTheme } from 'styled-components';

type StepActionType = 'STARTED_STEP' | 'COMPLETED_STEP' | 'NOT_STARTED_STEP';

interface StepData {
    /**
     * Unique identifier for the step.
     */
    id: string;
    /**
     * Name of the step when shown in a list view
     */
    stepName?: string;
    /**
     * Title of the step
     */
    title?: string;
    /**
     * Subtitle of the step
     */
    subtitle?: string;
    /**
     * Primary button title. If omitted, the primary button will not be shown.
     */
    primaryButtonTitle?: string;
    /**
     * Primary button URI.
     */
    primaryButtonUri?: string;
    /**
     * Primary button URI target (either _blank or _self)
     */
    primaryButtonUriTarget?: string;
    /**
     * Secondary button title. If omitted, the secondary button will not be shown.
     */
    secondaryButtonTitle?: string;
    /**
     * Secondary button URI.
     */
    secondaryButtonUri?: string;
    /**
     * Secondary button URI target (either _blank or _self)
     */
    secondaryButtonUriTarget?: string;
    /**
     * Text on button if a back button is present
     */
    backButtonTitle?: string;
    /**
     * If true, the step will be marked as completed when the secondary button is clicked.
     */
    skippable?: boolean;
    /**
     * @deprecated use primaryButtonUri instead
     */
    url?: string;
    /**
     * @deprecated use primaryButtonUriTarget instead
     */
    urlTarget?: string;
    type?: string;
    /**
     * Video url to be shown for components supporting video.
     */
    videoUri?: string;
    /**
     * Image url to be shown for components supporting image.
     */
    imageUri?: string | null;
    /**
     * Automatically mark the step as completed when the primary button is clicked. Default is false.
     */
    autoMarkCompleted?: boolean;
    complete: boolean;
    /**
     * Whether the step is blocked (can't be accessed yet)
     */
    blocked?: boolean;
    /**
     * Whether the step is hidden (not shown in the list view)
     */
    hidden?: boolean;
    StepContent?: React__default.ReactNode;
    /**
     * Handler for when the primary button is clicked.
     */
    handlePrimaryButtonClick?: () => void;
    /**
     * Handler for when the secondary button is clicked.
     */
    handleSecondaryButtonClick?: () => void;
    ctaActionType?: 'complete';
    imageStyle?: CSSProperties;
    props?: any;
    /**
     * Criteria that needs to be met for the step to complete
     */
    completionCriteria?: string;
    /**
     * Criteria that needs to be met for the step to start
     */
    startCriteria?: string;
    progress?: number;
    /**
     * Whether the step is dismissible (for instance, tooltips or other non-essential steps)
     */
    dismissible?: boolean;
    /**
     * Whether to show a highlight in the page where the step is shown. Typically used in tooltips for creating small pings.
     */
    showHighlight?: boolean;
}
interface DefaultFrigadeFlowProps {
    flowId: string;
    style?: CSSProperties;
    className?: string;
    /**
     * The appearance of the flow. See https://docs.frigade.com/sdk/styling
     */
    appearance?: Appearance;
    /**
     * Dynamic variables to use in flow-data.yml. See https://docs.frigade.com/flows/dynamic-variables
     */
    customVariables?: {
        [key: string]: string | number | boolean;
    };
    hideOnFlowCompletion?: boolean;
    /**
     * Handler for when a step is completed.
     * @param step
     * @param index
     * @param nextStep
     * @param allFormData All form data collected so far (only applicable to FrigadeForms)
     * @param stepSpecificFormData Form data collected for the finished step (only applicable to FrigadeForms)
     */
    onStepCompletion?: (step: StepData, index: number, nextStep?: StepData, allFormData?: any, stepSpecificFormData?: any) => boolean;
    /**
     * Handler for when a primary or secondary CTA is clicked (regardless if step is completed or not).
     * Return true if your app performs an action (e.g. open other modal or page transition).
     * @param step
     * @param index
     * @param cta
     */
    onButtonClick?: (step: StepData, index?: number, cta?: 'primary' | 'secondary' | 'link', nextStep?: StepData) => boolean;
    onDismiss?: () => void;
    onComplete?: () => void;
}
interface Appearance {
    /**
     * Overrides of individual components and classes.
     * This map can either be className(s) or CSSProperties.
     */
    styleOverrides?: {
        [key: string]: CSSProperties | string;
    };
    /**
     * The base theme to use with Frigade components.
     */
    theme?: BaseTheme;
}
interface BaseTheme {
    /**
     * The base theme color used on CTAs and other primary elements.
     */
    colorPrimary?: string;
    /**
     * Secondary color, used for CTAs and other secondary elements.
     */
    colorSecondary?: string;
    colorBackground?: string;
    colorBackgroundSecondary?: string;
    colorText?: string;
    colorTextOnPrimaryBackground?: string;
    colorTextSecondary?: string;
    colorTextDisabled?: string;
    colorTextError?: string;
    colorBorder?: string;
    fontSize?: string | number;
    fontSmoothing?: string;
    fontWeight?: string | number;
    borderRadius?: number;
    modalContainer?: CSSProperties;
}
declare const DefaultAppearance: Appearance;

interface Flow {
    id: number;
    name: string;
    description: string;
    data: string;
    createdAt: string;
    modifiedAt: string;
    slug: string;
    type: FlowType;
    triggerType: TriggerType;
    targetingLogic?: string;
    active: boolean;
}
declare enum FlowType {
    CHECKLIST = "CHECKLIST",
    FORM = "FORM",
    TOUR = "TOUR",
    SUPPORT = "SUPPORT",
    CUSTOM = "CUSTOM",
    BANNER = "BANNER",
    EMBEDDED_TIP = "EMBEDDED_TIP",
    NPS_SURVEY = "NPS_SURVEY"
}
declare enum TriggerType {
    MANUAL = "MANUAL",
    AUTOMATIC = "AUTOMATIC"
}
declare function useFlows(): {
    getFlow: (slug: string) => Flow;
    getFlowData: (flowId: string) => any;
    isLoading: boolean;
    getStepStatus: (flowId: string, stepId: string) => StepActionType | null;
    getFlowSteps: (flowId: string) => StepData[];
    getCurrentStepIndex: (flowId: string) => number;
    markStepStarted: (flowId: string, stepId: string, data?: any) => Promise<void>;
    markStepCompleted: (flowId: string, stepId: string, data?: any) => Promise<void>;
    markFlowNotStarted: (flowId: string, data?: any) => Promise<void>;
    markFlowStarted: (flowId: string, data?: any) => Promise<void>;
    markFlowCompleted: (flowId: string, data?: any) => Promise<void>;
    markFlowAborted: (flowId: string, data?: any) => Promise<void>;
    markStepNotStarted: (flowId: string, stepId: string, data?: any) => Promise<void>;
    getFlowStatus: (flowId: string) => "COMPLETED_FLOW" | "STARTED_FLOW" | "NOT_STARTED_FLOW";
    getNumberOfStepsCompleted: (flowId: string) => number;
    getNumberOfSteps: (flowId: string) => number;
    targetingLogicShouldHideFlow: (flow: Flow) => boolean;
    setCustomVariable: (key: string, value: string | number | boolean) => void;
    updateCustomVariables: (newCustomVariables?: {
        [key: string]: string | number | boolean;
    }) => void;
    customVariables: {
        [key: string]: string | number | boolean;
    };
    getStepOptionalProgress: (step: StepData) => number;
    getFlowMetadata: (slug: string) => any;
    isStepBlocked: (flowId: string, stepId: string) => boolean;
    isStepHidden: (flowId: string, stepId: string) => boolean;
    hasActiveFullPageFlow: boolean;
    setHasActiveFullPageFlow: React.Dispatch<React.SetStateAction<boolean>>;
    isFlowAvailableToUser: (flowId: string) => boolean;
};

interface FlowResponse {
    foreignUserId: string;
    flowSlug: string;
    stepId: string;
    actionType: string;
    data: object;
    createdAt: Date;
    blocked: boolean;
    hidden: boolean;
}
declare function useFlowResponses(): {
    addResponse: (flowResponse: FlowResponse) => Promise<void>;
    setFlowResponses: React.Dispatch<React.SetStateAction<FlowResponse[]>>;
    getFlowResponses: () => FlowResponse[];
};

interface FrigadeProviderProps {
    publicApiKey: string;
    /**
     * The user id of the user that is currently logged in.
     */
    userId?: string;
    /**
     * The organization id of the organization that is currently logged in.
     */
    organizationId?: string;
    config?: FrigadeConfig;
    children?: React__default.ReactNode;
}
interface FrigadeConfig {
    /**
     * Override the default router used by Frigade.
     * This is useful if you are using a router and want to avoid doing a full page refresh on navigation.
     * @param url The url to navigate to.
     */
    navigate?: (url: string, target: string) => void;
    /**
     * Default Appearance for all flows.
     */
    defaultAppearance?: Appearance;
    /**
     * API url to use for all requests. Defaults to https://api.frigade.com
     */
    apiUrl?: string;
    /**
     * When true, Frigade will be in read-only mode and state will not be updated. Default false.
     * Used mostly for demo purposes.
     */
    readonly?: boolean;
    theme?: Record<string, any>;
}
declare const FrigadeProvider: FC<FrigadeProviderProps>;

interface FrigadeChecklistProps extends HeroChecklistProps {
    flowId: string;
    title?: string;
    subtitle?: string;
    style?: CSSProperties;
    /** @ignore */
    initialSelectedStep?: number;
    className?: string;
    type?: 'inline' | 'modal';
    checklistStyle?: 'with-guide' | 'default' | 'condensed' | 'carousel';
    visible?: boolean;
    setVisible?: (visible: boolean) => void;
    onDismiss?: () => void;
    /**
     * See https://docs.frigade.com/flows/dynamic-variables
     */
    customVariables?: {
        [key: string]: string | number | boolean;
    };
    /**
     * Flow ID referencing the flow of a guide/link collection to attach to this Checklist
     */
    guideFlowId?: string;
    /**
     * Title for the guide (if attached)
     */
    guideTitle?: string;
    autoExpandFirstIncompleteStep?: boolean;
    autoExpandNextStep?: boolean;
}
declare const FrigadeChecklist: React__default.FC<FrigadeChecklistProps>;

interface HeroChecklistProps extends Omit<DefaultFrigadeFlowProps, 'flowId'> {
    title?: string;
    subtitle?: string;
    /**
     * @deprecated Use `appearance` instead
     * @ignore
     */
    primaryColor?: string;
    /** @ignore */
    steps?: StepData[];
    /** @ignore */
    selectedStep?: number;
    /** @ignore */
    setSelectedStep?: (index: number) => void;
    /**
     * Map from string to function with StepData returning React.ReactNode
     */
    customStepTypes?: Record<string, (stepData: StepData, appearance: Appearance) => React__default.ReactNode>;
}

interface FrigadeHeroChecklistProps extends HeroChecklistProps {
    flowId: string;
    title?: string;
    subtitle?: string;
    primaryColor?: string;
    onCompleteStep?: (index: number, stepData: StepData) => void;
    style?: CSSProperties;
    initialSelectedStep?: number;
    className?: string;
}
declare const FrigadeHeroChecklist: React__default.FC<FrigadeHeroChecklistProps>;

type ProgressBadgeType = 'condensed' | 'default' | 'full-width';

interface FrigadeProgressBadgeProps extends DefaultFrigadeFlowProps {
    title: string;
    subtitle?: string;
    icon?: React__default.ReactNode;
    textStyle?: CSSProperties;
    onClick?: () => void;
    hideOnFlowCompletion?: boolean;
    type?: ProgressBadgeType;
}
declare const FrigadeProgressBadge: React__default.FC<FrigadeProgressBadgeProps>;

interface FormInputType {
    id: string;
    title?: string;
    subtitle?: string;
    type: string;
    required?: boolean;
    validation?: InputValidation;
}
interface InputValidation {
    type: 'number' | 'string' | 'email' | 'phone' | 'date' | 'time' | 'datetime' | 'url' | 'custom' | 'password';
    requiredError?: string;
    invalidTypeError?: string;
    props?: InputValidationRuleProps[];
}
interface InputValidationRuleProps {
    requirement: string;
    value?: string | number;
    message?: string;
}
interface FormInputProps {
    formInput: FormInputType;
    customFormTypeProps: CustomFormTypeProps;
    inputData: any;
    onSaveInputData: (data: any) => void;
    setFormValidationErrors: (errors: FormValidationError[]) => void;
}
interface FormValidationError {
    message: string;
    id: string;
}
interface CustomFormTypeProps {
    flowId: string;
    stepData: StepData;
    canContinue: boolean;
    setCanContinue: (canContinue: boolean) => void;
    onSaveData: (data: object) => void;
    appearance?: Appearance;
    customFormElements?: {
        [key: string]: (params: FormInputProps) => React__default.ReactNode;
    };
}
interface StepContentProps {
    stepData: StepData;
    appearance?: Appearance;
}
type EntityProperties = Record<string, string | boolean | number | null>;

type FrigadeFormType = 'inline' | 'modal' | 'large-modal' | 'corner-modal';
interface FrigadeFormProps extends DefaultFrigadeFlowProps {
    /**
     * @ignore
     */
    title?: string;
    /**
     * @ignore
     */
    subtitle?: string;
    type?: FrigadeFormType;
    /**
     * Map of custom components. The key must match the `type` property of the step defined in `flow-data.yml`
     */
    customStepTypes?: {
        [key: string]: (params: CustomFormTypeProps) => React__default.ReactNode;
    };
    /**
     * Map of custom form components. Can only be used with a step of type `multiInput` (defined in `flow-data.yml`).
     * The key must match the `type` property of the input defined in `flow-data.yml`
     */
    customFormElements?: {
        [key: string]: (params: FormInputProps) => React__default.ReactNode;
    };
    visible?: boolean;
    setVisible?: (visible: boolean) => void;
    onComplete?: () => void;
    /**
     * Whether to show a dismiss button to exit out of the form. Applicable only for modal forms.
     */
    dismissible?: boolean;
    /**
     * If true, the form can be repeated multiple times. Default is false. Useful for e.g. contact/support forms.
     */
    repeatable?: boolean;
    /**
     * If true, the user will be excited from the flow when the form is dismissed. Default is false.
     */
    endFlowOnDismiss?: boolean;
    /**
     * Indicates the position of the modal if the form type is a modal. Default is center.
     */
    modalPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    /**
     * Show a pagination indicator at the bottom of the form. Default is false.
     */
    showPagination?: boolean;
    /**
     * Whether to allow the user to navigate back to previous steps. Default is false.
     */
    allowBackNavigation?: boolean;
    /**
     * @ignore
     */
    showFrigadeBranding?: boolean;
    /**
     * This function is called when the user submits data in a step.
     * If it returns a string, the flow will not proceed to the next step and the string will be displayed as an error message.
     */
    validationHandler?: (step: StepData, index: number, nextStep?: StepData, allFormData?: any, stepSpecificFormData?: object) => Promise<string | null | undefined>;
}
declare const FrigadeForm: FC<FrigadeFormProps>;

interface FrigadeGuideProps extends DefaultFrigadeFlowProps {
    title: string;
    primaryColor?: string;
}
declare const FrigadeGuide: FC<FrigadeGuideProps>;

type ToolTipPosition = 'left' | 'right' | 'auto';
interface ToolTipData extends StepData {
    selector?: string;
    subtitleStyle?: CSSProperties;
    titleStyle?: CSSProperties;
    buttonStyle?: CSSProperties;
}

interface FrigadeTourProps extends Omit<DefaultFrigadeFlowProps, 'flowId'> {
    /**
     * @ignore
     */
    steps?: ToolTipData[];
    onDismiss?: () => void;
    onComplete?: () => void;
    tooltipPosition?: ToolTipPosition;
    /**
     * Whether to show the highlight (the small circle/ping) or not. Defaults to true.
     */
    showHighlight?: boolean;
    /**
     * Whether to show more than one tooltip at a time. Defaults to false.
     */
    showTooltipsSimultaneously?: boolean;
    /**
     * @ignore
     */
    buttonStyle?: CSSProperties;
    /**
     * Offset to apply to all tooltips.
     */
    offset?: {
        x: number;
        y: number;
    };
    visible?: boolean;
    /**
     * @ignore
     */
    containerStyle?: CSSProperties;
    customVariables?: {
        [key: string]: string | number | boolean;
    };
    /**
     * @ignore
     */
    selectedStep?: number;
    customStepTypes?: Record<string, (props: {
        stepData: StepData;
        primaryColor: string;
    }) => React__default.ReactNode>;
    appearance?: Appearance;
    /**
     * Shows a close button in the top right corner of the tooltip. Depending on dismissBehavior, it will either end the entire flow or just the current step.
     */
    dismissible?: boolean;
    primaryColor?: string;
    /**
     * If true, the tooltip will only show the highlight and not the tooltip itself.
     * Clicking the highlight will reveal it.
     */
    showHighlightOnly?: boolean;
    /**
     * If true, a step counter will show up in the tooltip.
     */
    showStepCount?: boolean;
    /**
     * `complete-flow` (default): Completes the entire flow/tour when a single tooltip is dismissed.
     * `complete-step`: Completes the current step when a tooltip is dismissed.
     */
    dismissBehavior?: 'complete-flow' | 'complete-step';
    /**
     * @ignore
     */
    showFrigadeBranding?: boolean;
    /**
     * If true, the tour will go to the next existing step/tip if the current selector element is not found on the page.
     * Defaults to false.
     */
    skipIfNotFound?: boolean;
}
declare const FrigadeTour: FC<FrigadeTourProps & {
    flowId: string;
    initialSelectedStep?: number;
}>;

interface FloatingWidgetProps extends DefaultFrigadeFlowProps {
    type?: 'floating' | 'inline';
    visible?: boolean;
    title?: string;
}
declare const FrigadeSupportWidget: FC<FloatingWidgetProps>;

interface FrigadeEmbeddedTipProps extends DefaultFrigadeFlowProps {
    dismissible?: boolean;
}
declare const FrigadeEmbeddedTip: React__default.FC<FrigadeEmbeddedTipProps>;

/**
 * Frigade Banners
 * full-width: Full width banner, useful in top of the page
 * square: Square sized banner, useful in sidebars
 *
 */
type FrigadeBannerType = 'full-width' | 'square';
interface FrigadeBannerProps extends DefaultFrigadeFlowProps {
    type?: FrigadeBannerType;
    title?: string;
    subtitle?: string;
    onDismiss?: () => void;
    icon?: React__default.ReactNode;
}
declare const FrigadeBanner: React__default.FC<FrigadeBannerProps>;

interface FrigadeNPSSurveyProps extends DefaultFrigadeFlowProps {
    dismissible?: boolean;
    type?: 'inline' | 'modal';
}
declare const FrigadeNPSSurvey: React__default.FC<FrigadeNPSSurveyProps>;

declare function useFlowOpens(): {
    getOpenFlowState: (flowId: string, defaultValue?: boolean) => boolean;
    setOpenFlowState: (flowId: string, isOpen: boolean) => void;
    resetOpenFlowState: (flowId: string) => void;
    hasOpenModals: (currentFlowId?: string) => boolean;
    setKeepCompletedFlowOpenDuringSession: (flowId: string) => void;
    shouldKeepCompletedFlowOpenDuringSession: (flowId: string) => boolean;
};

declare function useUser(): {
    userId: string;
    setUserId: React__default.Dispatch<React__default.SetStateAction<string>>;
    addPropertiesToUser: (properties: EntityProperties) => Promise<void>;
    trackEventForUser: (event: string, properties?: EntityProperties) => Promise<void>;
};

declare function useOrganization(): {
    organizationId: string;
    setOrganizationId: React__default.Dispatch<React__default.SetStateAction<string>>;
    addPropertiesToOrganization: (properties: EntityProperties) => Promise<void>;
    trackEventForOrganization: (event: string, properties?: EntityProperties) => Promise<void>;
};

declare function Label({ title, required, appearance, }: {
    title?: string;
    required: boolean;
    appearance?: Appearance;
}): JSX.Element;

declare function TextField({ formInput, customFormTypeProps, onSaveInputData, setFormValidationErrors, inputData, }: FormInputProps): JSX.Element;

interface Overrides extends Record<string, Overrides | CSSProperties> {
}
type BoxProps<T extends ElementType = 'div'> = {
    as?: T;
    css?: Record<string, any>;
    children?: ReactNode;
    overrides?: Overrides;
} & BorderProps & ColorProps & Exclude<LayoutProps, 'size'> & ShadowProps & SpaceProps & TypographyProps & ComponentPropsWithoutRef<T>;
declare const Box: <T extends React__default.ElementType<any> = "div">({ as, children, overrides, ...rest }: any) => JSX.Element;

interface ButtonProps extends BoxProps {
    title: string;
}
declare const Button: React.FC<ButtonProps> & {
    [k: string]: {
        (props: ButtonProps): JSX.Element;
        displayName: string;
    };
};

type CheckBoxType = 'square' | 'round';
interface CheckBoxProps {
    value: boolean;
    type?: CheckBoxType;
    primaryColor?: string;
    progress?: number;
    appearance?: Appearance;
    className?: string;
    style?: React__default.CSSProperties;
}
declare const CheckBox: FC<CheckBoxProps>;

interface ProgressRingProps {
    fillColor: string;
    size: number;
    bgColor?: string;
    percentage: number;
    className?: string;
    style?: React__default.CSSProperties;
    children?: React__default.ReactNode;
}
declare const ProgressRing: FC<ProgressRingProps>;

declare const textVariants: {
    readonly Display1: {
        readonly fontSize: "5xl";
        readonly fontWeight: "bold";
        readonly letterSpacing: "md";
        readonly lineHeight: "4xl";
    };
    readonly Display2: {
        readonly fontSize: "4xl";
        readonly fontWeight: "bold";
        readonly letterSpacing: "md";
        readonly lineHeight: "3xl";
    };
    readonly H1: {
        readonly fontSize: "3xl";
        readonly fontWeight: "bold";
        readonly letterSpacing: "md";
        readonly lineHeight: "2xl";
    };
    readonly H2: {
        readonly fontSize: "2xl";
        readonly fontWeight: "bold";
        readonly letterSpacing: "md";
        readonly lineHeight: "xl";
    };
    readonly H3: {
        readonly fontSize: "xl";
        readonly fontWeight: "bold";
        readonly letterSpacing: "md";
        readonly lineHeight: "lg";
    };
    readonly H4: {
        readonly fontSize: "lg";
        readonly fontWeight: "bold";
        readonly letterSpacing: "md";
        readonly lineHeight: "md";
    };
    readonly Body1: {
        readonly fontSize: "md";
        readonly fontWeight: "regular";
        readonly letterSpacing: "md";
        readonly lineHeight: "md";
    };
    readonly Body2: {
        readonly fontSize: "sm";
        readonly fontWeight: "regular";
        readonly letterSpacing: "md";
        readonly lineHeight: "md";
    };
    readonly Caption: {
        readonly fontSize: "xs";
        readonly fontWeight: "regular";
        readonly letterSpacing: "md";
        readonly lineHeight: "sm";
    };
};

type TextVariant = keyof typeof textVariants;
interface BaseTextProps extends BoxProps, Partial<Pick<FontProps, 'fontWeight'>> {
    variant?: TextVariant;
}
declare const Text: React__default.FC<BaseTextProps> & {
    [k: string]: {
        (props: BaseTextProps): JSX.Element;
        displayName: string;
    };
};

declare const tokens: {
    colors: {
        neutral: {
            foreground: string;
        };
        primary: {
            background: string;
            foreground: string;
            inverted: string;
        };
        negative: {
            foreground: string;
        };
        black: string;
        gray100: string;
        gray200: string;
        gray300: string;
        gray400: string;
        gray500: string;
        gray600: string;
        gray700: string;
        gray800: string;
        gray900: string;
        white: string;
        blue400: string;
        blue500: string;
        blue800: string;
        blue900: string;
        green400: string;
        green500: string;
        green800: string;
        transparent: string;
        red500: string;
    };
    fonts: {
        default: string;
    };
    fontSizes: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
    };
    fontWeights: {
        regular: number;
        semibold: number;
        bold: number;
    };
    letterSpacings: {
        md: string;
    };
    lineHeights: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
    };
    radii: {
        md: string;
        lg: string;
        round: string;
    };
    shadows: {
        md: string;
    };
    space: {
        [k: string]: string;
    };
    components: {
        Button: {
            readonly Primary: {
                readonly backgroundColor: "primary.background";
                readonly color: "primary.foreground";
                readonly '&:hover': {
                    readonly backgroundColor: "blue400";
                };
            };
            readonly Secondary: {
                readonly backgroundColor: "white";
                readonly border: "1px solid";
                readonly borderColor: "gray800";
                readonly color: "neutral.foreground";
                readonly '&:hover': {
                    readonly backgroundColor: "blue900";
                };
            };
            readonly Link: {
                readonly backgroundColor: "transparent";
                readonly color: "primary.inverted";
            };
            readonly Plain: {
                readonly backgroundColor: "transparent";
                readonly color: "neutral.foreground";
            };
        };
        Text: {
            readonly Display1: {
                readonly fontSize: "5xl";
                readonly fontWeight: "bold";
                readonly letterSpacing: "md";
                readonly lineHeight: "4xl";
            };
            readonly Display2: {
                readonly fontSize: "4xl";
                readonly fontWeight: "bold";
                readonly letterSpacing: "md";
                readonly lineHeight: "3xl";
            };
            readonly H1: {
                readonly fontSize: "3xl";
                readonly fontWeight: "bold";
                readonly letterSpacing: "md";
                readonly lineHeight: "2xl";
            };
            readonly H2: {
                readonly fontSize: "2xl";
                readonly fontWeight: "bold";
                readonly letterSpacing: "md";
                readonly lineHeight: "xl";
            };
            readonly H3: {
                readonly fontSize: "xl";
                readonly fontWeight: "bold";
                readonly letterSpacing: "md";
                readonly lineHeight: "lg";
            };
            readonly H4: {
                readonly fontSize: "lg";
                readonly fontWeight: "bold";
                readonly letterSpacing: "md";
                readonly lineHeight: "md";
            };
            readonly Body1: {
                readonly fontSize: "md";
                readonly fontWeight: "regular";
                readonly letterSpacing: "md";
                readonly lineHeight: "md";
            };
            readonly Body2: {
                readonly fontSize: "sm";
                readonly fontWeight: "regular";
                readonly letterSpacing: "md";
                readonly lineHeight: "md";
            };
            readonly Caption: {
                readonly fontSize: "xs";
                readonly fontWeight: "regular";
                readonly letterSpacing: "md";
                readonly lineHeight: "sm";
            };
        };
    };
};

export { Appearance, Box, Button, CheckBox, CustomFormTypeProps, EntityProperties, FormInputProps, FormInputType, Label as FormLabel, TextField as FormTextField, FormValidationError, FrigadeBanner, FrigadeChecklist, DefaultAppearance as FrigadeDefaultAppearance, FrigadeEmbeddedTip, FrigadeForm, FrigadeGuide, FrigadeHeroChecklist, FrigadeNPSSurvey, FrigadeProgressBadge, FrigadeProvider, FrigadeSupportWidget, BaseTheme as FrigadeTheme, FrigadeTour, ProgressRing, StepContentProps, StepData, Text, tokens, useFlowOpens, useFlowResponses, useFlows, useOrganization, useUser };
