import { Box, Tooltip } from "@frigade/reactv2";

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
    (_, options) => (
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
        <Tooltip
          anchor="#tooltip-anchor"
          align="end"
          side="bottom"
          //alignOffset={5}
          {...options.args}
        />
      </Box>
    ),
  ],
};
