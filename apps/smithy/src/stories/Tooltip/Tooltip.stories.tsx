import { Box, Tooltip } from "@frigade/reactv2";
import { StoryFn, StoryContext } from "@storybook/react";

export default {
  title: "Components/Tooltip",
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
          height: "100vh",
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

        <Tooltip anchor="#tooltip-anchor" {...options.args} />
      </Box>
    ),
  ],
};
