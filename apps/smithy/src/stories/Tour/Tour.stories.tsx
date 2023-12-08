import { Box, Tour } from "@frigade/reactv2";
import { StoryContext, StoryFn } from "@storybook/react";

export default {
  title: "Components/Tour",
  component: Tour,
};

export const Default = {
  args: {},
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
        <Tour
          flowId="flow_U63A5pndRrvCwxNs"
          onComplete={(flow, prevFlow) =>
            console.log("COMPLETE", flow, prevFlow)
          }
          variables={{
            firstName: "Smeagol",
          }}
          spotlight={true}
          {...options.args}
        />
      </Box>
    ),
  ],
};
