import { Box, Tour } from "@frigade/react";
import { StoryContext, StoryFn } from "@storybook/react";

export default {
  title: "Components/Tour",
  component: Tour,
};

export const Default = {
  args: {
    dismissible: true,
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
          onComplete={(flow) => console.log("COMPLETE", flow)}
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
