import { Box, Card, Hint, Flex } from "@frigade/react";
import type { Meta, StoryContext, StoryFn } from "@storybook/react";

export default {
  title: "Design System/Hint",
  component: Hint,
} as Meta<typeof Hint>;

export const Default = {
  args: {
    align: "after",
    alignOffset: 0,
    anchor: "#tooltip-storybook-0",
    children: <Card boxShadow="md">Hello</Card>,
    defaultOpen: true,
    side: "left",
    sideOffset: 0,
  },
  decorators: [
    (Story: StoryFn, options: StoryContext) => {
      return (
        <Flex.Column
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 32px)",
          }}
        >
          <Box
            id="tooltip-storybook-0"
            p={4}
            style={{ background: "pink", width: "20vw" }}
          >
            Anchor here
          </Box>
          <Box
            id="tooltip-storybook-1"
            p={4}
            style={{ background: "fuchsia", width: "20vw" }}
          >
            Second anchor
          </Box>
          <Story {...options.args} />
        </Flex.Column>
      );
    },
  ],
};
