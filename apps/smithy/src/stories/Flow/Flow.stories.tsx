import { Card, Flex, Flow, type FlowChildrenProps, Text } from "@frigade/react";
import { type Meta } from "@storybook/react";

export default {
  title: "Components/Flow",
  component: Flow,
} as Meta<typeof Flow>;

export const Default = {
  args: {
    as: Card,
    flowId: "flow_xw9xq7yc",
    children: ({
      handleDismiss,
      handlePrimary,
      handleSecondary,
      parentProps: { dismissible },
      step,
    }: FlowChildrenProps) => {
      const primaryButtonTitle =
        step.primaryButton?.title ?? step.primaryButtonTitle;
      const secondaryButtonTitle =
        step.secondaryButton?.title ?? step.secondaryButtonTitle;

      return (
        <>
          <Card.Header
            dismissible={dismissible}
            handleDismiss={handleDismiss}
            subtitle={step.subtitle}
            title={step.title}
          />

          <Text.Body2>
            This may look like just another Flow-aware Card, but it's actually a
            completely custom Flow, which means I can put anything I want in
            here. Like a David Rose gif:
          </Text.Body2>

          <Card.Media src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTRnNGFtYzNyY2xqdHlqeDBnNDE0cWFvNzZhcmVudDE2cjJkcmtrZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gYBXSdjyCiBZrgc/giphy-downsized.gif" />

          <Flex.Row gap={3} justifyContent="flex-end" part="card-footer">
            <Card.Secondary
              title={secondaryButtonTitle}
              onClick={handleSecondary}
            />
            <Card.Primary title={primaryButtonTitle} onClick={handlePrimary} />
          </Flex.Row>
        </>
      );
    },
    width: "400px",
  },
};
