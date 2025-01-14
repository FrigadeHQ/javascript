import { Box, Button, Checklist } from "@frigade/react";
import { type Meta } from "@storybook/react";

export default {
  title: "Components/Checklist/Floating",
  component: Checklist.Floating,
  decorators: [
    (Story) => (
      <Box backgroundColor="gray900" height="calc(100vh - 2rem)" p={4}>
        <Story />
      </Box>
    ),
  ],
} as Meta<typeof Checklist.Floating>;

export const Default = {
  args: {
    children: <Button.Primary title="Open!" />,
    flowId: "flow_K2dmIlteW8eGbGoo",
  },
};
