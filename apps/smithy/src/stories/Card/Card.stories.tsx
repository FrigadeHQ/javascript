import { Box, Card, Flex } from "@frigade/react";
import { type Meta } from "@storybook/react";

export default {
  title: "Design System/Card",
  component: Card,
  decorators: [
    (Story) => (
      <Box backgroundColor="gray900" height="100%" p={4}>
        <Story />
      </Box>
    ),
  ],
} as Meta<typeof Card>;

export const Default = {
  args: {
    children: (
      <>
        <div>
          <Card.Title>Card.Title</Card.Title>
          <Card.Subtitle>Card.Subtitle</Card.Subtitle>
        </div>
        <Card.Media src="https://placehold.co/360x180" />
        <Flex.Row gap={3} justifyContent="flex-end">
          <Card.Secondary title="Card.Secondary" />
          <Card.Primary title="Card.Primary" />
        </Flex.Row>
      </>
    ),
    width: "400px",
  },
};

export const FlowAwareCard = {
  args: {
    dismissible: true,
    flowId: "flow_Kvwr5ow8",
    width: "400px",
  },
};
