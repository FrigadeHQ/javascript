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
    },
    side: {
      type: "select",
      options: ["top", "right", "bottom", "left"],
    },
    sideOffset: {
      type: "number",
    },
  },
};

export const Default = {
  args: {
    align: "start",
    side: "bottom",
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
        <Box
          id="tooltip-anchor"
          p={4}
          style={{ background: "#f0f0f0", width: "20vw" }}
        >
          Anchor here
        </Box>
        <Tooltip anchor="#tooltip-anchor" {...options.args} />
      </Box>
    ),
  ],
};
