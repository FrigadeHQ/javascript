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
  const { isCompleted, primaryButtonTitle, secondaryButtonTitle, title } = step;

  return (
    <CollapsibleStep.Root open={open} onOpenChange={onOpenChange}>
      <CollapsibleStep.Trigger isCompleted={isCompleted} title={title} />

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

export const Default = {
  args: {
    flowId: "flow_K2dmIlteW8eGbGoo",
    stepTypes: {
      test: TestStep,
    },
    width: "500px",
    forceMount: true,
    dismissible: true,
  },
};
