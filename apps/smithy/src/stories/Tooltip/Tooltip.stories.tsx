import { Box, Flex, Tooltip } from "@frigade/react";
import { StoryContext, StoryFn } from "@storybook/react";

export default {
  title: "Design System/Tooltip",
  component: Tooltip,
  argTypes: {
    align: {
      type: "select",
      options: ["before", "start", "center", "end", "after"],
    },
    alignOffset: {
      type: "number",
      default: 0,
    },
    side: {
      type: "select",
      options: ["top", "right", "bottom", "left"],
    },
    sideOffset: {
      type: "number",
      default: 0,
    },
  },
};

export const Default = {
  args: {
    align: "after",
    alignOffset: 0,
    primaryButtonTitle: "Primary button",
    side: "bottom",
    sideOffset: 0,
    spotlight: false,
    subtitle: "Subtitle",
    title: "Title",
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => (
      <Box
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "calc(100vh - 32px)",
        }}
      >
        <Box p={4} style={{ background: "pink", width: "20vw" }}>
          Not the anchor
        </Box>
        <Box
          id="tooltip-anchor"
          p={4}
          borderRadius="md"
          style={{ background: "#f0f0f0", width: "20vw" }}
        >
          Anchor here
        </Box>
        <Box p={4} style={{ background: "fuchsia", width: "20vw" }}>
          Also not the anchor
        </Box>

        <Tooltip
          anchor="#tooltip-anchor"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          {...options.args}
        >
          <Tooltip.Close />

          <Tooltip.Media src="https://placekitten.com/300/150" type="image" />

          <Flex.Column gap={1}>
            <Tooltip.Title>Title</Tooltip.Title>
            <Tooltip.Subtitle>Subtitle</Tooltip.Subtitle>
          </Flex.Column>

          <Flex.Row
            alignItems="center"
            gap={3}
            justifyContent="flex-end"
            part="tooltip-footer"
          >
            <Tooltip.Progress marginRight="auto">0/0</Tooltip.Progress>

            <Tooltip.Secondary title="Secondary" />
            <Tooltip.Primary title="Primary" />
          </Flex.Row>
        </Tooltip>
      </Box>
    ),
  ],
};
