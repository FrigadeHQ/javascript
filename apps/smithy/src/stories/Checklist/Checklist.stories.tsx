import {
  Card,
  Checklist,
  type CollapsibleStepProps,
  Flex,
  Text,
} from "@frigade/react";

export default {
  title: "Components/Checklist",
  component: Checklist.Collapsible,
};

const { CollapsibleStep } = Checklist;

function TestStep({
  handlePrimary,
  handleSecondary,
  open,
  onOpenChange,
  step,
}: CollapsibleStepProps) {
  const {
    $state: { completed },
    title,
  } = step;

  const primaryButtonTitle =
    step.primaryButton?.title ?? step.primaryButtonTitle;
  const secondaryButtonTitle =
    step.secondaryButton?.title ?? step.secondaryButtonTitle;

  return (
    <CollapsibleStep.Root open={open} onOpenChange={onOpenChange}>
      <CollapsibleStep.Trigger isCompleted={completed} title={title} />

      <CollapsibleStep.Content>
        <Text.H1>CUSTOM STEPPPPPP</Text.H1>
        <Flex.Row gap={3}>
          <Card.Secondary
            title={secondaryButtonTitle}
            onClick={handleSecondary}
          />
          <Card.Primary title={primaryButtonTitle} onClick={handlePrimary} />
        </Flex.Row>
      </CollapsibleStep.Content>
    </CollapsibleStep.Root>
  );
}

export const Carousel = {
  args: {
    flowId: "flow_ArnxGil9",
    // sort: "completed-last",
    onSecondary: (step, event) => console.log("Secondary", step, event),
  },
  decorators: [(_, { args }) => <Checklist.Carousel {...args} />],
};

export const Collapsible = {
  args: {
    flowId: "flow_K2dmIlteW8eGbGoo",
    stepTypes: {
      test: TestStep,
    },
    width: "500px",
    dismissible: true,
  },
};
